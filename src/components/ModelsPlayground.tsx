import React, { useState, useEffect } from 'react';
import './ModelsPlayground.css';

type ModelSection = 'deidentifier' | 'ddi-binary' | 'dl-ddi' | 
                    'condition-contradiction' | 'deepseeks';

const ModelsPlayground: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ModelSection>('deidentifier');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);

  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [smiles1, setSmiles1] = useState('');
  const [smiles2, setSmiles2] = useState('');
  const [suggestions1, setSuggestions1] = useState<string[]>([]);
  const [suggestions2, setSuggestions2] = useState<string[]>([]);
  const [dlDDIResult, setDlDDIResult] = useState('');

  const [highlightIndex1, setHighlightIndex1] = useState(-1);
  const [highlightIndex2, setHighlightIndex2] = useState(-1);



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showSection = (sectionId: ModelSection) => {
    setActiveSection(sectionId);
    if (windowWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  
  const fetchSuggestions = async (query: string, setter: any) => {
    if (!query.trim()) {
      setter([]);
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:9000/search-drugs?q=${query}`);
      const data = await res.json();
      setter(data || []);
    } catch (err) {
      console.error('Suggestion fetch error:', err);
      setter([]);
    }
  };
  
  const fetchSmiles = async (name: string, setter: any) => {
    if (!name.trim()) {
      setter('');
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:9000/get-smiles?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setter(data.smiles || '');
    } catch (err) {
      console.error('SMILES fetch error:', err);
      setter('');
    }
  };

  // Placeholder handlers
  const handleDeidentifier = async () => {
    const input = (document.getElementById('deidentifier-input') as HTMLTextAreaElement).value;
    const outputDiv = document.getElementById('deidentifier-output');
  
    if (!input.trim()) {
      if (outputDiv) outputDiv.innerHTML = `<p style="color:red">Please enter some text.</p>`;
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:9000/deidentify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
  
      const data = await response.json();
      const { input_text, deidentified_text, entities } = data;
  
      let resultHTML = `
        <div class="result-block">
          <h3>🔍 Original Text</h3>
          <pre class="output-box">${input_text}</pre>
  
          <h3>🛡️ De-identified Text</h3>
          <pre class="output-box">${deidentified_text}</pre>
  
          <h3>📌 Extracted Entities</h3>
          <table class="entity-table">
            <thead><tr><th>Original</th><th>Type</th><th>Start</th><th>End</th><th>Model Tag</th></tr></thead>
            <tbody>
      `;
  
      for (const entity of entities) {
        resultHTML += `
          <tr>
            <td>${entity.original}</td>
            <td>${entity.remapped_tag}</td>
            <td>${entity.start}</td>
            <td>${entity.end}</td>
            <td>${entity.original_tag}</td>
          </tr>
        `;
      }
  
      resultHTML += `</tbody></table></div>`;
      if (outputDiv) outputDiv.innerHTML = resultHTML;
  
    } catch (err) {
      if (outputDiv) outputDiv.innerHTML = `<p style="color:red">🚨 Server Error: Failed to connect or process.</p>`;
      console.error(err);
    } finally {
      setIsLoading(false); // hide overlay
    }
  };
  
  

  const handleDDIBinary = async () => {
    if (!drug1 || !drug2 || !smiles1 || !smiles2) {
      const output = document.getElementById('ddi-binary-output');
      if (output) output.innerHTML = `<p style="color:red">Please select both drugs and ensure SMILES are loaded.</p>`;
      return;
    }
  
    setIsLoading(true);
  
    try {
      const res = await fetch('http://localhost:9000/predict-hybrid-binary-ddi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles1, smiles2 })
      });
  
      const data = await res.json();
      const label = data.label;
      const prob = parseFloat(data.probability).toFixed(4);
  
      const verdictText = label === 1 ? "⚠️ Drug interaction likely" : "✅ No interaction detected";
      const verdictColor = label === 1 ? "#e76f51" : "#2a9d8f";
  
      const html = `
        <div class="ddi-result-summary">
          <h3>🧪 Drug Input Summary</h3>
          <p><strong>Drug 1:</strong> ${drug1}<br/><code>${smiles1}</code></p>
          <p><strong>Drug 2:</strong> ${drug2}<br/><code>${smiles2}</code></p>
  
          <h3>📋 Binary DDI Prediction</h3>
          <div style="background: ${verdictColor}20; border-left: 5px solid ${verdictColor}; padding: 1rem; border-radius: 8px;">
            <strong style="color: ${verdictColor}">${verdictText}</strong><br/>
            <span style="opacity: 0.8">Confidence: ${prob}</span>
          </div>
        </div>
      `;
  
      const output = document.getElementById('ddi-binary-output');
      if (output) output.innerHTML = html;
  
    } catch (err) {
      console.error('Binary DDI fetch error:', err);
      const output = document.getElementById('ddi-binary-output');
      if (output) output.innerHTML = `<p style="color:red">Server error. Please try again.</p>`;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDLDDI = async () => {
    if (!smiles1 || !smiles2) {
        setDlDDIResult('Please select both drugs.');
        return;
    }

    try {
        setIsLoading(true);
        const res = await fetch('http://localhost:9000/predict-chemberta-ddi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles1, smiles2 }),
        });
        const data = await res.json();

        let html = `
          <div class="ddi-result-summary">
            <h3>🧪 Drug Input Summary</h3>
            <p><strong>Drug 1:</strong> ${drug1} <br/><code>${smiles1}</code></p>
            <p><strong>Drug 2:</strong> ${drug2} <br/><code>${smiles2}</code></p>

            <h3>📊 Predicted DDI Classes</h3>
            <ul class="ddi-class-list">
        `;

        for (const result of data.results) {
          html += `
            <li>
              <strong>Class ${result.class}</strong> — ${result.description}
              <br/><small><em>Confidence Score: ${parseFloat(result.confidence).toFixed(4)}</em></small>
            </li>
          `;
        }

        html += '</ul></div>';
        setDlDDIResult(html);

    } catch (err) {
        setDlDDIResult('Server error. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
    };


  const handleConditionContradiction = () => {
    const drug = (document.getElementById('condition-drug') as HTMLInputElement).value;
    const output = document.getElementById('condition-contradiction-output');
    if (output) output.textContent = drug ? 'Asthma, Ulcers, Liver disease' : 'Please enter a drug name';
  };

  const handleDeepseeks = () => {
    const input = (document.getElementById('deepseeks-input') as HTMLInputElement).value;
    const output = document.getElementById('deepseeks-output');
    if (output) output.textContent = `${input} - This is a generated description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  };


  return (
    <div className="models-playground-wrapper">
    <div className="models-playground">
        {isLoading && (
            <div className="fullscreen-loader">
                <div className="loader-content">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Loading... Please wait.</p>
                </div>
            </div>
            )}
      <button className="nav-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <ul>
          {[
            ['deidentifier', 'Deidentifier', 'fa-shield-alt'],
            ['ddi-binary', 'DDI Binary', 'fa-sync'],
            ['dl-ddi', 'DL DDI', 'fa-brain'],
            ['condition-contradiction', 'Condition Check', 'fa-exclamation-triangle'],
            ['deepseeks', 'Deepseek', 'fa-book']
          ].map(([id, label, icon]) => (
            <li key={id}>
              <button
                className={activeSection === id ? 'active' : ''}
                onClick={() => showSection(id as ModelSection)}
              >
                <i className={`fas ${icon}`} /> {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {/* Deidentifier Section */}
        <div id="deidentifier" className={`model-section ${activeSection === 'deidentifier' ? 'active' : ''}`}>
          <h2><i className="fas fa-shield-alt"></i> Deidentifier Model</h2>
          <p className="description">Deidentify sensitive information from text or file input.</p>
          <div className="form-group">
            <label htmlFor="deidentifier-input">Enter Text or Upload File</label>
            <textarea 
              id="deidentifier-input" 
              placeholder="Type or paste text here (e.g., 'John Doe, DOB: 01/01/1990')..."
            ></textarea>
          </div>
          <div className="form-group">
            <button onClick={handleDeidentifier}>
              <i className="fas fa-shield-alt" /> Deidentify
            </button>
          </div>
          <div className="output" id="deidentifier-output">
            {isLoading ? (
                <div className="loader-text">⏳ Deidentifying... Please wait.</div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: "[Deidentified text will appear here]" }} />
            )}
            </div>
        </div>

        {/* DDI Binary Section */}
        <div id="ddi-binary" className={`model-section ${activeSection === 'ddi-binary' ? 'active' : ''}`}>
          <h2><i className="fas fa-sync"></i> DDI Classifier Binary</h2>
          <p className="description">Predict whether a binary interaction exists between two selected drugs.</p>
          <div className="form-group">
            <label htmlFor="ddi-binary-drug1">Drug Name 1</label>
            <input
              id="ddi-binary-drug1"
              value={drug1}
              onChange={(e) => {
                const val = e.target.value;
                setDrug1(val);
                if (val.trim().length >= 3) fetchSuggestions(val, setSuggestions1);
                else setSuggestions1([]);
                setHighlightIndex1(-1);
              }}
              onKeyDown={(e) => {
                if (suggestions1.length === 0) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightIndex1(prev => (prev + 1) % suggestions1.length);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightIndex1(prev => (prev - 1 + suggestions1.length) % suggestions1.length);
                } else if (e.key === 'Enter' && highlightIndex1 >= 0) {
                  e.preventDefault();
                  const selected = suggestions1[highlightIndex1];
                  setDrug1(selected);
                  fetchSmiles(selected, setSmiles1);
                  setSuggestions1([]);
                  setHighlightIndex1(-1);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setSuggestions1([]);
                  setHighlightIndex1(-1);
                }, 100);
                if (drug1) fetchSmiles(drug1, setSmiles1);
              }}
              placeholder="Type to search drug..."
            />
            {suggestions1.length > 0 && (
              <ul className="suggestion-list">
                {suggestions1.map((name, idx) => (
                  <li
                    key={idx}
                    className={highlightIndex1 === idx ? 'highlighted' : ''}
                    onMouseDown={() => {
                      setDrug1(name);
                      fetchSmiles(name, setSmiles1);
                      setSuggestions1([]);
                      setHighlightIndex1(-1);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="ddi-binary-drug2">Drug Name 2</label>
            <input
              id="ddi-binary-drug2"
              value={drug2}
              onChange={(e) => {
                const val = e.target.value;
                setDrug2(val);
                if (val.trim().length >= 3) fetchSuggestions(val, setSuggestions2);
                else setSuggestions2([]);
                setHighlightIndex2(-1);
              }}
              onKeyDown={(e) => {
                if (suggestions2.length === 0) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightIndex2(prev => (prev + 1) % suggestions2.length);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightIndex2(prev => (prev - 1 + suggestions2.length) % suggestions2.length);
                } else if (e.key === 'Enter' && highlightIndex2 >= 0) {
                  e.preventDefault();
                  const selected = suggestions2[highlightIndex2];
                  setDrug2(selected);
                  fetchSmiles(selected, setSmiles2);
                  setSuggestions2([]);
                  setHighlightIndex2(-1);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setSuggestions2([]);
                  setHighlightIndex2(-1);
                }, 100);
                if (drug2) fetchSmiles(drug2, setSmiles2);
              }}
              placeholder="Type to search drug..."
            />
            {suggestions2.length > 0 && (
              <ul className="suggestion-list">
                {suggestions2.map((name, idx) => (
                  <li
                    key={idx}
                    className={highlightIndex2 === idx ? 'highlighted' : ''}
                    onMouseDown={() => {
                      setDrug2(name);
                      fetchSmiles(name, setSmiles2);
                      setSuggestions2([]);
                      setHighlightIndex2(-1);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <button onClick={handleDDIBinary}>
              <i className="fas fa-sync" /> Predict Interaction
            </button>
          </div>
          <div className="output" id="ddi-binary-output">[Prediction result will appear here]</div>
        </div>


        {/* DL DDI Section */}
        <div id="dl-ddi" className={`model-section ${activeSection === 'dl-ddi' ? 'active' : ''}`}>
          <h2><i className="fas fa-brain"></i> DL-Based DDI Classifier</h2>
          <p className="description">Predict a class and provide a description based on two SMILES inputs.</p>
          <div className="form-group">
          <label htmlFor="dl-ddi-drug1">Drug Name 1</label>
          <input
            id="dl-ddi-drug1"
            value={drug1}
            onChange={(e) => {
              const val = e.target.value;
              setDrug1(val);
              if (val.trim().length >= 3) fetchSuggestions(val, setSuggestions1);
              else setSuggestions1([]);
              setHighlightIndex1(-1);
            }}
            onKeyDown={(e) => {
              if (suggestions1.length === 0) return;

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightIndex1(prev => (prev + 1) % suggestions1.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightIndex1(prev => (prev - 1 + suggestions1.length) % suggestions1.length);
              } else if (e.key === 'Enter' && highlightIndex1 >= 0) {
                e.preventDefault();
                const selected = suggestions1[highlightIndex1];
                setDrug1(selected);
                fetchSmiles(selected, setSmiles1);
                setSuggestions1([]);
                setHighlightIndex1(-1);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setSuggestions1([]);
                setHighlightIndex1(-1);
              }, 100);
            }}
            placeholder="Type to search drug..."
          />

          {suggestions1.length > 0 && (
            <ul className="suggestion-list">
              {suggestions1.map((name, idx) => (
                <li
                  key={idx}
                  className={highlightIndex1 === idx ? 'highlighted' : ''}
                  onMouseDown={() => {
                    setDrug1(name);
                    fetchSmiles(name, setSmiles1);
                    setSuggestions1([]);
                    setHighlightIndex1(-1);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
          </div>
          <div className="form-group">
          <label htmlFor="dl-ddi-drug2">Drug Name 2</label>
          <input
            id="dl-ddi-drug2"
            value={drug2}
            onChange={(e) => {
              const val = e.target.value;
              setDrug2(val);
              if (val.trim().length >= 3) fetchSuggestions(val, setSuggestions2);
              else setSuggestions2([]);
              setHighlightIndex2(-1);
            }}
            onKeyDown={(e) => {
              if (suggestions2.length === 0) return;

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightIndex2(prev => (prev + 1) % suggestions2.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightIndex2(prev => (prev - 1 + suggestions2.length) % suggestions2.length);
              } else if (e.key === 'Enter' && highlightIndex2 >= 0) {
                e.preventDefault();
                const selected = suggestions2[highlightIndex2];
                setDrug2(selected);
                fetchSmiles(selected, setSmiles2);
                setSuggestions2([]);
                setHighlightIndex2(-1);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setSuggestions2([]);
                setHighlightIndex2(-1);
              }, 100);
              if (drug2) fetchSmiles(drug2, setSmiles2);
            }}
            placeholder="Type to search drug..."
          />

          {suggestions2.length > 0 && (
            <ul className="suggestion-list">
              {suggestions2.map((name, idx) => (
                <li
                  key={idx}
                  className={highlightIndex2 === idx ? 'highlighted' : ''}
                  onMouseDown={() => {
                    setDrug2(name);
                    fetchSmiles(name, setSmiles2);
                    setSuggestions2([]);
                    setHighlightIndex2(-1);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}

          </div>
          <div className="form-group">
            <button onClick={handleDLDDI}>
              <i className="fas fa-brain" /> Predict Class
            </button>
          </div>
          <div className="output" id="dl-ddi-output">
            <div dangerouslySetInnerHTML={{ __html: dlDDIResult || '[Class prediction will appear here]' }} />
            </div>
        </div>

        {/* Condition Contradiction Section */}
        <div id="condition-contradiction" className={`model-section ${activeSection === 'condition-contradiction' ? 'active' : ''}`}>
          <h2><i className="fas fa-exclamation-triangle"></i> Patient Condition Contradiction</h2>
          <p className="description">Identify conditions that pose a risk with the given drug.</p>
          <div className="form-group">
            <label htmlFor="condition-drug">Drug Name</label>
            <input type="text" id="condition-drug" placeholder="Enter drug name (e.g., Aspirin)..." />
          </div>
          <div className="form-group">
            <button onClick={handleConditionContradiction}>
              <i className="fas fa-exclamation-triangle" /> Check Conditions
            </button>
          </div>
          <div className="output" id="condition-contradiction-output">[Risky conditions]</div>
        </div>

        {/* Deepseeks Section */}
        <div id="deepseeks" className={`model-section ${activeSection === 'deepseeks' ? 'active' : ''}`}>
          <h2><i className="fas fa-book"></i> Deepseek Finetuned</h2>
          <p className="description">Generate a short description from the input text.</p>
          <div className="form-group">
            <label htmlFor="deepseeks-input">Input Text</label>
            <input type="text" id="deepseeks-input" placeholder="Enter text (e.g., 'What is diabetes?')..." />
          </div>
          <div className="form-group">
            <button onClick={handleDeepseeks}>
              <i className="fas fa-book" /> Get Description
            </button>
          </div>
          <div className="output" id="deepseeks-output">[Generated description]</div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default ModelsPlayground;