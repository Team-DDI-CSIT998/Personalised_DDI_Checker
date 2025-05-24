import os
from dotenv import load_dotenv

# Only load .env locally
if os.getenv("RENDER") != "true":
    load_dotenv()

# Environment variables
MONGO_URI        = os.getenv("MONGO_URI")
DB_NAME          = os.getenv("DB_NAME")
COLLECTION_NAME  = os.getenv("COLLECTION_NAME")
LLM_MODEL        = os.getenv("LLM_MODEL")
CHAT_DB          = os.getenv("CHAT_DB")
MEDS_DB          = os.getenv("MEDS_DB")
USER_DB          = os.getenv("USER_DB")

# Fail fast if any required env is missing
required_vars = {
    "MONGO_URI": MONGO_URI,
    "DB_NAME": DB_NAME,
    "COLLECTION_NAME": COLLECTION_NAME,
    "LLM_MODEL": LLM_MODEL,
    "CHAT_DB": CHAT_DB,
    "MEDS_DB": MEDS_DB,
    "USER_DB": USER_DB
}

for key, value in required_vars.items():
    if not value:
        raise RuntimeError(f"❌ Missing required environment variable: {key}")
