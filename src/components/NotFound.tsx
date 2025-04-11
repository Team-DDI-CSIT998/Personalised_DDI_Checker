import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="notfound-link">Go back to Homepage</Link>
    </div>
  );
};

export default NotFound;
