import React, { useState, useEffect } from "react";
import "./DdiChecker.css";

// Define interfaces for the Medicine object and DDI results.
interface Medicine {
  drugbank_id: string;
  drug_name: string;
  smiles?: string;
}

interface DDIResult {
  drug1: Medicine;
  drug2: Medicine;
  score: number | null;
  category: string;
}

const DdiChecker: React.FC = () => {
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [results, setResults] = useState<DDIResult[] | null>(null);

  // Fetch available medicines from the backend when the component mounts.
  useEffect(() => {
    fetch("http://127.0.0.1:5000/available_medicines")
      .then((res) => res.json())
      .then((data: Medicine[]) => {
        console.log("Fetched medicines:", data);
        setAvailableMedicines(data);
      })
      .catch((err) => console.error("Error fetching medicines:", err));
  }, []);

  // Filter available medicines based on input (by drug_name)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const filtered = availableMedicines.filter((med) =>
      med.drug_name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  // When a suggestion is clicked, add it to selected medicines.
  const handleSuggestionClick = (suggestion: Medicine) => {
    if (selectedMedicines.find((med) => med.drugbank_id === suggestion.drugbank_id)) return;
    setSelectedMedicines([...selectedMedicines, suggestion]);
    setInput("");
    setSuggestions([]);
  };

  // Send selected drugs to the backend for pairwise DDI checking.
  const handleAnalyzeClick = () => {
    if (selectedMedicines.length < 2) {
      alert("Please select at least two medicines for interaction analysis.");
      return;
    }
    fetch("http://127.0.0.1:5000/predict_pairwise_ddi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugs: selectedMedicines }),
    })
      .then((res) => res.json())
      .then((data: DDIResult[]) => {
        console.log("Pairwise DDI Results:", data);
        setResults(data);
      })
      .catch((err) => console.error("Error analyzing interactions:", err));
  };

  // Clear selected medicines and any results.
  const handleClearClick = () => {
    setSelectedMedicines([]);
    setResults(null);
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
            <li><a href="#"><i className="fas fa-home"></i> Dashboard</a></li>
            <li><a href="#"><i className="fas fa-prescription-bottle-alt"></i> DDI Check</a></li>
            <li><a href="#"><i className="fas fa-cog"></i> Settings</a></li>
            <li><a href="#"><i className="fas fa-sign-out-alt"></i> Logout</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <div className="hero">
          <h2>AI-Powered DDI Checker</h2>
          <p>
            Type the medicine name (min. 3 letters) and select from the suggestions below.
            Then click “Analyze Interactions” to check for potential drug interactions.
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
                    key={suggestion.drugbank_id || idx}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.drug_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display Selected Medicines */}
          <div id="selected-medicines">
            {selectedMedicines.map((medicine) => (
              <span key={medicine.drugbank_id} className="medicine-pill">
                {medicine.drug_name}
                <button
                  className="remove-pill"
                  onClick={() =>
                    setSelectedMedicines(
                      selectedMedicines.filter((med) => med.drugbank_id !== medicine.drugbank_id)
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
              <table>
                <thead>
                  <tr>
                    <th>Drug 1</th>
                    <th>Drug 2</th>
                    <th>Score</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, idx) => (
                    <tr key={idx}>
                      <td>{result.drug1.drug_name}</td>
                      <td>{result.drug2.drug_name}</td>
                      <td>{result.score !== null ? result.score.toFixed(2) : "Error"}</td>
                      <td>{result.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DdiChecker;
