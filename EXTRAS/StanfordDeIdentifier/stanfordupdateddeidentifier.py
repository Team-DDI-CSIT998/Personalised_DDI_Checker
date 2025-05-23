
#pip install transformers torch

import re
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# ─── Load Stanford Deidentifier Model ─────────────────────────────
model_name = "StanfordAIMI/stanford-deidentifier-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
nlp_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")

# ─── Regex Patterns for Structured Entities ───────────────────────
regex_patterns = {
    "EMAIL": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
    "PHONE": r"\b\d{10,}\b",
    "ADDRESS": r"\d+\s[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Blvd|Boulevard|Drive|Dr)\b"
}

# ─── Entity Label Remapping ───────────────────────────────────────
ENTITY_REMAP = {
    "HCW": "NAME",
    "PATIENT": "NAME",
    "HOSPITAL": "ADDRESS",
    "VENDOR": "OTHER",
    "ID": "ID",
    "PHONE": "PHONE",
    "EMAIL": "EMAIL",
    "DATE": "DATE",
    # All others default to OTHER
}

# ─── De-identification Function ───────────────────────────────────
def deidentify_text(text):
    # Step 1: NER entities from model
    ner_entities = nlp_pipeline(text)

    # Step 2: Regex-based entities
    regex_entities = []
    for entity_type, pattern in regex_patterns.items():
        for match in re.finditer(pattern, text):
            regex_entities.append({
                "entity_group": entity_type,
                "start": match.start(),
                "end": match.end()
            })

    # Step 3: Combine and sort all entities (reverse to avoid shift issues)
    all_entities = ner_entities + regex_entities
    all_entities = sorted(all_entities, key=lambda e: e['start'], reverse=True)

    # Step 4: Redact and remap
    redacted_text = text
    final_entities = []

    for ent in all_entities:
        start, end = ent["start"], ent["end"]
        original_tag = ent["entity_group"]
        tag = ENTITY_REMAP.get(original_tag, "OTHER")
        redacted_text = redacted_text[:start] + f"[REDACTED:{tag}]" + redacted_text[end:]
        final_entities.append({
            "original": text[start:end],
            "original_tag": original_tag,
            "remapped_tag": tag,
            "start": start,
            "end": end
        })

    return redacted_text, final_entities

# ─── Sample Free-Text Input ───────────────────────────────────────
text = """
Hey, it's Mike here. DOB's 03/07/1985. Got diagnosed with Type 2 Diabetes last month. I'm currently taking Metformin and Lisinopril.
You can reach me on my old number 0456123456 or the new one 9876543210.
Also, I live at 221B Baker Street, London. Please don’t email me anymore at mike85@oldmail.com — use the hospital’s portal.
"""

# ─── Run De-Identification ────────────────────────────────────────
masked_text, extracted_entities = deidentify_text(text)

# ─── Output ───────────────────────────────────────────────────────
print("🔐 De-identified Text:\n", masked_text)
print("\n📌 Extracted Entities:")
for ent in sorted(extracted_entities, key=lambda x: x['start']):
    print(f" - {ent['remapped_tag']} (from '{ent['original']}' | model tag: {ent['original_tag']})")