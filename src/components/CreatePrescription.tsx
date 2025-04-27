import React, { useState } from 'react';
import './CreatePrescription.css';
import MedicineForm from './MedicineForm';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
}

const CreatePrescription: React.FC = () => {
  const [currentMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', duration: '7 days' },
    { id: 2, name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily', duration: 'Ongoing' },
    { id: 3, name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily', duration: '1 month' },
  ]);

  const [addedMedicines, setAddedMedicines] = useState<Medicine[]>([]);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);

  const handleAddChipClick = (med: Medicine) => {
    setEditingMedicine(med);
    setShowEditForm(true);
    setShowNewMedicineForm(false);
  };

  const isMedicineAdded = (id: number) => {
    return addedMedicines.some(med => med.id === id);
  };

  const handleInputChange = (field: string, value: string) => {
    if (!editingMedicine) return;
    if (
      field === 'name' ||
      field === 'dosage' ||
      field === 'frequency' ||
      field === 'duration'
    ) {
      setEditingMedicine({ ...editingMedicine, [field]: value });
    }
  };

  const handleSaveMedicine = () => {
    if (!editingMedicine) return;
    const exists = addedMedicines.find(med => med.id === editingMedicine.id);
    if (exists) {
      setAddedMedicines(addedMedicines.map(med => med.id === editingMedicine.id ? editingMedicine : med));
    } else {
      setAddedMedicines([...addedMedicines, editingMedicine]);
    }
    setEditingMedicine(null);
    setShowEditForm(false);
  };

  const handleRemoveMedicine = (id: number) => {
    setAddedMedicines(addedMedicines.filter(med => med.id !== id));
  };

  const handleEditMedicine = (id: number) => {
    const med = addedMedicines.find(med => med.id === id);
    if (med) {
      setEditingMedicine(med);
      setShowEditForm(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
    setShowEditForm(false);
  };

  // New medicine inputs
  const [newMedicine, setNewMedicine] = useState<Medicine>({
    id: 0,
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  });

  const handleNewMedicineChange = (field: string, value: string) => {
    if (
      field === 'name' ||
      field === 'dosage' ||
      field === 'frequency' ||
      field === 'duration'
    ) {
      setNewMedicine({ ...newMedicine, [field]: value });
    }
  };

  const handleAddNewMedicine = () => {
    if (!newMedicine.name.trim() || !newMedicine.dosage.trim()) return;
    const newMed: Medicine = {
      ...newMedicine,
      id: Date.now(),
    };
    setAddedMedicines([...addedMedicines, newMed]);
    setNewMedicine({
      id: 0,
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    });
    setShowNewMedicineForm(false);
  };

  const handleCancelNewMedicine = () => {
    setNewMedicine({
      id: 0,
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    });
    setShowNewMedicineForm(false);
  };

  return (
    <div className="create-prescription-container">
      <h3>Create Prescription</h3>

      <div className="section">
        <h4>Add from Current Medicines</h4>
        <div className="chips-container">
          {currentMedicines.map(med => (
            <div key={med.id} className={`chip ${isMedicineAdded(med.id) ? 'added' : ''}`}>
              <span>{med.name}</span>
              <button
                className="add-icon"
                onClick={() => handleAddChipClick(med)}
                disabled={isMedicineAdded(med.id)}
                aria-label={isMedicineAdded(med.id) ? "Added" : "Add"}
              >
                {isMedicineAdded(med.id) ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showEditForm && editingMedicine && !showNewMedicineForm && (
        <div className="section edit-form">
          <h4>Edit Medicine Details</h4>
          <MedicineForm
            medicine={editingMedicine}
            onChange={handleInputChange}
            onSave={() => {handleSaveMedicine(); setShowEditForm(false);}}
            onCancel={() => {handleCancelEdit(); setShowEditForm(false);}}
            saveDisabled={!editingMedicine.name.trim() || !editingMedicine.dosage.trim()}
          />
        </div>
      )}

      <div className="section">
        <h4>Add New Medicine</h4>
        {!showNewMedicineForm && !showEditForm && (
          <button onClick={() => {setShowNewMedicineForm(true); setShowEditForm(false);}}>Add New Medicine</button>
        )}
        {showNewMedicineForm && !showEditForm && (
          <div className="edit-form">
            <MedicineForm
              medicine={newMedicine}
              onChange={handleNewMedicineChange}
              onSave={() => {handleAddNewMedicine(); setShowNewMedicineForm(false);}}
              onCancel={() => {handleCancelNewMedicine(); setShowNewMedicineForm(false);}}
              saveDisabled={!newMedicine.name.trim() || !newMedicine.dosage.trim()}
            />
          </div>
        )}
      </div>

      <div className="section">
        <h4>Added Medicines</h4>
        {addedMedicines.length === 0 && <p>No medicines added yet.</p>}
        <ul className="added-medicines-list">
          {addedMedicines.map(med => (
            <li key={med.id} className="medicine-item">
              <span>{med.name} - {med.dosage} - {med.frequency} - {med.duration}</span>
              <div className="actions">
                <button onClick={() => handleEditMedicine(med.id)}>Edit</button>
                <button onClick={() => handleRemoveMedicine(med.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreatePrescription;
