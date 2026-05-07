import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Beef, Users, CreditCard,
  Package, BarChart3, LogOut, Menu, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hewan', icon: Beef, label: 'Hewan Qurban' },
  { to: '/peserta', icon: Users, label: 'Peserta' },
  { to: '/pembayaran', icon: CreditCard, label: 'Pembayaran' },
  { to: '/distribusi', icon: Package, label: 'Distribusi' },
  { to: '/laporan', icon: BarChart3, label: 'Laporan' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '20px 0' : '20px 16px' }}>
        {!collapsed && <div className="logo-icon">🐑</div>}
        
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-name">Qurbanku</span>
            <span className="logo-sub">Manajemen Qurban</span>
          </div>
        )}
        
        {/* Toggle Collapse (Desktop) */}
        <button 
          className="collapse-btn desktop-only" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={24} /> : <X size={18} />}
        </button>

        {/* Close Sidebar (Mobile) */}
        <button className="collapse-btn mobile-only" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* User info */}
      {!collapsed && state.user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {state.user.nama?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{state.user.nama}</span>
            <span className="user-role">{state.user.role}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? label : undefined}
            onClick={onClose}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
            {collapsed && <span className="nav-tooltip">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar-logout" onClick={handleLogout} title={collapsed ? 'Keluar' : undefined}>
        <LogOut size={20} />
        {!collapsed && <span>Keluar</span>}
      </button>
    </aside>
    </>
  );
}
