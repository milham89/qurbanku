import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError('Email atau password salah. Pastikan akun sudah dibuat di Supabase.');
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="login-container">
        <div className="login-logo">
          <div className="login-logo-icon">🐑</div>
          <h1 className="login-app-name">Qurbanku</h1>
          <p className="login-app-sub">Sistem Manajemen Qurban Digital</p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Selamat Datang</h2>
            <p>Masuk ke panel manajemen qurban</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="admin@qurbanku.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
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

            {error && (
              <div className="login-error">{error}</div>
            )}

            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : <><Lock size={16} /> Masuk</>}
            </button>
          </form>

          {/* Supabase badge */}
          <div className="login-hint" style={{ marginTop: '20px' }}>
            <span>🔒 Ditenagai oleh </span>
            <strong style={{ color: 'var(--primary)' }}>Supabase Auth</strong>
          </div>
        </div>

        <p className="login-footer">© 2024 Qurbanku — Manajemen Qurban Digital</p>
      </div>
    </div>
  );
}
