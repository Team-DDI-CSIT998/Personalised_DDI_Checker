import React, { useState, ChangeEvent, FormEvent, DragEvent } from "react";
import "./DoctorPatientPrescription.css";

interface Prescription {
  medicines: string[];
  dosage: string;
  duration: string;
  frequency: string;
  note: string;
}

interface Visit {
  date: string;
  healthReason: string;
  prescriptions: Prescription[];
  notes: string;
}

const medicineDatabase: string[] = [
  "Aspirin",
  "Ibuprofen",
  "Acetaminophen",
  "Metformin",
  "Lisinopril",
  "Amoxicillin",
  "Azithromycin",
  "Simvastatin",
  "Omeprazole",
];

const dummyHistory: Visit[] = [
  {
    date: "2023-01-15",
    healthReason: "Routine Checkup",
    prescriptions: [
      {
        medicines: ["Aspirin", "Lisinopril"],
        dosage: "100 mg",
        duration: "7 days",
        frequency: "Once a day",
        note: "Take with food",
      },
    ],
    notes: "Patient is in good health.",
  },
  {
    date: "2023-03-10",
    healthReason: "Follow-up Visit",
    prescriptions: [
      {
        medicines: ["Ibuprofen"],
        dosage: "200 mg",
        duration: "5 days",
        frequency: "Twice a day",
        note: "Monitor pain levels",
      },
    ],
    notes: "Mild headache reported.",
  },
];

