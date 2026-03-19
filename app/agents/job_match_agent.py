from app.services.llm_service import call_llm


def job_resume_match(resume_text, job_description):

    prompt = f"""
You are an ATS resume evaluator.

Compare the resume with the job description.

Return ONLY valid JSON in this format:

{{
 "match_score": number from 1-100,
 "matching_skills": ["skill1","skill2"],
 "missing_skills": ["skill1","skill2"],
 "suggestions": ["suggestion1","suggestion2"]
}}

Job Description:
{job_description}

Resume:
{resume_text}
"""

    return call_llm(prompt, model="llama-3.3-70b-versatile")