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
  const [isLoading, setIsLoading] = useState(false);

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
    setActiveSuggestion(-1); 
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
    setIsLoading(true);
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
    } finally{
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: "AI-Powered DDI Prediction",
      icon: <FaBrain size={30} />,
      description: "Uses deep learning models trained on DrugBank and molecular fingerprints to predict potential drug-drug interactions."
    },
    {
      title: "Real-Time Clinical Alerts",
      icon: <FaBell size={24} />,
      description: "Instantly flags high-risk interactions or contraindications based on patient history and prescribed medications."
    },
    {
      title: "Context-Aware Risk Stratification",
      icon: <FaChartLine size={40} />,
      description: "Prioritizes alerts based on severity, patient-specific conditions, and drug classes for safer clinical decisions."
    },
    {
      title: "Interactive Medical Chatbot",
      icon: <FaComments size={30} />,
      description: "Allows users to ask natural-language medical questions, with responses tailored to patient history and AI reasoning."
    },
    {
      title: "Doctor & Patient Portals",
      icon: <FaUserMd size={30} />,
      description: "Separate role-based portals with workflows designed for clinicians and patients, ensuring clarity and usability."
    },
    {
      title: "Unified Patient Summary",
      icon: <FaFileMedical size={30} />,
      description: "Summarizes conditions, medications, and allergies into a clear, structured view using LLM-based processing."
    },
    {
      title: "Verified Drug Interaction Sources",
      icon: <FaCheckCircle size={35} />,
      description: "All interaction data is sourced from validated databases like DrugBank and FDA drug labels."
    },
    {
      title: "Custom Trained Models",
      icon: <FaCogs size={30} />,
      description: "Includes ChemBERTa and binary classifiers trained in-house for DDI, and a rule-assisted model for contraindications."
    },
    {
      title: "Privacy-Focused Design",
      icon: <FaShieldAlt size={24} />,
      description: "Patient data is de-identified, encrypted, and processed securely with no third-party sharing."
    }
  ];
  
  return (
    <div className="home-page">
      {isLoading && (
            <div className="fullscreen-loader">
                <div className="loader-content">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Loading... Please wait.</p>
                </div>
            </div>
            )}
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
