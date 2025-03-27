import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorPatientPrescription from "./components/DoctorPatientPrescription";
import PatientPortal from "./components/PatientPortal";
import DdiChecker from "./components/DdiChecker";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Authentication" element={<Authentication />} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
        <Route path="/DoctorPatientPrescription" element={<DoctorPatientPrescription />} />
        <Route path="/PatientPortal" element={<PatientPortal />} />
        <Route path="/DdiChecker" element={<DdiChecker />} />
      </Routes>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </Router>
  );
}

export default App;
