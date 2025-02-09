import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import DoctorDashboard from "./components/DoctorDashboard";
import "./App.css";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Authentication" element={<Authentication />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
