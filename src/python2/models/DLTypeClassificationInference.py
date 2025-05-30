import torch
import torch.nn as nn
import pandas as pd
from transformers import AutoTokenizer, AutoModel
import torch.nn.functional as F

# ─── Config ─────────────────────────────────────
DEVICE = torch.device("cpu")  # Force CPU
MODEL_PATH = "models/model_Files/ddi_classifier2.pth"
NUM_CLASSES = 86

# ─── Load Tokenizer & ChemBERTa ─────────────────
tokenizer = AutoTokenizer.from_pretrained("seyonec/ChemBERTa-zinc-base-v1")
chemberta = AutoModel.from_pretrained("seyonec/ChemBERTa-zinc-base-v1").to(DEVICE)

# ─── Drug-Drug Interaction Labels ───────────────
label_map = {1: 'Drug a can cause a decrease in the absorption of Drug b resulting in a reduced serum concentration and potentially a decrease in efficacy.', 2: 'Drug a can cause an increase in the absorption of Drug b resulting in an increased serum concentration and potentially a worsening of adverse effects.', 3: 'The absorption of Drug b can be decreased when combined with Drug a.', 4: 'The bioavailability of Drug b can be decreased when combined with Drug a.', 5: 'The bioavailability of Drug b can be increased when combined with Drug a.', 6: 'The metabolism of Drug b can be decreased when combined with Drug a.', 7: 'The metabolism of Drug b can be increased when combined with Drug a.', 8: 'The protein binding of Drug b can be decreased when combined with Drug a.', 9: 'The serum concentration of Drug b can be decreased when it is combined with Drug a.', 10: 'The serum concentration of Drug b can be increased when it is combined with Drug a.', 11: 'The serum concentration of the active metabolites of Drug b can be increased when Drug b is used in combination with Drug a.', 12: 'The serum concentration of the active metabolites of Drug b can be reduced when Drug b is used in combination with Drug a resulting in a loss in efficacy.', 13: 'The therapeutic efficacy of Drug b can be decreased when used in combination with Drug a.', 14: 'The therapeutic efficacy of Drug b can be increased when used in combination with Drug a.', 15: 'Drug a may decrease the excretion rate of Drug b which could result in a higher serum level.', 16: 'Drug a may increase the excretion rate of Drug b which could result in a lower serum level and potentially a reduction in efficacy.', 17: 'Drug a may decrease the cardiotoxic activities of Drug b.', 18: 'Drug a may increase the cardiotoxic activities of Drug b.', 19: 'Drug a may increase the central neurotoxic activities of Drug b.', 20: 'Drug a may increase the hepatotoxic activities of Drug b.', 21: 'Drug a may increase the nephrotoxic activities of Drug b.', 22: 'Drug a may increase the neurotoxic activities of Drug b.', 23: 'Drug a may increase the ototoxic activities of Drug b.', 24: 'Drug a may decrease effectiveness of Drug b as a diagnostic agent.', 25: 'The risk of a hypersensitivity reaction to Drug b is increased when it is combined with Drug a.', 26: 'The risk or severity of adverse effects can be increased when Drug a is combined with Drug b.', 27: 'The risk or severity of bleeding can be increased when Drug a is combined with Drug b.', 28: 'The risk or severity of heart failure can be increased when Drug b is combined with Drug a.', 29: 'The risk or severity of hyperkalemia can be increased when Drug a is combined with Drug b.', 30: 'The risk or severity of hypertension can be increased when Drug b is combined with Drug a.', 31: 'The risk or severity of hypotension can be increased when Drug a is combined with Drug b.', 32: 'The risk or severity of QTc prolongation can be increased when Drug a is combined with Drug b.', 33: 'Drug a may decrease the analgesic activities of Drug b.', 34: 'Drug a may decrease the anticoagulant activities of Drug b.', 35: 'Drug a may decrease the antihypertensive activities of Drug b.', 36: 'Drug a may decrease the antiplatelet activities of Drug b.', 37: 'Drug a may decrease the bronchodilatory activities of Drug b.', 38: 'Drug a may decrease the diuretic activities of Drug b.', 39: 'Drug a may decrease the neuromuscular blocking activities of Drug b.', 40: 'Drug a may decrease the sedative activities of Drug b.', 41: 'Drug a may decrease the stimulatory activities of Drug b.', 42: 'Drug a may decrease the vasoconstricting activities of Drug b.', 43: 'Drug a may increase the adverse neuromuscular activities of Drug b.', 44: 'Drug a may increase the analgesic activities of Drug b.', 45: 'Drug a may increase the anticholinergic activities of Drug b.', 46: 'Drug a may increase the anticoagulant activities of Drug b.', 47: 'Drug a may increase the antihypertensive activities of Drug b.', 48: 'Drug a may increase the antiplatelet activities of Drug b.', 49: 'Drug a may increase the antipsychotic activities of Drug b.', 50: 'Drug a may increase the arrhythmogenic activities of Drug b.', 51: 'Drug a may increase the atrioventricular blocking (AV block) activities of Drug b.', 52: 'Drug a may increase the bradycardic activities of Drug b.', 53: 'Drug a may increase the bronchoconstrictory activities of Drug b.', 54: 'Drug a may increase the central nervous system depressant (CNS depressant) activities of Drug b.', 55: 'Drug a may increase the central nervous system depressant (CNS depressant) and hypertensive activities of Drug b.', 56: 'Drug a may increase the constipating activities of Drug b.', 57: 'Drug a may increase the dermatologic adverse activities of Drug b.', 58: 'Drug a may increase the fluid retaining activities of Drug b.', 59: 'Drug a may increase the hypercalcemic activities of Drug b.', 60: 'Drug a may increase the hyperglycemic activities of Drug b.', 61: 'Drug a may increase the hyperkalemic activities of Drug b.', 62: 'Drug a may increase the hypertensive activities of Drug b.', 63: 'Drug a may increase the hypocalcemic activities of Drug b.', 64: 'Drug a may increase the hypoglycemic activities of Drug b.', 65: 'Drug a may increase the hypokalemic activities of Drug b.', 66: 'Drug a may increase the hyponatremic activities of Drug b.', 67: 'Drug a may increase the hypotensive activities of Drug b.', 68: 'Drug a may increase the hypotensive and central nervous system depressant (CNS depressant) activities of Drug b.', 69: 'Drug a may increase the immunosuppressive activities of Drug b.', 70: 'Drug a may increase the myelosuppressive activities of Drug b.', 71: 'Drug a may increase the myopathic rhabdomyolysis activities of Drug b.', 72: 'Drug a may increase the neuroexcitatory activities of Drug b.', 73: 'Drug a may increase the neuromuscular blocking activities of Drug b.', 74: 'Drug a may increase the orthostatic hypotensive activities of Drug b.', 75: 'Drug a may increase the photosensitizing activities of Drug b.', 76: 'Drug a may increase the QTc-prolonging activities of Drug b.', 77: 'Drug a may increase the respiratory depressant activities of Drug b.', 78: 'Drug a may increase the sedative activities of Drug b.', 79: 'Drug a may increase the serotonergic activities of Drug b.', 80: 'Drug a may increase the stimulatory activities of Drug b.', 81: 'Drug a may increase the tachycardic activities of Drug b.', 82: 'Drug a may increase the thrombogenic activities of Drug b.', 83: 'Drug a may increase the ulcerogenic activities of Drug b.', 84: 'Drug a may increase the vasoconstricting activities of Drug b.', 85: 'Drug a may increase the vasodilatory activities of Drug b.', 86: 'Drug a may increase the vasopressor activities of Drug b.'}


# ─── Convert SMILES to Embedding ────────────────
def smiles_to_embedding(smiles: str):
    inputs = tokenizer(smiles, return_tensors="pt", padding=True, truncation=True, max_length=512)
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = chemberta(**inputs)
        return outputs.last_hidden_state.mean(dim=1).squeeze(0).cpu()

# ─── DDI Classifier Model ───────────────────────
class DDIClassifier(nn.Module):
    def __init__(self, input_dim=1536, num_classes=NUM_CLASSES):
        super(DDIClassifier, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_dim, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.fc(x)

# ─── Load Model Weights ─────────────────────────
model = DDIClassifier().to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

# ─── Main Inference Function ────────────────────
def predict_ddi(smiles1: str, smiles2: str, top_k: int = 3):
    emb1 = smiles_to_embedding(smiles1)
    emb2 = smiles_to_embedding(smiles2)
    input_vec = torch.cat((emb1, emb2)).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(input_vec)
        probs = F.softmax(logits, dim=1).squeeze()
        top_probs, top_classes = torch.topk(probs, k=top_k)

    return [(cls.item() + 1, prob.item()) for cls, prob in zip(top_classes, top_probs)]
