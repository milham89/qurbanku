import { useState } from 'react';
import { useApp, dbAddPeserta, dbUpdatePeserta, dbDeletePeserta } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';

const emptyForm = { nama: '', telepon: '', alamat: '', jenisQurban: 'Sapi', share: '1/7', idHewan: '', status: 'Aktif' };

export default function Peserta() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = state.peserta.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    (p.telepon || '').includes(search)
  );

  const openAdd = () => { setEditData(null); setForm(emptyForm); setError(''); setModal(true); };
  const openEdit = (p) => { setEditData(p); setForm({ ...p }); setError(''); setModal(true); };

  const handleSave = async () => {
    if (!form.nama || !form.telepon) { setError('Nama dan telepon wajib diisi.'); return; }
    setSaving(true);
    const fn = editData ? dbUpdatePeserta : dbAddPeserta;
    const { error: err } = await fn(dispatch, editData ? { ...form, id: editData.id } : form);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus peserta ini?')) return;
    await dbDeletePeserta(dispatch, id);
  };

  const shareOptions = form.jenisQurban === 'Sapi'
    ? ['1/7', '2/7', '3/7', '4/7', '5/7', '6/7', '7/7', '1 Ekor']
    : ['1 Ekor'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Peserta Qurban</h1>
          <p>{state.peserta.length} peserta terdaftar sebagai Shohibul Qurban</p>
        </div>
        <button id="btn-tambah-peserta" className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Peserta
        </button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input id="search-peserta" className="input" placeholder="Cari nama atau nomor telepon..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Nama Peserta</th><th>Telepon</th><th>Alamat</th>
                <th>Jenis Qurban</th><th>Share</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Tidak ada peserta
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td><strong>{p.nama}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.telepon}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.alamat}</td>
                  <td><span className="badge badge-default">{p.jenisQurban === 'Sapi' ? '🐄' : '🐑'} {p.jenisQurban}</span></td>
                  <td><span className="badge badge-info">{p.share}</span></td>
                  <td><span className="badge badge-success">{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-icon btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      <button className="btn btn-icon btn-sm" onClick={() => handleDelete(p.id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={editData ? 'Edit Peserta' : 'Tambah Peserta Qurban'}
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Batal</button>
              <button id="btn-simpan-peserta" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={14} className="spin" /> Menyimpan...</> : 'Simpan'}
              </button>
            </>
          }
        >
          {error && <div className="login-error">{error}</div>}
          <div className="form-grid">
            <div className="input-group full-width">
              <label>Nama Lengkap *</label>
              <input className="input" placeholder="Nama peserta" value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Telepon *</label>
              <input className="input" placeholder="08xxxxxxxxxx" value={form.telepon}
                onChange={e => setForm({ ...form, telepon: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Aktif</option><option>Tidak Aktif</option>
              </select>
            </div>
            <div className="input-group full-width">
              <label>Alamat</label>
              <input className="input" placeholder="Jl. Contoh No. 1, Kota" value={form.alamat}
                onChange={e => setForm({ ...form, alamat: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Jenis Qurban *</label>
              <select className="input" value={form.jenisQurban}
                onChange={e => setForm({ ...form, jenisQurban: e.target.value, share: e.target.value === 'Sapi' ? '1/7' : '1 Ekor' })}>
                <option>Sapi</option><option>Kambing</option>
              </select>
            </div>
            <div className="input-group">
              <label>Share / Bagian *</label>
              <select className="input" value={form.share} onChange={e => setForm({ ...form, share: e.target.value })}>
                {shareOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
