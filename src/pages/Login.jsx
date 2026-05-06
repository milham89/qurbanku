import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import './Login.css';

const USERS = [
  { username: 'admin', password: 'admin123', nama: 'Administrator', role: 'Admin Utama' },
  { username: 'panitia', password: 'panitia123', nama: 'Panitia Qurban', role: 'Panitia' },
];

export default function Login() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800)); // simulate delay

    const user = USERS.find(u => u.username === form.username && u.password === form.password);
    if (user) {
      const userData = { nama: user.nama, role: user.role, username: user.username };
      dispatch({ type: 'LOGIN', payload: userData });
      localStorage.setItem('qurbanku_auth', JSON.stringify(userData));
      navigate('/dashboard');
    } else {
      setError('Username atau password salah. Coba: admin / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Decorative background */}
      <div className="login-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🐑</div>
          <h1 className="login-app-name">Qurbanku</h1>
          <p className="login-app-sub">Sistem Manajemen Qurban Digital</p>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Selamat Datang</h2>
            <p>Masuk ke panel manajemen qurban</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username */}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  <Lock size={16} />
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="login-hint">
            <span>Demo: </span>
            <code>admin</code> / <code>admin123</code>
          </div>
        </div>

        <p className="login-footer">© 2024 Qurbanku — Manajemen Qurban Digital</p>
      </div>
    </div>
  );
}
