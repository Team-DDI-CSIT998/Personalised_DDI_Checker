// DashboardPage.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import ChatbotLauncher from './chatbotLauncher';
import { PatientSidebar } from './sidebar';
import './PatientPortal.css';

const DashboardPage: React.FC = () => {
  const vitals = [
    { name: 'Blood Pressure', value: '120/80', status: 'normal' },
    { name: 'Heart Rate', value: '95 bpm', status: 'warning' },
    { name: 'Glucose', value: '8.2 mmol/L', status: 'critical' },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <PatientSidebar />

      {/* Main content */}
      <main className="main">
        <div className="alert-banner">
          ⚠️ Your Vitamin D level is low — consider a supplement.
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <i className="fas fa-pills icon" />
            <h4>Medications</h4>
            <p>Aspirin, Ibuprofen</p>
          </div>
          <div className="card">
            <i className="fas fa-calendar-alt icon" />
            <h4>Appointments</h4>
            <p>Next: Mar 25 2025</p>
          </div>
          <div className="card">
            <i className="fas fa-file-medical-alt icon" />
            <h4>Lab Results</h4>
            <p>All normal</p>
          </div>
          <div className="card">
            <i className="fas fa-exclamation-triangle icon" />
            <h4>Health Concerns</h4>
            <p>Hypertension</p>
          </div>
          <div className="card">
            <i className="fas fa-heart icon" />
            <h4>Health Tips</h4>
            <p>Stay hydrated</p>
          </div>
        </div>

        {/* Vitals & Trends */}
        <div className="widget">
          <h3>Vitals &amp; Trends</h3>
          <div className="vitals-list">
            {vitals.map(v => (
              <div key={v.name} className="vital-item">
                <span>{v.name}</span>
                <div className={`sparkline ${v.status}`} />
                <span>{v.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Appointment */}
        <div className="widget">
          <h3>Next Appointment</h3>
          <div className="appt-next">
            <p><strong>In 3 days</strong></p>
            <p>Mar 25 2025 – 10:00 AM</p>
            <p>Dr. Smith (Check-up)</p>
          </div>
        </div>

        {/* Recent Lab Results */}
        <div className="widget recent-labs">
          <h3>Recent Lab Results</h3>
          <table>
            <thead>
              <tr><th>Test</th><th>Value</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Cholesterol</td>
                <td>190 mg/dL</td>
                <td className="status-border">Borderline</td>
              </tr>
              <tr>
                <td>Vitamin D</td>
                <td>18 ng/mL</td>
                <td className="status-critical">Low</td>
              </tr>
              <tr>
                <td>HbA1c</td>
                <td>5.6 %</td>
                <td className="status-normal">Normal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Right panel */}
      <aside className="aside">
        <div className="widget alerts">
          <h3>Reminders &amp; Alerts</h3>
          <ul>
            <li>Take Aspirin at 8:00 AM</li>
            <li>Doctor visit at 3:00 PM</li>
            <li>Refill Metformin</li>
          </ul>
        </div>
        <div className="widget">
          <h3>Notifications</h3>
          <ul>
            <li>New lab result available</li>
            <li>Appointment reminder at 9 AM</li>
            <li>Medication update</li>
          </ul>
        </div>
        <div className="widget">
          <h3>Quick Health Tips</h3>
          <ul>
            <li>Drink 8 glasses of water</li>
            <li>Take a 15-minute walk</li>
            <li>Eat a balanced meal</li>
          </ul>
        </div>
      </aside>

      <ChatbotLauncher />
    </div>
  );
};

export default DashboardPage;
