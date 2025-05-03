import React, { useState, useRef, useEffect } from 'react';
import './ChatPagePatient.css';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        text: "Hello! I’m your Health Assistant. How can I help?",
        sender: 'bot',
        timestamp: '10:00 AM',
    },
];

const quickReplies = ["Next Appointment", "Lab Results"];

const ChatPagePatient: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [userInput, setUserInput] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // auto-scroll when messages change
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // user message
        setMessages(prev => [
            ...prev,
            { id: Date.now(), text: text.trim(), sender: 'user', timestamp: time }
        ]);
        setUserInput('');
        // bot reply simulation
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: 'Here’s a quick answer to your request.',
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 800);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(userInput);
        }
    };

    return (
        <div className={`chatpage-patient${darkMode ? ' dark' : ''}`}>
            <header className="chat-header">
                <button onClick={() => window.history.back()} aria-label="Go back">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h1>Health Assistant</h1>
                <button
                    onClick={() => setDarkMode(dm => !dm)}
                    aria-label="Toggle dark mode"
                >
                    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
            </header>

            <section className="chat-container" role="log" aria-live="polite">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text}
                        <span className="timestamp">{msg.timestamp}</span>
                        {msg.sender === 'bot' && (
                            <div className="quick-replies">
                                {quickReplies.map((qr, i) => (
                                    <button key={i} onClick={() => sendMessage(qr)}>
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
            </section>

            <footer className="chat-input">
                <textarea
                    placeholder="Type your message…"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={() => sendMessage(userInput)} aria-label="Send">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </footer>
        </div>
    );
};

export default ChatPagePatient;
