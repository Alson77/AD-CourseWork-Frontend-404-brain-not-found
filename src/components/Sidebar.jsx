import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, LayoutDashboard, Users2, UsersRound, Search,
  UserPlus, FileText, CreditCard, BarChart2, Calendar,
  Package, Wrench, MoreVertical, LogOut, ClipboardList, Receipt,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Admin sees everything; Customer sees only these routes
const adminSections = [
  {
    title: 'Main',
    items: [
      { label: 'Home',                icon: Home,            to: '/' },
      { label: 'Manage Appointments', icon: LayoutDashboard, to: '/staff-dashboard' },
      { label: 'Analytics & Reports', icon: Users2,          to: '/admin-dashboard' },
      { label: 'Staff Management',    icon: UserPlus,        to: '/staff' },
    ],
  },
  {
    title: 'Customer Management',
    items: [
      { label: 'Manage Customers',  icon: UsersRound, to: '/customers' },
      { label: 'Customer Reports',  icon: BarChart2,  to: '/staff-reports' },
      { label: 'Search & Sale',     icon: Search,     to: '/catalog' },
    ],
  },
  {
    title: 'Sales & Finance',
    items: [
      { label: 'Sales History',     icon: FileText,   to: '/sales-history' },
      { label: 'Credit Management', icon: CreditCard, to: '/credit' },
      { label: 'Financial Reports', icon: BarChart2,  to: '/reports' },
      { label: 'Generate Invoice',  icon: Receipt,    to: '/invoice' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Appointments',          icon: Calendar,      to: '/appointment' },
      { label: 'Part Requests',         icon: Package,       to: '/admin-part-requests' },
      { label: 'Inventory Management',  icon: ClipboardList, to: '/inventory' },
      { label: 'Vendors',               icon: UsersRound,    to: '/vendors' },
      { label: 'Purchases',             icon: FileText,      to: '/purchases' },
    ],
  },
];

const customerSections = [
  {
    title: 'Menu',
    items: [
      { label: 'Dashboard',       icon: LayoutDashboard, to: '/customer-dashboard' },
      { label: 'Browse Parts',    icon: Search,    to: '/catalog' },
      { label: 'Shopping Cart',   icon: Package,   to: '/cart' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Book Appointment', icon: Calendar, to: '/appointment' },
      { label: 'Request a Part',   icon: Package,  to: '/part-request' },
      { label: 'My Vehicles',      icon: Wrench,   to: '/my-vehicles' },
    ],
  },
  {
    title: 'History & Profile',
    items: [
      { label: 'Purchase History', icon: FileText,    to: '/purchase-history' },
      { label: 'Service History',  icon: FileText,    to: '/service-history' },
      { label: 'Credit Management', icon: CreditCard,  to: '/credit-status' },
      { label: 'Reviews',          icon: MoreVertical, to: '/reviews' },
      { label: 'My Profile',       icon: UserPlus,    to: '/my-profile' },
    ],
  },
];

const staffSections = [
  {
    title: 'Main',
    items: [
      { label: 'Browse Parts',     icon: Search,          to: '/catalog' },
    ],
  },
  {
    title: 'Customer Management',
    items: [
      { label: 'Register Customer', icon: UserPlus,  to: '/staff-register' },
      { label: 'Search Customers',  icon: Search,    to: '/customers' },
      { label: 'Customer Reports',  icon: BarChart2, to: '/staff-reports' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Generate Invoice', icon: Receipt,  to: '/invoice' },
      { label: 'Sales History',    icon: FileText, to: '/sales-history' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Book Appointment', icon: Calendar, to: '/appointment' },
      { label: 'Request a Part',   icon: Package,  to: '/part-request' },
    ],
  },
];


function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sections = user?.role === 'Admin' ? adminSections : user?.role === 'Staff' ? staffSections : customerSections;
  const avatarLetter = user?.name?.[0]?.toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sb">

      {/* ── Logo ── */}
      <div className="sb-logo">
        <div className="sb-logo-icon">
          <Wrench size={17} />
        </div>
        <div className="sb-logo-text">
          <span className="sb-logo-main">Garage</span>
          <span className="sb-logo-accent">Hub</span>
        </div>
      </div>

      {/* ── Role Badge ── */}
      <div className="sb-role-badge">
        <span className={`sb-role ${user?.role === 'Admin' ? 'admin' : user?.role === 'Staff' ? 'admin' : 'customer'}`}>
          {user?.role || 'Guest'}
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="sb-nav">
        {sections.map((section) => (
          <div key={section.title} className="sb-group">
            <p className="sb-group-title">{section.title}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/' || item.to === '/catalog'}
                    className={({ isActive }) =>
                      `sb-link${isActive ? ' sb-link--active' : ''}`
                    }
                  >
                    <span className="sb-link-icon">
                      <item.icon size={16} strokeWidth={1.8} />
                    </span>
                    <span className="sb-link-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User Profile + Logout ── */}
      <div className="sb-user">
        <div className="sb-user-avatar">{avatarLetter}</div>
        <div className="sb-user-info">
          <p className="sb-user-name">{user?.name || 'User'}</p>
          <p className="sb-user-role">{user?.role || ''}</p>
        </div>
        <button className="sb-user-more" title="Logout" onClick={handleLogout}>
          <LogOut size={15} />
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
