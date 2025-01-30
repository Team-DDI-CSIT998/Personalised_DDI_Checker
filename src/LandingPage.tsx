import React from "react";

import "./LandingPage.css";
import DDIChecker from "./components/DDIChecker";
import LoginForm from "./components/LoginForm";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <h1 className="header">Personalized DDI Checker</h1>
      <div className="content">
        <DDIChecker />
        <LoginForm />
      </div>
    </div>
  );
};

export default LandingPage;
