from app.services.llm_service import call_llm

def generate_roadmap(role, missing_skills):

    skills_text = ", ".join(missing_skills)

    prompt = f"""
You are a career strategist.

Create a 3 month learning roadmap for becoming a {role}.

Focus on these missing skills: {skills_text}

Return the roadmap like this:

Month 1:
Month 2:
Month 3:
"""

    response = call_llm(prompt, model="llama-3.3-70b-versatile")

    return response