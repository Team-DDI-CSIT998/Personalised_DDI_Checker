from dotenv import load_dotenv
import os
import pymongo
from pymongo.errors import PyMongoError
from config import MONGO_URI

# Connect to MongoDB
try:
    db = MONGO_URI['drugbank_db']  
    collection = db['drugs']    

    # Step 1: Count the total number of drugs in the collection
    total_drugs = collection.count_documents({})
    print(f"Total number of drugs in the database: {total_drugs}")

    # Step 2: Display a few sample drugs (e.g., first 5)
    if total_drugs > 0:
        print("\nSample of up to 5 drugs in the database:")
        sample_drugs = collection.find().limit(5)  # Fetch the first 5 documents
        for i, drug in enumerate(sample_drugs, 1):
            print(f"\nDrug {i}:")
            print(f"Drug ID: {drug.get('drug_id', 'N/A')}")
            print(f"Name: {drug.get('name', 'N/A')}")
            print(f"Description: {drug.get('description', {}).get('full', 'N/A')[:100]}...")  # Truncate for readability
            print(f"Number of Interactions: {len(drug.get('interactions', []))}")
    else:
        print("No drugs found in the database.")

except PyMongoError as pe:
    print(f"Error: Failed to connect to or operate on MongoDB: {pe}")
    exit(1)
except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)
finally:
    MONGO_URI.close()