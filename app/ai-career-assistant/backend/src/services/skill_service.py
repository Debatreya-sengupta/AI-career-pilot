from typing import List, Dict

class SkillService:
    def __init__(self):
        self.skills_data = {
            "Software Engineer": ["Python", "Java", "JavaScript", "C++", "SQL"],
            "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Statistics"],
            "Product Manager": ["Agile", "Communication", "Market Research", "Data Analysis"],
            "Web Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js"]
        }

    def get_top_skills(self, role: str) -> List[str]:
        return self.skills_data.get(role, [])

    def analyze_skills(self, user_skills: List[str], role: str) -> Dict[str, int]:
        top_skills = self.get_top_skills(role)
        skill_match = {skill: user_skills.count(skill) for skill in top_skills}
        return skill_match

    def suggest_skills(self, user_skills: List[str], role: str) -> List[str]:
        top_skills = self.get_top_skills(role)
        missing_skills = [skill for skill in top_skills if skill not in user_skills]
        return missing_skills