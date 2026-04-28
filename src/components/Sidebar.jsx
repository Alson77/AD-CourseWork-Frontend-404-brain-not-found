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
    ],
  },
  {
    title: 'Customer Management',
    items: [
      { label: 'Manage Customers',  icon: UsersRound, to: '/customers' },
      { label: 'Search & Sale',     icon: Search,     to: '/catalog' },
      { label: 'Register Customer', icon: UserPlus,   to: '/register' },
    ],
  },
  {
    title: 'Sales & Finance',
    items: [
      { label: 'Sales History',     icon: FileText,   to: '/sales-history' },
      { label: 'Credit Management', icon: CreditCard, to: '/credit' },
      { label: 'Customer Reports',  icon: BarChart2,  to: '/reports' },
      { label: 'Generate Invoice',  icon: Receipt,    to: '/invoice' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Appointments',          icon: Calendar,      to: '/appointment' },
      { label: 'Part Requests',         icon: Package,       to: '/part-request' },
      { label: 'Inventory Management',  icon: ClipboardList, to: '/inventory' },
    ],
  },
];

const customerSections = [
  {
    title: 'Menu',
    items: [
      { label: 'Browse Parts',    icon: Search,    to: '/catalog' },
      { label: 'Shopping Cart',   icon: Package,   to: '/cart' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Book Appointment', icon: Calendar, to: '/appointment' },
      { label: 'Request a Part',   icon: Package,  to: '/part-request' },
      { label: 'My Profile',       icon: UserPlus, to: '/register' },
    ],
  },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sections = user?.role === 'Admin' ? adminSections : customerSections;
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
          <span className="sb-logo-main">AutoParts</span>
          <span className="sb-logo-accent">Plus</span>
        </div>
      </div>

      {/* ── Role Badge ── */}
      <div className="sb-role-badge">
        <span className={`sb-role ${user?.role === 'Admin' ? 'admin' : 'customer'}`}>
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
