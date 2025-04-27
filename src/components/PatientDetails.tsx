import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PatientDetails.css';

const PatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  // Dummy data for demonstration; in real app, fetch from API using patientId
  const patientBio = {
    name: 'John Smith',
    id: patientId,
    age: 45,
    gender: 'Male',
    dob: '1978-05-12',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
  };

  const currentMedications = [
    { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', status: 'Active', duration: '7 days' },
    { name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily', status: 'Active', duration: 'Ongoing' },
    { name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily', status: 'Active', duration: '1 month' },
  ];

  const prescriptions = [
    { id: 'RX1001', medication: 'Aspirin', date: '2024-01-15', status: 'Active' },
    { id: 'RX1002', medication: 'Lisinopril', date: '2023-12-10', status: 'Active' },
  ];

  const handleCreatePrescription = () => {
    navigate('/create-prescription');
  };

  return (
    <div className="patient-details-container">
      {/* Sidebar - doctor's sidebar from MedMatchDoctorPortal */}
      <aside className="patient-details-sidebar">
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

      {/* Main content */}
      <main className="patient-details-main">
        <section className="patient-bio-card">
          <img src={patientBio.imageUrl} alt="Patient" className="patient-bio-image" />
          <div className="patient-bio-info">
            <h3>{patientBio.name}</h3>
            <p><strong>ID:</strong> {patientBio.id}</p>
            <p><strong>Age:</strong> {patientBio.age}</p>
            <p><strong>Gender:</strong> {patientBio.gender}</p>
            <p><strong>Date of Birth:</strong> {patientBio.dob}</p>
          </div>
        </section>

        <section className="patient-section">
          <h3>Current Medications</h3>
          <table>
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentMedications.map((med, index) => (
                <tr key={index}>
                  <td>{med.name}</td>
                  <td>{med.dosage}</td>
                  <td>{med.frequency}</td>
                  <td>{med.duration}</td>
                  <td>{med.status}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="patient-section">
          <h3>Prescriptions</h3>
          <div className="prescription-list">
            {prescriptions.map((presc) => (
              <div key={presc.id} className="prescription-card">
                <h4>Prescription ID: {presc.id}</h4>
                <p><strong>Medication:</strong> {presc.medication}</p>
                <p><strong>Doctor:</strong> Dr. Sarah Johnson</p>
                <p><strong>Doctor Type:</strong> Cardiologist</p>
                <p><strong>Date:</strong> {presc.date}</p>
                <p><strong>Status:</strong> {presc.status}</p>
              </div>
            ))}
          </div>
        </section>

        <button className="btn btn-primary" onClick={handleCreatePrescription}>
          Create New Prescription
        </button>
      </main>
    </div>
  );
};

export default PatientDetails;
