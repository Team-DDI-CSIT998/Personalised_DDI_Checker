from dotenv import load_dotenv
import os
import pymongo
from pymongo.errors import PyMongoError
from config import MONGO_URI

# Load environment variables from .env file in src directory
load_dotenv('src/.env')
MONGO_URI = f"mongodb+srv://medmatchproject2025:{os.getenv('MONGO_PASSWORD')}@medmatchcluster.rrxor.mongodb.net/MedPortalDB?retryWrites=true&w=majority&appName=MedMatchCluster"
