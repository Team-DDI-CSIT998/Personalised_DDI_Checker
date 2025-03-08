import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [availableMedicines, setAvailableMedicines] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [interactionResults, setInteractionResults] = useState<{ pair: string; description: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch medicines from MongoDB when component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setAvailableMedicines(response.data.map((drug: { name: string }) => drug.name));
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  // Update suggestions when input changes
  useEffect(() => {
    if (input.trim().length >= 3) {
      const filtered = availableMedicines.filter((med) =>
        med.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [input, availableMedicines]);

  // Add a medicine to the selected list (limit to 5, prevent duplicates)
  const addMedicine = (medicine: string) => {
    if (selectedMedicines.length >= 5) {
      setError("You can select up to 5 medicines only.");
      setShowPopup(true);
      return;
    }
    if (!selectedMedicines.some((med) => med.toLowerCase() === medicine.toLowerCase())) {
      setSelectedMedicines([...selectedMedicines, medicine]);
      setInput("");
      setSuggestions([]);
    }
  };

  // Remove a medicine from the selected list
  const removeMedicine = (medicine: string) => {
    setSelectedMedicines(selectedMedicines.filter((med) => med !== medicine));
  };

  // Analyze interactions by calling the backend API
  const analyzeInteractions = async () => {
    if (selectedMedicines.length < 2) {
      setError("Please select at least two medicines to analyze interactions.");
      setShowPopup(true);
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/interactions", {
        medicines: selectedMedicines,
      });
      setInteractionResults(response.data);
      setError(null);
      setShowPopup(true);
    } catch (error) {
      console.error("Error analyzing interactions:", error);
      setError("Failed to analyze interactions. Please try again.");
      setInteractionResults([]);
      setShowPopup(true);
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div className="logo">MedMatch</div>
        <div className="nav-container">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/how-it-works">How it Works</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
          <div className="auth-buttons">
            <Link to="/authentication" state={{ isSignUp: false }} className="signin-btn">
              Sign In
            </Link>
            <Link to="/authentication" state={{ isSignUp: true }} className="signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with DDI Checker */}
      <section className="hero">
        <div className="container">
          <h2>Safer Medication Management Starts Here</h2>
          <p>AI-powered drug interaction analysis for safer patient care.</p>
          <div className="checker-box">
            <h3>Check Interactions</h3>
            <div id="selected-medicines">
              {selectedMedicines.map((med, index) => (
                <span className="medicine-pill" key={index}>
                  {med}
                  <button
                    type="button"
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
                placeholder="Type medicine name..."
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ color: "#333" }}
              />
              {input.trim().length >= 3 &&
                (suggestions.length > 0 ? (
                  <div id="suggestion-list" style={{ display: "block" }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        className="suggestion-item"
                        key={index}
                        onClick={() => addMedicine(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div id="suggestion-list" style={{ display: "block" }}>
                    <div className="suggestion-item no-medicine">
                      No medicines found
                    </div>
                  </div>
                ))}
            </div>
            <button onClick={analyzeInteractions} className="btn-red">
              Analyze Now
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features">
        <div className="container">
          <h3>Key Features of Personalized DDI</h3>
          <div className="feature-list">
            <div className="feature-item">
              <h4>Personalized Alerts</h4>
              <p>Receive tailored notifications for potential drug interactions.</p>
            </div>
            <div className="feature-item">
              <h4>Custom Reports</h4>
              <p>Get detailed and personalized drug interaction reports.</p>
            </div>
            <div className="feature-item">
              <h4>Real-Time Analysis</h4>
              <p>Access up-to-date information with instant analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h3>How It Works</h3>
          <div className="step-list">
            <div className="step-item">
              <h4>Step 1</h4>
              <p>Type your medication name and select from suggestions.</p>
            </div>
            <div className="step-item">
              <h4>Step 2</h4>
              <p>Watch your chosen medicines appear as pills below the input.</p>
            </div>
            <div className="step-item">
              <h4>Step 3</h4>
              <p>Click 'Analyze Now' to run a personalized interaction analysis.</p>
            </div>
            <div className="step-item">
              <h4>Step 4</h4>
              <p>Review the detailed report and receive smart recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Modal for Interaction Results */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Interaction Analysis</h3>
            {error ? (
              <p className="error">{error}</p>
            ) : interactionResults.length > 0 ? (
              <ul>
                {interactionResults.map((result, index) => (
                  <li key={index}>
                    <strong>{result.pair}</strong>: {result.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No interactions found between the selected medicines.</p>
            )}
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer>
        <div className="footer-container">
          <div>
            <h4>About Us</h4>
            <p>Learn more about our mission and team.</p>
          </div>
          <div>
            <h4>Privacy Policy</h4>
            <p>Understand how we protect your data.</p>
          </div>
          <div>
            <h4>Help & Support</h4>
            <p>Get assistance with our services.</p>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>Reach out for any queries or support.</p>
          </div>
        </div>
        <p>© 2025 Med Match. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;