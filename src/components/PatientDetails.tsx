import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MedMatchDoctorPortal.css';
import './PatientDetails.css';
import { DocSidebar } from './sidebar';

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
  profileImage?: string;
  conditions?: string[];
}

interface Medicine {
  id?: number;
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  status?: string;
}

interface HistoryNote {
  id: string;
  createdAt: string;
  rawText: string;
  summary: string;
  structured?: {
    conditions: { current: string[]; past: string[] };
    medications: Medicine[];
    allergies: string[];
  };
}

interface PrescriptionResp {
  prescription: { medicines: Medicine[] } | null;
}

interface LocationState {
  alerts?: { ddi: string[], pdi: string[] };
}

const defaultPatientAvatars: Record<string, string> = {
  male: 'https://img.icons8.com/color/96/user-male-circle.png',
  female: 'https://img.icons8.com/color/96/user-female-circle.png',
  other: 'https://img.icons8.com/color/96/user.png',
};

const NOTES_PER_PAGE = 4;

const PatientDetails: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const [initialAlertsShown, setInitialAlertsShown] = useState(false);

  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [editForm, setEditForm] = useState<DoctorProfile>({ fullName: '', phone: '', specialization: '', qualifications: '', experienceYears: 0, age: 0, gender: '', profileImage: '' });
  const [showEditModal, setShowEditModal] = useState(false);

  const [patientBio, setPatientBio] = useState<Patient | null>(null);
  const [currentMedications, setCurrentMedications] = useState<Medicine[]>([]);
  const [currentConditions, setCurrentConditions] = useState<string[]>([]);
  const [pastConditions, setPastConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [noteInput, setNoteInput] = useState('');
  const [historyNotes, setHistoryNotes] = useState<HistoryNote[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState<HistoryNote | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [alertData, setAlertData] = useState<{ ddi: string[], pdi: string[] }>({ ddi: [], pdi: [] });
  const [showAlertModal, setShowAlertModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!patientId) return;
    
    if (!initialAlertsShown && location.state?.alerts) {
      setAlertData(location.state.alerts);
      setShowAlertModal(true);
      setInitialAlertsShown(true);
      window.history.replaceState({}, document.title);
    }

    if (!location.state?.alerts) {
      fetch(`http://localhost:8000/api/check-alerts?patientId=${patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.ddi.length || data.pdi.length) {
            setAlertData(data);
          }
        })
        .catch(err => console.error("Alert fetch failed:", err));
    }

    // Fetch doctor profile
    fetch('http://localhost:5000/api/profile/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.doctorProfile) {
          setDoctorProfile(data.doctorProfile);
          setEditForm(data.doctorProfile);
        }
      })
      .catch(() => setError('Failed to fetch doctor profile'));

    // Fetch patient bio
    fetch('http://localhost:5000/api/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const found = data.patients.find((p: Patient) => p.id === patientId);
        if (found) {
          setPatientBio(found);
        }
      })
      .catch(() => setError('Failed to fetch patient bio'));

    // Fetch prescriptions
    fetch(`http://localhost:5000/api/prescriptions?patientId=${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then((data: PrescriptionResp) => {
        if (data.prescription?.medicines) {
          setCurrentMedications(data.prescription.medicines);
        }
      })
      .catch(() => setError('Failed to fetch prescriptions'));

    // Fetch history notes
    fetch(`http://localhost:8000/api/patient-history?patientId=${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (data.notes) {
          const sortedNotes = data.notes.sort((a: HistoryNote, b: HistoryNote) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setHistoryNotes(sortedNotes);
          // Apply latest structured data
          const latest = sortedNotes[0];
          if (latest?.structured) {
            setCurrentMedications(latest.structured.medications || []);
            setCurrentConditions(latest.structured.conditions?.current || []);
            setPastConditions(latest.structured.conditions?.past || []);
            setAllergies(latest.structured.allergies || []);
          }
        }
      })
      .catch(() => setError('Failed to fetch patient history'));

      return () => {
        setAlertData({ ddi: [], pdi: [] });
        setInitialAlertsShown(false);
      };
  }, [patientId]);

  

  const handleSaveNote = async () => {
    if (!noteInput.trim()) return;
    setError(null);
    setIsLoading(true); // 🔄 Show loading
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8000/api/patient-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId, notes: noteInput })
      });
  
      const result = await res.json();
  
      if (res.ok && result.note) {
        // Update notes
        setHistoryNotes(prev => [result.note, ...prev]);
  
        // Update structured data
        const s = result.note.structured;
        if (s) {
          setCurrentMedications(s.medications || []);
          setCurrentConditions(s.conditions?.current || []);
          setPastConditions(s.conditions?.past || []);
          setAllergies(s.allergies || []);
        }
  
        // 🟡 Fetch new alerts
        const alertRes = await fetch(`http://localhost:8000/api/check-alerts?patientId=${patientId}`);
        const alertJson = await alertRes.json();
        setAlertData(alertJson);
  
        // 🟢 Show alert modal after new note
        setShowAlertModal(true);
  
        // Cleanup
        setNoteInput('');
        setCurrentPage(1);
      } else {
        setError('Failed to save note');
      }
    } catch (err) {
      setError('Error saving note');
    } finally {
      setIsLoading(false); // ✅ Hide loading
    }
  };
  
  const indexOfLast = currentPage * NOTES_PER_PAGE;
  const indexOfFirst = indexOfLast - NOTES_PER_PAGE;
  const currentNotes = historyNotes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(historyNotes.length / NOTES_PER_PAGE);

  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  const handleOpenNote = (note: HistoryNote) => {
    setSelectedNote(note);
    setEditText(note.rawText || note.summary); // Use rawText if available, fallback to summary
    setShowNoteModal(true);
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/patient-history/${selectedNote.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setHistoryNotes(prev => prev.filter(n => n.id !== selectedNote.id));
        // After deletion, fetch the latest notes to update structured data
        const latestNotes = historyNotes.filter(n => n.id !== selectedNote.id);
        const latest = latestNotes[0];
        if (latest?.structured) {
          setCurrentMedications(latest.structured.medications || []);
          setCurrentConditions(latest.structured.conditions?.current || []);
          setPastConditions(latest.structured.conditions?.past || []);
          setAllergies(latest.structured.allergies || []);
        } else {
          setCurrentMedications([]);
          setCurrentConditions([]);
          setPastConditions([]);
          setAllergies([]);
        }
        setShowNoteModal(false);
      } else {
        setError('Failed to delete note');
      }
    } catch (err) {
      setError('Error deleting note');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedNote) return;
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/patient-history/${selectedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rawText: editText })
      });
      const result = await res.json();
      if (res.ok) {
        // Update the history notes with the edited note
        setHistoryNotes(prev => prev.map(n => (n.id === selectedNote.id ? { ...n, rawText: editText, summary: result.note?.summary || editText, structured: result.note?.structured || n.structured } : n)));
        // Update structured data
        const s = result.note?.structured;
        if (s) {
          setCurrentMedications(s.medications || []);
          setCurrentConditions(s.conditions?.current || []);
          setPastConditions(s.conditions?.past || []);
          setAllergies(s.allergies || []);
        }
        setShowNoteModal(false);
      } else {
        setError('Failed to update note');
      }
    } catch (err) {
      setError('Error updating note');
    }
  };

  if (!doctorProfile || !patientBio) return <div>Loading...</div>;

  const imgSrc = patientBio.profileImage || defaultPatientAvatars[patientBio.gender.toLowerCase()] || defaultPatientAvatars.other;

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type, files } = e.target as HTMLInputElement;
    if (id === 'profileImage' && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setEditForm(prev => ({ ...prev, profileImage: reader.result as string }));
      reader.readAsDataURL(files[0]);
    } else {
      setEditForm(prev => ({ ...prev, [id]: type === 'number' ? Number(value) : value } as any));
    }
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ profileData: { doctorProfile: editForm } })
    });
    if (res.ok) {
      setDoctorProfile(editForm);
      setShowEditModal(false);
    }
  };

  return (
    <div className="patient-details-container">
      {isLoading && <div className="fullscreen-loading">Processing...</div>}
      <DocSidebar
        profile={{
          name: `Dr. ${doctorProfile.fullName}`,
          specialization: doctorProfile.specialization,
          avatarUrl: doctorProfile.profileImage,
          onEditProfile: () => setShowEditModal(true)
        }}
      />

    
      
      <main className="patient-details-main">
        {error && <div className="error-message">{error}</div>}

        {/* Patient Bio */}
        <section className="patient-bio-card">
          <img src={imgSrc} alt="Patient" className="patient-bio-image" />
          <div className="patient-bio-info">
            <h3>{patientBio.name}</h3>
            <p><strong>ID:</strong> {patientBio.id}</p>
            <p><strong>Age:</strong> {patientBio.age}</p>
            <p><strong>Gender:</strong> {patientBio.gender}</p>
            <p><strong>DOB:</strong> {patientBio.dob}</p>
          </div>
          <button className="alert-btn-inside" onClick={() => {
              setShowAlertModal(true);
          }}>
            ⚠️ Alerts {alertData.ddi.length + alertData.pdi.length > 0 ? `(${alertData.ddi.length + alertData.pdi.length})` : ''}
          </button>
        </section>

        {/* Consultation Notes */}
        <section className="patient-section">
          <h3>Consultation Notes</h3>
          <textarea
            rows={4}
            value={noteInput}
            placeholder="Type patient's condition, symptoms, or history..."
            onChange={e => setNoteInput(e.target.value)}
            className="notes-input"
          />
          <button className="btn-primary" onClick={handleSaveNote}>Save Note</button>

          <div className="notes-container">
            {currentNotes.length ? (
              currentNotes.map(note => (
                <div key={note.id} className="note-card" onClick={() => handleOpenNote(note)}>
                  <div className="note-card-title">{new Date(note.createdAt).toLocaleString()}</div>
                  <div className="note-card-preview">{note.summary.length > 100 ? note.summary.slice(0,100)+'...' : note.summary}</div>
                </div>
              ))
            ) : (
              <p>No notes available.</p>
            )}
          </div>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </section>

        {/* Current Medications */}
        <section className="patient-section">
          <h3>Current Medications</h3>
          <table>
            <thead>
              <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Status</th></tr>
            </thead>
            <tbody>
              {currentMedications.length ? (
                currentMedications.map((med, idx) => (
                  <tr key={idx}><td>{med.name || 'N/A'}</td><td>{med.dosage || 'N/A'}</td><td>{med.frequency || 'N/A'}</td><td>{med.duration || 'N/A'}</td><td>{med.status || 'N/A'}</td></tr>
                ))
              ) : (
                <tr><td colSpan={5}>No medications available.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Conditions & Allergies */}
        <section className="patient-section">
          <h3>Current Conditions</h3>
          {currentConditions.length ? <ul>{currentConditions.map((c,i)=><li key={i}>{c}</li>)}</ul> : <p>None</p>}
          <h3>Past Conditions</h3>
          {pastConditions.length ? <ul>{pastConditions.map((c,i)=><li key={i}>{c}</li>)}</ul> : <p>None</p>}
          <h3>Allergies</h3>
          {allergies.length ? <ul>{allergies.map((a,i)=><li key={i}>{a}</li>)}</ul> : <p>None</p>}
        </section>

        <button className="btn-primary" onClick={()=>navigate('/create-prescription',{state:{patientId}})}>Add / Edit Prescription</button>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Edit Profile</h3>
            <div className="modal-contents">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" className="modal-input" value={editForm.fullName} onChange={onEditChange} />
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" className="modal-input" value={editForm.phone} onChange={onEditChange} />
              <label htmlFor="specialization">Specialization</label>
              <input id="specialization" className="modal-input" value={editForm.specialization} onChange={onEditChange} />
              <label htmlFor="qualifications">Qualifications</label>
              <input id="qualifications" className="modal-input" value={editForm.qualifications!} onChange={onEditChange} />
              <label htmlFor="experienceYears">Years of Experience</label>
              <input id="experienceYears" type="number" className="modal-input" value={editForm.experienceYears!} onChange={onEditChange} />
              <label htmlFor="age">Age</label>
              <input id="age" type="number" className="modal-input" value={editForm.age} onChange={onEditChange} />
              <label htmlFor="gender">Gender</label>
              <select id="gender" className="modal-input" value={editForm.gender} onChange={onEditChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="profileImage">Profile Image</label>
              <input id="profileImage" type="file" accept="image/*" className="modal-input" onChange={onEditChange} />
              {editForm.profileImage && <img src={editForm.profileImage} alt="Preview" style={{ width: 80, marginTop: 8 }} />}
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={()=>setShowEditModal(false)}>Cancel</button>
              <button className="modal-btn confirm-btn" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Note Edit/Delete Modal */}
      {showNoteModal && selectedNote && (
        <div className="modal-overlay">
          <div className="modal-box note-modal-box">
            <h3 className="modal-title">Edit Note</h3>
            <textarea className="modal-input note-modal-input" rows={8} value={editText} onChange={e=>setEditText(e.target.value)} />
            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={()=>setShowNoteModal(false)}>Cancel</button>
              <button className="modal-btn confirm-btn" onClick={handleSaveEdit}>Save</button>
              <button className="modal-btn delete-btn" onClick={handleDeleteNote}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="modal-backdrop">
          <div className="alert-modal">
            <h2>Interaction & History Alerts</h2>
            
            <div className="alert-card">
              <h3>Drug–Drug Interaction Alerts</h3>
              {alertData.ddi.length ? alertData.ddi.map((a, i) => <p key={i}>{a}</p>) : <p>No DDI alerts.</p>}
            </div>

            <div className="alert-card">
              <h3>Patient History Alerts</h3>
              {alertData.pdi.length ? alertData.pdi.map((a, i) => <p key={i}>{a}</p>) : <p>No PDI alerts.</p>}
            </div>

            <button className="close-btn" onClick={() => setShowAlertModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;