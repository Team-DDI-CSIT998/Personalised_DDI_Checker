import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Layout } from './styles/common';
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import DoctorPatientPrescription from "./components/DoctorPatientPrescription";
import PatientPortal from "./components/PatientPortal";
import HowItWorks from './components/HowItWorks';
import MedMatchDoctorPortal from "./components/MedMatchDoctorPortal";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Authentication" element={<Layout><Authentication /></Layout>} />
        <Route path="/DoctorPatientPrescription" element={<Layout><DoctorPatientPrescription /></Layout>} />
        <Route path="/PatientPortal" element={<Layout><PatientPortal /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/MedMatchDoctorPortal" element={<Layout><MedMatchDoctorPortal/></Layout>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;