const DoctorPatientPrescription: React.FC = () => {
  /* Patient Information States */
  const [patientName, setPatientName] = useState("John Doe");
  const [patientAge, setPatientAge] = useState(35);
  const [patientWeight, setPatientWeight] = useState(70);
  const [patientGender, setPatientGender] = useState("male");
  const [patientContact, setPatientContact] = useState("+1-555-1234567");
  const [patientAllergies, setPatientAllergies] = useState("");

  /* Prescription States */
  const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [medicineInput, setMedicineInput] = useState("");
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [prescriptionList, setPrescriptionList] = useState<Prescription[]>([]);

  /* File Upload & General Notes States */
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generalNotes, setGeneralNotes] = useState("");

  /* Visit History States */
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [isHistoryDetailModalOpen, setHistoryDetailModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  /* Patient Form Submission */
  const handlePatientFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Patient information saved!");
  };

  /* File Upload Handlers */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  /* Prescription Handlers */
  const handleMedicineInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMedicineInput(value);
    const query = value.trim().toLowerCase();
    if (query.length < 3) {
      setMedicineSuggestions([]);
      return;
    }
    const suggestions = medicineDatabase.filter((med) =>
      med.toLowerCase().includes(query)
    );
    setMedicineSuggestions(suggestions.length > 0 ? suggestions : ["No medicines found"]);
  };

  const addMedicine = (medicine: string) => {
    if (medicine === "No medicines found") return;
    if (selectedMedicines.some((med) => med.toLowerCase() === medicine.toLowerCase())) return;
    setSelectedMedicines((prev) => [...prev, medicine]);
  };

  const removeMedicine = (medicine: string) => {
    setSelectedMedicines((prev) => prev.filter((med) => med !== medicine));
  };

  const handlePrescriptionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedMedicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }
    const newPrescription: Prescription = {
      medicines: selectedMedicines,
      dosage,
      duration,
      frequency,
      note: prescriptionNote,
    };
    setPrescriptionList((prev) => [...prev, newPrescription]);
    // Reset prescription form fields
    setSelectedMedicines([]);
    setDosage("");
    setDuration("");
    setFrequency("");
    setPrescriptionNote("");
    setMedicineInput("");
    setMedicineSuggestions([]);
    setPrescriptionModalOpen(false);
  };

  /* Visit History Handlers */
  const openVisitDetail = (visit: Visit) => {
    setSelectedVisit(visit);
    setHistoryDetailModalOpen(true);
  };

  return (
    <div className="edit-patient">
      {/* Header remains unchanged */}
      <header>
        <div className="logo">
          MedMatch <span>MD Portal</span>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-home"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-prescription-bottle-alt"></i> DDI Check
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Card Container */}
        <div className="card-container">
          {/* Patient Information Card */}
          <section className="card patient-info">
            <h2>Patient Information</h2>
            <form onSubmit={handlePatientFormSubmit}>
              <div className="input-group">
                <label htmlFor="patientID">Patient ID</label>
                <input type="text" id="patientID" value="P001" readOnly />
              </div>
              <div className="input-group">
                <label htmlFor="patientName">Name</label>
                <input
                  type="text"
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="patientAge">Age</label>
                <input
                  type="number"
                  id="patientAge"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="patientWeight">Weight (kg)</label>
                <input
                  type="number"
                  id="patientWeight"
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(Number(e.target.value))}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="patientGender">Gender</label>
                <select
                  id="patientGender"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="patientContact">Contact Info</label>
                <input
                  type="text"
                  id="patientContact"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="patientAllergies">Allergies</label>
                <input
                  type="text"
                  id="patientAllergies"
                  value={patientAllergies}
                  onChange={(e) => setPatientAllergies(e.target.value)}
                  placeholder="e.g. Penicillin"
                />
              </div>
              <button type="submit" className="btn">
                Save Patient Info
              </button>
            </form>
          </section>

          {/* Prescription Management Card */}
          <section className="card prescription-management">
            <h2>Prescription History</h2>
            <div className="prescription-list">
              {prescriptionList.map((presc, index) => (
                <div key={index} className="prescription-item">
                  <p>
                    <strong>Medicines:</strong> {presc.medicines.join(", ")}
                  </p>
                  <p>
                    <strong>Dosage:</strong> {presc.dosage}
                  </p>
                  <p>
                    <strong>Duration:</strong> {presc.duration}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {presc.frequency}
                  </p>
                  <p>
                    <strong>Note:</strong> {presc.note}
                  </p>
                </div>
              ))}
            </div>
            <button className="btn" onClick={() => setPrescriptionModalOpen(true)}>
              <i className="fas fa-plus"></i> Add New Prescription
            </button>
          </section>

          {/* File Upload & Notes Card */}
          <section className="card file-notes">
            <h2>Additional Information</h2>
            <div className="input-group file-upload">
              <label htmlFor="fileUpload">Upload Patient File</label>
              <div
                className="file-drop-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <p>{uploadedFile.name}</p>
                ) : (
                  <p>Drag & drop a file here or click to select</p>
                )}
                <input type="file" id="fileUpload" onChange={handleFileChange} />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="generalNotes">General Visit Notes</label>
              <textarea
                id="generalNotes"
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="Enter your notes..."
              ></textarea>
            </div>
            <button className="btn" onClick={() => alert("Notes saved: " + generalNotes)}>
              Save Notes
            </button>
          </section>

          {/* Visit History Card (Timeline) */}
          <section className="card visit-history">
            <h2>Visit History</h2>
            <div className="timeline">
              {dummyHistory.map((visit, index) => (
                <div
                  key={index}
                  className="timeline-item"
                  onClick={() => openVisitDetail(visit)}
                >
                  <div className="timeline-date">{visit.date}</div>
                  <div className="timeline-content">
                    <p>
                      <strong>{visit.healthReason}</strong>
                    </p>
                    <p>{visit.notes.substring(0, 50)}...</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn" onClick={() => setHistoryModalOpen(true)}>
              View All Visits
            </button>
          </section>
        </div>
      </main>

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPrescriptionModalOpen(false);
          }}
        >
          <div className="modal-content">
            <span className="close-modal" onClick={() => setPrescriptionModalOpen(false)}>
              &times;
            </span>
            <h2>Add New Prescription</h2>
            <form onSubmit={handlePrescriptionSubmit}>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Type medicine name..."
                  value={medicineInput}
                  onChange={handleMedicineInputChange}
                  autoComplete="off"
                />
                {medicineSuggestions.length > 0 && (
                  <div className="suggestion-list">
                    {medicineSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className={`suggestion-item ${
                          suggestion === "No medicines found" ? "no-medicine" : ""
                        }`}
                        onClick={() => {
                          if (suggestion !== "No medicines found") {
                            addMedicine(suggestion);
                            setMedicineInput("");
                            setMedicineSuggestions([]);
                          }
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="selected-medicines">
                {selectedMedicines.map((med, idx) => (
                  <span key={idx} className="medicine-pill">
                    {med}
                    <button
                      type="button"
                      className="remove-pill"
                      onClick={() => removeMedicine(med)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="input-group">
                <label htmlFor="dosage">Dosage</label>
                <input
                  type="text"
                  id="dosage"
                  placeholder="e.g. 500 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  placeholder="e.g. 7 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="frequency">Frequency</label>
                <input
                  type="text"
                  id="frequency"
                  placeholder="e.g. Twice a day"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="prescriptionNote">Note</label>
                <textarea
                  id="prescriptionNote"
                  placeholder="Additional instructions..."
                  value={prescriptionNote}
                  onChange={(e) => setPrescriptionNote(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Save Prescription
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setHistoryModalOpen(false);
          }}
        >
          <div className="modal-content large">
            <span className="close-modal" onClick={() => setHistoryModalOpen(false)}>
              &times;
            </span>
            <h2>Visit History</h2>
            <div className="history-list">
              {dummyHistory.map((visit, idx) => (
                <div key={idx} className="history-item" onClick={() => openVisitDetail(visit)}>
                  <p>
                    <strong>Date:</strong> {visit.date}
                  </p>
                  <p>
                    <strong>Reason:</strong> {visit.healthReason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Detail Modal */}
      {isHistoryDetailModalOpen && selectedVisit && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setHistoryDetailModalOpen(false);
          }}
        >
          <div className="modal-content">
            <span className="close-modal" onClick={() => setHistoryDetailModalOpen(false)}>
              &times;
            </span>
            <h2>Visit Details</h2>
            <div className="history-detail">
              <p>
                <strong>Date:</strong> {selectedVisit.date}
              </p>
              <p>
                <strong>Health Reason:</strong> {selectedVisit.healthReason}
              </p>
              <p>
                <strong>Notes:</strong> {selectedVisit.notes}
              </p>
              <h3>Prescriptions:</h3>
              {selectedVisit.prescriptions.map((presc, idx) => (
                <div key={idx} className="history-prescription">
                  <p>
                    <strong>Medicines:</strong> {presc.medicines.join(", ")}
                  </p>
                  <p>
                    <strong>Dosage:</strong> {presc.dosage}
                  </p>
                  <p>
                    <strong>Duration:</strong> {presc.duration}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {presc.frequency}
                  </p>
                  <p>
                    <strong>Note:</strong> {presc.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientPrescription;