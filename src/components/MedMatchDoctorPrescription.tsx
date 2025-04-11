import React, { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import { FaPlus, FaTrash, FaHistory, FaFileUpload, FaPills } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MedMatchDoctorPrescription.css";

interface Prescription {
  medicines: string[];
  dosage: string;
  duration: string;
  frequency: string;
  note?: string;
}

interface HistoryItem {
  date: string;
  healthReason: string;
  notes: string;
}

const dummyHistory: HistoryItem[] = [
  { date: "2023-08-01", healthReason: "Annual Checkup", notes: "All vitals normal." },
  { date: "2023-05-15", healthReason: "Cold & Flu", notes: "Prescribed rest and hydration." },
];

const DoctorPatientPrescription: React.FC = () => {
  const navigate = useNavigate();

  // Patient form state
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<number>(0);
  const [patientWeight, setPatientWeight] = useState<number>(0);
  const [patientGender, setPatientGender] = useState<string>("male");
  const [patientContact, setPatientContact] = useState<string>("");
  const [patientAllergies, setPatientAllergies] = useState<string>("");

  // Prescription state
  const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState<boolean>(false);
  const [medicineInput, setMedicineInput] = useState<string>("");
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>(["Aspirin", "Ibuprofen", "Paracetamol"]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [dosage, setDosage] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [prescriptionNote, setPrescriptionNote] = useState<string>("");

  // File upload / notes
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generalNotes, setGeneralNotes] = useState<string>("");

  // Handlers
  const handlePatientFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Save patient info via API
    alert("Patient info saved: " + patientName);
  };

  const handleMedicineInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMedicineInput(value);
    // Filter suggestions
    setMedicineSuggestions([
      "Aspirin",
      "Ibuprofen",
      "Paracetamol",
    ].filter(m => m.toLowerCase().includes(value.toLowerCase())));
  };

  const addMedicine = (med: string) => {
    if (!selectedMedicines.includes(med)) {
      setSelectedMedicines(prev => [...prev, med]);
    }
    setMedicineInput("");
    setMedicineSuggestions([]);
  };

  const removeMedicine = (med: string) => {
    setSelectedMedicines(prev => prev.filter(m => m !== med));
  };

  const handlePrescriptionSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newPresc: Prescription = {
      medicines: selectedMedicines,
      dosage,
      duration,
      frequency,
      note: prescriptionNote,
    };
    setPrescriptionList(prev => [...prev, newPresc]);
    // Reset modal
    setSelectedMedicines([]);
    setDosage("");
    setDuration("");
    setFrequency("");
    setPrescriptionNote("");
    setPrescriptionModalOpen(false);
  };

  const openVisitDetail = (visit: HistoryItem) => {
    alert(`Visit on ${visit.date}: ${visit.notes}`);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="doctor-patient-prescription">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Patient Management</h1>
          <div className="patient-meta">
            <span className="patient-id">ID: P001</span>
            <span className="patient-status">Active</span>
          </div>
        </div>

        <div className="grid-container">
          {/* Patient Info Card */}
          <section className="card patient-info">
            <div className="card-header">
              <h2><FaPills /> Patient Profile</h2>
            </div>
            <form onSubmit={handlePatientFormSubmit}>
              <div className="form-grid">
                {/* input fields... */}
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input type="number" value={patientAge} onChange={e => setPatientAge(Number(e.target.value))} required />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input type="number" value={patientWeight} onChange={e => setPatientWeight(Number(e.target.value))} />
                </div>
                <div className="input-group">
                  <label>Gender</label>
                  <select value={patientGender} onChange={e => setPatientGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Contact Info</label>
                  <input type="text" value={patientContact} onChange={e => setPatientContact(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Allergies</label>
                  <input type="text" value={patientAllergies} onChange={e => setPatientAllergies(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary">Save Patient Info</button>
            </form>
          </section>

          {/* Prescription Card */}
          <section className="card prescriptions">
            <div className="card-header">
              <h2><FaPills /> Prescription Management</h2>
              <button className="btn-icon" onClick={() => setPrescriptionModalOpen(true)}><FaPlus /> New Prescription</button>
            </div>
            <div className="prescription-list">
              {prescriptionList.map((presc, idx) => (
                <div key={idx} className="prescription-item">
                  <div className="prescription-header">
                    <span className="medicines">{presc.medicines.join(", ")}</span>
                    <button className="btn-icon danger"><FaTrash /></button>
                  </div>
                  <div className="prescription-details">
                    <span>{presc.dosage}</span>
                    <span>{presc.duration}</span>
                    <span>{presc.frequency}</span>
                  </div>
                  {presc.note && <p className="note">{presc.note}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Medical History Card */}
          <section className="card medical-history">
            <div className="card-header">
              <h2><FaHistory /> Medical History</h2>
            </div>
            <div className="timeline">
              {dummyHistory.map((visit, idx) => (
                <div key={idx} className="timeline-item" onClick={() => openVisitDetail(visit)}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3>{visit.healthReason}</h3>
                    <span className="date">{visit.date}</span>
                    <p>{visit.notes.substring(0,60)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents Card */}
          <section className="card documents">
            <div className="card-header">
              <h2><FaFileUpload /> Documents & Notes</h2>
            </div>
            <div className="file-upload-area">
              <div className={`drop-zone ${uploadedFile ? 'has-file' : ''}`} onDragOver={handleDragOver} onDrop={handleDrop}>
                {uploadedFile ? (
                  <>
                    <p>{uploadedFile.name}</p>
                    <button className="btn-text danger" onClick={() => setUploadedFile(null)}>Remove File</button>
                  </>
                ) : (
                  <>
                    <p>Drag & drop files here</p>
                    <p>or</p>
                    <label className="btn-text">Browse Files<input type="file" onChange={handleFileChange} hidden /></label>
                  </>
                )}
              </div>
              <div className="notes-section">
                <label>Visit Notes </label>
                <textarea value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} placeholder="Enter clinical notes..."></textarea>
                <button className="btn-primary" onClick={() => alert("Notes saved: " + generalNotes)}>Save Notes</button>
              </div>
            </div>
          </section>
        </div>

        {/* Prescription Modal */}
        {isPrescriptionModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>New Prescription</h2>
                <button className="close-modal" onClick={() => setPrescriptionModalOpen(false)}>&times;</button>
              </div>
              <form onSubmit={handlePrescriptionSubmit}>
                <div className="input-group">
                  <label>Medicines</label>
                  <div className="medicine-selector">
                    <input type="text" placeholder="Search medicines..." value={medicineInput} onChange={handleMedicineInputChange} />
                    {medicineSuggestions.length > 0 && (
                      <div className="suggestions">
                        {medicineSuggestions.map((s, i) => <div key={i} className="suggestion-item" onClick={() => addMedicine(s)}>{s}</div>)}
                      </div>
                    )}
                    <div className="selected-medicines">
                      {selectedMedicines.map((med, i) => (
                        <span key={i} className="medicine-pill">{med}<button type="button" onClick={() => removeMedicine(med)}>&times;</button></span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-columns">
                  <div className="input-group"><label>Dosage</label><input type="text" value={dosage} onChange={e => setDosage(e.target.value)} /></div>
                  <div className="input-group"><label>Duration</label><input type="text" value={duration} onChange={e => setDuration(e.target.value)} /></div>
                  <div className="input-group"><label>Frequency</label><input type="text" value={frequency} onChange={e => setFrequency(e.target.value)} /></div>
                </div>
                <div className="input-group"><label>Instructions</label><textarea value={prescriptionNote} onChange={e => setPrescriptionNote(e.target.value)} /></div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setPrescriptionModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Prescription</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorPatientPrescription;