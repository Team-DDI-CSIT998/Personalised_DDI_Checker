import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { toast } from "react-toastify";
import "./Authentication.css";

type UserType = "patient" | "doctor" | "";
type LocationState = {
  isSignUp: boolean;
};

const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode =
    (location.state as LocationState)?.isSignUp !== undefined
      ? (location.state as LocationState).isSignUp
      : false;

  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode);
  const [userType, setUserType] = useState<UserType>("");
  const [formData, setFormData] = useState({
    username: "",
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
    setFormData({ username: "", email: "", password: "" });
    setPasswordStrength(0);
  };

  const toggleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSignUp(false);
    setFormData({ username: "", email: "", password: "" });
    setPasswordStrength(0);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await registerUser(
        formData.username,
        formData.email,
        formData.password
      );
      console.log("Signup successful:", data);
      toast.success("Signup successful!");
      navigate("/PatientPortal");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    if (isSignUp) {
      await handleSignUp();
    } else {
      try {
        const data = await loginUser(formData.email, formData.password);
        console.log("Login successful:", data);
        navigate("/PatientPortal");
        toast.success("Login successful!");
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred.");
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="authentication">
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

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  placeholder=" "
                  required
                  value={formData.username}
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
              <p>
                Already have an account?{" "}
                <span className="toggle-link" onClick={toggleSignIn}>
                  Sign In
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span className="toggle-link" onClick={toggleSignUp}>
                  Sign Up
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
