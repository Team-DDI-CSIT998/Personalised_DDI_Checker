import React, { useState, useRef, useEffect } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { parse, isToday, isYesterday, format } from 'date-fns';
import './Chatbot.css';
import { BASE_URL_2 } from '../base';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}
interface HistoryItem {
  id: string;
  date: string;
  summary: string;
}

const IconHistory = () => (
    <svg className="icon-history" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7H4v2h9a9 9 0 0 0 9-9 9 9 0 0 0-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></svg>
);
const IconPlus = () => (
    <svg className="icon-plus" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconAttach = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
);
const IconSend = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const IconHome = () => (
    <svg className="icon-home" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const IconMoreOptions = () => ( <>⋮</> );
const IconInfo = () => ( // Info icon for the hint
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', marginTop:'-1px' }}>
      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default function Chatbot() {
  const [showUploadHintElement, setShowUploadHintElement] = useState(false);
  const [uploadHintVisibleClass, setUploadHintVisibleClass] = useState(false); 

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || "guest";
  const [messages, setMessages] = useState<Message[]>([
    { text: `Hello! I'm MedChat, your AI medical assistant. How can I help you today?`, sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.querySelector('.messages-display-area');
    if (!container) return;

    if (container.scrollHeight <= container.clientHeight) {
      return;
    }
    const threshold = 10; 
    const isUserNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + threshold;

    if (isUserNearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryItem, setActiveHistoryItem] = useState<HistoryItem | null>(null);
  const [draftSummary, setDraftSummary] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL_2}/history/list?userId=${userId}`);
      const data: HistoryItem[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (userId !== "guest") { 
        fetchHistory();
    }
  }, [userId]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFilesToUpload(Array.from(e.target.files));
    e.target.value = ''; 
  };
  const removeFileToUpload = (idx: number) => setFilesToUpload(f => f.filter((_, i) => i !== idx));

  async function uploadFiles() {
    if (!filesToUpload.length) return;
    setIsUploading(true);
    try {
      for (const f of filesToUpload) {
        const fd = new FormData();
        fd.append('files', f);
        await fetch(`${BASE_URL_2}/history/upload?userId=${userId}`, {
          method: 'POST',
          body: fd
        });
      }
      await fetchHistory();
      setFilesToUpload([]);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  }
  
  async function sendToBackend(question: string): Promise<string> {
    try {
      const res = await fetch(`${BASE_URL_2}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userId })
      });
      if (!res.ok) { 
          const errorData = await res.json().catch(() => ({ message: `HTTP error ${res.status}` }));
          throw new Error(errorData.message || `HTTP error ${res.status}`);
      }
      const { answer } = await res.json();
      return answer;
    } catch (err: any) { 
      console.error('Chat error', err);
      return `Sorry, something went wrong: ${err.message || 'Please try again.'}`;
    }
  }
  
  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(msgs => [...msgs, { text: trimmedInput, sender: 'user', timestamp: currentTime }]);
    setInput('');
    
    const typingIndicatorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(msgs => [...msgs, { text: '...', sender: 'bot', timestamp: typingIndicatorTimestamp }]);
    
    const replyText = await sendToBackend(trimmedInput);

    setMessages(msgs => {
      const updatedMsgs = msgs.filter(msg => !(msg.sender === 'bot' && msg.text === '...'));
      return [...updatedMsgs, { text: replyText, sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function openHistoryDetailModal(item: HistoryItem) {
    setActiveHistoryItem(item);
    setDraftSummary(item.summary);
    setShowHistoryModal(true);
  }
  
  async function saveHistorySummary() {
    if (!activeHistoryItem) return;
    setIsUploading(true);
    try {
        await fetch(`${BASE_URL_2}/history/${activeHistoryItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: draftSummary })
        });
        setHistory(h => h.map(it => (it.id === activeHistoryItem.id ? { ...it, summary: draftSummary } : it)));
        setShowHistoryModal(false);
    } catch(err) {
        console.error("Failed to save history summary", err)
    } finally {
        setIsUploading(false);
    }
  }

  async function deleteHistoryItem(id: string) {
    const confirmed = window.confirm("Are you sure you want to delete this history item?");
    if (!confirmed) return;
    setIsUploading(true);
     try {
        await fetch(`${BASE_URL_2}/history/${id}`, { method: 'DELETE' });
        setHistory(h => h.filter(it => it.id !== id));
        if (activeHistoryItem?.id === id) setShowHistoryModal(false);
    } catch (err) {
        console.error("Failed to delete history item", err);
    } finally {
        setIsUploading(false);
    }
  }

  async function deleteAllHistoryItems() {
    const confirmed = window.confirm("Are you sure you want to delete ALL history items? This action cannot be undone.");
    if (!confirmed) return;
    setIsUploading(true);
    try {
        for (const item of history) {
            await fetch(`${BASE_URL_2}/history/${item.id}`, { method: 'DELETE' });
        }
        setHistory([]);
        setShowHistoryModal(false);
    } catch (err) {
        console.error("Failed to delete all history items", err);
    } finally {
        setIsUploading(false);
    }
  }

  function formatDisplayDate(dateStr: string): string {
    const parsedDate = parse(dateStr, 'dd/MM/yyyy hh:mm a', new Date());
    if (isNaN(parsedDate.getTime())) return 'Invalid date format';
  
    if (isToday(parsedDate)) return `Today, ${format(parsedDate, 'h:mm a')} UTC`;
    if (isYesterday(parsedDate)) return `Yesterday, ${format(parsedDate, 'h:mm a')} UTC`;
    return `${format(parsedDate, 'MMM dd, yyyy, h:mm a')} UTC`;
  }


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);


  useEffect(() => {
    let initialHoldTimerId: NodeJS.Timeout;
    let fadeInTimerId: NodeJS.Timeout;
    let visibilityDurationTimerId: NodeJS.Timeout;
    let finalHideTimerId: NodeJS.Timeout;

    initialHoldTimerId = setTimeout(() => {
      setShowUploadHintElement(true); 

      fadeInTimerId = setTimeout(() => {
        setUploadHintVisibleClass(true); 
      }, 50);

      visibilityDurationTimerId = setTimeout(() => {
        setUploadHintVisibleClass(false);

       
        finalHideTimerId = setTimeout(() => {
          setShowUploadHintElement(false);
        }, 400); 
      }, 15000); 

    }, 5000); 

   
    return () => {
      clearTimeout(initialHoldTimerId);
      clearTimeout(fadeInTimerId);
      clearTimeout(visibilityDurationTimerId);
      clearTimeout(finalHideTimerId);
    };
  }, []);



  const botAvatarUrl = `https://img.icons8.com/fluency/96/chatbot.png`;
  const userAvatarUrl = `https://img.icons8.com/fluency/96/test-account.png`;


  return (
    <div className="chat-app-shell">
      <div className="chat-app-container">
        <LoadingOverlay visible={isUploading} />
        
        <aside className="history-sidebar">
          <div className="history-header">
            <h2><IconHistory /> Med History</h2>
            <button 
              type="button" 
              className="new-chat-btn" 
              onClick={() => window.location.reload()}
              disabled 
            >
              <IconPlus /> New Chat
            </button>
          </div>
          <div className="history-list">
            {history.length === 0 && <p className="empty-history">No history uploaded yet.</p>}
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`history-item ${activeHistoryItem?.id === item.id ? 'active-history' : ''}`}
                title={item.summary || `Chat Session ${item.id.substring(0,5)}`}
                onClick={() => openHistoryDetailModal(item)}
              >
                <p className="history-title">{item.summary.substring(0,30)+(item.summary.length > 30 ? "..." : "") || `Chat Session ${item.id.substring(0,5)}`}</p>
                <p className="history-date">{formatDisplayDate(item.date)}</p>
              </button>
            ))}
          </div>
          <div className="history-footer">
            <button
              type="button"
              className="btn-delete-all"
              disabled={!history.length || isUploading}
              onClick={deleteAllHistoryItems}
            >
              Clear All History
            </button>
          </div>
        </aside>

        <main className="chat-main-area">
          <header className="chat-area-header">
            <div className="header-info">
                <div className="chat-title">
                    <h1>MedChat Assistant</h1>
                    <p className="chat-status">Online</p> {/* Or dynamically set status */}
                </div>
            </div>
          </header>

          <div className="messages-display-area">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                {msg.sender === 'bot' && <img src={botAvatarUrl} alt="Bot Avatar" className="avatar" />}
                <div className="message-content-wrapper">
                    <div className="message-bubble">
                        {msg.text === '...' ? (
                            <div className="typing-dots"><span></span><span></span><span></span></div>
                        ) : (
                            <p className="message-text">{msg.text}</p>
                        )}
                    </div>
                    {msg.timestamp && msg.text !== '...' && <span className="message-timestamp">{msg.timestamp}</span>}
                </div>
                {msg.sender === 'user' && <img src={userAvatarUrl} alt="User Avatar" className="avatar" />}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <footer className="chat-input-area">
          <div className="attach-btn-container"> {/* New wrapper */}
            <button
                type="button"
                className="icon-btn attach-btn"
                onClick={() => setShowUploadModal(true)}
                aria-label="Upload Patient History Documents" // Keep for accessibility
                title="Upload Patient History Documents" // Tooltip is still a good secondary cue
            >
              <IconAttach />
            </button>
            {showUploadHintElement && ( // Conditionally render the hint DIV
                <div className={`upload-indicator-hint ${uploadHintVisibleClass ? 'visible' : ''}`}>
                  <IconInfo />
                  Upload History
                </div>
              )}
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Describe your symptoms or ask a question…"
            rows={1}
          />
          <button
              type="button"
              className="icon-btn send-btn"
              disabled={!input.trim() || isUploading}
              onClick={handleSendMessage}
              aria-label="Send message"
          >
            <IconSend />
          </button>
          </footer>
        </main>
      </div>


      {showHistoryModal && activeHistoryItem && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content history-detail-modal" onClick={e => e.stopPropagation()}>
            <h3>History — {activeHistoryItem.summary.substring(0,30)+(activeHistoryItem.summary.length > 30 ? "..." : "") || `Chat ${activeHistoryItem.id.substring(0,5)}`}</h3>
            <p className="modal-date-stamp">{formatDisplayDate(activeHistoryItem.date)}</p>
            <textarea
              className="modal-textarea"
              value={draftSummary}
              onChange={e => setDraftSummary(e.target.value)}
              placeholder="Edit summary..."
            />
            <div className="modal-actions">
              <button type="button" className="btn-modal-close" onClick={() => setShowHistoryModal(false)}>Close</button>
              <button type="button" className="btn-modal-delete" onClick={() => deleteHistoryItem(activeHistoryItem.id)} disabled={isUploading}>Delete</button>
              <button type="button" className="btn-modal-savechanges" onClick={saveHistorySummary} disabled={isUploading || draftSummary === activeHistoryItem.summary}>
                {isUploading && activeHistoryItem ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => { if(!isUploading) {setFilesToUpload([]); setShowUploadModal(false);} }}>
          <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
            <h3>Upload Patient History Documents</h3>
            <div className="upload-info">
                <p>Attach relevant medical history documents.</p>
                <p>Accepted file types: <code>.txt</code>, <code>.pdf</code>, <code>.xls</code>, <code>.xlsx</code>, <code>.ppt</code>, <code>.pptx</code>, <code>.docx</code>.</p>
                <p><small>(Image support: .jpg, .png, .gif - coming soon! Currently under development.)</small></p>
            </div>
            <input 
                type="file" 
                multiple 
                onChange={handleFileSelection} 
                accept=".txt,.pdf,.xls,.xlsx,.ppt,.pptx,.docx" // Standard office documents
                disabled={isUploading}
            />
            {filesToUpload.length > 0 && (
              <ul className="file-list-preview">
                {filesToUpload.map((f, i) => (
                  <li key={i}>
                    {f.name} ({Math.round(f.size / 1024)} KB)
                    <button type="button" className="remove-file-btn" onClick={() => removeFileToUpload(i)} aria-label={`Remove ${f.name}`} disabled={isUploading}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-action btn-modal-cancel"
                onClick={() => { setFilesToUpload([]); setShowUploadModal(false); }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-action btn-modal-upload"
                disabled={!filesToUpload.length || isUploading}
                onClick={uploadFiles}
              >
                {isUploading ? 'Uploading...' : `Upload ${filesToUpload.length} File(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
}