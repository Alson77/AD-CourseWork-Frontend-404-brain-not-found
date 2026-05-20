import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Wrench, LogIn } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data); // store user + token in context & localStorage

      // Redirect based on role
      const role = res.data.role || res.data.Role;
      if (role === 'Admin') {
        navigate('/');
      } else if (role === 'Staff') {
        navigate('/invoice');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Wrench size={20} />
          </div>
          <span className="login-logo-text">
            Garage<strong>Hub</strong>
          </span>
        </div>

        <h1 className="login-title">Sign in to your account</h1>
        <p className="login-subtitle">Enter your credentials to continue</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. admin@garagehub.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>Register Here</Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
