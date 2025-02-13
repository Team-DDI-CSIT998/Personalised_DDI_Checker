import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    </Router>
  );
}

export default App;
