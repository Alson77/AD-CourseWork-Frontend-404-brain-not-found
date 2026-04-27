import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerRegister from './pages/CustomerRegister';
import AppointmentBooking from './pages/AppointmentBooking';
import PartRequest from './pages/PartRequest';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/appointment" element={<AppointmentBooking />} />
          <Route path="/part-request" element={<PartRequest />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
