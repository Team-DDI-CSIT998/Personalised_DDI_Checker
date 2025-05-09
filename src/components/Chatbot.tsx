import React, { useState, useRef, useEffect } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import './Chatbot.css';


interface Message {
  text: string;
  sender: 'user' | 'bot';
}
interface HistoryItem {
  id: string;
  date: string;
  summary: string;
}

export default function Chatbot() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hello! I'm MedChat, your AI medical assistant. How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  // Loading state for uploads
  const [isUploading, setIsUploading] = useState(false);

  // Scroll to bottom
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messages.length > 1) {
           endRef.current?.scrollIntoView({ behavior: 'smooth' });
         }
  }, [messages]);

  // Patient-history state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [active, setActive] = useState<HistoryItem | null>(null);
  const [draft, setDraft] = useState('');
  const [showHisModal, setShowHisModal] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetch('http://localhost:8000/history/list')
      .then(res => res.json())
      .then((data: HistoryItem[]) => setHistory(data))
      .catch(() => {});
  }, []);

  // File-upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileSel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };
  const removeFile = (idx: number) => setFiles(f => f.filter((_, i) => i !== idx));

  async function uploadFiles() {
    if (!files.length) return;
    setIsUploading(true);
    try {
      for (const f of files) {
        const fd = new FormData();
        fd.append('files', f);
        await fetch('http://localhost:8000/history/upload', { method: 'POST', body: fd });
      }
      const updated = await fetch('http://localhost:8000/history/list').then(r => r.json());
      setHistory(updated);
      setFiles([]);
      setShowUpload(false);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  }

  // Chat send
  async function sendToBackend(question: string): Promise<string> {
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { answer } = await res.json();
      return answer;
    } catch (err) {
      console.error('Chat error', err);
      return 'Sorry, something went wrong. Please try again.';
    }
  }
  
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(msgs => [...msgs, { text: trimmed, sender: 'user' }]);
    setInput('');
    setMessages(msgs => [...msgs, { text: '...', sender: 'bot' }]);
    const reply = await sendToBackend(trimmed);
    setMessages(msgs => {
      const pruned = msgs.filter((msg, i) => !(msg.sender === 'bot' && msg.text === '...' && i === msgs.length - 1));
      return [...pruned, { text: reply, sender: 'bot' }];
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helpers
  function openHistoryModal(item: HistoryItem) {
    setActive(item);
    setDraft(item.summary);
    setShowHisModal(true);
  }
  async function saveHistory() {
    if (!active) return;
    await fetch(`http://localhost:8000/history/${active.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: draft })
    });
    setHistory(h => h.map(it => (it.id === active.id ? { ...it, summary: draft } : it)));
    setShowHisModal(false);
  }
  async function deleteHistory(id: string) {
    await fetch(`http://localhost:8000/history/${id}`, { method: 'DELETE' });
    setHistory(h => h.filter(it => it.id !== id));
    if (active?.id === id) setShowHisModal(false);
  }

  return (
    <div className="chat-shell">
      {/* Main chat panel */}
      {/* Global loader */}
      <LoadingOverlay visible={isUploading} />
      <div className="chat-container bordered">
        <header className="chat-header">
          <h3>MedChat Assistant</h3>
          <p>AI-Powered Medical Guidance</p>
        </header>

        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}-message`}>              
              <div className="message-content">
                {msg.text}
                <span className="message-timestamp">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <button type="button" className="btn clip-btn" onClick={() => setShowUpload(true)} aria-label="Attach files">📎</button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms or ask a question…"
              rows={1}
            />
            <button type="button" className="btn send-btn" disabled={!input.trim()} onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>

      {/* History panel */}
      <aside className="history-rail bordered">
        <header><h4>Patient History</h4></header>
        {history.length === 0 && <p className="empty">No history uploaded yet.</p>}
        <div className="rail-scroll">
          {history.map(item => (
            <button key={item.id} type="button" className="history-card btn" title="Click to view summary" onClick={() => openHistoryModal(item)}>
              <span className="date">{item.date}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn danger wide"
          disabled={!history.length}
          onClick={() => history.forEach(h => deleteHistory(h.id))}
        >
          Delete All
        </button>
      </aside>

      {/* History modal */}
      {showHisModal && active && (
        <div className="modal-overlay">
          <div className="modal big bordered">
            <h3>History — {active.date}</h3>
            <textarea
              className="modal-text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
            />
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setShowHisModal(false)}>Close</button>
              <button type="button" className="btn danger" onClick={() => deleteHistory(active.id)}>Delete</button>
              <button type="button" className="btn" onClick={saveHistory}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal bordered">
            <h3>Upload patient documents</h3>
            <input type="file" multiple onChange={handleFileSel} />
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={i}>
                    {f.name}
                    <button type="button" className="remove-file btn" onClick={() => removeFile(i)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => { setFiles([]); setShowUpload(false); }}>Cancel</button>
              <button type="button" className="btn" disabled={!files.length} onClick={uploadFiles}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
