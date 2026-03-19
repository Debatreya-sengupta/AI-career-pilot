import requests
from app.services.llm_service import call_llm
import json
import re

def summarize_job(description):

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
{description}
"""

    result = call_llm(prompt, model="llama-3.1-8b-instant")

    cleaned = re.sub(r"```json|```", "", result).strip()

    try:
        parsed = json.loads(cleaned)
        return parsed["summary"]
    except:
        return [description[:200]]

def scrape_jobs(role):

    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": role,
        "page": "1",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": "cbd32e5cd4mshc404ab727ef2f7fp141d71jsn0bedca1873f6",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    data = response.json()

    jobs = []

    for job in data.get("data", [])[:10]:

        description = job.get("job_description", "")

        summary = summarize_job(description)

        jobs.append({
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "summary": summary
        })

    return jobs