import React from 'react';
import './MainLandingPage.css';

const MainLandingPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <h1>MedMatch</h1>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
            {/* Common login button */}
            <a href="login.html" className="cta-button">Sign In</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Revolutionize Your Prescriptions</h1>
          <p>AI-powered drug interaction analysis for safer patient care.</p>
          {/* Interaction Checker Section */}
          <div className="interaction-checker">
            <h2>Check Interactions</h2>
            <div className="drug-inputs">
              <div className="drug-input-wrapper">
                <input type="text" placeholder="Enter Drug 1" />
              </div>
              <div className="drug-input-wrapper">
                <input type="text" placeholder="Enter Drug 2" />
              </div>
            </div>
            <div className="analyze-button-container">
              <button className="cta-button analyze-btn">Analyze Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Instant DDI Check</h3>
            <p>Real-time interaction analysis with AI-powered predictions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Medical History Analysis</h3>
            <p>Upload patient data and let our NLP extract relevant insights.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Chat Assistant</h3>
            <p>Receive explanations and alternatives through our conversational AI.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Interaction History</h3>
            <p>Review past interactions and track patient safety trends.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-step-icon">🔑</div>
            <h3>Sign In</h3>
            <p>Access your secure dashboard by signing in.</p>
          </div>
          <div className="how-step">
            <div className="how-step-icon">📝</div>
            <h3>Enter Prescription</h3>
            <p>Use our intuitive form to input the medications.</p>
          </div>
          <div className="how-step">
            <div className="how-step-icon">⚠️</div>
            <h3>Receive Alerts</h3>
            <p>Get real-time DDI warnings and alternative recommendations.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>
              "MedMatch has revolutionized the way I manage prescriptions. The DDI alerts are instant and incredibly reliable."
            </p>
            <cite>– Dr. Emily Carter</cite>
          </div>
          <div className="testimonial">
            <p>
              "The platform's ease of use and real-time insights help ensure patient safety with every prescription."
            </p>
            <cite>– Dr. Michael Lee</cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact">
        <p>© 2023 MedMatch. All rights reserved.</p>
        <p>
          Contact us: <a href="mailto:support@medmatch.com" className="footer-link">support@medmatch.com</a>
        </p>
      </footer>
    </>
  );
};

export default MainLandingPage;
