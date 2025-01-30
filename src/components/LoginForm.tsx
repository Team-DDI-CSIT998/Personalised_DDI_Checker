import React from "react";
import { TextField, PrimaryButton } from "@fluentui/react";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  return (
    <div className="login-form">
      <h2>Login</h2>
      <TextField type="email" placeholder="Email / Phone" />
      <TextField type="password" placeholder="Password" />
      <p className="forgot-password">Forgot Password?</p>
      <PrimaryButton className="login-button">Login</PrimaryButton>
      <p>
        Don't have an account? <span className="signup-link">Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;
