from fastapi import APIRouter, UploadFile, File
from typing import List, Dict
from ..services.career_service import check_resume_ats, analyze_resume_job_match
from ..services.skill_service import get_top_skills
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/resume/check-ats")
async def resume_check_ats(file: UploadFile = File(...)):
    result = await check_resume_ats(file)
    return JSONResponse(content=result)

@router.post("/resume/job-match")
async def resume_job_match(resume: UploadFile = File(...), job_description: str = ""):
    result = await analyze_resume_job_match(resume, job_description)
    return JSONResponse(content=result)

@router.get("/skills/{role}")
async def skills_analysis(role: str) -> List[Dict[str, str]]:
    skills = await get_top_skills(role)
    return JSONResponse(content=skills)