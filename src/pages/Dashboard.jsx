import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import { Beef, Users, CreditCard, Package, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatRupiah, chartPemasukan } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { state } = useApp();

  const totalHewan = state.hewan.length;
  const hewanTersedia = state.hewan.filter(h => h.status === 'Tersedia').length;
  const totalPeserta = state.peserta.length;
  const totalPemasukan = state.pembayaran.reduce((s, p) => s + p.terbayar, 0);
  const lunas = state.pembayaran.filter(p => p.status === 'Lunas').length;
  const cicilan = state.pembayaran.filter(p => p.status === 'Cicilan').length;
  const belumBayar = state.pembayaran.filter(p => p.status === 'Belum Bayar').length;
  const distribusiSelesai = state.distribusi.filter(d => d.status === 'Selesai').length;

  const pieData = [
    { name: 'Lunas', value: lunas },
    { name: 'Cicilan', value: cicilan },
    { name: 'Belum Bayar', value: belumBayar },
  ];

  const recentHewan = state.hewan.slice(0, 4);
  const recentPeserta = state.peserta.slice(0, 4);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{label}</p>
          <p className="chart-tooltip-value">{formatRupiah(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Bismillah, Selamat Datang! 🌙</h1>
          <p className="welcome-sub">Pantau dan kelola program qurban tahun ini dengan mudah.</p>
        </div>
        <div className="welcome-badge">
          <span>Idul Adha 1445 H</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Beef} label="Total Hewan" value={totalHewan} sub={`${hewanTersedia} tersedia`} color="primary" trend={12} />
        <StatCard icon={Users} label="Total Peserta" value={totalPeserta} sub="Shohibul Qurban" color="info" trend={8} />
        <StatCard icon={CreditCard} label="Total Pemasukan" value={formatRupiah(totalPemasukan)} sub={`${lunas} peserta lunas`} color="warning" trend={15} />
        <StatCard icon={Package} label="Distribusi Selesai" value={distribusiSelesai} sub={`dari ${state.distribusi.length} titik`} color="danger" />
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts">
        {/* Area Chart */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h3>Pemasukan Bulanan</h3>
              <p>Riwayat pembayaran qurban</p>
            </div>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartPemasukan} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="bulan" tick={{ fill: '#5c7068', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5c7068', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v === 0 ? '0' : `${(v/1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2.5}
                fill="url(#colorPemasukan)" dot={{ fill: '#10b981', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card chart-card chart-card--small">
          <div className="chart-header">
            <div>
              <h3>Status Pembayaran</h3>
              <p>Distribusi pembayaran peserta</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                paddingAngle={4} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} peserta`, '']} />
              <Legend formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <div className="quick-stat-item">
          <CheckCircle size={16} style={{ color: 'var(--success)' }} />
          <span className="quick-stat-label">Lunas</span>
          <span className="quick-stat-value">{lunas} peserta</span>
        </div>
        <div className="quick-stat-item">
          <Clock size={16} style={{ color: 'var(--warning)' }} />
          <span className="quick-stat-label">Cicilan</span>
          <span className="quick-stat-value">{cicilan} peserta</span>
        </div>
        <div className="quick-stat-item">
          <AlertCircle size={16} style={{ color: 'var(--danger)' }} />
          <span className="quick-stat-label">Belum Bayar</span>
          <span className="quick-stat-value">{belumBayar} peserta</span>
        </div>
        <div className="quick-stat-item">
          <Beef size={16} style={{ color: 'var(--info)' }} />
          <span className="quick-stat-label">Hewan Tersedia</span>
          <span className="quick-stat-value">{hewanTersedia} ekor</span>
        </div>
      </div>

      {/* Recent tables */}
      <div className="dashboard-tables">
        {/* Recent Hewan */}
        <div className="card">
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <h3>Hewan Terbaru</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis</th>
                  <th>Harga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentHewan.map(h => (
                  <tr key={h.id}>
                    <td>{h.nama}</td>
                    <td>{h.jenis}</td>
                    <td>{formatRupiah(h.harga)}</td>
                    <td>
                      <span className={`badge ${h.status === 'Tersedia' ? 'badge-success' : 'badge-warning'}`}>
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Peserta */}
        <div className="card">
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <h3>Peserta Terbaru</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {recentPeserta.map(p => (
                  <tr key={p.id}>
                    <td>{p.nama}</td>
                    <td>{p.jenisQurban}</td>
                    <td>
                      <span className="badge badge-info">{p.share}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
