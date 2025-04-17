// UnderConstructionPopup.tsx
import React from 'react';
import './underConstruction.css';

interface UnderConstructionPopupProps {
  visible: boolean;
  onClose: () => void;
}

const UnderConstructionPopup: React.FC<UnderConstructionPopupProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="uc-overlay" onClick={onClose}>
      <div className="uc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="uc-close-btn" onClick={onClose} aria-label="Close Popup">&times;</button>
        <div className="uc-content">
          <h2>Under Construction</h2>
          <p>
            This section is currently being updated. Please check back soon!
          </p>
          <div className="uc-icon">
            {/* Updated Hammer Icon for Under Construction */}
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
