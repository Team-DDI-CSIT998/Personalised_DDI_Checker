import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import "./PatientPortal.css";

const medicineDatabase = [
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

const PatientPortal: React.FC = () => {
  /** Dashboard Overview (static or pre‐loaded data) */
  const [currentMedications] = useState("Aspirin, Ibuprofen");
  const [upcomingAppointments] = useState("March 25, 2025 - 10:00 AM");
  const [labSummary] = useState("All lab results are normal.");
  const [healthTips] = useState("Stay hydrated and exercise regularly.");

  /** Medical History States */
  const [medicalHistoryText, setMedicalHistoryText] = useState("");
  const [historySummary, setHistorySummary] = useState("");
  const [historyFile, setHistoryFile] = useState<File | null>(null);

  /** DDI Checker States */
  const [ddiInput, setDdiInput] = useState("");
  const [ddiSuggestions, setDdiSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [ddiResults, setDdiResults] = useState("");

  /** Lab Results States */
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labResultsSummary, setLabResultsSummary] = useState("");

  /** Appointments (static list for now) */
  const [appointments] = useState<string[]>([
    "March 25, 2025 - 10:00 AM with Dr. Smith",
    "April 10, 2025 - 2:00 PM with Dr. Johnson",
  ]);

  /** Chatbot States */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  /** --- DDI Checker Handlers --- */
  const handleDdiInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDdiInput(value);
    if (value.trim().length < 3) {
      setDdiSuggestions([]);
      return;
    }
    const suggestions = medicineDatabase.filter((med) =>
      med.toLowerCase().includes(value.toLowerCase())
    );
    setDdiSuggestions(suggestions.length ? suggestions : ["No medicines found"]);
  };

  const addDdiMedicine = (medicine: string) => {
    if (medicine === "No medicines found") return;
    if (selectedMedicines.find((med) => med.toLowerCase() === medicine.toLowerCase())) return;
    setSelectedMedicines((prev) => [...prev, medicine]);
  };

  const analyzeDdi = () => {
    if (selectedMedicines.length === 0) {
      alert("Please add at least one medicine before analyzing interactions.");
      return;
    }
    setDdiResults(`Analyzing interactions for: ${selectedMedicines.join(", ")}...`);
    setTimeout(() => {
      setDdiResults("No significant interactions detected.");
    }, 1500);
  };

  const clearDdi = () => {
    setSelectedMedicines([]);
    setDdiResults("");
  };

  /** --- Medical History Handlers --- */
  const processMedicalHistory = () => {
    if (medicalHistoryText.trim() === "") {
      alert("Please enter your medical history.");
      return;
    }
    // Simulate an NLP process (you could integrate an API later)
    setHistorySummary(
      "Extracted Insights: Chronic migraine, seasonal allergies, and previous hypertension detected."
    );
  };

  const processHistoryFile = () => {
    if (!historyFile) {
      alert("Please upload a document.");
      return;
    }
    setHistorySummary("File processed: No abnormal findings detected.");
  };

  /** --- Lab Results Handlers --- */
  const processLabResults = () => {
    if (!labFile) {
      alert("Please upload your lab results.");
      return;
    }
    setLabResultsSummary("Lab Summary: All parameters within normal ranges.");
  };

  /** --- Chatbot Handlers --- */
  const sendChatMessage = () => {
    if (chatInput.trim() === "") return;
    setChatMessages((prev) => [...prev, { sender: "user", text: chatInput }]);
    setChatInput("");
    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm here to help! Could you please elaborate?" },
      ]);
    }, 1000);
  };

  // Auto-scroll chat messages
  useEffect(() => {
    const chatMessagesDiv = document.getElementById("chatMessages");
    if (chatMessagesDiv) {
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="patient-portal">
      {/* Header */}
      <header>
        <div className="logo">
          <i className="fas fa-heartbeat"></i> MedMatch <span>Patient Portal</span>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-notes-medical"></i> My Profile
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-flask"></i> Lab Results
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-pills"></i> Medications
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-calendar-alt"></i> Appointments
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
        {/* Dashboard Overview */}
        <section className="dashboard-overview">
          <h2>Your Health Dashboard</h2>
          <div className="cards">
            <div className="card">
              <h3>Current Medications</h3>
              <p>{currentMedications}</p>
            </div>
            <div className="card">
              <h3>Upcoming Appointments</h3>
              <p>{upcomingAppointments}</p>
            </div>
            <div className="card">
              <h3>Lab Results Summary</h3>
              <p>{labSummary}</p>
            </div>
            <div className="card">
              <h3>Health Tips</h3>
              <p>{healthTips}</p>
            </div>
          </div>
        </section>

        {/* Medical History */}
        <section className="medical-history">
          <h2>Medical History</h2>
          <div className="history-input">
            <textarea
              value={medicalHistoryText}
              onChange={(e) => setMedicalHistoryText(e.target.value)}
              placeholder="Enter your medical history..."
            ></textarea>
            <button onClick={processMedicalHistory} className="btn">
              Process History
            </button>
          </div>
          {historySummary && (
            <div className="summary">
              <p>{historySummary}</p>
            </div>
          )}
          <div className="file-upload">
            <label htmlFor="historyFileUpload">Upload your medical documents:</label>
            <input
              type="file"
              id="historyFileUpload"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setHistoryFile(e.target.files[0]);
                }
              }}
            />
            <button onClick={processHistoryFile} className="btn">
              Process File
            </button>
          </div>
        </section>

        {/* DDI Checker */}
        <section className="ddi-checker">
          <h2>Drug Interaction Checker</h2>
          <div className="input-container">
            <input
              type="text"
              id="ddiInput"
              value={ddiInput}
              onChange={handleDdiInputChange}
              placeholder="Type medicine name..."
              autoComplete="off"
            />
            {ddiSuggestions.length > 0 && (
              <div className="suggestion-list">
                {ddiSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`suggestion-item ${
                      suggestion === "No medicines found" ? "no-medicine" : ""
                    }`}
                    onClick={() => {
                      if (suggestion !== "No medicines found") {
                        addDdiMedicine(suggestion);
                        setDdiInput("");
                        setDdiSuggestions([]);
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
                  className="remove-pill"
                  onClick={() =>
                    setSelectedMedicines(selectedMedicines.filter((m) => m !== med))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="buttons">
            <button onClick={analyzeDdi} className="btn">
              Analyze Interactions
            </button>
            <button onClick={clearDdi} className="btn clear">
              Clear All
            </button>
          </div>
          {ddiResults && (
            <div className="results">
              <h3>Interaction Results</h3>
              <p>{ddiResults}</p>
            </div>
          )}
        </section>

        {/* Lab Results */}
        <section className="lab-results">
          <h2>Lab Results</h2>
          <div className="file-upload">
            <label htmlFor="labFileUpload">Upload Lab Results:</label>
            <input
              type="file"
              id="labFileUpload"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setLabFile(e.target.files[0]);
                }
              }}
            />
            <button onClick={processLabResults} className="btn">
              Summarize Lab Results
            </button>
          </div>
          {labResultsSummary && (
            <div className="summary">
              <h3>Lab Summary</h3>
              <p>{labResultsSummary}</p>
            </div>
          )}
        </section>

        {/* Appointments */}
        <section className="appointments">
          <h2>Upcoming Appointments</h2>
          <ul>
            {appointments.map((apt, idx) => (
              <li key={idx}>{apt}</li>
            ))}
          </ul>
        </section>
      </main>

      {/* Chatbot */}
      <div className="chatbot-container">
        <div className="chatbot-button" onClick={() => setChatOpen(!chatOpen)}>
          <i className="fas fa-robot"></i>
        </div>
        {chatOpen && (
          <div className="chat-window" id="chatWindow">
            <div className="chat-header">
              <h3>Your Health Assistant</h3>
            </div>
            <div className="chat-messages" id="chatMessages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                id="chatInput"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={sendChatMessage} id="chatSendBtn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;
