# hybrid_binary_ddi_inference.py
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem, MACCSkeys
from rdkit.DataStructs import ConvertToNumpyArray
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout, BatchNormalization, Concatenate

# ─── Constants ───────────────────────────────────────────────
MORGAN_BITS = 1024
MACCS_BITS = 167
FP_DIM = MORGAN_BITS + MACCS_BITS
MODEL_WEIGHTS_PATH = "models/model_Files/hybrid_ddi_model_final.h5"

# ─── Rebuild the Original Training Architecture ─────────────
def build_hybrid_ddi_model(input_dim=FP_DIM):
    inp1 = Input(shape=(input_dim,), name='drug1_fp')
    inp2 = Input(shape=(input_dim,), name='drug2_fp')

    def subnet(x):
        x = Dense(256, activation='relu')(x)
        x = BatchNormalization()(x)
        x = Dropout(0.3)(x)
        x = Dense(128, activation='relu')(x)
        x = BatchNormalization()(x)
        return x

    x1 = subnet(inp1)
    x2 = subnet(inp2)
    x = Concatenate()([x1, x2])
    x = Dense(64, activation='relu')(x)
    x = Dropout(0.3)(x)
    out = Dense(1, activation='sigmoid')(x)

    return Model(inputs=[inp1, inp2], outputs=out)

# ─── Load Model Weights ─────────────────────────────────────
model = build_hybrid_ddi_model()
model.load_weights(MODEL_WEIGHTS_PATH)
print("✅ Hybrid binary DDI model weights loaded.")

# ─── Fingerprint Generator ──────────────────────────────────
def generate_fingerprint(smiles: str) -> np.ndarray:
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"❌ Invalid SMILES: {smiles}")

    morgan_fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=MORGAN_BITS)
    maccs_fp = MACCSkeys.GenMACCSKeys(mol)

    fp = np.zeros((FP_DIM,), dtype=np.float32)
    ConvertToNumpyArray(morgan_fp, fp[:MORGAN_BITS])
    ConvertToNumpyArray(maccs_fp, fp[MORGAN_BITS:])
    return fp

# ─── Inference Function ─────────────────────────────────────
def predict_hybrid_binary_ddi(smiles1: str, smiles2: str):
    fp1 = generate_fingerprint(smiles1)
    fp2 = generate_fingerprint(smiles2)

    input1 = np.expand_dims(fp1, axis=0)
    input2 = np.expand_dims(fp2, axis=0)

    prob = float(model.predict([input1, input2], verbose=0)[0][0])
    label = 1 if prob >= 0.5 else 0

    return label, prob