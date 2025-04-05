import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: "var(--accent)",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "12px 15px",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.3s",
      }}
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
