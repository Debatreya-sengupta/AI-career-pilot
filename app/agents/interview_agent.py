from app.services.llm_service import call_llm
import uuid
import json






interview_sessions = {}


def generate_interview_question(role, skills=None, previous_answer=None):

    if previous_answer:
        prompt = f"""
You are an experienced technical interviewer.

The candidate previously answered:
{previous_answer}

Generate 3 follow-up interview questions for the role {role}.

Return ONLY JSON in this format:

{{
 "questions": [
  "question 1",
  "question 2",
  "question 3"
 ]
}}
"""
    
    elif skills:
        prompt = f"""
You are an experienced technical interviewer.

The candidate has these skills:
{skills}

Generate 3 interview questions related to these skills for the role {role}.

Return ONLY JSON in this format:

{{
 "questions": [
  "question 1",
  "question 2",
  "question 3"
 ]
}}
"""

    else:
        prompt = f"""
Generate 3 interview questions for the role {role}.

Return ONLY JSON in this format:

{{
 "questions": [
  "question 1",
  "question 2",
  "question 3"
 ]
}}
"""

    return call_llm(prompt, model="llama-3.1-8b-instant")

def start_interview(role, skills=None):

    session_id = str(uuid.uuid4())

    interview_sessions[session_id] = {
        "role": role,
        "skills": skills,
        "questions": [],
        "answers": [],
        "scores": []
    }

    return session_id

import json

def next_question(session_id):

    session = interview_sessions[session_id]

    role = session["role"]
    skills = session.get("skills")

    previous_answer = None
    if session["answers"]:
        previous_answer = session["answers"][-1]

    questions_json = generate_interview_question(role, skills, previous_answer)

    try:
        questions = json.loads(questions_json)["questions"]
    except:
        questions = [questions_json]

    session["questions"].extend(questions)

    return questions



def evaluate_answer(role, question, answer):

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer.

Role: {role}

Question:
{question}

Candidate Answer:
{answer}

Return ONLY valid JSON in this format:

{{
  "score": number from 1 to 10,
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"]
}}

Do not include any text outside the JSON.
"""

    return call_llm(prompt, model="llama-3.3-70b-versatile")

def submit_answer(session_id, answer):

    session = interview_sessions[session_id]

    question = session["questions"][-1]

    evaluation = evaluate_answer(
        session["role"],
        question,
        answer
    )

    session["answers"].append(answer)
    session["scores"].append(evaluation)

    next_q = next_question(session_id)

    return {
        "evaluation": evaluation,
        "next_question": next_q
    }

def interview_summary(session_id):

    session = interview_sessions[session_id]

    answers = session["answers"]

    prompt = f"""
You are a technical interviewer.

Based on the candidate's answers below, generate an interview summary.

Answers:
{answers}

Return ONLY JSON in this format:

{{
 "final_score": number from 1-10,
 "strengths": ["point1","point2"],
 "weaknesses": ["point1","point2"],
 "recommendation": "short improvement advice"
}}
"""

    return call_llm(prompt, model="llama-3.3-70b-versatile")