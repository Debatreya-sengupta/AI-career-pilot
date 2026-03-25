from app.services.llm_service import call_llm


def analyze_profile(resume_text: str) -> str:
    # Explicit slice and type hint for linter
    r_text: str = str(resume_text)
    truncated_resume = r_text[0:4000]
    prompt = f"""
You are an expert technical recruiter and career analyst.

Extract structured data from this resume.

Return ONLY valid JSON in this exact format. No extra text outside the JSON:

{{
  "skills": ["skill1", "skill2"],
  "years_experience": 0,
  "current_role": "inferred role title",
  "education": "highest degree and field",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}}

Resume:
{truncated_resume}
"""
    return call_llm(prompt, model="llama-3.1-8b-instant")


def extract_resume_skills(resume_text: str) -> str:
    # Explicit slice and type hint for linter
    r_text: str = str(resume_text)
    truncated_resume = r_text[0:4000]
    prompt = f"""
You are an expert technical recruiter.

Extract the key technical skills from this resume.

Resume:
{truncated_resume}

Return ONLY valid JSON in this format. No extra text:

{{
 "skills": ["skill1", "skill2", "skill3"]
}}
"""
    return call_llm(prompt, model="llama-3.3-70b-versatile")