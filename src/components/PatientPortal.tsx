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

  // Keyword States
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  /** DDI Checker States */
  const [ddiInput, setDdiInput] = useState("");
  const [ddiSuggestions, setDdiSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [ddiResults, setDdiResults] = useState("");

  /** Lab Results States */
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labResultsSummary, setLabResultsSummary] = useState("");

  /** Appointments (static list for now) */
  interface Appointment {
    date: string;
    time: string;
    doctor: string;
    type?: string; // optional, e.g. "Check-up", "Follow-up"d
  }

  const [appointments] = useState<Appointment[]>([
    {
      date: "March 25, 2025",
      time: "10:00 AM",
      doctor: "Dr. Smith",
      type: "General Check-up",
    },
    {
      date: "April 10, 2025",
      time: "2:00 PM",
      doctor: "Dr. Johnson",
      type: "Follow-up",
    },
  ]);

  /** Chatbot States */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  /** Sidebar Active Link */
  const [activeLink, setActiveLink] = useState("dashboard");

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
    // Simulate an NLP process
    setHistorySummary(
      "Extracted Insights: Chronic migraine, seasonal allergies, and previous hypertension detected."
    );
  };

    // Handlers for keywords
    const handleAddKeyword = () => {
      const trimmed = keywordInput.trim();
      if (!trimmed) return;
      if (!keywords.includes(trimmed)) {
        setKeywords([...keywords, trimmed]);
      }
      setKeywordInput("");
    };
  
    const handleRemoveKeyword = (kw: string) => {
      setKeywords(keywords.filter((k) => k !== kw));
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
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
        </div>
        <ul className="sidebar-nav">
          <li
            className={activeLink === "dashboard" ? "active" : ""}
            onClick={() => setActiveLink("dashboard")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </li>
          <li
            className={activeLink === "profile" ? "active" : ""}
            onClick={() => setActiveLink("profile")}
          >
            <i className="fas fa-notes-medical"></i> My Profile
          </li>
          <li
            className={activeLink === "lab" ? "active" : ""}
            onClick={() => setActiveLink("lab")}
          >
            <i className="fas fa-flask"></i> Lab Results
          </li>
          <li
            className={activeLink === "medications" ? "active" : ""}
            onClick={() => setActiveLink("medications")}
          >
            <i className="fas fa-pills"></i> Medications
          </li>
          <li
            className={activeLink === "appointments" ? "active" : ""}
            onClick={() => setActiveLink("appointments")}
          >
            <i className="fas fa-calendar-alt"></i> Appointments
          </li>
          <li>
            <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <h1>Patient Portal</h1>
        </header>
        <main>
          {/* Dashboard Section */}
          <section className="dashboard-section">
  <div className="dashboard-container">
    <h2>Your Health Dashboard</h2>
    <div className="dashboard-cards">
      <div className="card">
        <div className="card-icon-wrapper">
          <i className="fas fa-pills card-icon"></i>
        </div>
        <h3>Current Medications</h3>
        <p>{currentMedications}</p>
      </div>

      <div className="card">
        <div className="card-icon-wrapper">
          <i className="fas fa-calendar-alt card-icon"></i>
        </div>
        <h3>Upcoming Appointments</h3>
        <p>{upcomingAppointments}</p>
      </div>

      <div className="card">
        <div className="card-icon-wrapper">
          <i className="fas fa-file-medical-alt card-icon"></i>
        </div>
        <h3>Lab Results Summary</h3>
        <p>{labSummary}</p>
      </div>

      <div className="card">
        <div className="card-icon-wrapper">
          <i className="fas fa-heart card-icon"></i>
        </div>
        <h3>Health Tips</h3>
        <p>{healthTips}</p>
      </div>
    </div>
  </div>
</section>


          {/* Medical History */}
          <section className="medical-history">
      <h2>Medical History</h2>

      {/* Keyword Input */}
      <div className="keyword-input">
        <label htmlFor="medicalKeyword">Enter Your Medical History:</label>
        <div className="keyword-row">
          <input
            type="text"
            id="medicalKeyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="e.g., Chronic migraines"
          />
          <button onClick={handleAddKeyword} className="btn">
            Add
          </button>
        </div>
      </div>

      {/* Display Selected Keywords as Pills */}
      <div className="selected-keywords">
        {keywords.map((kw, idx) => (
          <span key={idx} className="keyword-pill">
            {kw}
            <button
              className="remove-pill"
              onClick={() => handleRemoveKeyword(kw)}
            >
              ×
            </button>
          </span>
        ))}
      </div>


      {/* Process History Button */}
      <button onClick={processMedicalHistory} className="btn">
        Process History
      </button>

      {/* Show Summary if available */}
      {historySummary && (
        <div className="summary">
          <p>{historySummary}</p>
        </div>
      )}

      {/*
      <div className="file-upload">
        <label htmlFor="historyFileUpload">Upload your medical documents:</label>
        <input
          type="file"
          id="historyFileUpload"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              // setHistoryFile(e.target.files[0]);
            }
          }}
        />
        <button onClick={processHistoryFile} className="btn">
          Process File
        </button>
      </div>
      */}
    </section>

          {/* DDI Checker */}
          <section className="ddi-checker">
            <h2>Drug Interaction Checker</h2>
            <div className="input-container">
              <label htmlFor="ddiInput">Type medicine name:</label>
              <input
                type="text"
                id="ddiInput"
                value={ddiInput}
                onChange={handleDdiInputChange}
                placeholder="Start typing..."
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
            <label className="custom-file-upload">
              <input
                type="file"
                id="labFileUpload"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setLabFile(e.target.files[0]);
                  }
                }}
              />
              Choose File
            </label>

            {/* Display the selected file name or "No file chosen" */}
            <span className="file-name">
              {labFile ? labFile.name : "No file chosen"}
            </span>

            <button onClick={processLabResults} className="btn summary-btn">
              Summarize Lab Results
            </button>
          </div>

          {/* Summary Display */}
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
          <div className="appointment-timeline">
            {appointments.map((apt, idx) => (
              <div className="appointment-item" key={idx}>
                {/* Timeline Icon */}
                <div className="timeline-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>

                {/* Content Card */}
                <div className="appointment-content">
                  <h3 className="appointment-date-time">
                    {apt.date} - {apt.time}
                  </h3>
                  <p className="appointment-doctor-type">
                    With {apt.doctor}
                    {/* Optional type label */}
                    {apt.type && <span className="type-label">{apt.type}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </main>
      </div>

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
