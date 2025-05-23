import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePrescription.css';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
}

interface LocationState {
  patientId: string;
}

interface MedicineFormProps {
  medicine: Medicine;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saveDisabled: boolean;
  setMedicineName: (name: string) => void;
  availableMedicines: string[];
  filteredMedicines: string[];
  setShowDropdown: (show: boolean) => void;
  showDropdown: boolean;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ 
  medicine, 
  onChange, 
  onSave, 
  onCancel, 
  saveDisabled,
  setMedicineName,
  availableMedicines,
  filteredMedicines,
  setShowDropdown,
  showDropdown
}) => {
  const [errors, setErrors] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (field === 'name' && !availableMedicines.includes(value)) {
      error = 'Please select a medicine from the dropdown';
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (field: string, value: string) => {
    onChange(field, value);
    if (field === 'name') {
      setMedicineName(value);
      if (value.length >= 3) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
    validateField(field, value);
  };

  const handleSelectMedicine = (medicine: string) => {
    onChange('name', medicine);
    setMedicineName(medicine);
    setShowDropdown(false);
    validateField('name', medicine);
  };

  return (
    <div className="medicine-form">
      <div className="form-group">
        <label>Medicine Name</label>
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="e.g., Paracetamol (type 3+ letters to search)"
            value={medicine.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {showDropdown && filteredMedicines.length > 0 && (
            <ul className="dropdown-list">
              {filteredMedicines.map((medicine, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectMedicine(medicine)}
                >
                  {medicine}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label>Dosage</label>
        <input
          type="text"
          placeholder="e.g., 500 mg"
          value={medicine.dosage}
          onChange={(e) => handleInputChange('dosage', e.target.value)}
        />
        {errors.dosage && <span className="error-text">{errors.dosage}</span>}
      </div>
      <div className="form-group">
        <label>Frequency</label>
        <input
          type="text"
          placeholder="e.g., Twice daily"
          value={medicine.frequency}
          onChange={(e) => handleInputChange('frequency', e.target.value)}
        />
        {errors.frequency && <span className="error-text">{errors.frequency}</span>}
      </div>
      <div className="form-group">
        <label>Duration</label>
        <input
          type="text"
          placeholder="e.g., 5 days"
          value={medicine.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
        />
        {errors.duration && <span className="error-text">{errors.duration}</span>}
      </div>
      <div className="form-actions">
        <button className="form-btn cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="form-btn save-btn"
          onClick={onSave}
          disabled={saveDisabled}
        >
          Save Medication
        </button>
      </div>
    </div>
  );
};

const CreatePrescription: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const { patientId } = (state as LocationState) || { patientId: '' };

  const [currentMedicines] = useState<Medicine[]>([
    { id: 1, name: 'Morphine', dosage: '81 mg', frequency: 'Once daily', duration: '7 days' },
    { id: 2, name: 'Bivalirudin', dosage: '500 mg', frequency: 'Twice daily', duration: 'Ongoing' },
    { id: 3, name: 'Apixaban', dosage: '10 mg', frequency: 'Once daily', duration: '1 month' },
  ]);

  const [addedMedicines, setAddedMedicines] = useState<Medicine[]>([]);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNewMedicineForm, setShowNewMedicineForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Medicine>({ id: 0, name: '', dosage: '', frequency: '', duration: '' });
  const [medicineName, setMedicineName] = useState('');
  const [availableMedicines, setAvailableMedicines] = useState<string[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasConsultationNote, setHasConsultationNote] = useState(false);

  useEffect(() => {
    const fetchConsultationNote = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8000/api/patient-history?patientId=${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.notes && response.data.notes.length > 0) {
          setHasConsultationNote(true);
        }
      } catch {
        setHasConsultationNote(false);
      }
    };

    fetchConsultationNote();
  }, [patientId]);


  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:5000/api/medicines", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableMedicines(
          response.data.map((drug: { name: string }) => drug.name)
        );
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setAvailableMedicines([]);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (medicineName.length >= 3) {
      const filtered = availableMedicines.filter(med => 
        med.toLowerCase().startsWith(medicineName.toLowerCase())
      );
      setFilteredMedicines(filtered);
      setShowDropdown(true);
    } else {
      setFilteredMedicines([]);
      setShowDropdown(false);
    }
  }, [medicineName, availableMedicines]);

  const handleAddChipClick = (med: Medicine) => {
    setEditingMedicine(med);
    setShowEditForm(true);
    setShowNewMedicineForm(false);
  };

  const isMedicineAdded = (id: number) => addedMedicines.some(med => med.id === id);

  const handleInputChange = (field: string, value: string) => {
    if (editingMedicine) setEditingMedicine({ ...editingMedicine, [field]: value });
  };

  const handleNewMedicineChange = (field: string, value: string) => {
    setNewMedicine({ ...newMedicine, [field]: value });
  };

  const validateMedicine = (med: Medicine) => {
    return (
      med.name.trim() !== '' &&
      availableMedicines.includes(med.name) &&
      med.dosage.trim() !== '' &&
      med.frequency?.trim() !== '' &&
      med.duration?.trim() !== ''
    );
  };

  const handleSaveMedicine = () => {
    if (!editingMedicine || !validateMedicine(editingMedicine)) return;
    setAddedMedicines(prev => {
      const exists = prev.find(m => m.id === editingMedicine.id);
      return exists
        ? prev.map(m => (m.id === editingMedicine.id ? editingMedicine : m))
        : [...prev, editingMedicine];
    });
    setEditingMedicine(null);
    setShowEditForm(false);
  };

  const handleAddNewMedicine = () => {
    if (!validateMedicine(newMedicine)) return;
    const newMed: Medicine = { ...newMedicine, id: Date.now() };
    setAddedMedicines(prev => [...prev, newMed]);
    setNewMedicine({ id: 0, name: '', dosage: '', frequency: '', duration: '' });
    setShowNewMedicineForm(false);
  };

  const handleEditMedicine = (id: number) => {
    const med = addedMedicines.find(m => m.id === id);
    if (med) {
      setEditingMedicine(med);
      setShowEditForm(true);
      setShowNewMedicineForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
    setShowEditForm(false);
  };

  const handleCancelNewMedicine = () => {
    setNewMedicine({ id: 0, name: '', dosage: '', frequency: '', duration: '' });
    setShowNewMedicineForm(false);
  };

  const handleRemoveMedicine = (id: number) => {
    setAddedMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleSavePrescription = async () => {
    if (!patientId || addedMedicines.length === 0) return alert('Add medicines first.');
    if (!hasConsultationNote) return alert('You must write a consultation note first.');
  
    const token = localStorage.getItem('token');
    setIsLoading(true);
  
    try {
      // Get latest consultation note
      const notesRes = await axios.get(`http://localhost:8000/api/patient-history?patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latestNote = notesRes.data.notes[0];
      if (!latestNote) return alert('No consultation note found.');
  
      await axios.put(`http://localhost:8000/api/patient-history/${latestNote.id}`, {
        rawText: latestNote.rawText || '',
        medicines: addedMedicines   // send manually added medicines
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      //  Fetch alerts
      const alerts = await axios.get(`http://localhost:8000/api/check-alerts?patientId=${patientId}`);
      navigate(`/patient-details/${patientId}`, { state: { alerts: alerts.data } });
  
    } catch (err: any) {
      alert(err.response?.data?.error || 'Could not update prescription.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="prescription-container">
      {isLoading && (
            <div className="fullscreen-loader">
                <div className="loader-content">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Loading... Please wait.</p>
                </div>
            </div>
            )}
      <div className="prescription-header">
        <h2>Create New Prescription</h2>
        <p className="subtitle">Add medications for your patient</p>
      </div>

      <div className="prescription-content">
        <div className="medicine-section">
          <div className="section-header">
            <h3>Suggested Medications</h3>
            <p>Commonly prescribed medicines for this patient</p>
          </div>
          <div className="medicine-chips">
            {currentMedicines.map(med => (
              <button
                key={med.id}
                className={`medicine-chip ${isMedicineAdded(med.id) ? 'added' : ''}`}
                onClick={() => handleAddChipClick(med)}
                disabled={isMedicineAdded(med.id)}
              >
                <span className="chip-name">{med.name}</span>
                <span className="chip-dosage">{med.dosage}</span>
                <span className="chip-add">{isMedicineAdded(med.id) ? '✓' : '+'}</span>
              </button>
            ))}
          </div>
        </div>

        {showEditForm && editingMedicine && (
          <div className="edit-form-container">
            <div className="form-header">
              <h3>Edit Medication</h3>
              <p>Adjust dosage and instructions</p>
            </div>
            <MedicineForm
              medicine={editingMedicine}
              onChange={handleInputChange}
              onSave={handleSaveMedicine}
              onCancel={handleCancelEdit}
              saveDisabled={!validateMedicine(editingMedicine)}
              setMedicineName={setMedicineName}
              availableMedicines={availableMedicines}
              filteredMedicines={filteredMedicines}
              setShowDropdown={setShowDropdown}
              showDropdown={showDropdown}
            />
          </div>
        )}

        <div className="medicine-section">
          <div className="section-header">
            <h3>Custom Medication</h3>
            <p>Add a medication not listed above</p>
          </div>
          {!showNewMedicineForm && !showEditForm && (
            <button 
              className="add-custom-btn"
              onClick={() => { setShowNewMedicineForm(true); setShowEditForm(false); }}
            >
              <span>+</span> Add Custom Medication
            </button>
          )}
          {showNewMedicineForm && !showEditForm && (
            <div className="edit-form-container">
              <div className="form-header">
                <h3>Add New Medication</h3>
                <p>Enter medication details</p>
              </div>
              <MedicineForm
                medicine={newMedicine}
                onChange={handleNewMedicineChange}
                onSave={handleAddNewMedicine}
                onCancel={handleCancelNewMedicine}
                saveDisabled={!validateMedicine(newMedicine)}
                setMedicineName={setMedicineName}
                availableMedicines={availableMedicines}
                filteredMedicines={filteredMedicines}
                setShowDropdown={setShowDropdown}
                showDropdown={showDropdown}
              />
            </div>
          )}
        </div>

        <div className="medicine-section added-medicines">
          <div className="section-header">
            <h3>Current Prescription</h3>
            <p>{addedMedicines.length} medication{addedMedicines.length !== 1 ? 's' : ''} added</p>
          </div>
          {addedMedicines.length === 0 ? (
            <div className="empty-state">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <p>No medications added yet</p>
            </div>
          ) : (
            <ul className="medicine-list">
              {addedMedicines.map(med => (
                <li key={med.id} className="medicine-item">
                  <div className="medicine-info">
                    <span className="medicine-name">{med.name}</span>
                    <span className="medicine-details">{med.dosage} • {med.frequency} • {med.duration}</span>
                  </div>
                  <div className="medicine-actions">
                    <button className="edit-btn" onClick={() => handleEditMedicine(med.id)}>
                      Edit
                    </button>
                    <button className="remove-btn" onClick={() => handleRemoveMedicine(med.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="action-bar">
          <button className="secondary-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button 
            className="primary-btn" 
            onClick={handleSavePrescription}
            disabled={addedMedicines.length === 0 || !hasConsultationNote}
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;