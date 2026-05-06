import { useState } from 'react';
import { useApp, dbAddDistribusi, dbUpdateDistribusi, dbDeleteDistribusi } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Search, Pencil, Trash2, CheckCircle, Clock, Loader2 } from 'lucide-react';
import './Distribusi.css';

const emptyForm = { penerima: '', kategori: 'Warga', beratDaging: '', status: 'Proses', tanggal: new Date().toISOString().slice(0, 10) };
const KATEGORI = ['Masjid', 'Warga', 'Sosial', 'Peserta', 'Panitia', 'Lainnya'];

export default function Distribusi() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = state.distribusi.filter(d =>
    d.penerima.toLowerCase().includes(search.toLowerCase()) ||
    (d.kategori || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalBerat = state.distribusi.reduce((s, d) => s + Number(d.beratDaging || 0), 0);
  const selesai = state.distribusi.filter(d => d.status === 'Selesai').length;
  const proses  = state.distribusi.filter(d => d.status === 'Proses').length;

  const openAdd = () => { setEditData(null); setForm(emptyForm); setError(''); setModal(true); };
  const openEdit = (d) => { setEditData(d); setForm({ ...d }); setError(''); setModal(true); };

  const handleSave = async () => {
    if (!form.penerima || !form.beratDaging) { setError('Penerima dan berat daging wajib diisi.'); return; }
    setSaving(true);
    const fn = editData ? dbUpdateDistribusi : dbAddDistribusi;
    const { error: err } = await fn(dispatch, editData ? { ...form, id: editData.id } : form);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data distribusi ini?')) return;
    await dbDeleteDistribusi(dispatch, id);
  };

  const toggleStatus = async (d) => {
    const newStatus = d.status === 'Selesai' ? 'Proses' : 'Selesai';
    await dbUpdateDistribusi(dispatch, { ...d, status: newStatus });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Distribusi Daging</h1>
          <p>Kelola distribusi daging qurban ke seluruh penerima</p>
        </div>
        <button id="btn-tambah-distribusi" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Distribusi
        </button>
      </div>

      <div className="distribusi-summary">
        <div className="dist-card">
          <span>⚖️</span>
          <div><strong>{totalBerat} kg</strong><span>Total Daging</span></div>
        </div>
        <div className="dist-card dist-card--green">
          <span>✅</span>
          <div><strong>{selesai}</strong><span>Titik Selesai</span></div>
        </div>
        <div className="dist-card dist-card--yellow">
          <span>🔄</span>
          <div><strong>{proses}</strong><span>Sedang Proses</span></div>
        </div>
        <div className="dist-card">
          <span>📍</span>
          <div><strong>{state.distribusi.length}</strong><span>Total Titik</span></div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input id="search-distribusi" className="input" placeholder="Cari penerima atau kategori..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="distribusi-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Tidak ada data distribusi
          </div>
        ) : filtered.map(d => (
          <div key={d.id} className={`dist-item-card ${d.status === 'Selesai' ? 'done' : ''}`}>
            <div className="dist-item-header">
              <span className="badge badge-default">{d.kategori}</span>
              <span className={`badge ${d.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                {d.status === 'Selesai' ? <CheckCircle size={11} /> : <Clock size={11} />} {d.status}
              </span>
            </div>
            <h3 className="dist-item-name">{d.penerima}</h3>
            <p className="dist-item-berat">⚖️ {d.beratDaging} kg daging</p>
            <p className="dist-item-tanggal">📅 {d.tanggal}</p>
            <div className="dist-item-actions">
              <button className={`btn btn-sm ${d.status === 'Selesai' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleStatus(d)}>
                {d.status === 'Selesai' ? 'Tandai Proses' : 'Tandai Selesai'}
              </button>
              <button className="btn btn-icon btn-sm" onClick={() => openEdit(d)}><Pencil size={14} /></button>
              <button className="btn btn-icon btn-sm" onClick={() => handleDelete(d.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={editData ? 'Edit Distribusi' : 'Tambah Data Distribusi'}
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button id="btn-simpan-distribusi" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={14} className="spin" /> Menyimpan...</> : 'Simpan'}
              </button>
            </>
          }
        >
          {error && <div className="login-error">{error}</div>}
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Nama Penerima *</label>
              <input className="input" placeholder="Masjid / Panti / Warga..." value={form.penerima}
                onChange={e => setForm({ ...form, penerima: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Kategori</label>
              <select className="input" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Berat Daging (kg) *</label>
              <input className="input" type="number" placeholder="25" value={form.beratDaging}
                onChange={e => setForm({ ...form, beratDaging: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Proses</option><option>Selesai</option>
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
