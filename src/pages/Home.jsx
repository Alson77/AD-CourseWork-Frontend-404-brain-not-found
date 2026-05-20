import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users2, Calendar, FileText,
  BarChart2, UsersRound, Package, Search,
} from 'lucide-react';

const dashCards = [
  { title: 'Staff Dashboard', icon: LayoutDashboard, to: '/staff-dashboard' },
  { title: 'Catalog', icon: Search, to: '/catalog' },
  { title: 'Appointments', icon: Calendar, to: '/appointment' },
  { title: 'Sales History', icon: FileText, to: '/sales-history' },
  { title: 'Admin Dashboard', icon: Users2, to: '/admin-dashboard' },
  { title: 'Parts Inventory', icon: Package, to: '/catalog' },
  { title: 'Manage Customers', icon: UsersRound, to: '/customers' },
  { title: 'Reports', icon: BarChart2, to: '/reports' },
];

function Home() {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="main-content">
      <p className="page-breadcrumb">Welcome</p>

      <div className="home-header">
        <div>
          <h1 className="home-title">Welcome back, admin! 👋</h1>
          <p className="home-subtitle">Here's what's happening with your account today.</p>
        </div>
        <Link to="/catalog" className="btn-primary">
          <Search size={15} /> Buy Part
        </Link>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="dash-grid">
        {dashCards.map((card) => (
          <Link to={card.to} key={card.title} className="dash-card">
            <div className="dash-card-icon">
              <card.icon size={26} />
            </div>
            <p className="dash-card-title">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="home-bottom-grid">
        {/* Quick Overview */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-icon">ℹ</span>
            <strong>Quick Overview</strong>
          </div>
          <div className="overview-rows">
            <div className="overview-row">
              <span className="ov-label">YOUR ROLE</span>
              <span className="badge-blue">ADMINISTRATOR</span>
            </div>
            <div className="overview-row">
              <span className="ov-label">TODAY'S DATE</span>
              <strong className="ov-value">{today}</strong>
            </div>
            <div className="overview-row">
              <span className="ov-label">SYSTEM STATUS</span>
              <span className="badge-green">Active</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="info-card">
          <div className="info-card-header">
            <strong>Quick Links</strong>
          </div>
          <ul className="quick-links">
            <li><Link to="/register">Register Customer</Link></li>
            <li><Link to="/customers">Manage Customers</Link></li>
            <li><Link to="/appointment">New Appointment</Link></li>
            <li><Link to="/part-request">Request a Part</Link></li>
            <li><Link to="/catalog">Browse Catalog</Link></li>
          </ul>
        </div>
      </div>

      <p className="footer-copy">© 2026 GarageHub. All rights reserved.</p>
    </div>
  );
}

export default Home;
