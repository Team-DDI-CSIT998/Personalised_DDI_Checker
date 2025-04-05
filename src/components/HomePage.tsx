// HomePage.tsx - Modern Redesign (Updated)
import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaBrain,
  FaBell,
  FaChartLine,
  FaUserMd,
  FaComments,
  FaFileMedical,
  FaCheckCircle,
  FaCogs,
  FaShieldAlt,
} from 'react-icons/fa';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [availableMedicines, setAvailableMedicines] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [interactionResults, setInteractionResults] = useState<
    { pair: string; shortDescription: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch available medicines from the backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setAvailableMedicines(
          response.data.map((drug: { name: string }) => drug.name)
        );
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  // Update suggestions based on input
  useEffect(() => {
    if (input.trim().length >= 3) {
      const filtered = availableMedicines.filter((med) =>
        med.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setActiveSuggestion(-1); // reset active suggestion on input change
  }, [input, availableMedicines]);

  // Add a medicine to selected list
  const addMedicine = (medicine: string) => {
    if (selectedMedicines.length >= 5) {
      setError("You can only add up to 5 medications at a time.");
      setShowPopup(true);
      return;
    }
    if (
      !selectedMedicines.some(
        (med) => med.toLowerCase() === medicine.toLowerCase()
      )
    ) {
      setSelectedMedicines([...selectedMedicines, medicine]);
      setInput("");
      setSuggestions([]);
      setActiveSuggestion(-1);
    }
  };

  // Remove a selected medicine
  const removeMedicine = (medicine: string) => {
    setSelectedMedicines(
      selectedMedicines.filter((med) => med !== medicine)
    );
  };

  // Handle arrow keys and Enter for suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev + 1 >= suggestions.length ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0 && activeSuggestion < suggestions.length) {
          addMedicine(suggestions[activeSuggestion]);
        }
      }
    }
  };

  // Trigger the API to analyze interactions
  const analyzeInteractions = async () => {
    if (selectedMedicines.length < 2) {
      setError("Please add at least two medications to perform an interaction check.");
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/interactions", {
        medicines: selectedMedicines,
      });
      const interactions = response.data;

      if (interactions.length === 0) {
        setInteractionResults([]);
        setError(null);
        setShowPopup(true);
        return;
      }

      const simplified = await axios.post(
        "http://localhost:5000/api/simplify_interactions",
        { interactions }
      );

      setInteractionResults(simplified.data);
      setError(null);
      setShowPopup(true);
    } catch (error) {
      console.error("Error analyzing interactions:", error);
      setError("An error occurred while analyzing interactions. Please try again later.");
      setInteractionResults([]);
      setShowPopup(true);
    }
  };

  const features = [
    {
      title: "Intelligent Interaction Detection",
      icon: <FaBrain size={24} />,
      description: "Leveraging AI to pinpoint potential drug interactions with unmatched accuracy."
    },
    {
      title: "Instant Safety Alerts",
      icon: <FaBell size={24} />,
      description: "Receive immediate alerts when risky drug combinations are detected."
    },
    {
      title: "Risk Stratification",
      icon: <FaChartLine size={24} />,
      description: "In-depth analysis that prioritizes risks and offers actionable guidance."
    },
    {
      title: "Intuitive Chatbot Assistant",
      icon: <FaComments size={24} />,
      description: "Access quick, interactive support and receive tailored answers to your drug interaction queries instantly."
    },
    {
      title: "Clinician-Centric Interface",
      icon: <FaUserMd size={24} />,
      description: "Designed with clinicians in mind for a seamless, intuitive workflow."
    },
    {
      title: "Unified Health Profile",
      icon: <FaFileMedical size={24} />,
      description: "Effortlessly consolidate your medications, doctor details, and treatment history in one seamless, easy-to-use interface."
    },
    {
      title: "Verified Drug Sources",
      icon: <FaCheckCircle size={24} />,
      description: "Backed by DrugBank—the gold standard in pharmaceutical data—for trustworthy and clinically validated interaction information."
    },
    {
      title: "Fine-Tuned AI Model",
      icon: <FaCogs size={24} />,
      description: "Our custom-trained model on DrugBank data delivers precise predictions tailored for real-world clinical scenarios."
    },
    {
      title: "Private & Secure Predictions",
      icon: <FaShieldAlt size={24} />,
      description: "No third-party data sharing. Your input stays encrypted and securely processed within our system—guaranteed."
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h2>Real-Time Interaction Alerts for Safer Prescriptions</h2>
          <p>
            Our advanced AI swiftly identifies risky drug combinations, ensuring patient safety and empowering informed clinical decisions.
          </p>
          
          <div className="checker-box">
            <h3>Drug Interaction Checker</h3>
            
            <div id="selected-medicines">
              {selectedMedicines.map((med) => (
                <span className="medicine-pill" key={med}>
                  {med}
                  <button 
                    className="remove-pill"
                    onClick={() => removeMedicine(med)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="input-container">
              <input
                type="text"
                id="medicine-input"
                placeholder="Enter a drug name..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {suggestions.length > 0 && (
                <div id="suggestion-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
                      onClick={() => addMedicine(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={analyzeInteractions} 
              className="btn-red"
            >
              Check Interactions →
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h3>Why Choose MedMatch?</h3>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <h4>{feature.icon} {feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Interaction Analysis</h3>
            {error ? (
              <p className="error">{error}</p>
            ) : interactionResults.length > 0 ? (
              <ul>
                {interactionResults.map((result, index) => (
                  <li key={index}>
                    <strong>{result.pair}</strong>: {result.shortDescription}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No interactions found between the selected medications.</p>
            )}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
