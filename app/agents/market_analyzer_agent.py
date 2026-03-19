from app.services.llm_service import call_llm
import json
import re


def extract_skills_from_jobs(descriptions):

    text = "\n".join(descriptions)

    prompt = f"""
Analyze the following job descriptions.

Extract the most frequently mentioned technical skills.

Return ONLY JSON in this format:

{{
 "skills": [
  "skill1",
  "skill2",
  "skill3"
 ]
}}

Job Descriptions:
{text}
"""

    result = call_llm(prompt, model="llama-3.3-70b-versatile")

    cleaned = re.sub(r"```json|```", "", result).strip()

    try:
        parsed = json.loads(cleaned)
        return parsed["skills"]
    except:
        return []