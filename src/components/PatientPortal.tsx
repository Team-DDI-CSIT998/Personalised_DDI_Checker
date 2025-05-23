import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ChatbotLauncher from './chatbotLauncher';
import { PatientSidebar } from './sidebar';
import './PatientPortal.css';
import axios from 'axios';

interface PatientProfile {
  fullName: string;
  profileImage?: string;
}

const DashboardPage: React.FC = () => {
  const vitals = [
    { name: 'Blood Pressure', value: '120/80', status: 'normal' },
    { name: 'Heart Rate', value: '95 bpm', status: 'warning' },
    { name: 'Glucose', value: '8.2 mmol/L', status: 'critical' },
  ];

  const medications = ['Aspirin 81mg (once daily)', 'Ibuprofen 200mg (as needed)'];
  const healthTips = [
    'Drink at least 8 glasses of water daily',
    'Get 30 minutes of moderate exercise',
    'Maintain a balanced diet with vegetables'
  ];
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);



  useEffect(() => {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/profile/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data.patientProfile) {
            setPatientProfile(data.patientProfile);
          }
        });
    }, []);
  
  return (
    <div className="patient-portal-root">
      <div className="dashboard-container">
        {/* Sidebar */}
        <PatientSidebar
          profile={{
            name: patientProfile?.fullName || 'Patient',
            avatarUrl: patientProfile?.profileImage
          }}
        />

        
        {/* Main content */}
        <main className="main">
          <div className="alert-banner">
            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
            Your Vitamin D level is low (18 ng/mL) — consider a supplement.
          </div>

          {/* Summary Cards */}
          <div className="cards">
            <div className="card">
              <i className="fas fa-pills icon"></i>
              <h4>Medications</h4>
              <p>{medications.length} active prescriptions</p>
            </div>
            <div className="card">
              <i className="fas fa-calendar-alt icon"></i>
              <h4>Appointments</h4>
              <p>Next: Mar 25 2025</p>
            </div>
            <div className="card">
              <i className="fas fa-file-medical-alt icon"></i>
              <h4>Lab Results</h4>
              <p>3 tests available</p>
            </div>
            <div className="card">
              <i className="fas fa-heartbeat icon"></i>
              <h4>Health Status</h4>
              <p>2 alerts</p>
            </div>
          </div>

          {/* Vitals & Trends */}
          <div className="widget vitals-widget">
            <h3>
              <i className="fas fa-heart" style={{ marginRight: '8px' }}></i>
              Vitals & Trends
            </h3>
            <div className="vitals-list">
              {vitals.map((vital, index) => (
                <div key={index} className="vital-item">
                  <span className="vital-name">
                    <i className={`fas fa-${getVitalIcon(vital.name)}`} style={{ marginRight: '8px' }}></i>
                    {vital.name}
                  </span>
                  <div className={`sparkline ${vital.status}`}></div>
                  <span className="vital-value">{vital.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Appointment */}
          <div className="widget appointment-widget">
            <h3>
              <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
              Next Appointment
            </h3>
            <div className="appt-next">
              <p><strong>In 3 days - March 25, 2025</strong></p>
              <p><i className="far fa-clock"></i> 10:00 AM - 10:30 AM</p>
              <p><i className="fas fa-user-md"></i> Dr. Smith - General Checkup</p>
              <p><i className="fas fa-map-marker-alt"></i> Main Clinic, Room 205</p>
            </div>
          </div>

          {/* Recent Lab Results */}
          <div className="widget labs-widget">
            <h3>
              <i className="fas fa-flask" style={{ marginRight: '8px' }}></i>
              Recent Lab Results
            </h3>
            <div className="table-container">
              <table className="labs-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cholesterol</td>
                    <td>190 mg/dL</td>
                    <td className="status-border">Borderline</td>
                    <td>Mar 10, 2025</td>
                  </tr>
                  <tr>
                    <td>Vitamin D</td>
                    <td>18 ng/mL</td>
                    <td className="status-critical">Low</td>
                    <td>Mar 10, 2025</td>
                  </tr>
                  <tr>
                    <td>HbA1c</td>
                    <td>5.6%</td>
                    <td className="status-normal">Normal</td>
                    <td>Mar 10, 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right panel */}
        <aside className="aside">
          <div className="widget alerts-widget">
            <h3>
              <i className="fas fa-bell" style={{ marginRight: '8px' }}></i>
              Reminders & Alerts
            </h3>
            <ul>
              <li>
                <i className="fas fa-pills" style={{ marginRight: '8px' }}></i>
                Take Aspirin at 8:00 AM
              </li>
              <li>
                <i className="fas fa-user-md" style={{ marginRight: '8px' }}></i>
                Doctor visit at 3:00 PM
              </li>
              <li>
                <i className="fas fa-prescription-bottle-alt" style={{ marginRight: '8px' }}></i>
                Refill Metformin
              </li>
            </ul>
          </div>

          <div className="widget notifications-widget">
            <h3>
              <i className="fas fa-inbox" style={{ marginRight: '8px' }}></i>
              Notifications
            </h3>
            <ul>
              <li>New lab result available</li>
              <li>Appointment reminder</li>
              <li>Medication update</li>
            </ul>
          </div>

          <div className="widget tips-widget">
            <h3>
              <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
              Health Tips
            </h3>
            <ul>
              {healthTips.map((tip, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle" style={{ marginRight: '8px', color: '#2A9D8F' }}></i>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <ChatbotLauncher />
      </div>
    </div>
  );

  // Helper function to get icons for vitals
  function getVitalIcon(vitalName: string): string {
    switch(vitalName) {
      case 'Blood Pressure': return 'tint';
      case 'Heart Rate': return 'heartbeat';
      case 'Glucose': return 'blood';
      default: return 'chart-line';
    }
  }
};

export default DashboardPage;