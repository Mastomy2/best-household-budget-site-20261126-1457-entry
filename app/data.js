// PundiKita — data anggaran rumah tangga Keluarga Wijaya, November 2026.
// Satu sumber kebenaran: semua total dihitung dari daftar transaksi di bawah,
// jadi angka di Beranda, Anggaran, Transaksi dan Laporan selalu cocok.
// Data tersimpan di localStorage; tambah/edit/hapus transaksi memperbarui
// semua halaman karena semuanya membaca state yang sama.

export const FAMILY = {
  name: 'Keluarga Wijaya',
  members: 'Budi & Sari Wijaya, Dimas (12) dan Nadia (9)',
  city: 'Makassar',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  asOf: '26 November 2026',
  currency: 'Rp',
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', budget: 2500000, color: '#2e7d4f', icon: '🛒' },
  { id: 'makan', name: 'Makan di Luar', budget: 900000, color: '#c2703d', icon: '🍜' },
  { id: 'transport', name: 'Transport', budget: 1200000, color: '#3d6fb4', icon: '🛵' },
  { id: 'tagihan', name: 'Tagihan & Utilitas', budget: 1450000, color: '#7a5fb0', icon: '💡' },
  { id: 'pendidikan', name: 'Pendidikan Anak', budget: 1800000, color: '#b03d6e', icon: '📚' },
  { id: 'kesehatan', name: 'Kesehatan', budget: 600000, color: '#3d9b8f', icon: '💊' },
  { id: 'hiburan', name: 'Hiburan', budget: 500000, color: '#b49a3d', icon: '🎬' },
  { id: 'pakaian', name: 'Pakaian', budget: 400000, color: '#6b7c8c', icon: '👕' },
];

export const INCOME = [
  { id: 'gaji-budi', date: '2026-11-01', desc: 'Gaji Budi — guru SMA', amount: 8500000 },
  { id: 'gaji-sari', date: '2026-11-01', desc: 'Gaji Sari — perawat', amount: 4000000 },
  { id: 'freelance', date: '2026-11-14', desc: 'Freelance desain Sari', amount: 1200000 },
];

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', cat: 'pendidikan', desc: 'SPP sekolah Dimas', amount: 950000 },
  { id: 't02', date: '2026-11-02', cat: 'belanja', desc: 'Pasar Minggu — belanja mingguan', amount: 386500 },
  { id: 't03', date: '2026-11-02', cat: 'transport', desc: 'Bensin motor', amount: 52000 },
  { id: 't04', date: '2026-11-03', cat: 'makan', desc: 'Warteg Bu Tini', amount: 78000 },
  { id: 't05', date: '2026-11-04', cat: 'belanja', desc: 'Supermarket — beras & minyak', amount: 212750 },
  { id: 't06', date: '2026-11-05', cat: 'pendidikan', desc: 'Buku & alat tulis Nadia', amount: 186500 },
  { id: 't07', date: '2026-11-06', cat: 'transport', desc: 'Bensin motor', amount: 48000 },
  { id: 't08', date: '2026-11-07', cat: 'belanja', desc: 'Pasar Minggu — sayur & buah', amount: 328000 },
  { id: 't09', date: '2026-11-07', cat: 'kesehatan', desc: 'Apotek — vitamin keluarga', amount: 124000 },
  { id: 't10', date: '2026-11-08', cat: 'makan', desc: 'Ayam geprek sekeluarga', amount: 124500 },
  { id: 't11', date: '2026-11-09', cat: 'belanja', desc: 'Supermarket — susu & telur', amount: 164300 },
  { id: 't12', date: '2026-11-09', cat: 'transport', desc: 'Parkir & tol', amount: 87500 },
  { id: 't13', date: '2026-11-10', cat: 'tagihan', desc: 'BPJS Kesehatan', amount: 350000 },
  { id: 't14', date: '2026-11-10', cat: 'pakaian', desc: 'Seragam sekolah Dimas', amount: 215000 },
  { id: 't15', date: '2026-11-11', cat: 'pendidikan', desc: 'Les matematika Nadia', amount: 450000 },
  { id: 't16', date: '2026-11-12', cat: 'belanja', desc: 'Pasar Minggu — ikan & ayam', amount: 312400 },
  { id: 't17', date: '2026-11-12', cat: 'transport', desc: 'Bensin motor', amount: 55000 },
  { id: 't18', date: '2026-11-13', cat: 'makan', desc: 'Bakso & es teh', amount: 86000 },
  { id: 't19', date: '2026-11-14', cat: 'hiburan', desc: 'Langganan streaming', amount: 54000 },
  { id: 't20', date: '2026-11-15', cat: 'belanja', desc: 'Supermarket — daging & sayur', amount: 289600 },
  { id: 't21', date: '2026-11-15', cat: 'tagihan', desc: 'Internet rumah', amount: 350000 },
  { id: 't22', date: '2026-11-15', cat: 'transport', desc: 'Ojek online', amount: 36000 },
  { id: 't23', date: '2026-11-16', cat: 'makan', desc: 'Pizza malam minggu', amount: 212000 },
  { id: 't24', date: '2026-11-17', cat: 'kesehatan', desc: 'Dokter gigi Sari', amount: 285000 },
  { id: 't25', date: '2026-11-18', cat: 'belanja', desc: 'Pasar Minggu — belanja mingguan', amount: 241250 },
  { id: 't26', date: '2026-11-19', cat: 'transport', desc: 'Bensin mobil', amount: 185000 },
  { id: 't27', date: '2026-11-20', cat: 'tagihan', desc: 'Listrik PLN', amount: 486200 },
  { id: 't28', date: '2026-11-20', cat: 'tagihan', desc: 'Air PDAM', amount: 212500 },
  { id: 't29', date: '2026-11-21', cat: 'belanja', desc: 'Supermarket — kebutuhan dapur', amount: 198900 },
  { id: 't30', date: '2026-11-21', cat: 'hiburan', desc: 'Bioskop sekeluarga', amount: 186000 },
  { id: 't31', date: '2026-11-22', cat: 'makan', desc: 'Sate ayam', amount: 96500 },
  { id: 't32', date: '2026-11-23', cat: 'transport', desc: 'Parkir & tol', amount: 64000 },
  { id: 't33', date: '2026-11-24', cat: 'belanja', desc: 'Pasar Minggu — belanja mingguan', amount: 176800 },
  { id: 't34', date: '2026-11-25', cat: 'makan', desc: 'Nasi padang', amount: 112000 },
  { id: 't35', date: '2026-11-26', cat: 'transport', desc: 'Bensin motor', amount: 50000 },
];

