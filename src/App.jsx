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
import StaffManagement from './pages/StaffManagement';
import Vendors from './pages/Vendors';
import Purchases from './pages/Purchases';
import FinancialReports from './pages/FinancialReports';
import CreditManagement from './pages/CreditManagement';
import StaffCustomerReports from './pages/StaffCustomerReports';
import AdminPartRequests from './pages/AdminPartRequests';
import MyProfile from './pages/MyProfile';
import MyVehicles from './pages/MyVehicles';
import CustomerDashboard from './pages/CustomerDashboard';
import PurchaseHistory from './pages/PurchaseHistory';
import ServiceHistory from './pages/ServiceHistory';
import CreditStatus from './pages/CreditStatus';
import Reviews from './pages/Reviews';
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

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={user ? (
          <Navigate
            to={user.role === 'Admin' ? '/' : user.role === 'Staff' ? '/invoice' : '/customer-dashboard'}
            replace
          />
        ) : (
          <Login />
        )}
      />
      <Route
        path="/register"
        element={user ? (
          <Navigate
            to={user.role === 'Admin' ? '/' : user.role === 'Staff' ? '/invoice' : '/customer-dashboard'}
            replace
          />
        ) : (
          <CustomerRegister />
        )}
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
        <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
          <AppLayout><ManageCustomers /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff-register" element={
        <ProtectedRoute allowedRoles={['Staff']}>
          <AppLayout><CustomerRegister /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/sales-history" element={
        <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
          <AppLayout><SalesHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/credit" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><CreditManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><FinancialReports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><InventoryManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/invoice" element={
        <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
          <AppLayout><InvoiceGeneration /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff-reports" element={
        <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
          <AppLayout><StaffCustomerReports /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><StaffManagement /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/vendors" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><Vendors /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/purchases" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><Purchases /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-part-requests" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AppLayout><AdminPartRequests /></AppLayout>
        </ProtectedRoute>
      } />


      {/* Shared routes (both roles) */}
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
          <AppLayout><PartsCatalog /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <AppLayout><Cart /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-profile" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><MyProfile /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-vehicles" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><MyVehicles /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/customer-dashboard" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><CustomerDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/purchase-history" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><PurchaseHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/service-history" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><ServiceHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/credit-status" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><CreditStatus /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reviews" element={
        <ProtectedRoute allowedRoles={['Customer']}>
          <AppLayout><Reviews /></AppLayout>
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
