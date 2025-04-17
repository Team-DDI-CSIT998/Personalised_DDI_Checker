import React, { useState } from 'react';
import './PatientPortal.css';

const EnhancedPortal: React.FC = () => {
  // Sidebar toggle function
  const toggleSidebar = () => {
    const sidebar = document.getElementById('left-sidebar');
    const toggleBtnIcon = document.getElementById('toggle-icon');
    if (sidebar && toggleBtnIcon) {
      sidebar.classList.toggle('collapsed');
      toggleBtnIcon.classList.toggle('fa-angle-left');
      toggleBtnIcon.classList.toggle('fa-angle-right');
    }
  };

  // Chatbot toggle function
  const toggleChatbot = () => {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    }
  };

  // Medical History state for adding and removing conditions
  const [inputValue, setInputValue] = useState<string>('');
  const [conditions, setConditions] = useState<string[]>([
    'Chronic migraines', // Example pre-loaded condition
  ]);

  // Add condition handler
  const handleAddCondition = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return; // do nothing if empty
    setConditions((prev) => [...prev, trimmed]);
    setInputValue('');
  };

  // Remove condition handler
  const handleRemoveCondition = (conditionToRemove: string) => {
    setConditions((prev) => prev.filter((cond) => cond !== conditionToRemove));
  };

  const handleProcessConditions = () => {
    console.log('Process Condition clicked. Current conditions:', conditions);
  };

  //DDI Checker state
  const [medicineInput, setMedicineInput] = useState<string>('');
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([
    'Aspirin',
    'Ibuprofen', // Example pre-loaded
  ]);

  // Handle adding a new medicine from input
  const handleAddMedicine = () => {
    const trimmed = medicineInput.trim();
    if (!trimmed) return; // Do nothing if empty
    // Add medicine to the array
    setSelectedMedicines((prev) => [...prev, trimmed]);
    setMedicineInput('');
  };

  // Handle removing an existing medicine from the array
  const handleRemoveMedicine = (medicineToRemove: string) => {
    setSelectedMedicines((prev) => prev.filter((med) => med !== medicineToRemove));
  };

  // Placeholder logic for analyzing interactions
  const handleAnalyzeInteractions = () => {
    // In a real scenario, you'd do an API call or advanced logic here
    console.log('Analyzing interactions for:', selectedMedicines);
  };

  // Clear all selected medicines
  const handleClearAll = () => {
    setSelectedMedicines([]);
  };

  return (
    <div className="app-container">
      {/* Header */}
      

      {/* Hero Section
      <section className="hero-section">
        <h1>Empower Your Health Journey</h1>
        <p>
          Access personalized care, track your progress, and stay ahead on your path to wellness.
        </p>
        <button className="cta-btn">Get Started</button>
      </section>
 */}
      {/* 3-Colu*mn Layout */}
      <div className="content-container">
        {/* Left Sidebar (Collapsible) */}
        <aside className="left-sidebar" id="left-sidebar">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i id="toggle-icon" className="fas fa-angle-left"></i>
          </button>
          <ul>
            <li className="active">
              <i className="fas fa-tachometer-alt"></i>
              <span className="menu-label">Dashboard</span>
            </li>
            <li>
              <i className="fas fa-user"></i>
              <span className="menu-label">My Profile</span>
            </li>
            <li>
              <i className="fas fa-flask"></i>
              <span className="menu-label">Lab Results</span>
            </li>
            <li>
              <i className="fas fa-pills"></i>
              <span className="menu-label">Medications</span>
            </li>
            <li>
              <i className="fas fa-calendar-alt"></i>
              <span className="menu-label">Appointments</span>
            </li>
            <li>
              <i className="fas fa-sign-out-alt"></i>
              <span className="menu-label">Logout</span>
            </li>
          </ul>
        </aside>

        {/* topbar for smaller devices */}
        <aside className="topbar" id="tobar">
          <ul>
            <li className="active">
              <i className="fas fa-tachometer-alt"></i>
            </li>
            <li>
              <i className="fas fa-user"></i>
            </li>
            <li>
              <i className="fas fa-flask"></i>
            </li>
            <li>
              <i className="fas fa-pills"></i>
            </li>
            <li>
              <i className="fas fa-calendar-alt"></i>
            </li>
            <li>
              <i className="fas fa-sign-out-alt"></i>
            </li>
          </ul>
        </aside>

        {/* Middle Main Content */}
        <main className="middle-content">
          {/* Dashboard Cards */}
          <div className="portal-section">
            <h2>Your Health Dashboard</h2>
            <div className="cards">
              <div className="card">
                <div className="icon"><i className="fas fa-pills"></i></div>
                <h3>Medications</h3>
                <p>Aspirin, Ibuprofen</p>
              </div>
              <div className="card">
                <div className="icon"><i className="fas fa-calendar-alt"></i></div>
                <h3>Appointments</h3>
                <p>Mar 25, 2025 - 10:00 AM</p>
              </div>
              <div className="card">
                <div className="icon"><i className="fas fa-file-medical-alt"></i></div>
                <h3>Lab Results</h3>
                <p>All results normal</p>
              </div>
              <div className="card">
                <div className="icon"><i className="fas fa-heart"></i></div>
                <h3>Health Tips</h3>
                <p>Stay hydrated &amp; exercise</p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="portal-section">
            <h2>Medical History</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter your condition"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <button className="btn" onClick={handleAddCondition}>
              Add Condition
            </button>

            {/* Display conditions as removable pills */}
            <div className="keyword-pills">
              {conditions.map((condition, idx) => (
                <span key={idx} className="pill">
                  {condition}
                  <button
                    className="remove-pill"
                    onClick={() => handleRemoveCondition(condition)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button className="btn" onClick={handleProcessConditions} style={{  marginTop: '0.5rem' }}>
              Process History
            </button>
          </div>

          {/* Drug Interaction Checker */}
          <div className="portal-section">
          <h2>Drug Interaction Checker</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Type medicine name"
              value={medicineInput}
              onChange={(e) => setMedicineInput(e.target.value)}
            />
          </div>

          {/* Display selected medicines as pills with removable icons */}
          <div className="keyword-pills">
            {selectedMedicines.map((medicine, idx) => (
              <span key={idx} className="pill">
                {medicine}
                <button
                  className="remove-pill"
                  onClick={() => handleRemoveMedicine(medicine)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Buttons: Analyze and Clear All */}
          <button className="btn" onClick={handleAddMedicine} style={{  margin: '0.5rem' }}>
            Add Medicine
          </button>
          <button className="btn" onClick={handleAnalyzeInteractions} style={{  margin: '0.5rem' }}>
            Analyze Interactions
          </button>
          <button className="btn" style={{ background: 'var(--accent)' }} onClick={handleClearAll}>
            Clear All
          </button>

          
        </div>

          {/* Lab Results */}
          <div className="portal-section">
            <h2>Lab Results</h2>
            <div className="form-group">
              <input type="file" />
            </div>
            <p>No file chosen</p>
            <button className="btn">Summarize Lab Results</button>
            <div className="lab-summary">
              <h2>Lab Summary</h2>
              <p>All parameters are within normal ranges.</p>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="portal-section">
            <h2>Upcoming Appointments</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="time-icon"><i className="fas fa-calendar-alt"></i></div>
                <div className="content">
                  <h2>Mar 25, 2025</h2>
                  <p>10:00 AM – Dr. Smith (General Check-up)</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="time-icon"><i className="fas fa-calendar-alt"></i></div>
                <div className="content">
                  <h2>Apr 10, 2025</h2>
                  <p>2:00 PM – Dr. Johnson (Follow-up)</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Extra Widgets */}
        <aside className="right-sidebar">
          <div className="widget">
            <h3>Quick Health Tips</h3>
            <ul className="health-tips">
              <li>Drink 8 glasses of water</li>
              <li>Take a 15-minute walk</li>
              <li>Eat a balanced meal</li>
            </ul>
          </div>
          <div className="widget">
            <h3>Notifications</h3>
            <ul className="notification-list">
              <li>New lab result available</li>
              <li>Appointment reminder at 9 AM</li>
              <li>Medication update</li>
            </ul>
          </div>
          <div className="widget alerts">
            <h3>Reminders &amp; Alerts</h3>
            <ul>
              <li>Take Aspirin at 8:00 AM</li>
              <li>Doctor visit at 3:00 PM</li>
              <li>Refill prescription: Metformin</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Floating Chatbot */}
      <div className="chatbot">
        <div className="chatbot-btn" onClick={toggleChatbot}>
          <i className="fas fa-robot"></i>
        </div>
        <div className="chat-window" id="chat-window">
          <div className="chat-header">
            <h3>Your Health Assistant</h3>
          </div>
          <div className="chat-body">
            <p>Hi there! How can I help you today?</p>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button className="btn-send">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPortal;
