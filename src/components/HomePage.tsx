import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

const availableMedicines = [
  "Aspirin",
  "Ibuprofen",
  "Acetaminophen",
  "Metformin",
  "Lisinopril",
  "Amoxicillin",
  "Azithromycin",
  "Simvastatin",
  "Omeprazole",
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);

  // Update suggestions when input changes.
  useEffect(() => {
    if (input.trim().length >= 3) {
      const filtered = availableMedicines.filter((med) =>
        med.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  // Add a medicine to the selected list (if not already added)
  const addMedicine = (medicine: string) => {
    if (
      !selectedMedicines.some(
        (med) => med.toLowerCase() === medicine.toLowerCase()
      )
    ) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  // Remove a medicine from the selected list
  const removeMedicine = (medicine: string) => {
    setSelectedMedicines(selectedMedicines.filter((med) => med !== medicine));
  };

  // Simulate analyzing interactions
  const analyzeInteractions = () => {
    if (selectedMedicines.length === 0) {
      alert("Please add at least one medicine before analyzing interactions.");
      return;
    }
    alert("Analyzing interactions for: " + selectedMedicines.join(", "));
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
            {/* Using Link with state so that the Authentication page knows which mode to load */}
            <Link
              to="/authentication"
              state={{ isSignUp: false }}
              className="signin-btn"
            >
              Sign In
            </Link>
            <Link
              to="/authentication"
              state={{ isSignUp: true }}
              className="signup-btn"
            >
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
            {/* Display selected medicine pills */}
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
            {/* Input field & suggestion dropdown */}
            <div className="input-container">
              <input
                type="text"
                id="medicine-input"
                placeholder="Type medicine name..."
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ color: "#333" }} // Ensure text color is visible
              />
              {/* Show suggestions if available */}
              {input.trim().length >= 3 &&
                (suggestions.length > 0 ? (
                  <div id="suggestion-list" style={{ display: "block" }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        className="suggestion-item"
                        key={index}
                        onClick={() => {
                          addMedicine(suggestion);
                          setInput("");
                          setSuggestions([]);
                        }}
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
            {/* Analyze Now button */}
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
              <p>
                Receive tailored notifications for potential drug interactions
                based on your medication profile.
              </p>
            </div>
            <div className="feature-item">
              <h4>Custom Reports</h4>
              <p>
                Get detailed and personalized drug interaction reports to guide
                safer medication use.
              </p>
            </div>
            <div className="feature-item">
              <h4>Real-Time Analysis</h4>
              <p>
                Access up-to-date information with smart suggestions and
                instant analysis.
              </p>
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
              <p>Type your medication name and select from the suggestions.</p>
            </div>
            <div className="step-item">
              <h4>Step 2</h4>
              <p>
                Watch your chosen medicines appear as pills below the input.
              </p>
            </div>
            <div className="step-item">
              <h4>Step 3</h4>
              <p>
                Click on "Analyze Now" to run a personalized interaction
                analysis.
              </p>
            </div>
            <div className="step-item">
              <h4>Step 4</h4>
              <p>
                Review the detailed report and receive smart recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

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
        <p>&copy; 2025 Med Match. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
