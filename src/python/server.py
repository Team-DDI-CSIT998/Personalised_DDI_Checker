from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid, os, tempfile, json, re
from pymongo.collection import Collection
import aiofiles
import patientHistoryCheck as PHC
from medmatchpipeline4 import process_single_question
from medmatchpipeline4 import FULL_ROUTER_PROMPT  
from medmatchpipeline4 import extract_two_drugs, lookup_interaction  
from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient
from config import MONGO_URI, COLLECTION_NAME, DB_NAME
import requests
from openrouter_config import OPENROUTER_API_URL, HEADERS, MODEL, MODEL_NAME

# ─── FASTAPI SETUP ────────────────────────────────────────────────────
app = FastAPI(title="MedMatch Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = MongoClient(MONGO_URI)
prescriptions_collection = mongo_client[DB_NAME]["prescriptions"]
accounts_collection = mongo_client[DB_NAME]["accounts"]
chatbot_history_collection = mongo_client[DB_NAME]["chatbot_histories"]

# ─── MODELS ───────────────────────────────────────────────────────────
class HistoryInput(BaseModel):
    patientId: str
    notes: str

class UpdateRequest(BaseModel):
    rawText: Optional[str] = None
    summary: Optional[str] = None
    medicines: Optional[List[dict]] = None

# ─── HELPERS ──────────────────────────────────────────────────────────
def _temp_path(original: str) -> Path:
    root = Path(tempfile.gettempdir()) / "medmatch_uploads"
    root.mkdir(exist_ok=True)
    safe = Path(original).name.replace("\\", "_").replace("/", "_")
    return root / f"{uuid.uuid4().hex}_{safe}"


def call_llm(prompt_text: str) -> str:
    payload = {"model": MODEL, "messages": [{"role": "user", "content": prompt_text}]}
    res = requests.post(OPENROUTER_API_URL, headers=HEADERS, json=payload)
    res.raise_for_status()
    return res.json().get("choices", [{}])[0].get("message", {}).get("content", "")


def get_consultation_notes(patient_id: str) -> List[dict]:
    pres = prescriptions_collection.find_one(
        {"patient": patient_id, "source": "notes"},  # 🔥 only fetch the notes document
        projection={"consultationNotes": 1}
    )
    return pres.get("consultationNotes", []) if pres else []


def get_all_notes_with_dates(patient_id: str) -> List[str]:
    pres = prescriptions_collection.find_one({"patient": patient_id}, {"consultationNotes": 1})
    notes = pres.get("consultationNotes", []) if pres else []
    return [f"{n['createdAt']}: {n['summary']}" for n in notes]


def get_current_medications(patient_id: str) -> List[dict]:
    pres = prescriptions_collection.find_one(
        {"patient": patient_id},
        projection={"medicines": 1},
        sort=[("createdAt", -1)]
    )
    return pres.get("medicines", []) if pres else []

def get_all_medications_from_notes(patient_id: str) -> List[dict]:
    pres = prescriptions_collection.find_one(
        {"patient": patient_id, "source": "notes"},
        projection={"consultationNotes.structured.medications": 1}
    )
    if not pres or "consultationNotes" not in pres:
        return []

    all_meds = []
    for note in pres["consultationNotes"]:
        all_meds.extend(note.get("structured", {}).get("medications", []))

    # Deduplicate by (name + dosage)
    merged = {}
    for med in all_meds:
        key = (med["name"].lower(), med.get("dosage", "").lower())
        merged[key] = med
    return list(merged.values())

def get_current_prescriptions(patient_id: str) -> List[str]:
    current_meds = get_all_medications_from_notes(patient_id)
    formatted_meds = []
    for m in meds:
        parts = [m.get("name", ""), m.get("dosage", ""), m.get("frequency", ""), m.get("duration", "")]
        formatted_meds.append(" ".join([pt for pt in parts if pt]).strip())
    return formatted_meds

def merge_medications(existing, new):
    combined = { (m['name'].lower(), m['dosage'].lower()): m for m in existing }
    for med in new:
        key = (med['name'].lower(), med['dosage'].lower())
        combined[key] = med  # overwrite or insert
    return list(combined.values())

def extract_structured_summary(full_notes: List[str], current_meds: List[dict]) -> dict:
    # Format current medications as a JSON string for the LLM prompt
    current_meds_json = json.dumps(current_meds, indent=2)
    
    prompt = f"""
You are a clinical AI assistant.

Your job is to analyze the following consultation history and return structured medical data in JSON format. Use the format exactly as shown below:

{{
  "summary": "short plain-English summary of the patient history",
  "conditions": {{
    "current": ["condition1", "condition2"],
    "past": ["resolved_condition1"]
  }},
  "medications": [
    {{
      "name": "DrugName",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. Twice daily",
      "duration": "e.g. 5 days",
      "status": "active" or "discontinued"
    }}
  ],
  "allergies": ["allergy1", "allergy2"]
}}

Instructions:
- Only use the patient's history to extract conditions, allergies, and medications.
- For medications, use the provided list below as the current master and update based on the latest entry.
- Always include `status` in medications.
- ❌ Do not add commentary, explanation, or markdown. Just return JSON.

---

Consultation Notes:
{chr(10).join(full_notes)}

Current Medication List (JSON):
{current_meds_json}
"""

    try:
        raw = call_llm(prompt)
        print("[LLM Raw Reply]", raw)
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not match:
            print("[LLM Error]: No JSON found in response")
            return {
                "summary": "",
                "conditions": {"current": [], "past": []},
                "medications": current_meds,  # Preserve existing medications
                "allergies": []
            }
        cleaned = match.group(0).strip()
        structured_data = json.loads(cleaned)
        print("[Structured Data]", structured_data)
        return structured_data
    except json.JSONDecodeError as e:
        print(f"[LLM JSON Error]: {e} - Raw response: {raw}")
        return {
            "summary": "",
            "conditions": {"current": [], "past": []},
            "medications": current_meds,  # Preserve existing medications
            "allergies": []
        }
    except Exception as e:
        print(f"[LLM General Error]: {e}")
        return {
            "summary": "",
            "conditions": {"current": [], "past": []},
            "medications": current_meds,  # Preserve existing medications
            "allergies": []
        }




# ─── SAVE HISTORY TO PRESCRIPTION ───────────────────────────────────────
@app.post("/api/patient-history")
async def save_patient_history(data: HistoryInput):
    try:
        past_summaries = get_all_notes_with_dates(data.patientId)
        current_meds = get_current_medications(data.patientId)
        now_ts = datetime.utcnow().isoformat()
        formatted_ts = datetime.utcnow().isoformat()
        past_summaries.append(f"{formatted_ts}: {data.notes.strip()}")
        result = extract_structured_summary(past_summaries, current_meds)

        entry = {
            "id": str(uuid.uuid4()),
            "createdAt": now_ts,
            "rawText": data.notes,
            "summary": result["summary"],
            "structured": result
        }

        prescriptions_collection.update_one(
            {"patient": data.patientId, "source": "notes"},
            {
                "$push": {"consultationNotes": entry},
                "$set": {
                    "medicines": merge_medications(current_meds, result.get("medications", [])),
                    "createdAt": now_ts,
                    "source": "notes"
                }
            },
            upsert=True
        )

        return {"success": True, "note": entry}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Could not save patient history: {e}")
        raise HTTPException(500, f"History processing failed: {e}")


@app.get("/api/patient-history")
def get_patient_history(patientId: str):
    if not patientId:
        raise HTTPException(400, "Missing patientId")
    notes = get_consultation_notes(patientId)
    return {"notes": notes[::-1]}  # reverse chronological

@app.put("/api/patient-history/{note_id}")
async def update_patient_history(note_id: str, update: UpdateRequest):
    pres = prescriptions_collection.find_one(
        {"consultationNotes.id": note_id},
        {"patient": 1, "consultationNotes": 1, "medicines": 1}
    )
    if not pres:
        raise HTTPException(404, "Note not found")

    patient_id = pres["patient"]
    current_meds = pres.get("medicines", [])
    full_notes = []
    for note in sorted(pres["consultationNotes"], key=lambda x: x["createdAt"]):
        if note["id"] == note_id:
            raw = update.rawText or note["rawText"]
            full_notes.append(f"{datetime.fromisoformat(note['createdAt']).strftime('%d/%m/%Y %I:%M %p')}: {raw}")
        else:
            full_notes.append(f"{datetime.fromisoformat(note['createdAt']).strftime('%d/%m/%Y %I:%M %p')}: {note['summary']}")

    result = extract_structured_summary(full_notes, current_meds)

    res = prescriptions_collection.update_one(
        {"consultationNotes.id": note_id},
        {
            "$set": {
                "consultationNotes.$": {
                    "id": note_id,
                    "createdAt": pres["consultationNotes"][0]["createdAt"],
                    "rawText": update.rawText or pres["consultationNotes"][0]["rawText"],
                    "summary": result["summary"],
                    "structured": {
                        **result,
                        "medications": merge_medications(result.get("medications", []), update.medicines or [])
                    }
                },
                "medicines": merge_medications(current_meds, update.medicines or result.get("medications", [])),
            }
        }
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Note not found")

    # update_patient_profile(patient_id, result)

    return {"success": True, "note": {
    "id": note_id,
    "createdAt": pres["consultationNotes"][0]["createdAt"],
    "rawText": update.rawText or pres["consultationNotes"][0]["rawText"],
    "summary": result["summary"],
    "structured": {
        **result,
        "medications": merge_medications(result.get("medications", []), update.medicines or [])
    }
}}

@app.delete("/api/patient-history/{note_id}")
async def delete_patient_history(note_id: str):
    pres = prescriptions_collection.find_one(
        {"consultationNotes.id": note_id},
        {"patient": 1, "consultationNotes": 1, "medicines": 1}
    )
    if not pres:
        raise HTTPException(404, "Note not found")

    patient_id = pres["patient"]
    current_meds = pres.get("medicines", [])
    res = prescriptions_collection.update_one(
        {"consultationNotes.id": note_id},
        {"$pull": {"consultationNotes": {"id": note_id}}}
    )
    if res.modified_count == 0:
        raise HTTPException(404, "Note not found")

    # Recompute structured data after deletion to update medications
    past_summaries = get_all_notes_with_dates(patient_id)
    result = extract_structured_summary(past_summaries, current_meds)
    prescriptions_collection.update_one(
        {"patient": patient_id},
        {"$set": {"medicines": result.get("medications", current_meds)}}
    )
    # update_patient_profile(patient_id, result)

    return {"success": True}

# ─── CHATBOT ENDPOINT ───────────────────────────────────────────────────
@app.post("/chat")
async def chat_endpoint(payload: dict = Body(...)):
    question = payload.get("question", "").strip()
    user_id = payload.get("userId", "").strip()
    
    if not question or not user_id:
        raise HTTPException(400, "Missing question or userId")

    try:
        answer = process_single_question(question, user_id)
        return JSONResponse({"answer": answer or "Sorry, I couldn't find an answer."})
    except Exception as e:
        raise HTTPException(500, f"Chat failed: {e}")


# ─── LEGACY FILE UPLOAD HISTORY ─────────────────────────────────────────
@app.post("/history/upload")
async def upload_history(
    files: List[UploadFile] = File(...),
    userId: str = Query(...)
):  
    if not files:
        raise HTTPException(400, "No files received")
    
    for up in files:
        tmp = _temp_path(up.filename)
        async with aiofiles.open(tmp, "wb") as f:
            await f.write(await up.read())
        try:
            PHC.ingest_file(tmp, userId)  # ✅ Now stores in MongoDB
        except Exception as e:
            raise HTTPException(422, f"Could not process {up.filename}: {e}")
        finally:
            tmp.unlink(missing_ok=True)

    return {"success": True, "message": "File(s) processed and history saved."}

@app.get("/history/list")
def list_user_history(userId: str = Query(...)):
    docs = chatbot_history_collection.find(
        {"userId": userId, "isSafe": True}
    ).sort("uploadedAt", -1)

    return [
        {
            "id": str(doc["_id"]),
            "date": doc["uploadedAt"].strftime("%d/%m/%Y %I:%M %p"),
            "summary": doc["summary"]
        }
        for doc in docs
    ]



# ─── DEBUG ROUTE ──────────────────────────────────────────────────────
@app.post("/test-token")
async def test_token(request: Request):
    auth = request.headers.get("Authorization")
    data = await request.json()
    return {"auth_header": auth, "patientId": data.get("patientId"), "notes": data.get("notes")}


@app.get("/api/check-alerts")
def check_alerts(patientId: str = Query(...)):
    if not patientId:
        raise HTTPException(400, "Missing patientId")

    # Fetch latest consultation note with structured data
    pres = prescriptions_collection.find_one(
        {"patient": patientId, "source": "notes"},
        projection={"consultationNotes": 1, "medicines": 1},
        sort=[("createdAt", -1)]
    )

    if not pres or "consultationNotes" not in pres or not pres["consultationNotes"]:
        return {"ddi": [], "pdi": []}

    latest_note = sorted(pres["consultationNotes"], key=lambda n: n["createdAt"], reverse=True)[0]
    structured = latest_note.get("structured", {})

    # 🔍 Extract data
    medications = pres.get("medicines", [])
    conditions = structured.get("conditions", {})
    allergies = structured.get("allergies", [])

    active_drugs = [m["name"] for m in medications if m.get("status", "active").lower() == "active"]
    cond_current = conditions.get("current", [])
    cond_past = conditions.get("past", [])

    # 🧠 Build LLM prompt
    llm_prompt = f"""
    Analyze the following medical data and return structured risks:

    - Current Medications: {', '.join(active_drugs) or 'None'}
    - Current Conditions: {', '.join(cond_current) or 'None'}
    - Past Conditions: {', '.join(cond_past) or 'None'}
    - Allergies: {', '.join(allergies) or 'None'}

    Tasks:
    1. Identify any risky drug-drug interactions (DDI).
    2. Identify any drug-condition or drug-allergy contradictions (PDI).

    Return in the format:
    [ddi_alerts: 
    - Drug1 + Drug2: Reason
    - ...
    ]

    [pdi_alerts: 
    - Drug + Condition/Allergy: Reason
    - ...
    ]
    """

    # 🧠 LLM call
    router_out = call_llm(llm_prompt)

    def extract_block(name):
        m = re.search(rf"\[{name}:(.*?)\]", router_out, re.DOTALL)
        return m.group(1).strip() if m else ""

    ddi_block = extract_block("ddi_alerts")
    pdi_block = extract_block("pdi_alerts")

    ddi_alerts = re.findall(r"-\s*(.*?)$", ddi_block, re.MULTILINE)
    pdi_alerts = re.findall(r"-\s*(.*?)$", pdi_block, re.MULTILINE)

    return {"ddi": ddi_alerts, "pdi": pdi_alerts}