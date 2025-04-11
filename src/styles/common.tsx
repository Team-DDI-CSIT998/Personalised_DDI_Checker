// components/Common.tsx - Modern Redesign
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaCheckCircle, FaLock, FaDatabase } from 'react-icons/fa';
import './common.css';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <div className="app-container">
      <Header />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Determine if we're on the How It Works page
  const isHowItWorks = location.pathname === '/how-it-works';
  // Determine if we're on the Authentication page
  const isAuthPage = location.pathname === '/Authentication';
  const isDoctorPortal = location.pathname === '/MedMatchDoctorPortal';
  const isPrescription = location.pathname === '/MedMatchDoctorPrescription';

  return (
    <header className="header">
      <Link
        to="/"
        className="logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-clinic-medical"></i>
        <span>MedMatch</span>
      </Link>

      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav className={`nav-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="nav-links">
        {!isAuthPage && !isDoctorPortal && !isPrescription &&(
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Home
          </Link>
          )}
          {/* Only show these links if NOT on the Authentication page */}
          {!isAuthPage && !isDoctorPortal && !isDoctorPortal && !isPrescription &&(
            <>
            {!isHowItWorks && (
              <a href="#features" className="nav-link">
                Features
              </a>
            )}
              <a href="#footer" className="nav-link">
                Get in Touch
              </a>
            </>
          )}
          {!isAuthPage && !isDoctorPortal && !isPrescription &&(
          <Link 
            to="/how-it-works" 
            className={`nav-link ${isHowItWorks ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            How It Works
          </Link>
          )}
        </div>

        {/* Only show auth buttons if not on the Authentication page */}
          <ThemeToggle />
          <div className="auth-buttons">
            
            {!isAuthPage && !isDoctorPortal && !isPrescription &&(
            <Link
              to="/Authentication"
              state={{ isSignUp: false }}
              className="signin-btn"
            >
              Sign In
            </Link>
             )}
             {!isAuthPage && !isDoctorPortal && !isPrescription &&(
            <Link
              to="/Authentication"
              state={{ isSignUp: true }}
              className="signup-btn"
            >
              Get Started
            </Link>
             )}
            
          </div>
       
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>MedMatch</h4>
          <p>Pioneering safer medication practices through AI-powered solutions.</p>
          <div className="footer-trust-badges">
            <p><FaCheckCircle /> HIPAA Compliant</p>
            <p><FaLock /> 100% Privacy</p>
            <p><FaDatabase /> Powered by DrugBank</p>
          </div>
        </div>
        <div className="footer-section">
          <h4>Solutions</h4>
          <a href="#">DDI Checker</a>
          <a href="#">Patient Safety</a>
          <a href="#">Clinical Decision Support</a>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 MedMatch Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Layout;
