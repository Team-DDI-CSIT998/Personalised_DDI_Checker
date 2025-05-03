import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotLauncher.css';

const ChatbotLauncher: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            className="chatbot-launcher"
            onClick={() => navigate('/chat-patient')}
            aria-label="Open Chat"
        >
            <i className="fas fa-robot"></i>
        </button>
    );
};

export default ChatbotLauncher;
