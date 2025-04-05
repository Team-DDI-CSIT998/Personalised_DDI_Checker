import React, { useState, useEffect } from 'react';
import { FaMedkit, FaComments, FaUserMd, FaArrowDown } from 'react-icons/fa';
import './HowItWorks.css';

interface Step {
  id: number;
  icon: JSX.Element;
  title: string;
  summary: string;
  details: string[];
}

const steps: Step[] = [
  {
    id: 1,
    icon: <FaMedkit size={32} />,
    title: "Effortless DDI Checker",
    summary: "Quickly verify drug interactions.",
    details: [
      "Enter at least 3 letters of a medication to see suggestions.",
      "Select the medication from the dropdown list.",
      "Add 2+ medications and click 'Analyze' for a clear interaction report."
    ],
  },
  {
    id: 2,
    icon: <FaComments size={32} />,
    title: "Interactive Chatbot Assistance",
    summary: "Chat for personalized guidance.",
    details: [
      "Log in as a patient or doctor to unlock the chatbot.",
      "Optionally, upload records or describe your condition.",
      "Chat with our AI assistant that checks for drug interactions on demand."
    ],
  },
  {
    id: 3,
    icon: <FaUserMd size={32} />,
    title: "Doctor Portal & Prescription Management",
    summary: "Manage patients and prescriptions seamlessly.",
    details: [
      "Access the portal to add patient and prescription details.",
      "Medications are automatically checked against patient history.",
      "Receive real-time alerts and actionable insights for safe prescribing."
    ],
  },
];

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  // Scroll to top when How It Works page mounts.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeModal = () => setActiveStep(null);

  return (
    <div className="how-it-works">
      <header className="how-header">
        <h1>How It Works</h1>
        <p>
          Discover the streamlined workflows that power MedMatch for safer medication practices.
        </p>
      </header>

      <section className="steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className="step-card"
            onClick={() => setActiveStep(step)}
          >
            <div className="step-icon">{step.icon}</div>
            <h2>{step.title}</h2>
            <p>{step.summary}</p>
            <button className="view-details">View Details</button>
          </div>
        ))}
      </section>

      {activeStep && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">{activeStep.icon}</div>
              <h2>{activeStep.title}</h2>
            </div>
            <div className="modal-details">
              {activeStep.details.map((detail, index) => (
                <div key={index} className="detail-wrapper">
                  <div className="detail-panel">
                    <p>{detail}</p>
                  </div>
                  {index < activeStep.details.length - 1 && (
                    <div className="detail-arrow-wrapper">
                      <FaArrowDown size={20} className="detail-arrow" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;
