import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, registerUser, loginUser, checkEmail } from "../api/authApi";
import { toast } from "react-toastify";
import CustomModal from "./CustomModal"; 
import "./Authentication.css";

type UserType = "patient" | "doctor" | "";
type LocationState = {
  isSignUp: boolean;
};



const MIN_PASSWORD_STRENGTH = 80;

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
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmCallback, setModalConfirmCallback] = useState<(() => void) | null>(null);
  const [modalCancelCallback, setModalCancelCallback] = useState<(() => void) | null>(null);

  const [isExistingEmail, setIsExistingEmail] = useState<boolean>(false);

  const openModal = (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalConfirmCallback(() => onConfirm || null);
    setModalCancelCallback(() => onCancel || null);
    setModalOpen(true);
  };

  // A helper to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalMessage("");
    setModalConfirmCallback(null);
    setModalCancelCallback(null);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setErrorMessage("");
  };

  // Basic password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;
    return Math.min(strength, 100);
  };

  // Handle input changes
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
    setFormData({ email: "", password: "", confirmPassword: "" });
    setPasswordStrength(0);
  };

  const toggleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsSignUp(false);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setPasswordStrength(0);
  };

  // Inside your handleSignUp function:
const handleSignUp = async (confirmRoleAddition = false) => {
  
  // Check email existence using our helper function
  const emailResult = await checkEmail(formData.email);
  setIsExistingEmail(emailResult.exists);
  console.log("Email exists:", emailResult.exists);
  
  // If the email is new, enforce password validations
  if (!emailResult.exists) {

    if (!userType) {
      openModal(
        "Role Required",
        "Please select either 'Patient' or 'Healthcare Pro' before proceeding."
      );
      setIsLoading(false);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      openModal("Password Mismatch", "Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (passwordStrength < MIN_PASSWORD_STRENGTH) {
      openModal("Weak Password", "Please use a stronger password.");
      setIsLoading(false);
      return;
    }
  }
  
  // Proceed with registration as before...
  setIsLoading(true);
  setErrorMessage("");
  try {
    const data = await registerUser(
      formData.email,
      formData.password,
      userType,
      confirmRoleAddition
    );
    localStorage.setItem("token", data.token);
    toast.success("Signup successful!");
    navigate("/ProfileSetup", {
      state: { role: userType }   // pass the chosen role
    });
  } catch (err: any) {
    if (err instanceof ApiError && err.status === 409 && err.body.addNewRole) {
      // server told us to ask for role addition
      openModal(
        "Account Exists",
        err.body.message,
        async () => {
          closeModal();
          // confirm role addition
          try {
            const data2 = await registerUser(
              formData.email,
              formData.password,
              userType,
              true
            );
            toast.success("Role added successfully!");
            navigate(userType === "patient" ? "/PatientPortal" : "/DoctorPortal");
          } catch (err2: any) {
            const msg =
              err2 instanceof ApiError
                ? err2.body.error || err2.message
                : err2.message;
            toast.error(msg);
          }
        },
        () => {
          closeModal();
          toast.info("Role linking cancelled.");
        }
      );
    } else {
      // any other error: display its message
      const msg = err instanceof ApiError ? err.body.error || err.message : err.message;
      toast.error(msg || "An unknown error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};
  
  
  // --- Login process
  const handleLogin = async () => {
    try {
      const data = await loginUser(formData.email, formData.password, userType);
      console.log("Login successful:", data);
  
      // Check if this account has the selected role.
      if (!data.user.roles.includes(userType)) {
        openModal(
          "Add New Role?",
          `Your account does not currently have the ${userType} role. Would you like to add it?`,
          async () => {
            closeModal();
            try {
              const updatedData = await registerUser(
                formData.email,
                formData.password,
                userType,
                true
              );
              console.log("Role linked successfully:", updatedData);
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user)); 

              toast.success("Role linked successfully!");
              navigate("/ProfileSetup", {
                state: { role: userType } 
              });
            } catch (error: any) {
              toast.error(error.response?.data?.error || error.message || "An error occurred linking the role.");
            }
          },
          () => {
            closeModal();
            toast.info("Role linking cancelled.");
          }
        );
      } else {
        // Already has this role.
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(userType === "patient" ? "/PatientPortal" : "/MedMatchDoctorPortal");
        toast.success("Login successful!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || "An unknown error occurred.");
    }
  };
  

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (isSignUp) {
      await handleSignUp();
    } else {
      if (!userType) {
        openModal("Role Required", "Please select either 'Patient' or 'Healthcare Pro' before logging in.");
        setIsLoading(false);
        return;
      }
      await handleLogin();
    }
    setIsLoading(false);
  };

  return (
    <div className="authentication">
      <button
        className="back-button"
        onClick={() => navigate("/")}
        aria-label="Back to Home"
      >
        &#8592;
      </button>
      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="form-header">
            <h1>Med Match</h1>
            <p>Your Gateway to Safe Medication Management</p>
          </div>

          {/* User Role Selection */}
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
            {isSignUp && (
              <div className="input-group">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder=" "
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <label className="floating-label">Confirm Password</label>
              </div>
            )}
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

      <CustomModal
        isOpen={modalOpen}
        title={modalTitle}
        message={modalMessage}
        confirmText="OK"
        cancelText="Cancel"
        onConfirm={() => {
          if (modalConfirmCallback) {
            modalConfirmCallback();
          }
          closeModal();
        }}
        onCancel={() => {
          if (modalCancelCallback) {
            modalCancelCallback();
          }
          closeModal();
        }}
      />
    </div>
  );
};

export default Authentication;
