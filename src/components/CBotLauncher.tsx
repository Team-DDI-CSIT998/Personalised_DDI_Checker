import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CBotLauncher.css';

const ChatbotLauncher: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            className="chatbot-launcher"
            onClick={() => navigate('/chatbot')}
            aria-label="Open Chat"
        >
            <i className="fas fa-robot"></i>
        </button>
    );
};

export default ChatbotLauncher;
