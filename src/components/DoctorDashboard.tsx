import React, { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from "react";
import "./DoctorDashboard.css";

// Define a Patient type
type Patient = {
  name: string;
  id: string;
};

// Dummy patient data
const initialPatients: Patient[] = [
  { name: "John Doe", id: "P001" },
  { name: "Jane Smith", id: "P002" },
  { name: "Alice Johnson", id: "P003" },
  { name: "Bob Williams", id: "P004" },
];

const DoctorDashboard: React.FC = () => {
  // Patient list and search state
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal state for new patient form
  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState<string>("");
  const [newPatientID, setNewPatientID] = useState<string>("");

  // Chatbot state
  type ChatMessage = { sender: "bot" | "user"; message: string };
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "bot", message: "Hello Doctor! How can I assist you today?" },
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  // Filter patients based on searchQuery
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics (dummy: newPatients fixed to 1)
  const totalPatients = patients.length;
  const newPatients = 1;

  // Event handlers for patient actions
  const handleEditPatient = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    alert("Edit patient: " + patients[index].name);
  };

  const handleDeletePatient = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete " + patients[index].name + "?")) {
      const updated = [...patients];
      updated.splice(index, 1);
      setPatients(updated);
    }
  };

  // New patient form submission
  const handleNewPatientSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPatients([...patients, { name: newPatientName, id: newPatientID }]);
    setNewPatientName("");
    setNewPatientID("");
    setIsPatientModalOpen(false);
  };

  // Chatbot functions
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: "user", message: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: "I'm here to help! Could you please elaborate?" },
      ]);
    }, 1000);
  };

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header>
        <div className="logo">
          MedMatch <span className="logo-badge">MD Portal</span>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="/ddi_checker.html">
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

      {/* Main Content */}
      <main>
        {/* Dashboard Metrics */}
        <section className="metrics">
          <div className="metric-card">
            <h2 id="totalPatients">{totalPatients}</h2>
            <p>Total Patients</p>
          </div>
          <div className="metric-card">
            <h2 id="newPatients">{newPatients}</h2>
            <p>New Patients Today</p>
          </div>
        </section>

        {/* Patient Section */}
        <section className="patient-section">
          <div className="patient-controls">
            <input
              type="text"
              id="patientSearch"
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
            <button id="addPatientBtn" onClick={() => setIsPatientModalOpen(true)}>
              <i className="fas fa-plus"></i> Add New Patient
            </button>
          </div>
          <div className="patient-list">
            {filteredPatients.length === 0 ? (
              <p style={{ textAlign: "center", color: "#585858", padding: "1rem" }}>
                No patients found.
              </p>
            ) : (
              filteredPatients.map((patient, index) => (
                <div
                  key={index}
                  className="patient-item"
                  onClick={() => alert("Navigate to details for " + patient.name)}
                >
                  <div className="patient-details">
                    <span>
                      <strong>{patient.name}</strong>
                    </span>
                    <span>ID: {patient.id}</span>
                  </div>
                  <div className="patient-actions">
                    <button onClick={(e) => handleEditPatient(index, e)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={(e) => handleDeletePatient(index, e)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* New Patient Modal */}
      {isPatientModalOpen && (
        <div
          className="modal"
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains("modal")) {
              setIsPatientModalOpen(false);
            }
          }}
        >
          <div className="modal-content">
            <span className="close-modal" onClick={() => setIsPatientModalOpen(false)}>
              &times;
            </span>
            <h2>Add New Patient</h2>
            <form id="patientForm" onSubmit={handleNewPatientSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  id="patientName"
                  placeholder="Patient Name"
                  value={newPatientName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewPatientName(e.target.value)
                  }
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="patientID"
                  placeholder="Patient ID"
                  value={newPatientID}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewPatientID(e.target.value)
                  }
                  required
                />
              </div>
              <button type="submit">
                <i className="fas fa-user-plus"></i> Add Patient
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="chatbot-container">
        <div className="chat-window" style={{ display: isChatOpen ? "block" : "none" }}>
          <div className="chat-header">
            <h3>MedMatch AI Assistant</h3>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
            />
            <button onClick={handleChatSend}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <div className="chatbot-button" onClick={toggleChat}>
          <i className="fas fa-robot"></i>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
