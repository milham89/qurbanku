import { useApp } from '../context/AppContext';
import { formatRupiah, chartPemasukan } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import './Laporan.css';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function Laporan() {
  const { state } = useApp();

  const totalPemasukan = state.pembayaran.reduce((s, p) => s + p.terbayar, 0);
  const totalTagihan = state.pembayaran.reduce((s, p) => s + p.totalTagihan, 0);
  const lunas = state.pembayaran.filter(p => p.status === 'Lunas').length;
  const cicilan = state.pembayaran.filter(p => p.status === 'Cicilan').length;
  const belumBayar = state.pembayaran.filter(p => p.status === 'Belum Bayar').length;

  const hewanData = [
    { name: 'Sapi', value: state.hewan.filter(h => h.jenis === 'Sapi').length },
    { name: 'Kambing', value: state.hewan.filter(h => h.jenis === 'Kambing').length },
  ];

  const statusBayarData = [
    { name: 'Lunas', value: lunas },
    { name: 'Cicilan', value: cicilan },
    { name: 'Belum Bayar', value: belumBayar },
  ];

  const distribusiData = state.distribusi.map(d => ({
    name: d.penerima.length > 20 ? d.penerima.slice(0, 20) + '...' : d.penerima,
    berat: d.beratDaging,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="chart-tooltip">
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
            {typeof payload[0].value === 'number' && payload[0].value > 100000
              ? formatRupiah(payload[0].value)
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Laporan & Analisis</h1>
          <p>Rekap lengkap program qurban tahun 1445 H</p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Cetak Laporan
        </button>
      </div>

      {/* Ringkasan Eksekutif */}
      <div className="laporan-executive">
        <div className="exec-item">
          <div className="exec-icon">🐄</div>
          <div className="exec-info">
            <span className="exec-val">{state.hewan.filter(h => h.jenis === 'Sapi').length}</span>
            <span className="exec-lbl">Sapi</span>
          </div>
        </div>
        <div className="exec-divider" />
        <div className="exec-item">
          <div className="exec-icon">🐑</div>
          <div className="exec-info">
            <span className="exec-val">{state.hewan.filter(h => h.jenis === 'Kambing').length}</span>
            <span className="exec-lbl">Kambing</span>
          </div>
        </div>
        <div className="exec-divider" />
        <div className="exec-item">
          <div className="exec-icon">👥</div>
          <div className="exec-info">
            <span className="exec-val">{state.peserta.length}</span>
            <span className="exec-lbl">Peserta Qurban</span>
          </div>
        </div>
        <div className="exec-divider" />
        <div className="exec-item">
          <div className="exec-icon">💰</div>
          <div className="exec-info">
            <span className="exec-val" style={{ fontSize: '16px' }}>{formatRupiah(totalPemasukan)}</span>
            <span className="exec-lbl">Total Terkumpul</span>
          </div>
        </div>
        <div className="exec-divider" />
        <div className="exec-item">
          <div className="exec-icon">🎯</div>
          <div className="exec-info">
            <span className="exec-val">{totalTagihan > 0 ? Math.round((totalPemasukan / totalTagihan) * 100) : 0}%</span>
            <span className="exec-lbl">Tingkat Pelunasan</span>
          </div>
        </div>
        <div className="exec-divider" />
        <div className="exec-item">
          <div className="exec-icon">⚖️</div>
          <div className="exec-info">
            <span className="exec-val">{state.distribusi.reduce((s, d) => s + d.beratDaging, 0)} kg</span>
            <span className="exec-lbl">Daging Didistribusi</span>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="laporan-charts">
        {/* Bar - Pemasukan */}
        <div className="card">
          <h3 style={{ marginBottom: '4px', fontSize: '15px', fontWeight: 700 }}>Pemasukan Bulanan</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Tren pembayaran per bulan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartPemasukan} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="bulan" tick={{ fill: '#5c7068', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5c7068', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v === 0 ? '0' : `${(v/1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Status Pembayaran */}
        <div className="card">
          <h3 style={{ marginBottom: '4px', fontSize: '15px', fontWeight: 700 }}>Status Pembayaran</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Distribusi status peserta</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusBayarData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {statusBayarData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} peserta`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Jenis Hewan */}
        <div className="card">
          <h3 style={{ marginBottom: '4px', fontSize: '15px', fontWeight: 700 }}>Komposisi Hewan</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Sapi vs Kambing</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={hewanData} cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                paddingAngle={4} dataKey="value">
                {hewanData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{val}</span>} />
              <Tooltip formatter={(v) => [`${v} ekor`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar - Distribusi per titik */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '4px', fontSize: '15px', fontWeight: 700 }}>Distribusi Daging per Titik</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Berat daging (kg) per penerima</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={distribusiData} margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#5c7068', fontSize: 11 }} axisLine={false} tickLine={false}
              angle={-30} textAnchor="end" />
            <YAxis tick={{ fill: '#5c7068', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v} kg`} />
            <Tooltip formatter={(v) => [`${v} kg`, 'Berat Daging']} />
            <Bar dataKey="berat" radius={[4, 4, 0, 0]}>
              {distribusiData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Ringkasan */}
      <div className="laporan-tables">
        <div className="card" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700 }}>Rekap Peserta & Pembayaran</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jenis</th>
                  <th>Tagihan</th>
                  <th>Terbayar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.pembayaran.map(p => (
                  <tr key={p.id}>
                    <td>{p.namaPeserta}</td>
                    <td><span className="badge badge-default">{state.peserta.find(ps => ps.id === p.idPeserta)?.jenisQurban || '-'}</span></td>
                    <td>{formatRupiah(p.totalTagihan)}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatRupiah(p.terbayar)}</td>
                    <td>
                      <span className={`badge ${p.status === 'Lunas' ? 'badge-success' : p.status === 'Cicilan' ? 'badge-warning' : 'badge-danger'}`}>
                        {p.status}
                      </span>
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
