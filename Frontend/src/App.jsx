import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SupportAgent from "./components/SupportAgent";
import SupportTicket from "./components/SupportTicket";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <div className="grid-layout">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agents" element={<SupportAgent />} />
            <Route path="/tickets" element={<SupportTicket />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
