import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLandingPage from './components/MainLandingPage';
import "./App.css";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLandingPage />} />
        
      </Routes>
    </Router>
  );
}

export default App
