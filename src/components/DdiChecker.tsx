import React, { useState } from "react";
import "./DdiChecker.css";

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

const DdiChecker: React.FC = () => {
  // State for input field, suggestions, selected medicines, and results.
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [results, setResults] = useState("");

  // Handle input changes, filtering available medicines
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const filtered = availableMedicines.filter((med) =>
      med.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.length > 0 ? filtered : ["No medicines found"]);
  };

  // Handle suggestion click: add medicine if not already added.
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "No medicines found") return;
    if (
      selectedMedicines.find(
        (med) => med.toLowerCase() === suggestion.toLowerCase()
      )
    )
      return;
    setSelectedMedicines([...selectedMedicines, suggestion]);
    setInput("");
    setSuggestions([]);
  };

  // Analyze interactions: simulate processing then update results.
  const handleAnalyzeClick = () => {
    if (selectedMedicines.length === 0) {
      alert("Please add at least one medicine before analyzing interactions.");
      return;
    }
    setResults(
      "Analyzing interactions for: " + selectedMedicines.join(", ") + " ..."
    );
    setTimeout(() => {
      setResults("No significant interactions found among the selected medicines.");
    }, 1500);
  };

  // Clear selected medicines and results.
  const handleClearClick = () => {
    setSelectedMedicines([]);
    setResults("");
  };

  return (
    <div className="ddi-checker-page">
      {/* Header */}
      <header>
        <div className="logo">
          MedMatch <span>MD Portal</span>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-home"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-prescription-bottle-alt"></i> DDI Check
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <div className="hero">
          <h2>AI-Powered DDI Checker</h2>
          <p>
            Type the medicine name (min. 3 letters) and select from the
            suggestions below. Then click “Analyze Interactions” to check for
            potential drug interactions.
          </p>
        </div>

        <div className="ddi-container">
          {/* Input & Suggestion Dropdown */}
          <div className="input-container">
            <input
              type="text"
              id="medicine-input"
              placeholder="Type medicine name..."
              autoComplete="off"
              value={input}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <div id="suggestion-list">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`suggestion-item ${
                      suggestion === "No medicines found" ? "no-medicine" : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display selected medicines as pills */}
          <div id="selected-medicines">
            {selectedMedicines.map((medicine, idx) => (
              <span key={idx} className="medicine-pill">
                {medicine}
                <button
                  className="remove-pill"
                  onClick={() =>
                    setSelectedMedicines(
                      selectedMedicines.filter((med) => med !== medicine)
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="buttons">
            <button id="analyzeBtn" className="btn" onClick={handleAnalyzeClick}>
              Analyze Interactions
            </button>
            <button id="clearBtn" className="btn clear" onClick={handleClearClick}>
              Clear All
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div id="results">
              <h3>Interaction Results</h3>
              <p id="resultsText">{results}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DdiChecker;
