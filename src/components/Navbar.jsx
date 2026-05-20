import { NavLink } from 'react-router-dom';
import { Car, Home, Calendar, Package, BookOpen, ShoppingCart } from 'lucide-react';

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Car size={24} />
        <span>VehicleParts MS</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Home size={16} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Car size={16} /> Register
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointment" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Calendar size={16} /> Appointment
          </NavLink>
        </li>
        <li>
          <NavLink to="/part-request" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Package size={16} /> Part Request
          </NavLink>
        </li>
        <li>
          <NavLink to="/catalog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <BookOpen size={16} /> Catalog
          </NavLink>
        </li>
        <li>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
