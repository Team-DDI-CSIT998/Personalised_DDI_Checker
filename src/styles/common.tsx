import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import UnderConstructionPopup, { TeamPopup, AboutUsPopup } from './popUp';
import { FiLogOut } from 'react-icons/fi';
import './common.css';

interface LayoutProps {
  children: React.ReactNode;
}

// 🔹 Centralized logic for hiding nav
const shouldShowNavLinks = (pathname: string): boolean => {
  const hiddenRoutes = [
    '/Authentication',
    '/MedMatchDoctorPortal',
    '/patient-details',
    '/create-prescription',
    "/chatbot",
    "/ModelsPlayground",
    "/PatientPortal"
  ];
  return !hiddenRoutes.some(route => pathname.startsWith(route));
};

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
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const isLoggedIn = !!user;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const showNavLinks = shouldShowNavLinks(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/Authentication", { state: { isSignUp: false } });
  };

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
          {showNavLinks && (
            <>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Home
              </Link>
              
              <a href="#features" className="nav-link">
                Features
              </a>
              
              <Link
                to="/how-it-works"
                className={`nav-link ${location.pathname === '/how-it-works' ? 'active' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                How It Works
              </Link>
              
              <a href="#footer" className="nav-link">
                Get in Touch
              </a>
              
              <div className={`dropdown ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="nav-link dropdown-toggle">
                  Other Links <i className="fas fa-chevron-down dropdown-arrow"></i>
                </div>
                <div className="dropdown-content">
                  <Link 
                    to="/PatientPortal" 
                    className="dropdown-link"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <i className="fas fa-user-injured" style={{ marginRight: '10px' }}></i>
                    Patient Portal
                  </Link>
                  <Link 
                    to="/MedMatchDoctorPortal" 
                    className="dropdown-link"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <i className="fas fa-user-md" style={{ marginRight: '10px' }}></i>
                    Doctor Portal
                  </Link>
                  <Link 
                    to="/chatbot" 
                    className="dropdown-link"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <i className="fas fa-robot" style={{ marginRight: '10px' }}></i>
                    ChatBot
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <ThemeToggle />

        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="logout-action" onClick={handleLogout}>
              <span>Logout</span>
              <FiLogOut className="logout-icon" />
            </div>
          ) : (
            showNavLinks && (
              <>
                <Link to="/Authentication" state={{ isSignUp: false }} className="signin-btn">Sign In</Link>
                <Link to="/Authentication" state={{ isSignUp: true }} className="signup-btn">Get Started</Link>
              </>
            )
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
          <div className="footer-logo">
            <i className="fas fa-clinic-medical"></i>
            <h2>MedMatch</h2>
          </div>
          <p>
            Innovating healthcare with AI-driven solutions and a commitment to patient safety.
          </p>
          <div className="social-links">{/* Social Icons Here */}</div>
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
