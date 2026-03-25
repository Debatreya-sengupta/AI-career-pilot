from app.services.llm_service import call_llm


def generate_roadmap(role: str, missing_skills: list) -> str:
    skills_text = ", ".join(missing_skills)

    prompt = f"""
You are a senior career strategist.

Create a 3-month learning roadmap for becoming a {role}.

Focus on these missing skills: {skills_text}

Return ONLY valid JSON in this exact format:

{{
  "role": "{role}",
  "duration_months": 3,
  "months": [
    {{
      "month": 1,
      "focus": "short focus area title",
      "skills": ["skill1", "skill2"],
      "resources": ["resource1", "resource2"],
      "milestones": ["milestone1", "milestone2"]
    }},
    {{
      "month": 2,
      "focus": "short focus area title",
      "skills": ["skill1", "skill2"],
      "resources": ["resource1", "resource2"],
      "milestones": ["milestone1", "milestone2"]
    }},
    {{
      "month": 3,
      "focus": "short focus area title",
      "skills": ["skill1", "skill2"],
      "resources": ["resource1", "resource2"],
      "milestones": ["milestone1", "milestone2"]
    }}
  ]
}}

Do not include any text outside the JSON.
"""

    response = call_llm(prompt, model="llama-3.3-70b-versatile")
    return response