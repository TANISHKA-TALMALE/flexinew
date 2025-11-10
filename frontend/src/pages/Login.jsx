import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="center-screen">
      <div className="auth-card">
        <div className="auth-side">
          <span className="badge"><span className="dot" /> Design Studio</span>
          <h1>Sign in and start crafting</h1>
          <p>Make striking business cards with modern templates and artful accents.</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          <h2>Welcome back</h2>
          <p className="hint">Use your account to access saved designs.</p>
          {error && <p style={{ color: 'salmon', margin: 0 }}>{error}</p>}
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
          <button className="btn primary" type="submit">Login</button>
          <p className="hint">No account? <Link to="/signup" style={{ color: 'var(--text)' }}>Create one</Link></p>
        </form>
      </div>
    </div>
  );
}