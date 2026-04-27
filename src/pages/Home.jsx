import { Link } from 'react-router-dom';
import { Car, Calendar, Package, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Vehicle Parts Management System</h1>
        <p className="hero-subtitle">
          Manage customer registrations, service appointments, and part requests — all in one place.
        </p>
      </div>

      <div className="cards-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <Car size={36} />
          </div>
          <h2>Customer Registration</h2>
          <p>Register as a customer and save your vehicle details for faster service.</p>
          <Link to="/register" className="card-btn">
            Register Now <ArrowRight size={16} />
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Calendar size={36} />
          </div>
          <h2>Book Appointment</h2>
          <p>Schedule a service appointment at your preferred date and time.</p>
          <Link to="/appointment" className="card-btn">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Package size={36} />
          </div>
          <h2>Request a Part</h2>
          <p>Can't find a part? Submit a request and we'll source it for you.</p>
          <Link to="/part-request" className="card-btn">
            Request Part <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
