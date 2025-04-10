import React, { useState, useEffect } from "react";
import "./MedMatchDoctorPortal.css";

/**
 * Note:
 * - The Google Fonts and Font Awesome styles should be included in your public/index.html.
 *   For example:
 *   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
 *   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 */
const MedMatchDoctorPortal: React.FC = () => {
    
  return (
    <div className="doctor-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="doctor-profile">
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="Doctor"
          />
          <h3>Dr. Sarah Johnson</h3>
          <p>Cardiologist</p>
          <button className="btn-edit">Edit Profile</button>
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
            <input
              type="text"
              placeholder="Search patients, medications..."
            />
          </div>
          <div className="header-actions">
            <i className="fas fa-bell"></i>
            <i className="fas fa-envelope"></i>
          </div>
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>142</h3>
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
            <button>
              <i className="fas fa-plus"></i> Add Patient
            </button>
          </div>

          <div className="patient-list">
            <div className="patient-item">
              <div className="patient-info">
                <h4>John Smith</h4>
                <p>ID: P1001 | Last Visit: 2 days ago</p>
              </div>
              <div className="patient-actions">
                <button>
                  <i className="fas fa-edit"></i>
                </button>
                <button>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-info">
                <h4>Maria Garcia</h4>
                <p>ID: P1002 | Last Visit: 1 week ago</p>
              </div>
              <div className="patient-actions">
                <button>
                  <i className="fas fa-edit"></i>
                </button>
                <button>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-info">
                <h4>Robert Chen</h4>
                <p>ID: P1003 | Last Visit: 3 days ago</p>
              </div>
              <div className="patient-actions">
                <button>
                  <i className="fas fa-edit"></i>
                </button>
                <button>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-info">
                <h4>Lisa Wong</h4>
                <p>ID: P1004 | Last Visit: 2 weeks ago</p>
              </div>
              <div className="patient-actions">
                <button>
                  <i className="fas fa-edit"></i>
                </button>
                <button>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Chatbot */}
      <div className="chatbot-container">
        <div className="chatbot-button">
          <i className="fas fa-robot"></i>
        </div>
      </div>

    </div>
  );
};

export default MedMatchDoctorPortal;
