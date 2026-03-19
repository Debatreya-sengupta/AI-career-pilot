from pydantic import BaseModel
from typing import List, Optional

class ResumeCheckRequest(BaseModel):
    resume_text: str

class ResumeCheckResponse(BaseModel):
    is_ats_friendly: bool
    feedback: List[str]

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JobMatchResponse(BaseModel):
    match_score: float
    feedback: List[str]

class SkillAssessmentRequest(BaseModel):
    role: str

class SkillAssessmentResponse(BaseModel):
    top_skills: List[str]

class JobRecommendationRequest(BaseModel):
    resume_text: str
    job_description: str

class JobRecommendationResponse(BaseModel):
    recommended_jobs: List[str]