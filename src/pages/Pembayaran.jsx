import { useState } from 'react';
import { useApp, dbAddPembayaran, dbUpdatePembayaran } from '../context/AppContext';
import Modal from '../components/Modal';
import NumberInput from '../components/NumberInput';
import { Plus, Search, Pencil, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatRupiah } from '../data/mockData';
import './Pembayaran.css';

const emptyForm = { namaPeserta: '', totalTagihan: '', terbayar: '', metode: 'Transfer Bank', tanggal: new Date().toISOString().slice(0, 10) };

export default function Pembayaran() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = state.pembayaran.filter(p => {
    const matchSearch = (p.namaPeserta || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPemasukan = state.pembayaran.reduce((s, p) => s + Number(p.terbayar || 0), 0);
  const totalTagihan  = state.pembayaran.reduce((s, p) => s + Number(p.totalTagihan || 0), 0);
  const lunas = state.pembayaran.filter(p => p.status === 'Lunas').length;

  const openAdd = () => { setEditData(null); setForm(emptyForm); setError(''); setModal(true); };
  const openEdit = (p) => { setEditData(p); setForm({ ...p }); setError(''); setModal(true); };

  const handleSave = async () => {
    if (!form.namaPeserta || !form.totalTagihan) { setError('Nama peserta dan total tagihan wajib diisi.'); return; }
    setSaving(true);
    const total = Number(form.totalTagihan);
    const bayar = Number(form.terbayar || 0);
    let status = 'Belum Bayar';
    if (bayar >= total) status = 'Lunas';
    else if (bayar > 0) status = 'Cicilan';

    const payload = { ...form, totalTagihan: total, terbayar: bayar, status };
    const fn = editData ? dbUpdatePembayaran : dbAddPembayaran;
    const { error: err } = await fn(dispatch, editData ? { ...payload, id: editData.id } : payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setModal(false);
  };

  const statusBadge = (s) => {
    if (s === 'Lunas') return <span className="badge badge-success"><CheckCircle size={11} /> Lunas</span>;
    if (s === 'Cicilan') return <span className="badge badge-warning"><Clock size={11} /> Cicilan</span>;
    return <span className="badge badge-danger"><AlertCircle size={11} /> Belum Bayar</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pembayaran</h1>
          <p>Pantau status pembayaran seluruh peserta qurban</p>
        </div>
        <button id="btn-tambah-pembayaran" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Catat Pembayaran
        </button>
      </div>

      <div className="pembayaran-summary">
        <div className="pay-card">
          <span className="pay-card-label">Total Tagihan</span>
          <span className="pay-card-value">{formatRupiah(totalTagihan)}</span>
        </div>
        <div className="pay-card pay-card--green">
          <span className="pay-card-label">Total Terbayar</span>
          <span className="pay-card-value">{formatRupiah(totalPemasukan)}</span>
        </div>
        <div className="pay-card pay-card--yellow">
          <span className="pay-card-label">Sisa Tagihan</span>
          <span className="pay-card-value">{formatRupiah(totalTagihan - totalPemasukan)}</span>
        </div>
        <div className="pay-card">
          <span className="pay-card-label">Peserta Lunas</span>
          <span className="pay-card-value">{lunas} / {state.pembayaran.length}</span>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input id="search-pembayaran" className="input" placeholder="Cari nama peserta..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        {['Semua', 'Lunas', 'Cicilan', 'Belum Bayar'].map(s => (
          <button key={s} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Nama Peserta</th><th>Total Tagihan</th><th>Terbayar</th>
                <th>Sisa</th><th>Status</th><th>Metode</th><th>Tanggal</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Tidak ada data pembayaran
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td><strong>{p.namaPeserta}</strong></td>
                  <td>{formatRupiah(p.totalTagihan)}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatRupiah(p.terbayar)}</td>
                  <td style={{ color: (p.totalTagihan - p.terbayar) > 0 ? 'var(--danger)' : 'var(--success)' }}>
                    {formatRupiah(p.totalTagihan - p.terbayar)}
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.metode}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{p.tanggal}</td>
                  <td>
                    <button className="btn btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={editData ? 'Edit Pembayaran' : 'Catat Pembayaran Baru'}
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button id="btn-simpan-pembayaran" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={14} className="spin" /> Menyimpan...</> : 'Simpan'}
              </button>
            </>
          }
        >
          {error && <div className="login-error">{error}</div>}
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Nama Peserta *</label>
              <input className="input" placeholder="Nama peserta" value={form.namaPeserta}
                onChange={e => setForm({ ...form, namaPeserta: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Total Tagihan (Rp) *</label>
              <NumberInput
                prefix="Rp "
                placeholder="3.000.000"
                value={form.totalTagihan}
                onChange={val => setForm({ ...form, totalTagihan: val })}
              />
            </div>
            <div className="input-group">
              <label>Jumlah Terbayar (Rp)</label>
              <NumberInput
                prefix="Rp "
                placeholder="0"
                value={form.terbayar}
                onChange={val => setForm({ ...form, terbayar: val })}
              />
            </div>
            <div className="input-group">
              <label>Metode Pembayaran</label>
              <select className="input" value={form.metode} onChange={e => setForm({ ...form, metode: e.target.value })}>
                {['Transfer Bank', 'Cash', 'QRIS', 'Lainnya'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Tanggal</label>
              <input className="input" type="date" value={form.tanggal}
                onChange={e => setForm({ ...form, tanggal: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
