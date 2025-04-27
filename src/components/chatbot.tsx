import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen(o => !o);
    const closeChat = () => setOpen(false);

    return (
        <div className={`chatbot ${open ? 'open' : ''}`}>
            <button className="chatbot-toggle" onClick={toggleOpen}>
                <i className="fas fa-robot"></i>
            </button>

            <div className="chatbot-window">
                <div className="chatbot-header">
                    <span>Your Health Assistant</span>
                    <button className="chatbot-close" onClick={closeChat}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="chatbot-messages">
                    <div className="message bot">Hi there! How can I help you today?</div>
                </div>

                <div className="chatbot-input">
                    <input type="text" placeholder="Type your message…" />
                    <button className="send-btn">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
