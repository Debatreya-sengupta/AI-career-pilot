import os
import requests
from typing import List, Dict, Any, cast
from app.services.llm_service import call_llm
import json
import re
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv(usecwd=True))

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")


def summarize_job(description: str) -> list:
    # Ensure str and use explicit slice for linter satisfaction
    desc_str: str = str(description)
    truncated_desc = desc_str[0:3000]
    
    prompt = f"""
Summarize the following job description into 3 short bullet points.

Return ONLY valid JSON:

{{
 "summary": [
  "point1",
  "point2",
  "point3"
 ]
}}

Job Description:
{truncated_desc}
"""
    result = call_llm(prompt, model="llama-3.1-8b-instant")
    cleaned = re.sub(r"```json|```", "", result).strip()
    try:
        parsed = json.loads(cleaned)
        return parsed["summary"]
    except Exception:
        # Fallback summary uses first 200 chars
        return [desc_str[0:200]]


def scrape_jobs(role: str, summarize: bool = True) -> list:
    if not RAPIDAPI_KEY:
        return []

    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {
        "query": role,
        "page": "1",
        "num_pages": "1"
    }
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=15)
        response.raise_for_status()
        data = response.json()
    except Exception:
        return []

    jobs = []
    for job in data.get("data", [])[:10]:
        description = job.get("job_description", "")
        summary = summarize_job(description) if summarize else []
        jobs.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "description": description,
            "summary": summary
        })

    return jobs