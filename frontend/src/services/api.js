import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const instance = axios.create({
  baseURL: '/api',
});

// Attach token from localStorage for simplicity
instance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default instance;