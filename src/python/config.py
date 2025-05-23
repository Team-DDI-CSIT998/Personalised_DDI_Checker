import os
from dotenv import load_dotenv

# Path to your root-level .env
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
load_dotenv(dotenv_path)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME         = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
LLM_MODEL=os.getenv("LLM_MODEL")
CHAT_DB=os.getenv("CHAT_DB")
MEDS_DB=os.getenv("MEDS_DB")
USER_DB=os.getenv("USER_DB")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")