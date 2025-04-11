import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MedMatchDoctorPortal.css";

// Simple modal component for editing profile or adding a patient.
const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ title, children, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-btn confirm-btn">
            Save
          </button>
          <button onClick={onClose} className="modal-btn cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface Patient {
  id: string;
  fullName: string;
  lastVisit?: string;
}

const MedMatchDoctorPortal: React.FC = () => {
  const navigate = useNavigate();

  // Dummy doctor profile data; in a real app, fetch this from the backend.
  const [doctorProfile, setDoctorProfile] = useState({
    fullName: "Sarah Johnson",
    phone: "123-456-7890",
    specialization: "Cardiology",
    // other details as needed...
    profilePic: "https://randomuser.me/api/portraits/women/45.jpg"
  });

  // Dummy patient list
  const [patients, setPatients] = useState<Patient[]>([
    { id: "P1001", fullName: "John Smith", lastVisit: "2 days ago" },
    { id: "P1002", fullName: "Maria Garcia", lastVisit: "1 week ago" },
    { id: "P1003", fullName: "Robert Chen", lastVisit: "3 days ago" },
    { id: "P1004", fullName: "Lisa Wong", lastVisit: "2 weeks ago" },
  ]);

  // State to open modals
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null); // for editing a patient
  
  // Temp state for editing data in modals
  const [editDoctorProfile, setEditDoctorProfile] = useState({ ...doctorProfile });
  const [newPatient, setNewPatient] = useState({ fullName: "", lastVisit: "" });

  // Handlers for doctor profile modal
  const openDoctorModal = () => {
    setEditDoctorProfile({ ...doctorProfile });
    setShowDoctorModal(true);
  };
  const closeDoctorModal = () => setShowDoctorModal(false);
  const saveDoctorProfile = () => {
    setDoctorProfile({ ...editDoctorProfile });
    setShowDoctorModal(false);
    // In a real implementation, call an API to update the doctor profile
  };

  // Handler for adding a new patient
  const openAddPatientModal = () => {
    setNewPatient({ fullName: "", lastVisit: "" });
    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setCurrentPatient(null);
  };

  const saveNewPatient = () => {
    if (newPatient.fullName.trim()) {
      setPatients(prev => [
        ...prev,
        { id: "P" + Math.floor(Math.random() * 10000), fullName: newPatient.fullName, lastVisit: newPatient.lastVisit || "Just now" }
      ]);
    }
    setShowPatientModal(false);
  };

  // Handler for editing an existing patient (navigate to prescription page)
  const handleEditPatient = (patient: Patient) => {
    // Here you could pass the patient id to the prescription page.
    navigate("/MedMatchDoctorPrescription", { state: { patientId: patient.id } });
  };

  // Handler for deleting a patient
  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="doctor-profile">
          <img src={doctorProfile.profilePic} alt="Doctor" />
          <h3>Dr. {doctorProfile.fullName}</h3>
          <p>{doctorProfile.specialization}</p>
          <button className="btn-edit" onClick={openDoctorModal}>Edit Profile</button>
        </div>

        <nav className="dashboard-nav">
          <button className="nav-item active">
            <i className="fas fa-user-injured"></i> Patients
          </button>
          <button className="nav-item">
            <i className="fas fa-prescription"></i> Prescriptions
          </button>
          <button className="nav-item">
            <i className="fas fa-clinic-medical"></i> DDI Checker
          </button>
          <button className="nav-item">
            <i className="fas fa-calendar-alt"></i> Appointments
          </button>
          <button className="nav-item">
            <i className="fas fa-chart-line"></i> Analytics
          </button>
          <button className="nav-item">
            <i className="fas fa-cog"></i> Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search patients, medications..." />
          </div>
          <div className="header-actions">
            <i className="fas fa-bell"></i>
            <i className="fas fa-envelope"></i>
          </div>
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>{patients.length}</h3>
            <p>Total Patients</p>
          </div>
          <div className="metric-card">
            <h3>6</h3>
            <p>New Today</p>
          </div>
          <div className="metric-card">
            <h3>24</h3>
            <p>Appointments</p>
          </div>
          <div className="metric-card">
            <h3>8</h3>
            <p>DDI Alerts</p>
          </div>
        </div>

        {/* Patient Management */}
        <section className="patient-management">
          <div className="section-header">
            <h2>Patient Records</h2>
            <button onClick={openAddPatientModal}>
              <i className="fas fa-plus"></i> Add Patient
            </button>
          </div>

          <div className="patient-list">
            {patients.map((patient) => (
              <div className="patient-item" key={patient.id}>
                <div className="patient-info">
                  <h4>{patient.fullName}</h4>
                  <p>ID: {patient.id} | Last Visit: {patient.lastVisit}</p>
                </div>
                <div className="patient-actions">
                  <button onClick={() => handleEditPatient(patient)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDeletePatient(patient.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Edit Doctor Profile Modal */}
      {showDoctorModal && (
        <Modal
          title="Edit Profile"
          onClose={closeDoctorModal}
          onConfirm={saveDoctorProfile}
        >
          <div className="modal-form">
            <div className="form-group">
              <label htmlFor="profilePic">Profile Picture URL</label>
              <input
                id="profilePic"
                type="text"
                value={editDoctorProfile.profilePic || ""}
                onChange={(e) =>
                  setEditDoctorProfile({
                    ...editDoctorProfile,
                    profilePic: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={editDoctorProfile.fullName}
                onChange={(e) =>
                  setEditDoctorProfile({
                    ...editDoctorProfile,
                    fullName: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="specialization">Specialization</label>
              <input
                id="specialization"
                type="text"
                value={editDoctorProfile.specialization}
                onChange={(e) =>
                  setEditDoctorProfile({
                    ...editDoctorProfile,
                    specialization: e.target.value,
                  })
                }
              />
            </div>
            {/* Add other fields as needed */}
          </div>
        </Modal>
      )}

      {/* Add/Edit Patient Modal */}
      {showPatientModal && (
        <Modal
          title={currentPatient ? "Edit Patient" : "Add Patient"}
          onClose={closePatientModal}
          onConfirm={() => {
            if (currentPatient) {
              // For editing, update the patient record (this example just logs)
              console.log("Editing patient:", newPatient);
            } else {
              saveNewPatient();
            }
          }}
        >
          <div className="modal-form">
            <div className="form-group">
              <label htmlFor="patientFullName">Full Name</label>
              <input
                id="patientFullName"
                type="text"
                value={newPatient.fullName}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, fullName: e.target.value })
                }
                required
              />
            </div>
            {/* Add more fields for the patient as needed */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedMatchDoctorPortal;
