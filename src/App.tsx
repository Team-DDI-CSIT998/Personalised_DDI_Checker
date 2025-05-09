import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Layout } from './styles/common';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import PatientPortal from "./components/PatientPortal";
import HowItWorks from './components/HowItWorks';
import MedMatchDoctorPortal from "./components/MedMatchDoctorPortal";
import ProfileSetup from "./components/ProfileSetup";
import NotFound from "./components/NotFound";
import MedMatchDoctorPrescription from "./components/MedMatchDoctorPrescription";
import Chatbot from "./components/Chatbot";
import './App.css';

function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Authentication" element={<Layout><Authentication /></Layout>} />
        <Route path="/MedMatchDoctorPrescription" element={<ProtectedRoute><Layout><MedMatchDoctorPrescription /></Layout></ProtectedRoute>} />
        <Route path="/PatientPortal" element={<ProtectedRoute><Layout><PatientPortal /></Layout></ProtectedRoute>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/MedMatchDoctorPortal" element={<ProtectedRoute><Layout><MedMatchDoctorPortal/></Layout></ProtectedRoute>} />
        <Route path="/ProfileSetup" element={<ProtectedRoute><Layout><ProfileSetup /></Layout></ProtectedRoute>} />
        <Route path="/Chatbot" element={<ProtectedRoute><Layout><Chatbot /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;