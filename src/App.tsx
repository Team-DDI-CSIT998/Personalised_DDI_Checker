import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Layout } from './styles/common';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import MedHistory from "./components/medHistory";
import PatientPortal from "./components/PatientPortal";
import HowItWorks from './components/HowItWorks';
import MedMatchDoctorPortal from "./components/MedMatchDoctorPortal";
import ProfileSetup from "./components/ProfileSetup";
import NotFound from "./components/NotFound";
import Chatbot from "./components/Chatbot";
import './App.css';
import PatientDetails from "./components/PatientDetails";
import PatientLabResults from "./components/PatientLabResult";
import CreatePrescription from "./components/CreatePrescription";
import UnderConstruction from "./components/UnderConstruction";
import ModelsPlayground from "./components/ModelsPlayground";

function App() {
  return ( 
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Authentication" element={<Layout><Authentication /></Layout>} />

        <Route path="/medical-history" element={<Layout><MedHistory /></Layout>} />
        <Route path="/PatientPortal" element={<ProtectedRoute><Layout><PatientPortal /></Layout></ProtectedRoute>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/patientLabResults/:patientId" element={<Layout><PatientLabResults /></Layout>} />
        <Route path="/patient-details/:patientId" element={<ProtectedRoute><Layout><PatientDetails /></Layout></ProtectedRoute>} />
        <Route path="/create-prescription" element={<ProtectedRoute><Layout><CreatePrescription /></Layout></ProtectedRoute>} />
        <Route path="/MedMatchDoctorPortal" element={<ProtectedRoute><Layout><MedMatchDoctorPortal/></Layout></ProtectedRoute>} />
        <Route path="/ProfileSetup" element={<ProtectedRoute><Layout><ProfileSetup /></Layout></ProtectedRoute>} />
        <Route path="/Chatbot" element={<ProtectedRoute><Layout><Chatbot /></Layout></ProtectedRoute>} />
        <Route path="/UnderConstruction" element={<Layout><UnderConstruction /></Layout>} />
        <Route path="/ModelsPlayground" element={<Layout><ModelsPlayground /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
        
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
