from app.data.market_data import market_data

def calculate_skill_gap(user_skills, role):

    role_data = market_data.get(role)

    if not role_data:
        return {"error": "Role not found"}

    market_skills = role_data["skills"]

    gaps = []

    for skill, weight in market_skills.items():
        if skill not in user_skills:
            gaps.append({
                "skill": skill,
                "priority_score": weight
            })

    # Sort by priority
    gaps = sorted(gaps, key=lambda x: x["priority_score"], reverse=True)

    return {
        "missing_skills": gaps,
        "salary_range": role_data["salary_range"]
    }