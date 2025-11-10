import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      {/* Ambient background overlay for subtle animated motion */}
      <div className="ambient-bg" aria-hidden="true" />
      <nav className="navbar">
        <div className="brand">
          <div className="dot" />
          <span>BizCard Studio</span>
        </div>
        <div className="actions">
          <Link to="/">Home</Link>
          {!user && <Link to="/signup">Signup</Link>}
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <>
              <span className="muted">Hi, {user.name}</span>
              <button className="btn outline" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}