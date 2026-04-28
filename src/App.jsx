import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import CustomerRegister from './pages/CustomerRegister';
import AppointmentBooking from './pages/AppointmentBooking';
import PartRequest from './pages/PartRequest';
import PartsCatalog from './pages/PartsCatalog';
import Cart from './pages/Cart';
import InventoryManagement from './pages/InventoryManagement';
import InvoiceGeneration from './pages/InvoiceGeneration';
import ManageCustomers from './pages/ManageCustomers';
import SalesHistory from './pages/SalesHistory';
import AdminAppointments from './pages/AdminAppointments';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function ComingSoon({ title, breadcrumb }) {
  return (
    <div className="main-content">
      <p className="page-breadcrumb">{breadcrumb || title}</p>
      <h1 className="page-title">{title}</h1>
      <div className="coming-soon-card">
        <p>This feature is under development.</p>
        <p>It will be connected to the ASP.NET Core backend in the next milestone.</p>
      </div>
    </div>
  );
}

// Layout wraps Sidebar + main content (only for authenticated users)
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">{children}</div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === 'Admin' ? '/' : '/catalog'} replace /> : <Login />}
      />

      {/* Admin-only routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><Home /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff-dashboard" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><AdminAppointments /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><ManageCustomers /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/sales-history" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><SalesHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/credit" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><ComingSoon title="Credit Management" breadcrumb="Sales & Finance > Credit Management" /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><ComingSoon title="Customer Reports" breadcrumb="Sales & Finance > Customer Reports" /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><InventoryManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/invoice" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><InvoiceGeneration /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Shared routes (both roles) */}
      <Route path="/register" element={
        <ProtectedRoute>
          <AppLayout><CustomerRegister /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/appointment" element={
        <ProtectedRoute>
          <AppLayout><AppointmentBooking /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/part-request" element={
        <ProtectedRoute>
          <AppLayout><PartRequest /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/catalog" element={
        <ProtectedRoute>
          <AppLayout><PartsCatalog cart={cart} setCart={setCart} /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <AppLayout><Cart cart={cart} setCart={setCart} /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
