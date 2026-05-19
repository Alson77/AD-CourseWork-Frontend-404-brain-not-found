import axios from 'axios';

// Base URL for all API calls
export const BASE_URL = 'http://localhost:5000';

// Helper to get the JWT token from localStorage
export const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('vp_user'));
    return user?.token || user?.Token || '';
  } catch {
    return '';
  }
};

// Pre-configured axios instance with auth header injected automatically
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
