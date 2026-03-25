from fastapi import FastAPI
import json
import re
from typing import Any, Dict, List, Union, cast
from app.agents.profile_agent import analyze_profile
from app.models.schemas import SkillGapRequest, RoadmapRequest
from app.agents.gap_agent import calculate_skill_gap   
from app.agents.roadmap_agent import generate_roadmap 
from app.services.job_scraper import scrape_jobs
from app.agents.interview_agent import (
    generate_interview_question,
    evaluate_answer,
    start_interview,
    next_question,
    submit_answer
)
from app.models.schemas import (
    InterviewQuestionRequest,
    InterviewEvaluationRequest,
    StartInterviewRequest,
    AnswerRequest
)
from app.agents.interview_agent import interview_summary
from app.models.schemas import FinishInterviewRequest
from app.agents.profile_agent import extract_resume_skills
from app.models.schemas import ResumeInterviewRequest
from fastapi import UploadFile, File
from app.services.resume_parser import parse_resume_pdf
from app.agents.ats_agent import ats_check
from app.models.schemas import ATSRequest
from app.agents.job_match_agent import job_resume_match
from app.agents.market_analyzer_agent import extract_skills_from_jobs
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router

app = FastAPI()   # ⚠️ THIS LINE IS CRITICAL

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# ============================================================================
# Original Endpoints
# ============================================================================

@app.post("/Skill-gap")
async def skill_gap(request: SkillGapRequest):
    result = calculate_skill_gap(
        request.user_skills,
        request.role
    )
    return result


@app.post("/Roadmap")
async def roadmap(request: RoadmapRequest):
    plan = generate_roadmap(
        request.role,
        request.missing_skills
    )
    return {"roadmap": plan}

@app.post("/Interview-question")
async def interview_question(request: InterviewQuestionRequest):

    question = generate_interview_question(request.role)

    return {"question": question}


@app.post("/Evaluate-answer")
async def evaluate(request: InterviewEvaluationRequest):

    result = evaluate_answer(
        request.role,
        request.question,
        request.answer
    )

    try:
        parsed = json.loads(result)
    except Exception:
        parsed = {"raw_response": result}

    return parsed

@app.post("/Start-interview")
async def start(request: StartInterviewRequest):

    session_id = start_interview(request.role)

    question = next_question(session_id)

    return {
        "session_id": session_id,
        "question": question
    }

@app.post("/Submit-answer")
async def answer(request: AnswerRequest):

    evaluation = submit_answer(
        request.session_id,
        request.answer
    )

    return {"evaluation": evaluation}

@app.post("/Finish-interview")
async def finish(request: FinishInterviewRequest):

    summary = interview_summary(request.session_id)

    try:
        parsed_summary = json.loads(summary)
    except Exception:
        parsed_summary = {"raw_response": summary}

    return parsed_summary

@app.post("/Resume-interview")
async def resume_interview(request: ResumeInterviewRequest):

    skills = extract_resume_skills(request.resume_text)

    session_id = start_interview(request.role, skills)

    question = next_question(session_id)

    return {
        "session_id": session_id,
        "skills": skills,
        "question": question
    }

@app.post("/Upload-resume")
async def upload_resume(role: str, file: UploadFile = File(...)):

    resume_text = parse_resume_pdf(file.file)

    skills = extract_resume_skills(resume_text)

    session_id = start_interview(role, skills)

    question = next_question(session_id)

    return {
        "session_id": session_id,
        "skills": skills,
        "question": question
    }


@app.post("/Ats-check-file")
async def ats_check_file(role: str, file: UploadFile = File(...)):

    resume_text = parse_resume_pdf(file.file)

    result = ats_check(resume_text, role)

    # remove markdown code blocks
    cleaned = re.sub(r"```json|```", "", result).strip()

    try:
        parsed = json.loads(cleaned)
        return parsed
    except Exception as e:
        return {
            "error": "Failed to parse ATS response",
            "detail": str(e),
            "raw_response": result
        }
    
@app.post("/Resume-job-match")
async def resume_job_match(job_description: str, file: UploadFile = File(...)):

    resume_text = parse_resume_pdf(file.file)

    result = job_resume_match(resume_text, job_description)

    cleaned = re.sub(r"```json|```", "", result).strip()

    try:
        parsed = json.loads(cleaned)
        return parsed
    except Exception as e:
        return {
            "error": "Failed to parse match response",
            "detail": str(e),
            "raw_response": result
        }

