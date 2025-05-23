from rdkit import Chem
from rdkit.Chem import AllChem, MACCSkeys
from rdkit.DataStructs import ConvertToNumpyArray
import numpy as np
from tensorflow.keras.models import load_model

# Load your saved model
model = load_model(r"C:\Users\siddh\OneDrive\Desktop\fahadChanges\Personalised_DDI_Checker\src\python2\models\model_Files\hybrid_ddi_model_final.h5")

# Constants
morgan_bits = 1024
maccs_bits = 167
fp_dim = morgan_bits + maccs_bits

def generate_fingerprint(smiles):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Invalid SMILES: {smiles}")
    
    morgan = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=morgan_bits)
    maccs = MACCSkeys.GenMACCSKeys(mol)
    fp = np.zeros((fp_dim,), dtype=np.float32)
    ConvertToNumpyArray(morgan, fp[:morgan_bits])
    ConvertToNumpyArray(maccs, fp[morgan_bits:])
    return fp

def predict_ddi(smiles1, smiles2):
    try:
        fp1 = generate_fingerprint(smiles1)
        fp2 = generate_fingerprint(smiles2)
    except ValueError as e:
        print(e)
        return None
    
    # Reshape to match input shape
    fp1 = np.expand_dims(fp1, axis=0)
    fp2 = np.expand_dims(fp2, axis=0)

    # Predict
    prob = model.predict([fp1, fp2])[0][0]
    label = int(prob >= 0.5)

    print(f"🧪 Prediction: {'Interaction' if label else 'No Interaction'} (Confidence: {prob:.4f})")
    return label, prob


predict_ddi("CCO", "CC(C)O")  # Ethanol vs. Isopropanol