import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles: e.g. ['Admin'] or ['Admin','Customer'] or null (any logged-in user)
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role → send to their home
    return <Navigate to={user.role === 'Admin' ? '/' : '/catalog'} replace />;
  }

  return children;
}

export default ProtectedRoute;
