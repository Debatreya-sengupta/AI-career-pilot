import os
from typing import Any, Dict, List, Optional

import requests
from dotenv import find_dotenv, load_dotenv

# Load .env reliably regardless of where the process is launched from.
load_dotenv(find_dotenv(usecwd=True))

api_key = os.getenv("GROQ_API_KEY")

GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")

DEFAULT_SYSTEM_PROMPT = os.getenv("CAREER_COPILOT_SYSTEM_PROMPT", "You are an AI career strategist.")

def call_llm(
    prompt: str,
    model: str = "llama-3.1-8b-instant",
    *,
    temperature: float = 0.3,
    system_prompt: str = DEFAULT_SYSTEM_PROMPT,
    timeout_s: int = 60,
) -> str:
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not found. Ensure it is set in the environment (or in .env).")

    url = f"{GROQ_BASE_URL.rstrip('/')}/chat/completions"

    messages: List[Dict[str, str]] = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt},
    ]

    payload: Dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
    }

    resp = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=timeout_s,
    )

    if resp.status_code >= 400:
        raise RuntimeError(f"Groq API error {resp.status_code}: {resp.text}")

    data = resp.json()
    try:
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Unexpected Groq response format: {data}") from e