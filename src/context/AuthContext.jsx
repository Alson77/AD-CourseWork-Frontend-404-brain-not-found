import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage on page refresh
    const stored = localStorage.getItem('vp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    const normalized = {
      ...userData,
      token: userData.token || userData.Token,
      role: userData.role || userData.Role,
      name: userData.name || userData.Name,
      email: userData.email || userData.Email,
      customerId: userData.customerId ?? userData.CustomerId,
    };
    setUser(normalized);
    localStorage.setItem('vp_user', JSON.stringify(normalized));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy use in any component
export function useAuth() {
  return useContext(AuthContext);
}
