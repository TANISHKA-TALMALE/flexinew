import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="center-screen">
      <div className="auth-card">
        <div className="auth-side">
          <span className="badge"><span className="dot" /> Design Studio</span>
          <h1>Create your studio account</h1>
          <p>Unlock templates, save designs, and export crisp, print-ready cards.</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          <h2>Sign up</h2>
          <p className="hint">It’s fast — just name, email, and a password.</p>
          {error && <p style={{ color: 'salmon', margin: 0 }}>{error}</p>}
          <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} />
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
          <button className="btn primary" type="submit">Create account</button>
          <p className="hint">Already have an account? <a className="link" href="/login">Login</a></p>
        </form>
      </div>
    </div>
  );
}