// ============================================================
// Mock Data — Qurbanku App
// ============================================================

export const mockHewan = [
  { id: 1, nama: 'Sapi Limosin #001', jenis: 'Sapi', berat: 350, harga: 18000000, status: 'Tersedia', keterangan: 'Sehat, sudah cek dokter' },
  { id: 2, nama: 'Sapi Simmental #002', jenis: 'Sapi', berat: 420, harga: 22000000, status: 'Terjual', keterangan: 'Kondisi prima' },
  { id: 3, nama: 'Kambing Etawa #003', jenis: 'Kambing', berat: 35, harga: 3500000, status: 'Tersedia', keterangan: 'Kambing jantan sehat' },
  { id: 4, nama: 'Kambing Boer #004', jenis: 'Kambing', berat: 42, harga: 4200000, status: 'Terjual', keterangan: 'Berat optimal' },
  { id: 5, nama: 'Sapi Brahman #005', jenis: 'Sapi', berat: 380, harga: 20000000, status: 'Tersedia', keterangan: 'Dari peternak lokal' },
  { id: 6, nama: 'Kambing Kacang #006', jenis: 'Kambing', berat: 28, harga: 2800000, status: 'Tersedia', keterangan: 'Siap qurban' },
];

export const mockPeserta = [
  { id: 1, nama: 'Ahmad Fauzi', telepon: '08123456789', alamat: 'Jl. Mawar No. 5, Jakarta', jenisQurban: 'Sapi', share: '1/7', idHewan: 2, status: 'Aktif' },
  { id: 2, nama: 'Siti Rahmawati', telepon: '08234567890', alamat: 'Jl. Melati No. 12, Bekasi', jenisQurban: 'Kambing', share: '1 Ekor', idHewan: 4, status: 'Aktif' },
  { id: 3, nama: 'Budi Santoso', telepon: '08345678901', alamat: 'Jl. Anggrek No. 3, Depok', jenisQurban: 'Sapi', share: '1/7', idHewan: 2, status: 'Aktif' },
  { id: 4, nama: 'Dewi Lestari', telepon: '08456789012', alamat: 'Jl. Dahlia No. 8, Tangerang', jenisQurban: 'Sapi', share: '1/7', idHewan: 2, status: 'Aktif' },
  { id: 5, nama: 'Eko Prasetyo', telepon: '08567890123', alamat: 'Jl. Kenanga No. 1, Bogor', jenisQurban: 'Kambing', share: '1 Ekor', idHewan: 4, status: 'Aktif' },
  { id: 6, nama: 'Fatimah Zahra', telepon: '08678901234', alamat: 'Jl. Cempaka No. 15, Jakarta', jenisQurban: 'Sapi', share: '1/7', idHewan: 2, status: 'Aktif' },
];

export const mockPembayaran = [
  { id: 1, idPeserta: 1, namaPeserta: 'Ahmad Fauzi', totalTagihan: 3000000, terbayar: 3000000, status: 'Lunas', tanggal: '2024-05-10', metode: 'Transfer Bank' },
  { id: 2, idPeserta: 2, namaPeserta: 'Siti Rahmawati', totalTagihan: 4200000, terbayar: 2000000, status: 'Cicilan', tanggal: '2024-05-12', metode: 'Cash' },
  { id: 3, idPeserta: 3, namaPeserta: 'Budi Santoso', totalTagihan: 3000000, terbayar: 3000000, status: 'Lunas', tanggal: '2024-05-08', metode: 'Transfer Bank' },
  { id: 4, idPeserta: 4, namaPeserta: 'Dewi Lestari', totalTagihan: 3000000, terbayar: 1500000, status: 'Cicilan', tanggal: '2024-05-15', metode: 'QRIS' },
  { id: 5, idPeserta: 5, namaPeserta: 'Eko Prasetyo', totalTagihan: 4200000, terbayar: 0, status: 'Belum Bayar', tanggal: '-', metode: '-' },
  { id: 6, idPeserta: 6, namaPeserta: 'Fatimah Zahra', totalTagihan: 3000000, terbayar: 3000000, status: 'Lunas', tanggal: '2024-05-11', metode: 'Transfer Bank' },
];

export const mockDistribusi = [
  { id: 1, penerima: 'Masjid Al-Ikhlas', kategori: 'Masjid', beratDaging: 25, status: 'Selesai', tanggal: '2024-06-17' },
  { id: 2, penerima: 'Keluarga Kurang Mampu RT 05', kategori: 'Warga', beratDaging: 15, status: 'Selesai', tanggal: '2024-06-17' },
  { id: 3, penerima: 'Panti Asuhan Al-Amin', kategori: 'Sosial', beratDaging: 30, status: 'Proses', tanggal: '2024-06-17' },
  { id: 4, penerima: 'Peserta Qurban (Shohibul Qurban)', kategori: 'Peserta', beratDaging: 40, status: 'Proses', tanggal: '2024-06-17' },
  { id: 5, penerima: 'Panitia Qurban', kategori: 'Panitia', beratDaging: 10, status: 'Selesai', tanggal: '2024-06-17' },
];

export const chartPemasukan = [
  { bulan: 'Jan', pemasukan: 0 },
  { bulan: 'Feb', pemasukan: 0 },
  { bulan: 'Mar', pemasukan: 2500000 },
  { bulan: 'Apr', pemasukan: 5500000 },
  { bulan: 'Mei', pemasukan: 8500000 },
  { bulan: 'Jun', pemasukan: 3000000 },
];

export const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
};
