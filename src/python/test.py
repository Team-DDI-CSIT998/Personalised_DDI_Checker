import os
from openrouter_config import OPENROUTER_API_URL, HEADERS, MODEL, MODEL_NAME
import requests

def call_llm(prompt_text: str) -> str:
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt_text}]
    }
    try:
        res = requests.post(OPENROUTER_API_URL, headers=HEADERS, json=payload)
        res.raise_for_status()
        raw_text = res.text
        print("[RAW OPENROUTER RESPONSE TEXT]", raw_text)  # 👈 Add this
        json_response = res.json()
        return json_response.get("choices", [{}])[0].get("message", {}).get("content", "")
    except Exception as e:
        print("[LLM REQUEST ERROR]", e)
        return ""

call_llm("hi")