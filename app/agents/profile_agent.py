from app.services.llm_service import call_llm

def analyze_profile(resume_text: str):

    prompt = f"""
    Extract structured data from this resume.
    Return JSON with:
    - skills
    - years_experience
    - strengths
    - weaknesses

    Resume:
    {resume_text}
    """

    return call_llm(prompt, model="llama-3.1-8b-instant")

def extract_resume_skills(resume_text: str):

    prompt = f"""
You are an expert technical recruiter.

Extract the key technical skills from this resume.

Resume:
{resume_text}

Return ONLY valid JSON in this format:

{{
 "skills": ["skill1", "skill2", "skill3"]
}}
"""

    return call_llm(prompt, model="llama-3.3-70b-versatile")