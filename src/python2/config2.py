import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from settings import (
    MONGO_URI,
    DB_NAME,
    COLLECTION_NAME,
    LLM_MODEL,
    CHAT_DB,
    MEDS_DB,
    USER_DB
)