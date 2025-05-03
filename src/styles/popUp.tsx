import React from 'react';
import './popup.css';

interface UnderConstructionPopupProps {
  visible: boolean;
  onClose: () => void;
}

const UnderConstructionPopup: React.FC<UnderConstructionPopupProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close Popup">&times;</button>
        <div className="popup-content">
          <h2>Under Construction</h2>
          <p>
            This section is currently being updated. Please check back soon!
          </p>
          <div className="popup-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              <rect x="28" y="10" width="8" height="40" fill="var(--primary-dark)" />
              <polygon points="32,10 10,32 18,40 40,18" fill="var(--text-light)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPopup;

// ------------------------------------------------------------
// Additional Popups Below (TeamPopup and AboutUsPopup)
// ------------------------------------------------------------

export const TeamPopup: React.FC<UnderConstructionPopupProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close Popup">&times;</button>
        <h2>Meet the team</h2>

        <div className="popup-members">
          {/* Supervisor on top, single row */}
          <div className="popup-supervisor-wrapper">
            <div className="popup-member supervisor">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Chau Nguyen" />
              <h3>Chau Nguyen</h3>
              <span className="popup-badge supervisor-badge">Supervisor</span>
              <p className="popup-role">Add sups credentials</p>
            </div>
          </div>

          {/* Grid layout for rest */}
          <div className="popup-grid">
            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Siddhanth Thakuri" />
              <h3>Siddhanth Thakuri</h3>
              <div>
                <span className="popup-badge leader-badge">Team Leader</span>
                <span className="popup-badge backend-badge">Backend Dev</span>
              </div>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>

            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Al Amin" />
              <h3>Al Amin</h3>
              <span className="popup-badge research-badge">Research Analyst</span>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>

            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Forhan Chowdhury" />
              <h3>Forhan Chowdhury</h3>
              <span className="popup-badge frontend-badge">Front-end Dev</span>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>

            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Md. Fahad Hoque" />
              <h3>Md. Fahad Hoque</h3>
              <span className="popup-badge frontend-badge">Front-end Dev</span>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>

            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Nabila Arya" />
              <h3>Nabila Arya</h3>
              <span className="popup-badge writer-badge">Report Writer</span>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>

            <div className="popup-member">
              <img src="https://img.icons8.com/ios-filled/100/FFFFFF/user-male-circle.png" alt="Kushal Neupane" />
              <h3>Kushal Neupane</h3>
              <span className="popup-badge writer-badge">Report Assistant</span>
              <p className="popup-role">Master of Computer Science<br />University of Wollongong.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export const AboutUsPopup: React.FC<UnderConstructionPopupProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close Popup">&times;</button>
        <h2>About Us</h2>

        <div className="popup-section">
          <h3>🚀 Meet the Team</h3>
          <p>
            Behind every great project is a group of passionate people — and we’re no different.
            We’re six Master’s students from the University of Wollongong who joined forces not just
            to complete a capstone, but to solve a real problem that affects millions. With caffeine
            in our veins and code in our hearts, we’re building something that could genuinely make
            healthcare safer — and we’re loving every second of the challenge.
          </p>
        </div>

        <div className="popup-section">
          <h3>💡 What We're Building</h3>
          <p>
            Prescription errors are still a major issue in modern healthcare, often leading to serious
            side effects, longer hospital stays, or even fatalities. Our AI-powered system is designed
            to change that. It analyzes patient medical history and medication data to instantly detect
            harmful drug interactions and contraindications. What sets it apart? It's personalized,
            real-time, and built to integrate seamlessly into clinical workflows — helping healthcare
            professionals make faster, safer decisions when it matters most.
          </p>
        </div>

        <div className="popup-section">
          <h3>🛠️ Powered By</h3>
          <div className="popup-tech-list">
            <p>React</p>
            <p>Django / Node.js</p>
            <p>TensorFlow</p>
            <p>Scikit-learn</p>
            <p>DrugBank</p>
            <p>MongoDB / PostgreSQL</p>
          </div>
        </div>
      </div>
    </div>
  );
};
