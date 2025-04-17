// common.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import UnderConstructionPopup from './underConstruction.tsx';
import './common.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isHowItWorks = location.pathname === '/how-it-works';
  const isAuthPage = location.pathname === '/Authentication';

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
          {!isAuthPage && (
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </Link>
          )}
          {!isAuthPage && (
            <>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#footer" className="nav-link">
                Get in Touch
              </a>
            </>
          )}
          {!isAuthPage && (
            <Link 
              to="/how-it-works" 
              className={`nav-link ${isHowItWorks ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              How It Works
            </Link>
          )}
        </div>
        <ThemeToggle />
        <div className="auth-buttons">
          {!isAuthPage && (
            <Link
              to="/Authentication"
              state={{ isSignUp: false }}
              className="signin-btn"
            >
              Sign In
            </Link>
          )}
          {!isAuthPage && (
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
  const [popupVisible, setPopupVisible] = useState(false);

  // Show popup and prevent default behavior of the link
  const handlePopupOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPopupVisible(true);
  };
  return (
    <footer className="custom-footer" id="footer">
      <UnderConstructionPopup visible={popupVisible} onClose={() => setPopupVisible(false)} />

      <div className="footer-container">
        
        {/* Left Section (2 units) */}
        <div className="footer-left">
          <h2>MedMatch</h2>
          <p>
            Innovating healthcare with AI-driven solutions and a commitment to patient safety.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495V14.708h-3.13v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.919.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557a9.9 9.9 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475 4.924 4.924 0 0 0 2.188 4.1 4.902 4.902 0 0 1-2.228-.616v.062a4.93 4.93 0 0 0 3.95 4.827 4.996 4.996 0 0 1-2.224.085 4.936 4.936 0 0 0 4.604 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.055 0 14.007-7.496 14.007-13.986 0-.213-.005-.425-.014-.637A9.935 9.935 0 0 0 24 4.557z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554V9h3.414v1.561h.049c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.266 2.368 4.266 5.455v6.288zM5.337 7.433c-1.144 0-2.07-.926-2.07-2.07 0-1.144.926-2.07 2.07-2.07 1.144 0 2.07.926 2.07 2.07 0 1.144-.926 2.07-2.07 2.07zM6.771 20.452H3.903V9h2.868v11.452zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.207 24 24 23.229 24 22.271V1.723C24 .771 23.207 0 22.225 0z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.163c3.204,0,3.584,0.012,4.85,0.07c1.366,0.062,2.633,0.337,3.608,1.312c0.975,0.975,1.25,2.242,1.312,3.608 c0.058,1.267,0.069,1.646,0.069,4.85c0,3.204-0.012,3.584-0.069,4.85c-0.062,1.366-0.337,2.633-1.312,3.608 c-0.975,0.975-2.242,1.25-3.608,1.312c-1.267,0.058-1.646,0.069-4.85,0.069c-3.204,0-3.584-0.012-4.85-0.069 c-1.366-0.062-2.633-0.337-3.608-1.312c-0.975-0.975-1.25-2.242-1.312-3.608C2.175,15.747,2.163,15.367,2.163,12 c0-3.204,0.012-3.584,0.069-4.85c0.062-1.366,0.337-2.633,1.312-3.608S5.485,2.225,6.851,2.163 C8.117,2.105,8.497,2.094,11.701,2.094 M12,0C8.741,0,8.332,0.013,7.052,0.072C5.775,0.131,4.552,0.404,3.515,1.441 C2.478,2.478,2.205,3.701,2.146,4.977C2.087,6.257,2.074,6.667,2.074,10.001 c0,3.332,0.013,3.744,0.072,5.023c0.059,1.275,0.333,2.498,1.37,3.535c1.037,1.037,2.26,1.311,3.535,1.37 c1.28,0.059,1.69,0.072,5.023,0.072c3.332,0,3.744-0.013,5.023-0.072c1.275-0.059,2.498-0.333,3.535-1.37 c1.037-1.037,1.311-2.26,1.37-3.535c0.059-1.28,0.072-1.69,0.072-5.023c0-3.332-0.013-3.744-0.072-5.023 c-0.059-1.275-0.333-2.498-1.37-3.535C19.477,0.404,18.254,0.131,16.98,0.072C15.701,0.013,15.291,0,12,0L12,0z M12,5.838 c-3.403,0-6.162,2.759-6.162,6.162S8.597,18.162,12,18.162S18.162,15.403,18.162,12S15.403,5.838,12,5.838z M12,16.2 c-2.293,0-4.2-1.907-4.2-4.2S9.707,7.8,12,7.8S16.2,9.707,16.2,12S14.293,16.2,12,16.2z M18.406,4.594 c0,0.796-0.646,1.442-1.442,1.442s-1.442-0.646-1.442-1.442s0.646-1.442,1.442-1.442S18.406,3.798,18.406,4.594z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Section (3 units) */}
        <div className="footer-right">
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#" onClick={handlePopupOpen}>About Us</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Careers</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Press</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Products</h3>
            <ul>
              <li><a href="#" onClick={handlePopupOpen}>DDI Checker</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Clinical Support</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Patient Safety</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Data Insights</a></li>
            </ul>*
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#" onClick={handlePopupOpen}>Help Center</a></li>
              <li><a href="#" onClick={handlePopupOpen}>FAQ</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Terms of Service</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 MedMatch Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Layout;