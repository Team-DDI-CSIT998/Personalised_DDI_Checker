
// common.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import UnderConstructionPopup, { TeamPopup, AboutUsPopup } from './popUp';
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
  const [aboutVisible, setAboutVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);

  const handlePopupOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPopupVisible(true);
  };

  const handleAboutOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAboutVisible(true);
  };

  const handleTeamOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setTeamVisible(true);
  };

  return (
    <footer className="custom-footer" id="footer">
      <UnderConstructionPopup visible={popupVisible} onClose={() => setPopupVisible(false)} />
      <TeamPopup visible={teamVisible} onClose={() => setTeamVisible(false)} />
      <AboutUsPopup visible={aboutVisible} onClose={() => setAboutVisible(false)} />

      <div className="footer-container">
        <div className="footer-left">
          <h2>MedMatch</h2>
          <p>
            Innovating healthcare with AI-driven solutions and a commitment to patient safety.
          </p>
          <div className="social-links">
            {/* ... (unchanged social icons) */}
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#" onClick={handleAboutOpen}>About Us</a></li>
              <li><a href="#" onClick={handleTeamOpen}>Team</a></li>
              <li><a href="#" onClick={handlePopupOpen}>Future Plan</a></li>
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
            </ul>
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
