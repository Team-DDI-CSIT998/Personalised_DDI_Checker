import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { Layout } from './styles/common';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from './components/HomePage';
import Authentication from './components/Authentication';
import DoctorDashboard from "./components/DoctorDashboard";
import DoctorPatientPrescription from "./components/DoctorPatientPrescription";
import MedHistory from "./components/medHistory";
import PatientPortal from "./components/PatientPortal";
import HowItWorks from './components/HowItWorks';
import MedMatchDoctorPortal from "./components/MedMatchDoctorPortal";
import ProfileSetup from "./components/ProfileSetup";
import NotFound from "./components/NotFound";
import MedMatchDoctorPrescription from "./components/MedMatchDoctorPrescription";
import './App.css';
import MedMatchDoctorPortal from "./components/MedMatchDoctorPortal";
import PatientDetails from "./components/PatientDetails";
import CreatePrescription from "./components/CreatePrescription";
import ChatPagePatient from "./components/chatPagePatient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Authentication" element={<Layout><Authentication /></Layout>} />

        //keep one of the below two routes
        <Route path="/DoctorDashboard" element={<Layout><DoctorDashboard /></Layout>} />
        <Route path="/MedMatchDoctorPortal" element={<Layout><MedMatchDoctorPortal /></Layout>} />

        <Route path="/DoctorPatientPrescription" element={<Layout><DoctorPatientPrescription /></Layout>} />
        <Route path="/PatientPortal" element={<Layout><PatientPortal /></Layout>} />
        <Route path="/medical-history" element={<Layout><MedHistory /></Layout>} />
        <Route path="/MedMatchDoctorPrescription" element={<ProtectedRoute><Layout><MedMatchDoctorPrescription /></Layout></ProtectedRoute>} />
        <Route path="/PatientPortal" element={<ProtectedRoute><Layout><PatientPortal /></Layout></ProtectedRoute>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/MedMatchDoctorPortal" element={<ProtectedRoute><Layout><MedMatchDoctorPortal/></Layout></ProtectedRoute>} />
        <Route path="/ProfileSetup" element={<ProtectedRoute><Layout><ProfileSetup /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
        <Route path="/patient-details/:patientId" element={<Layout><PatientDetails /></Layout>} />
        <Route path="/create-prescription" element={<Layout><CreatePrescription /></Layout>} />
        <Route path="/chat-patient" element={<ChatPagePatient />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
