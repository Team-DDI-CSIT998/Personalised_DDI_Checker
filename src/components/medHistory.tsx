import React, { useState, ChangeEvent } from 'react';
import { NavLink } from 'react-router-dom';
import './PatientPortal.css';  // layout & sidebar
import './MedHistory.css';     // stats‐cards, buttons, modal, accordion

interface ConditionEntry {
    condition: string;
    date: string;
    provider: string;
    notes: string;
}

const MedHistoryPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => setCollapsed(c => !c);
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-item${isActive ? ' active' : ''}`;

    const [entries, setEntries] = useState<ConditionEntry[]>([
        { condition: 'Type 2 Diabetes', date: 'Mar 12, 2021', provider: 'Dr. A. Smith', notes: 'Metformin 500 mg BID; improved control.' },
        { condition: 'Hypertension', date: 'Jan 08, 2019', provider: 'Dr. L. Wong', notes: 'Lisinopril 10 mg QD; lifestyle advised.' },
    ]);

    // Modal/form state
    const [isModalOpen, setModalOpen] = useState(false);
    const [historyText, setHistoryText] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const allSuggestions = ['Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'COPD', 'Migraine'];
    const [selectedKeywords, setSelected] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const filteredSuggestions = allSuggestions
        .filter(s => s.toLowerCase().includes(keywordInput.toLowerCase()))
        .filter(s => !selectedKeywords.includes(s));

    const addKeyword = (kw: string) => { setSelected([...selectedKeywords, kw]); setKeywordInput(''); };
    const removeKeyword = (kw: string) => setSelected(selectedKeywords.filter(k => k !== kw));
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && setFile(e.target.files[0]);

    const handleAddCondition = () => {
        if (!historyText && selectedKeywords.length === 0 && !file) {
            alert('Please enter a description, choose keywords or upload a file.');
            return;
        }
        const newEntry: ConditionEntry = {
            condition: selectedKeywords[0] || historyText,
            date: new Date().toLocaleDateString(),
            provider: 'You',
            notes: historyText || '–',
        };
        setEntries([newEntry, ...entries]);
        setHistoryText(''); setSelected([]); setFile(null);
        closeModal();
    };

    const handleExport = () => window.print();

    return (
        <div className={`dashboard-container${collapsed ? ' sidebar-collapsed' : ''}`}>
            {/* --- Sidebar (exact copy from PatientPortal.tsx) --- */}
            <aside className="sidebar">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <i className={`fas ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
                </button>
                <div className="profile">
                    <img src="https://i.pravatar.cc/80" alt="Avatar" />
                    {!collapsed && <>
                        <h4>Jane Doe</h4>
                        <p>Female | <span>Jan 15 1989</span></p>
                    </>}
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={navLinkClass}><i className="fas fa-tachometer-alt" /><span>Dashboard</span></NavLink>
                    <NavLink to="/medical-history" className={navLinkClass}><i className="fas fa-notes-medical" /><span>History</span></NavLink>
                    <NavLink to="/lab-results" className={navLinkClass}><i className="fas fa-flask" /><span>Lab Results</span></NavLink>
                    <NavLink to="/medications" className={navLinkClass}><i className="fas fa-pills" /><span>Medications</span></NavLink>
                    <NavLink to="/appointments" className={navLinkClass}><i className="fas fa-calendar-alt" /><span>Appointments</span></NavLink>
                    <NavLink to="/logout" className={navLinkClass}><i className="fas fa-sign-out-alt" /><span>Log Out</span></NavLink>
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <main className="main">
                {/* 1) Buttons, spaced to extremes */}
                <div className="page-actions">
                    <button className="btn-add" onClick={openModal}>Add Condition</button>
                    <button className="btn-export" onClick={handleExport}>Export History</button>
                </div>

                {/* 2) Full-row stats cards */}
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
                    <div className="stats-card">
                        <i className="fas fa-procedures icon" /><p>Surgeries</p><h3>1</h3>
                    </div>
                </div>

                {/* 3) Accordion of entries */}
                <div className="accordion">
                    {entries.map((e, i) =>
                        <details className="collapsible" key={i} open={i === 0}>
                            <summary><i className="fas fa-notes-medical summary-icon" /> {e.condition}</summary>
                            <div className="content">
                                <p><strong>Date:</strong> {e.date}</p>
                                <p><strong>Provider:</strong> {e.provider}</p>
                                <p><strong>Notes:</strong> {e.notes}</p>
                            </div>
                        </details>
                    )}
                </div>
            </main>

            {/* --- Add-Condition Modal --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        <h3>Add Condition</h3>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={historyText}
                                onChange={e => setHistoryText(e.target.value)}
                                placeholder="Describe your condition…"
                            />
                        </div>

                        <div className="form-group">
                            <label>Keywords</label>
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={e => setKeywordInput(e.target.value)}
                                placeholder="Type to search…"
                            />
                            {filteredSuggestions.length > 0 && (
                                <ul className="suggestions">
                                    {filteredSuggestions.map(s =>
                                        <li key={s} onClick={() => addKeyword(s)}>{s}</li>
                                    )}
                                </ul>
                            )}
                            <div className="selected-pills">
                                {selectedKeywords.map(k =>
                                    <span className="pill" key={k}>
                                        {k}<button onClick={() => removeKeyword(k)}>×</button>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Upload File</label>
                            <input type="file" onChange={onFileChange} />
                        </div>

                        <button className="modal-add-btn" onClick={handleAddCondition}>
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedHistoryPage;