# ============================================================================
# Dashboard-Specific Endpoints (Aliases for compatibility)
# ============================================================================

@app.post("/ats-check-file")
async def ats_check_file_dashboard(
    role: str,
    file: UploadFile = File(..., alias="resume_file"),
):
    """Dashboard ATS checker endpoint"""
    return await ats_check_file(role, file)


@app.post("/resume-job-match")
async def resume_job_match_dashboard(
    job_description: str,
    file: UploadFile = File(..., alias="resume_file"),
):
    """Dashboard resume-job match endpoint"""
    return await resume_job_match(job_description, file)

def _pick_first_question(q: Any) -> str:
    if isinstance(q, list) and q:
        # next_question() returns a list of questions; dashboard expects a single string.
        return str(q[0])
    return str(q)

@app.post("/start-interview")
async def start_interview_dashboard(request: StartInterviewRequest):
    """Dashboard interview start endpoint (lowercase, compatible shape)."""
    session_id = start_interview(request.role)
    question_list = next_question(session_id)
    return {"session_id": session_id, "question": _pick_first_question(question_list)}


@app.post("/submit-answer")
async def submit_answer_dashboard(request: AnswerRequest):
    """Dashboard answer submission endpoint (lowercase, compatible shape)."""
    result = submit_answer(request.session_id, request.answer)

    evaluation = result.get("evaluation")
    if isinstance(evaluation, str):
        try:
            evaluation_json = json.loads(re.sub(r"```json|```", "", evaluation).strip())
            evaluation = evaluation_json
        except Exception:
            pass

    return {
        "evaluation": evaluation,
        "next_question": _pick_first_question(result.get("next_question")),
    }


@app.post("/finish-interview")
async def finish_interview_dashboard(request: FinishInterviewRequest):
    """Dashboard interview finish endpoint (lowercase, compatible shape)."""
    summary = interview_summary(request.session_id)
    try:
        parsed_summary = json.loads(re.sub(r"```json|```", "", summary).strip())
    except Exception:
        parsed_summary = {"raw_response": summary}

    # The dashboard expects 0-100 score. Agent may return 1-10.
    # Cast to dict to satisfy linter and check for None
    p_sum = cast(Dict[str, Any], parsed_summary)
    score = p_sum.get("final_score")
    if score is not None:
        try:
            score_f = float(score)
            if 0 <= score_f <= 10:
                p_sum["final_score"] = int(round(score_f * 10))
            else:
                p_sum["final_score"] = int(round(score_f))
        except (ValueError, TypeError):
            pass

    return p_sum


@app.get("/market-skills")
async def market_skills(role: str):
    """Get market skills for a role"""
    jobs = scrape_jobs(role, summarize=False)

    if not jobs:
        return {"error": "No jobs found", "role": role, "top_skills": []}

    descriptions = [job.get("description", "") for job in jobs if job.get("description")]

    if not descriptions:
        return {"error": "No job descriptions available", "role": role, "top_skills": []}

    skills = extract_skills_from_jobs(descriptions)

    # Calculate real frequency-based demand score from job descriptions
    combined_text = " ".join(descriptions).lower()
    total_jobs = len(descriptions)

    formatted_skills = []
    for skill in skills:
        skill_lower = skill.lower()
        # Count how many job descriptions mention this skill
        mention_count = sum(1 for desc in descriptions if skill_lower in desc.lower())
        # Convert to a 0-100 demand percentage
        demand_pct = int((mention_count / total_jobs) * 100) if total_jobs > 0 else 50
        # Clamp between 10 and 100 for display purposes
        demand_pct = max(10, min(100, demand_pct))
        formatted_skills.append({"name": skill, "demand": demand_pct})

    # Sort by demand descending
    formatted_skills.sort(key=lambda x: x["demand"], reverse=True)

    return {
        "role": role,
        "top_skills": formatted_skills
    }
    
@app.get("/scrape-jobs")
async def get_jobs(role: str):
    """Scrape jobs for a role"""
    jobs = scrape_jobs(role)

    return {
        "role": role,
        "jobs": jobs
    }

# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Career Assistant API"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)