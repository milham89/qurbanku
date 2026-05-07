import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Hewan from './pages/Hewan';
import Peserta from './pages/Peserta';
import Pembayaran from './pages/Pembayaran';
import Distribusi from './pages/Distribusi';
import Laporan from './pages/Laporan';

function ProtectedLayout({ children }) {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!state.isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { state } = useApp();
  return (
    <Routes>
      <Route path="/login" element={state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/hewan" element={<ProtectedLayout><Hewan /></ProtectedLayout>} />
      <Route path="/peserta" element={<ProtectedLayout><Peserta /></ProtectedLayout>} />
      <Route path="/pembayaran" element={<ProtectedLayout><Pembayaran /></ProtectedLayout>} />
      <Route path="/distribusi" element={<ProtectedLayout><Distribusi /></ProtectedLayout>} />
      <Route path="/laporan" element={<ProtectedLayout><Laporan /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
