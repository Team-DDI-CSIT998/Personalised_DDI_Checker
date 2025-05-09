from pathlib import Path
from typing import List
from datetime import datetime
import uuid, os, tempfile, sys
import aiofiles

import patientHistoryCheck as PHC       # ← your existing summariser

from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

from starlette.responses import JSONResponse
import medmatchpipeline4 as pipeline

app = FastAPI(title="MedMatch Upload-Demo API")

ALLOW_ORIGINS = [
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:5173", "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory “DB”.  Swap this out for SQLite / Mongo etc. when ready.
HISTORY = []   # each item: {id,date,summary}


def _temp_path(original: str) -> Path:
    root = Path(tempfile.gettempdir()) / "medmatch_uploads"
    root.mkdir(exist_ok=True)
    safe = Path(original).name.replace("\\", "_").replace("/", "_")
    return root / f"{uuid.uuid4().hex}_{safe}"


def _add_summary(summary: str) -> dict:
    item = {
        "id":   uuid.uuid4().hex,
        "date": datetime.today().strftime("%Y-%m-%d %H:%M:%S"),
        "summary": summary.strip(),
    }
    HISTORY.append(item)
    return item


@app.post("/history/upload")
async def upload_history(files: List[UploadFile] = File(...)):
    """Ingest 1-N files → extract only the new summary per file → store items → return full list."""
    if not files:
        raise HTTPException(400, "No files received")

    for up in files:
        tmp = _temp_path(up.filename)
        async with aiofiles.open(tmp, "wb") as f:
            await f.write(await up.read())
        try:
            # ingest_file returns the full merged history with timestamp headers
            merged = PHC.ingest_file(tmp)

            # Split out only the latest summary entry
            lines = merged.splitlines()
            timestamp_indices = [i for i, ln in enumerate(lines) if ln.startswith('### ')]
            if timestamp_indices:
                last_idx = timestamp_indices[-1]
                summary_lines = lines[last_idx + 1 :]
                latest_summary = "\n".join(summary_lines).strip()
            else:
                latest_summary = merged.strip()

            _add_summary(latest_summary)
        except Exception as e:
            raise HTTPException(422, f"Could not process {up.filename}: {e}")
        finally:
            tmp.unlink(missing_ok=True)

    return HISTORY

@app.get("/history/list")
def list_history():
    return HISTORY

@app.put("/history/{item_id}")
def update_history(item_id: str, body: dict):
    record = next((it for it in HISTORY if it["id"] == item_id), None)
    if not record:
        raise HTTPException(404, "History item not found")
    record["summary"] = body.get("summary", "").strip()
    return record

@app.delete("/history/{item_id}")
def delete_history_item(item_id: str):
    global HISTORY
    if not any(it for it in HISTORY if it["id"] == item_id):
        raise HTTPException(404, "History item not found")
    HISTORY = [it for it in HISTORY if it["id"] != item_id]
    return {"ok": True}

@app.delete("/history")
def delete_all_history():
    HISTORY.clear()
    return {"ok": True}


@app.post("/chat")
async def chat_endpoint(payload: dict = Body(...)):
    question = payload.get("question", "").strip()
    if not question:
        raise HTTPException(400, "No question provided")
    try:
        # call your new pipeline function
        answer = pipeline.process_single_question(question)
        if not answer:
            answer = "Sorry, I couldn't find an answer to that."
        return JSONResponse({"answer": answer})
    except Exception as e:
        raise HTTPException(500, f"Chat processing failed: {e}")