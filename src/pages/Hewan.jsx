import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Search, Pencil, Trash2, Beef } from 'lucide-react';
import { formatRupiah } from '../data/mockData';

const emptyForm = { nama: '', jenis: 'Sapi', berat: '', harga: '', status: 'Tersedia', keterangan: '' };

export default function Hewan() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterJenis, setFilterJenis] = useState('Semua');

  const filtered = state.hewan.filter(h => {
    const matchSearch = h.nama.toLowerCase().includes(search.toLowerCase());
    const matchJenis = filterJenis === 'Semua' || h.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const openAdd = () => { setEditData(null); setForm(emptyForm); setModal(true); };
  const openEdit = (h) => { setEditData(h); setForm({ ...h }); setModal(true); };

  const handleSave = () => {
    if (!form.nama || !form.berat || !form.harga) return;
    if (editData) {
      dispatch({ type: 'UPDATE_HEWAN', payload: { ...form, id: editData.id } });
    } else {
      const newId = Math.max(0, ...state.hewan.map(h => h.id)) + 1;
      dispatch({ type: 'ADD_HEWAN', payload: { ...form, id: newId } });
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data hewan ini?')) {
      dispatch({ type: 'DELETE_HEWAN', payload: id });
    }
  };

  const totalHarga = state.hewan.reduce((s, h) => s + Number(h.harga), 0);
  const sapi = state.hewan.filter(h => h.jenis === 'Sapi').length;
  const kambing = state.hewan.filter(h => h.jenis === 'Kambing').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hewan Qurban</h1>
          <p>Kelola data hewan qurban — {state.hewan.length} hewan terdaftar</p>
        </div>
        <button id="btn-tambah-hewan" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Hewan
        </button>
      </div>

      {/* Summary */}
      <div className="hewan-summary">
        <div className="hewan-summary-item">
          <span className="hs-icon">🐄</span>
          <div><span className="hs-val">{sapi}</span><span className="hs-lbl">Sapi</span></div>
        </div>
        <div className="hewan-summary-item">
          <span className="hs-icon">🐑</span>
          <div><span className="hs-val">{kambing}</span><span className="hs-lbl">Kambing</span></div>
        </div>
        <div className="hewan-summary-item">
          <span className="hs-icon">✅</span>
          <div><span className="hs-val">{state.hewan.filter(h => h.status === 'Tersedia').length}</span><span className="hs-lbl">Tersedia</span></div>
        </div>
        <div className="hewan-summary-item">
          <span className="hs-icon">💰</span>
          <div><span className="hs-val" style={{ fontSize: '15px' }}>{formatRupiah(totalHarga)}</span><span className="hs-lbl">Total Nilai</span></div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input id="search-hewan" className="input" placeholder="Cari nama hewan..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        {['Semua', 'Sapi', 'Kambing'].map(j => (
          <button key={j} className={`btn ${filterJenis === j ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilterJenis(j)}>{j}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Hewan</th>
                <th>Jenis</th>
                <th>Berat (kg)</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Tidak ada data hewan
                </td></tr>
              ) : filtered.map((h, i) => (
                <tr key={h.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td><strong>{h.nama}</strong></td>
                  <td>
                    <span className="badge badge-default">{h.jenis === 'Sapi' ? '🐄' : '🐑'} {h.jenis}</span>
                  </td>
                  <td>{h.berat} kg</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatRupiah(h.harga)}</td>
                  <td>
                    <span className={`badge ${h.status === 'Tersedia' ? 'badge-success' : 'badge-warning'}`}>
                      {h.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{h.keterangan}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(h)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(h.id)} title="Hapus"
                        style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          title={editData ? 'Edit Hewan' : 'Tambah Hewan Qurban'}
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button id="btn-simpan-hewan" className="btn btn-primary" onClick={handleSave}>Simpan</button>
            </>
          }
        >
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Nama Hewan *</label>
              <input className="input" placeholder="contoh: Sapi Limosin #007" value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Jenis *</label>
              <select className="input" value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value })}>
                <option>Sapi</option>
                <option>Kambing</option>
              </select>
            </div>
            <div className="input-group">
              <label>Status *</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Tersedia</option>
                <option>Terjual</option>
              </select>
            </div>
            <div className="input-group">
              <label>Berat (kg) *</label>
              <input className="input" type="number" placeholder="350" value={form.berat}
                onChange={e => setForm({ ...form, berat: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Harga (Rp) *</label>
              <input className="input" type="number" placeholder="18000000" value={form.harga}
                onChange={e => setForm({ ...form, harga: e.target.value })} />
            </div>
            <div className="input-group full-width">
              <label>Keterangan</label>
              <input className="input" placeholder="Catatan kondisi hewan..." value={form.keterangan}
                onChange={e => setForm({ ...form, keterangan: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
