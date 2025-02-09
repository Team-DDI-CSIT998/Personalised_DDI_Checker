import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Authentication.css";

type UserType = "patient" | "doctor" | "";
type LocationState = {
  isSignUp: boolean;
};

const Authentication: React.FC = () => {
  const location = useLocation();
  const initialMode =
    (location.state as LocationState)?.isSignUp !== undefined
      ? (location.state as LocationState).isSignUp
      : false;
  console.log("Initial Mode:", initialMode);

  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode);
  const [userType, setUserType] = useState<UserType>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;
    return Math.min(strength, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const toggleSignUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSignUp(true);
    setFormData({ name: "", email: "", password: "" });
    setPasswordStrength(0);
  };

  const toggleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSignUp(false);
    setFormData({ name: "", email: "", password: "" });
    setPasswordStrength(0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isSignUp) {
        alert(
          `Creating account for ${formData.name} (${formData.email}) as ${userType}.`
        );
      } else {
        alert(`Signing in with ${formData.email} as ${userType}.`);
      }
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="form-header">
          <h1>Med Match</h1>
          <p>Your Gateway to Safe Medication Management</p>
        </div>

        <div className="user-type-selector">
          <div
            className={`user-type-card ${
              userType === "patient" ? "selected" : ""
            }`}
            onClick={() => handleUserTypeSelect("patient")}
          >
            <h3>Patient</h3>
            <p>Access personalized insights</p>
          </div>
          <div
            className={`user-type-card ${
              userType === "doctor" ? "selected" : ""
            }`}
            onClick={() => handleUserTypeSelect("doctor")}
          >
            <h3>Healthcare Pro</h3>
            <p>Advanced tools & analytics</p>
          </div>
        </div>

        <form className="auth-form" id="loginForm" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="input-group">
              <input
                type="text"
                id="name"
                placeholder=" "
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <label className="floating-label">Full Name</label>
            </div>
          )}
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <label className="floating-label">
              {isSignUp ? "Professional Email" : "Email Address"}
            </label>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              required
              value={formData.password}
              onChange={handleInputChange}
            />
            <label className="floating-label">
              {isSignUp ? "Create Password" : "Password"}
            </label>
            <div className="password-strength">
              <div
                className="strength-bar"
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
          </div>

          {errorMessage && (
            <div className="error-message" id="errorMessage">
              {errorMessage}
            </div>
          )}

          <button type="submit">
            <span className="button-text">
              {isSignUp ? "Create Secure Account" : "Secure Sign In"}
            </span>
            <div
              className="loading-spinner"
              style={{ display: isLoading ? "block" : "none" }}
            ></div>
          </button>
        </form>

        <div className="toggle-form">
          {isSignUp ? (
            <>
              Already registered?{" "}
              <a href="#" onClick={toggleSignIn}>
                Access Secure Portal
              </a>
            </>
          ) : (
            <>
              New to MedMatch?{" "}
              <a href="#" onClick={toggleSignUp}>
                Create Secure Account
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
