import os
from dotenv import load_dotenv

# Path to your root-level .env
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))
load_dotenv(dotenv_path)

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")

MONGO_URI = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@medmatchcluster.rrxor.mongodb.net/MedPortalDB?retryWrites=true&w=majority&appName=MedMatchCluster"
DB_NAME         = "MedPortalDB"
COLLECTION_NAME = "drugs"