export const GOALS = [
  { id: 'g1', name: 'Dana Darurat', note: '6× pengeluaran bulanan', target: 15000000, saved: 9250000, due: 'Juni 2027' },
  { id: 'g2', name: 'DP Rumah', note: 'Rumah di pinggir kota', target: 50000000, saved: 21400000, due: 'Des 2027' },
  { id: 'g3', name: 'Liburan Keluarga', note: 'Bali, libur sekolah', target: 8000000, saved: 4600000, due: 'Juni 2027' },
  { id: 'g4', name: 'Laptop Dimas', note: 'Belajar & tugas sekolah', target: 6500000, saved: 2150000, due: 'Mar 2027' },
];

export const BILLS = [
  { id: 'b1', name: 'Listrik PLN', amount: 486200, due: '20 Nov 2026', status: 'Lunas' },
  { id: 'b2', name: 'Air PDAM', amount: 212500, due: '20 Nov 2026', status: 'Lunas' },
  { id: 'b3', name: 'Internet rumah', amount: 350000, due: '15 Nov 2026', status: 'Lunas' },
  { id: 'b4', name: 'BPJS Kesehatan', amount: 350000, due: '10 Nov 2026', status: 'Lunas' },
  { id: 'b5', name: 'Langganan streaming', amount: 54000, due: '28 Nov 2026', status: 'Mendatang' },
  { id: 'b6', name: 'Iuran RT', amount: 50000, due: '30 Nov 2026', status: 'Mendatang' },
  { id: 'b7', name: 'SPP sekolah Dimas', amount: 950000, due: '1 Des 2026', status: 'Mendatang' },
  { id: 'b8', name: 'Cicilan motor', amount: 1150000, due: '5 Des 2026', status: 'Mendatang' },
];

export const HISTORY = [
  { month: 'Jun', income: 12900000, expense: 9124000 },
  { month: 'Jul', income: 13200000, expense: 9586000 },
  { month: 'Agu', income: 13700000, expense: 10214000 },
  { month: 'Sep', income: 13700000, expense: 9438000 },
  { month: 'Okt', income: 13700000, expense: 9812000 },
  { month: 'Nov', income: 13700000, expense: 7446200 },
];

export const SAVINGS_TARGET = 3000000;

const KEY = 'pundikita-v1';

export function defaultState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    goals: GOALS.map((g) => ({ ...g })),
    bills: BILLS.map((b) => ({ ...b })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh atau diblokir: situs tetap jalan dari memori.
  }
}

export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Abaikan: state default dipakai lagi saat muat ulang.
  }
  return defaultState();
}

// ---- Hitungan: semua berasal dari transaksi di atas ----
export function totalIncome() {
  return INCOME.reduce((s, i) => s + i.amount, 0);
}

export function totalExpense(state) {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function spentByCategory(state) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (out[t.cat] !== undefined) out[t.cat] += t.amount;
  }
  return out;
}

export function totalBudget() {
  return CATEGORIES.reduce((s, c) => s + c.budget, 0);
}

export function goalTotals(state) {
  return {
    saved: state.goals.reduce((s, g) => s + g.saved, 0),
    target: state.goals.reduce((s, g) => s + g.target, 0),
  };
}
