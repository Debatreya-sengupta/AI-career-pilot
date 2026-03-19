from app.services.llm_service import call_llm


def ats_check(resume_text, job_role):

    prompt = f"""
You are an ATS (Applicant Tracking System) resume evaluator.

Analyze the resume for the role: {job_role}.

Return ONLY valid JSON.

Format:

{{
 "ats_score": number from 1-100,
 "missing_keywords": ["keyword1","keyword2"],
 "strengths": ["point1","point2"],
 "improvements": ["point1","point2"]
}}

Resume:
{resume_text}
"""

    return call_llm(prompt, model="llama-3.3-70b-versatile")