from pydantic import BaseModel
from typing import List

class SkillGapRequest(BaseModel):
    role: str
    user_skills: List[str]


class RoadmapRequest(BaseModel):
    role: str
    missing_skills: List[str]


class InterviewQuestionRequest(BaseModel):
    role: str


class InterviewEvaluationRequest(BaseModel):
    role: str
    question: str
    answer: str

class StartInterviewRequest(BaseModel):
    role: str


class AnswerRequest(BaseModel):
    session_id: str
    answer: str

class FinishInterviewRequest(BaseModel):
    session_id: str

class ResumeInterviewRequest(BaseModel):
    role: str
    resume_text: str

class ATSRequest(BaseModel):
    role: str
    resume_text: str

class JobMatchRequest(BaseModel):
    job_description: str