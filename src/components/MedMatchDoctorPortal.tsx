import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MedMatchDoctorPortal.css";
import { DocSidebar } from './PortalSidebar';
import { BASE_URL_1 } from "../base";

interface DoctorProfile {
  fullName: string;
  phone: string;
  specialization: string;
  qualifications?: string;
  experienceYears?: number;
  age: number;
  gender: string;
  profileImage?: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  lastVisit: string;
}

const MedMatchDoctorPortal: React.FC = () => {
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [editForm, setEditForm] = useState<DoctorProfile>({
    fullName: "",
    phone: "",
    specialization: "",
    qualifications: "",
    experienceYears: 0,
    age: 0,
    gender: "",
    profileImage: "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: 0, gender: "", dob: "" });

  // Fetch profile and patients
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL_1}/api/profile/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.doctorProfile) {
          setDoctorProfile(data.doctorProfile);
          setEditForm(data.doctorProfile);
        }
      });
    fetch(`${BASE_URL_1}/api/patients`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.patients) setPatients(data.patients);
      });
  }, []);

  // Handle edit form change
  const onEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type, files } = e.target as HTMLInputElement;
    if (id === "profileImage" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setEditForm(prev => ({ ...prev, [id]: type === "number" ? Number(value) : value }));
    }
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL_1}/api/profile/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ profileData: { doctorProfile: editForm } }),
    });
    if (response.ok) {
      setDoctorProfile(editForm);
      setShowEditModal(false);
    } else {
      console.error("Update failed");
    }
  };

  const handleAddPatient = async () => {
    const token = localStorage.getItem("token");
    const id = "P" + (Math.floor(Math.random() * 9000) + 1000);
    const entry = { ...newPatient, id, lastVisit: "Today" };
    if (!entry.name || entry.age <= 0 || !entry.gender || !entry.dob) {
      alert("All fields are required"); return;
    }
    const res = await fetch(`${BASE_URL_1}/api/patients/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(entry),
    });
    const data = await res.json();
    if (res.ok) setPatients(prev => [...prev, data.patient]);
    setShowAddPatientModal(false);
    setNewPatient({ name: "", age: 0, gender: "", dob: "" });
  };

  return (
    <div className="doctor-dashboard">
      <DocSidebar
        profile={{
          name: `Dr. ${doctorProfile?.fullName}`,
          specialization: doctorProfile?.specialization,
          avatarUrl: doctorProfile?.profileImage,
          onEditProfile: () => setShowEditModal(true)
        }}
      />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="search-bar"><i className="fas fa-search"></i><input type="text" placeholder="Search patients, medications..."/></div>
          <div className="header-actions"><i className="fas fa-bell"></i><i className="fas fa-envelope"></i></div>
        </div>

        <div className="metrics-grid">
          {[{label:'Total Patients',value:patients.length},{label:'New Today',value:1},{label:'Appointments',value:5},{label:'Critical Cases',value:2}].map((m,i)=>(
            <div key={i} className="metric-card"><h3>{m.value}</h3><p>{m.label}</p></div>
          ))}
        </div>

        <section className="patient-management">
          <div className="section-header"><h2>Patient Records</h2><button onClick={()=>setShowAddPatientModal(true)}><i className="fas fa-plus"></i> Add Patient</button></div>
          <div className="patient-list">
            {patients.map(p=>(
              <div key={p.id} className="patient-item" onClick={()=>navigate(`/patient-details/${p.id}`)}>
                <div className="patient-info"><h4>{p.name}</h4><p>ID: {p.id} | Last Visit: {p.lastVisit}</p></div>
                <div className="patient-actions">
                  <button><i className="fas fa-edit"></i></button>
                  <button onClick={e=>{e.stopPropagation();if(window.confirm('Delete?')){
                    const token=localStorage.getItem('token');
                    fetch(`${BASE_URL_1}/api/patients/${p.id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}})
                    .then(r=>r.json()).then(d=>{if(d.message==='Patient deleted')setPatients(prev=>prev.filter(x=>x.id!==p.id));});
                  }}}><i className="fas fa-trash-alt"></i></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="chatbot-container"><div className="chatbot-button" onClick={()=>navigate('/chatbot')}><i className="fas fa-robot"></i></div></div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 className="modal-title">Edit Profile</h3>
            <div className="modal-contents">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" className="modal-input" value={editForm.fullName} onChange={onEditChange}/>
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" className="modal-input" value={editForm.phone} onChange={onEditChange}/>
              <label htmlFor="specialization">Specialization</label>
              <input id="specialization" className="modal-input" value={editForm.specialization} onChange={onEditChange}/>
              <label htmlFor="qualifications">Qualifications</label>
              <input id="qualifications" className="modal-input" value={editForm.qualifications!} onChange={onEditChange}/>
              <label htmlFor="experienceYears">Years of Experience</label>
              <input id="experienceYears" type="number" className="modal-input" value={editForm.experienceYears!} onChange={onEditChange}/>
              <label htmlFor="age">Age</label>
              <input id="age" type="number" className="modal-input" value={editForm.age} onChange={onEditChange}/>
              <label htmlFor="gender">Gender</label>
              <select id="gender" className="modal-input" value={editForm.gender} onChange={onEditChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="profileImage">Profile Image</label>
              <input id="profileImage" type="file" accept="image/*" className="modal-input" onChange={onEditChange}/>
              {editForm.profileImage && <img src={editForm.profileImage} alt="Preview" style={{width:80,marginTop:8}}/>}
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={()=>setShowEditModal(false)}>Cancel</button>
              <button className="modal-btn confirm-btn" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 className="modal-title">Add New Patient</h3>
            <div className="modal-contents">
              <label htmlFor="name">Name</label>
              <input id="name" className="modal-input" value={newPatient.name} onChange={e=>setNewPatient({...newPatient,name:e.target.value})}/>
              <label htmlFor="age">Age</label>
              <input id="age" type="number" className="modal-input" value={newPatient.age} onChange={e=>setNewPatient({...newPatient,age:Number(e.target.value)})}/>
              <label htmlFor="gender">Gender</label>
              <select id="gender" className="modal-input" value={newPatient.gender} onChange={e=>setNewPatient({...newPatient,gender:e.target.value})}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="dob">Date of Birth</label>
              <input id="dob" type="date" className="modal-input" value={newPatient.dob} onChange={e=>setNewPatient({...newPatient,dob:e.target.value})}/>
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={()=>setShowAddPatientModal(false)}>Cancel</button>
              <button className="modal-btn confirm-btn" onClick={handleAddPatient}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedMatchDoctorPortal;
