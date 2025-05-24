from config import OPENROUTER_API_KEY, LLM_MODEL

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENROUTER_API_KEY}"
}
MODEL_NAME = LLM_MODEL