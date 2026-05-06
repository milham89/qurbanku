import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', sub: 'Ringkasan & statistik qurban' },
  '/hewan': { title: 'Hewan Qurban', sub: 'Kelola data hewan qurban' },
  '/peserta': { title: 'Peserta Qurban', sub: 'Kelola data peserta & shohibul qurban' },
  '/pembayaran': { title: 'Pembayaran', sub: 'Pantau status & riwayat pembayaran' },
  '/distribusi': { title: 'Distribusi Daging', sub: 'Kelola distribusi daging qurban' },
  '/laporan': { title: 'Laporan', sub: 'Rekap & analisis data qurban' },
};

export default function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Qurbanku', sub: '' };
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{page.title}</h2>
        <p className="header-sub">{page.sub}</p>
      </div>
      <div className="header-right">
        <span className="header-date">{dateStr}</span>
        <button className="header-icon-btn" title="Notifikasi">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
      </div>
    </header>
  );
}
