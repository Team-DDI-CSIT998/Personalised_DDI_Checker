import React, { useState, ChangeEvent, FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import './PatientPortal.css';  // layout & sidebar
import './MedHistory.css';     // updated styles including form + detail cards
import Chatbot from './chatbot';


interface ConditionEntry {
    condition: string;
    date: string;
    provider: string;
    notes: string;
}

const MedHistoryPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [entries, setEntries] = useState<ConditionEntry[]>([
        { condition: 'Type 2 Diabetes', date: 'Mar 12, 2021', provider: 'Dr. A. Smith', notes: 'Metformin 500 mg BID; improved control.' },
        { condition: 'Hypertension', date: 'Jan 08, 2019', provider: 'Dr. L. Wong', notes: 'Lisinopril 10 mg QD; lifestyle advised.' },
    ]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [historyText, setHistoryText] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const allSuggestions = ['Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'COPD', 'Migraine'];
    const [selectedKeywords, setSelected] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const toggleSidebar = () => setCollapsed(c => !c);
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-item${isActive ? ' active' : ''}`;

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setHistoryText('');
        setKeywordInput('');
        setSelected([]);
        setFile(null);
    };

    const filteredSuggestions = keywordInput.trim()
        ? allSuggestions
            .filter(s => s.toLowerCase().includes(keywordInput.toLowerCase()))
            .filter(s => !selectedKeywords.includes(s))
        : [];

    const addKeyword = (kw: string) => { setSelected([...selectedKeywords, kw]); setKeywordInput(''); };
    const removeKeyword = (kw: string) => setSelected(selectedKeywords.filter(k => k !== kw));
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && setFile(e.target.files[0]);

    const handleAddCondition = () => {
        if (!historyText && selectedKeywords.length === 0 && !file) {
            alert('Please enter a description, pick keywords or upload a file.');
            return;
        }
        const newEntry: ConditionEntry = {
            condition: selectedKeywords[0] || historyText,
            date: new Date().toLocaleDateString(),
            provider: 'You',
            notes: historyText || '–',
        };
        setEntries([newEntry, ...entries]);
        closeModal();
    };
    const handleExport = () => window.print();
    const onSubmit = (e: FormEvent) => { e.preventDefault(); handleAddCondition(); };

    return (
        <div className={`dashboard-container${collapsed ? ' sidebar-collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <i className={`fas ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
                </button>
                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="Avatar" />
                    {!collapsed && (<><h4>Jane Doe</h4><p>Female | <span>Jan 15 1989</span></p></>)}
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/patientPortal" className={navLinkClass}><i className="fas fa-tachometer-alt" /><span>Dashboard</span></NavLink>
                    <NavLink to="/medical-history" className={navLinkClass}><i className="fas fa-notes-medical" /><span>History</span></NavLink>
                    <NavLink to="/lab-results" className={navLinkClass}><i className="fas fa-flask" /><span>Lab Results</span></NavLink>
                    <NavLink to="/medications" className={navLinkClass}><i className="fas fa-pills" /><span>Prescriptions</span></NavLink>
                    <NavLink to="/appointments" className={navLinkClass}><i className="fas fa-calendar-alt" /><span>Appointments</span></NavLink>
                    <NavLink to="/logout" className={navLinkClass}><i className="fas fa-sign-out-alt" /><span>Log Out</span></NavLink>
                </nav>
            </aside>

            {/* Main */}
            <main className="main">
                <div className="page-actions">
                    <button className="btn-add" onClick={openModal}>Add Condition</button>
                    <button className="btn-export" onClick={handleExport}>Export History</button>
                </div>

                <div className="stats-cards">
                    <div className="stats-card">
                        <i className="fas fa-notes-medical icon" /><p>Conditions</p><h3>{entries.length}</h3>
                    </div>
                    <div className="stats-card">
                        <i className="fas fa-pills icon" /><p>Medications</p><h3>2</h3>
                    </div>
                    <div className="stats-card">
                        <i className="fas fa-allergies icon" /><p>Allergies</p><h3>2</h3>
                    </div>
                </div>

                <div className="accordion">
                    {entries.map((e, i) => (
                        <details className="collapsible" key={i} open={i === 0}>
                            <summary><i className="fas fa-notes-medical summary-icon" /> {e.condition}</summary>
                            <div className="content">
                                <div className="detail-cards">
                                    <div className="detail-card">
                                        <div className="detail-header">
                                            <i className="far fa-calendar-alt" /> Date
                                        </div>
                                        <div className="detail-body">{e.date}</div>
                                    </div>
                                    <div className="detail-card">
                                        <div className="detail-header">
                                            <i className="far fa-user" /> Provider
                                        </div>
                                        <div className="detail-body">{e.provider}</div>
                                    </div>
                                    <div className="detail-card notes">
                                        <div className="detail-header">
                                            <i className="far fa-sticky-note" /> Notes
                                        </div>
                                        <div className="detail-body">{e.notes}</div>
                                    </div>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>

                <div className="chatbot"><Chatbot /></div>
            </main>

            {/* Add-Condition Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="add-condition-card"><button className="modal-close" onClick={closeModal}>&times;</button>
                        <h2>Add Condition</h2>

                        <form className="add-condition-form" onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="cond-desc">Description</label>
                                <textarea
                                    id="cond-desc"
                                    value={historyText}
                                    onChange={e => setHistoryText(e.target.value)}
                                    placeholder="Describe your condition…"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cond-keywords">Keywords</label>
                                <input
                                    id="cond-keywords"
                                    type="text"
                                    value={keywordInput}
                                    onChange={e => setKeywordInput(e.target.value)}
                                    placeholder="Type to search…"
                                    autoComplete="off"
                                />
                                {filteredSuggestions.length > 0 && (
                                    <ul className="suggestions active">
                                        {filteredSuggestions.map(s => (
                                            <li key={s} onClick={() => addKeyword(s)}>{s}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="selected-pills">
                                    {selectedKeywords.map(k => (
                                        <span className="pill" key={k}>
                                            {k}<button onClick={() => removeKeyword(k)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="cond-file">Upload File</label>
                                <input
                                    id="cond-file"
                                    type="file"
                                    onChange={onFileChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedHistoryPage;
