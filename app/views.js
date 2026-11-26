// PundiKita — halaman-halaman situs. Setiap halaman dirender dari state yang
// sama (data.js), jadi angka di mana-mana cocok. Navigasi lewat hash route:
// #/ (Beranda), #/transaksi, #/anggaran, #/tujuan, #/tagihan, #/laporan,
// #/kalkulator — semuanya tautan <a> biasa.

import {
  CATEGORIES, FAMILY, HISTORY, INCOME, SAVINGS_TARGET,
  totalIncome, totalExpense, spentByCategory, totalBudget, goalTotals,
} from './data.js';
import { fmtRp, fmtShort, fmtDate, monthlyBars, categoryDonut, budgetBar, esc } from './charts.js';

function catById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

function kpi(label, value, sub, tone) {
  return `<div class="kpi${tone ? ' ' + tone : ''}"><span class="kpi-label">${label}</span><strong class="kpi-value">${value}</strong><span class="kpi-sub">${sub}</span></div>`;
}

function txRow(t, withActions) {
  const c = catById(t.cat);
  const actions = withActions
    ? `<td class="row-actions"><button type="button" data-edit="${t.id}">Ubah</button> <button type="button" data-del="${t.id}" class="danger">Hapus</button></td>`
    : '';
  return `<tr><td>${fmtDate(t.date)}</td><td>${esc(t.desc)}</td><td><span class="chip" style="--chip:${c.color}">${c.icon} ${esc(c.name)}</span></td><td class="num">${fmtRp(t.amount)}</td>${actions}</tr>`;
}

export function viewHome(state) {
  const income = totalIncome();
  const expense = totalExpense(state);
  const left = income - expense;
  const spent = spentByCategory(state);
  const budget = totalBudget();
  const goals = goalTotals(state);
  const top = [...CATEGORIES].sort((a, b) => (spent[b.id] || 0) - (spent[a.id] || 0)).slice(0, 3);
  const recent = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const savePct = Math.round((SAVINGS_TARGET / income) * 100);
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Anggaran ${esc(FAMILY.month)} · ${esc(FAMILY.city)} · per ${esc(FAMILY.asOf)}</p>
      <h1>Uang keluarga terkendali, tanpa spreadsheet.</h1>
      <p class="lede">${esc(FAMILY.name)} — ${esc(FAMILY.members)}. Pemasukan ${fmtRp(income)}, sudah dibelanjakan ${fmtRp(expense)}, sisa ${fmtRp(left)} untuk 4 hari terakhir bulan ini.</p>
      <p class="hero-cta"><a class="btn primary" href="#/transaksi">+ Catat pengeluaran</a> <a class="btn" href="#/anggaran">Lihat anggaran</a></p>
    </div>
    <div class="hero-card">
      <p class="card-label">Sisa bulan ini</p>
      <strong class="big-num">${fmtRp(left)}</strong>
      <p class="card-sub">${Math.round((left / income) * 100)}% pemasukan belum terpakai · target tabungan ${fmtRp(SAVINGS_TARGET)} (${savePct}%)</p>
      ${budgetBar(expense, budget + SAVINGS_TARGET)}
      <p class="card-sub">Terpakai ${fmtRp(expense)} dari rencana ${fmtRp(budget + SAVINGS_TARGET)} (belanja + tabungan)</p>
    </div>
  </section>

  <section class="kpis" aria-label="Ringkasan bulan ini">
    ${kpi('Pemasukan', fmtRp(income), 'Gaji Budi + gaji Sari + freelance', 'good')}
    ${kpi('Pengeluaran', fmtRp(expense), state.transactions.length + ' transaksi · 1–26 Nov 2026', 'warn')}
    ${kpi('Sisa', fmtRp(left), 'Siap ditabung & dana darurat', 'good')}
    ${kpi('Tujuan tabungan', fmtShort(goals.saved), 'dari target ' + fmtShort(goals.target) + ' · ' + Math.round((goals.saved / goals.target) * 100) + '%', '')}
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Pemasukan vs pengeluaran</h2>
      <p class="muted">Enam bulan terakhir. November masih berjalan sampai 26 Nov — pengeluarannya paling rendah karena tagihan besar sudah lunas di awal bulan.</p>
      ${monthlyBars(HISTORY)}
      <p class="legend"><span class="dot" style="background:#2e7d4f"></span> Pemasukan &nbsp; <span class="dot" style="background:#c2703d"></span> Pengeluaran</p>
    </article>
    <article class="card">
      <h2>Ke mana uang pergi?</h2>
      <p class="muted">Porsi pengeluaran November per kategori.</p>
      ${categoryDonut(CATEGORIES, spent, income)}
      <ul class="top-cats">${top.map((c) => `<li><span class="dot" style="background:${c.color}"></span>${esc(c.name)} <strong>${fmtRp(spent[c.id] || 0)}</strong></li>`).join('')}</ul>
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Anggaran yang hampir habis</h2>
      ${[...CATEGORIES].sort((a, b) => (spent[b.id] / b.budget) - (spent[a.id] / a.budget)).slice(0, 3).map((c) => {
        const s = spent[c.id] || 0;
        const pct = Math.round((s / c.budget) * 100);
        return `<div class="budget-line"><div class="budget-head"><span>${c.icon} ${esc(c.name)}</span><span>${fmtRp(s)} / ${fmtRp(c.budget)} · ${pct}%</span></div>${budgetBar(s, c.budget)}</div>`;
      }).join('')}
      <p><a href="#/anggaran">Semua 8 kategori anggaran →</a></p>
    </article>
    <article class="card">
      <h2>Transaksi terakhir</h2>
      <div class="table-wrap"><table class="tx"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>
      <tbody>${recent.map((t) => txRow(t, false)).join('')}</tbody></table></div>
      <p><a href="#/transaksi">Semua ${state.transactions.length} transaksi →</a></p>
    </article>
  </section>

  <section class="grid-3">
    <article class="card"><h2>🎯 Tujuan</h2><p class="muted">Dana darurat sudah ${fmtRp(9250000)} dari ${fmtRp(15000000)} — 62%. DP rumah 43%.</p><p><a href="#/tujuan">Lihat 4 tujuan →</a></p></article>
    <article class="card"><h2>🧾 Tagihan</h2><p class="muted">4 tagihan November lunas (${fmtRp(1398700)}). 4 tagihan mendatang total ${fmtRp(2204000)}.</p><p><a href="#/tagihan">Jadwal tagihan →</a></p></article>
    <article class="card"><h2>🧮 Kalkulator 50/30/20</h2><p class="muted">Dari gaji ${fmtRp(income)}: kebutuhan ${fmtRp(6850000)}, keinginan ${fmtRp(4110000)}, tabungan ${fmtRp(2740000)}.</p><p><a href="#/kalkulator">Hitung gajimu →</a></p></article>
  </section>`;
}

export function viewTransactions(state) {
  const spent = spentByCategory(state);
  const total = totalExpense(state);
  const rows = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || a.desc.localeCompare(b.desc));
  return `
  <section class="page-head">
    <div><p class="eyebrow">${state.transactions.length} transaksi · 1–26 November 2026</p>
    <h1>Transaksi</h1>
    <p class="lede">Semua pengeluaran keluarga bulan ini. Tambah, ubah, atau hapus — total di semua halaman ikut berubah karena datanya satu.</p></div>
    <div class="hero-card"><p class="card-label">Total pengeluaran</p><strong class="big-num">${fmtRp(total)}</strong><p class="card-sub">Rata-rata ${fmtRp(Math.round(total / 26))} per hari · kategori terbesar: Belanja Harian ${fmtRp(spent.belanja)}</p></div>
  </section>

  <section class="card">
    <h2>+ Catat pengeluaran baru</h2>
    <form id="add-form" class="form-grid">
      <label>Tanggal <input type="date" name="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
      <label>Keterangan <input type="text" name="desc" placeholder="cth. Pasar Minggu — sayur" maxlength="80" required></label>
      <label>Kategori <select name="cat">${CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${esc(c.name)}</option>`).join('')}</select></label>
      <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="500" placeholder="150000" required></label>
      <div class="form-actions"><button class="btn primary" type="submit">Simpan transaksi</button> <button class="btn" type="button" id="reset-data">Kembalikan data awal</button></div>
    </form>
    <p class="muted" id="form-msg" role="status"></p>
  </section>

  <section class="card">
    <div class="filter-row">
      <label>Cari <input type="search" id="tx-search" placeholder="cth. pasar, bensin, SPP"></label>
      <label>Kategori <select id="tx-cat"><option value="">Semua kategori</option>${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <button class="btn" type="button" id="dl-csv">Unduh CSV</button>
    </div>
    <div class="table-wrap"><table class="tx" id="tx-table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th>Aksi</th></tr></thead>
    <tbody>${rows.map((t) => txRow(t, true)).join('')}</tbody></table></div>
    <p class="muted" id="tx-count">${rows.length} transaksi ditampilkan · total ${fmtRp(total)}</p>
  </section>`;
}

export function viewBudget(state) {
  const spent = spentByCategory(state);
  const budget = totalBudget();
  const total = totalExpense(state);
  return `
  <section class="page-head">
    <div><p class="eyebrow">November 2026 · 8 kategori</p>
    <h1>Anggaran</h1>
    <p class="lede">Setiap rupiah punya amplopnya. Bila satu kategori melewati 85%, bilahnya berubah warna — Tagihan sudah 96% karena listrik dan air jatuh tempo bersamaan.</p></div>
    <div class="hero-card"><p class="card-label">Terpakai dari anggaran belanja</p><strong class="big-num">${fmtRp(total)}</strong><p class="card-sub">dari ${fmtRp(budget)} · ${Math.round((total / budget) * 100)}% · sisa anggaran ${fmtRp(budget - total)}</p></div>
  </section>
  <section class="budget-grid">
    ${CATEGORIES.map((c) => {
      const s = spent[c.id] || 0;
      const pct = Math.round((s / c.budget) * 100);
      const left = c.budget - s;
      const status = s > c.budget ? 'Lewat anggaran' : pct >= 85 ? 'Hampir habis' : pct >= 50 ? 'Separuh jalan' : 'Aman';
      return `<article class="card budget-card"><h2>${c.icon} ${esc(c.name)}</h2>
        <p class="budget-nums"><strong>${fmtRp(s)}</strong> <span class="muted">dari ${fmtRp(c.budget)}</span></p>
        ${budgetBar(s, c.budget)}
        <p class="budget-status"><strong>${pct}%</strong> · ${status} · sisa ${fmtRp(Math.max(0, left))}</p>
        <p class="muted">Anggaran bulanan ${fmtShort(c.budget)} — ${pct < 85 ? 'masih cukup sampai akhir bulan.' : 'hemat di sisa 4 hari.'}</p></article>`;
    }).join('')}
  </section>
  <section class="card">
    <h2>Aturan amplop keluarga</h2>
    <ul class="rules-list">
      <li><strong>Belanja harian</strong> dibayar tunai tiap Minggu pagi di Pasar Minggu — struk disimpan di laci dapur.</li>
      <li><strong>Tagihan</strong> dibayar tanggal 10–20 lewat autodebet; listrik dan air tidak pernah telat sejak Maret 2026.</li>
      <li><strong>Makan di luar</strong> maksimal 2× seminggu; pizza malam minggu adalah tradisi yang tidak diganggu.</li>
      <li>Bila satu amplop habis, ambil dari amplop <strong>Hiburan</strong> dulu — jangan sentuh amplop Tabungan.</li>
    </ul>
  </section>`;
}

export function viewGoals(state) {
  const goals = goalTotals(state);
  return `
  <section class="page-head">
    <div><p class="eyebrow">4 tujuan · jatuh tempo 2027</p>
    <h1>Tujuan Tabungan</h1>
    <p class="lede">Setiap gajian, ${fmtRp(SAVINGS_TARGET)} langsung dipindah ke rekening terpisah sebelum dibelanjakan. Tekan “+ Tambah” untuk mencatat setoran — progres di Beranda ikut naik.</p></div>
    <div class="hero-card"><p class="card-label">Total terkumpul</p><strong class="big-num">${fmtRp(goals.saved)}</strong><p class="card-sub">dari target ${fmtRp(goals.target)} · ${Math.round((goals.saved / goals.target) * 100)}% · kurang ${fmtRp(goals.target - goals.saved)}</p></div>
  </section>
  <section class="goals-grid">
    ${state.goals.map((g) => {
      const pct = Math.round((g.saved / g.target) * 100);
      const left = g.target - g.saved;
      return `<article class="card goal-card"><h2>🎯 ${esc(g.name)}</h2>
        <p class="muted">${esc(g.note)} · target ${esc(g.due)}</p>
        <p class="budget-nums"><strong>${fmtRp(g.saved)}</strong> <span class="muted">dari ${fmtRp(g.target)}</span></p>
        ${budgetBar(g.saved, g.target)}
        <p class="budget-status"><strong>${pct}%</strong> · kurang ${fmtRp(left)}</p>
        <p class="goal-actions"><button type="button" class="btn" data-goal="${g.id}" data-amt="100000">+ Rp 100 rb</button> <button type="button" class="btn" data-goal="${g.id}" data-amt="500000">+ Rp 500 rb</button></p></article>`;
    }).join('')}
  </section>
  <section class="card">
    <h2>Kenapa dana darurat didahulukan?</h2>
    <p>Targetnya 6× pengeluaran bulanan (${fmtRp(15000000)}). Saat Budi sakit dua minggu di 2024, keluarga bertahan dari dana ini tanpa utang — sejak itu setorannya tidak pernah bolong. Setelah dana darurat penuh, setoran pindah ke DP rumah.</p>
  </section>`;
}

export function viewBills(state) {
  const paid = state.bills.filter((b) => b.status === 'Lunas');
  const upcoming = state.bills.filter((b) => b.status !== 'Lunas');
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const upSum = upcoming.reduce((s, b) => s + b.amount, 0);
  const billRow = (b) => `<tr><td>${esc(b.name)}</td><td class="num">${fmtRp(b.amount)}</td><td>${esc(b.due)}</td><td><span class="status ${b.status === 'Lunas' ? 'paid' : 'due'}">${esc(b.status)}</span></td><td>${b.status === 'Lunas' ? '✓ Dibayar' : `<button type="button" data-pay="${b.id}">Tandai lunas</button>`}</td></tr>`;
  return `
  <section class="page-head">
    <div><p class="eyebrow">November–Desember 2026</p>
    <h1>Tagihan</h1>
    <p class="lede">Tidak ada tagihan yang telat sejak Maret 2026. Yang sudah dibayar bulan ini tetap tercatat — tekan “Tandai lunas” untuk tagihan mendatang dan totalnya ikut berubah.</p></div>
    <div class="hero-card"><p class="card-label">Tagihan mendatang</p><strong class="big-num">${fmtRp(upSum)}</strong><p class="card-sub">4 tagihan · sudah lunas bulan ini ${fmtRp(paidSum)}</p></div>
  </section>
  <section class="card">
    <h2>Sudah lunas — November 2026</h2>
    <div class="table-wrap"><table class="tx"><thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th></th></tr></thead><tbody>${paid.map(billRow).join('')}</tbody></table></div>
  </section>
  <section class="card">
    <h2>Mendatang</h2>
    <div class="table-wrap"><table class="tx"><thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th></th></tr></thead><tbody>${upcoming.map(billRow).join('')}</tbody></table></div>
    <p class="muted">Total mendatang ${fmtRp(upSum)} — cicilan motor 5 Des adalah yang terbesar; dananya sudah disisihkan dari sisa bulan ini.</p>
  </section>`;
}

export function viewReport(state) {
  const income = totalIncome();
  const expense = totalExpense(state);
  const spent = spentByCategory(state);
  const rows = [...CATEGORIES].sort((a, b) => (spent[b.id] || 0) - (spent[a.id] || 0));
  const avgExpense = Math.round(HISTORY.slice(0, 5).reduce((s, h) => s + h.expense, 0) / 5);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Juni–November 2026</p>
    <h1>Laporan</h1>
    <p class="lede">Enam bulan keluarga ini: pemasukan stabil di ${fmtRp(13700000)} sejak Agustus, pengeluaran rata-rata ${fmtRp(avgExpense)} per bulan. November paling hemat — tagihan besar lunas lebih awal.</p></div>
    <div class="hero-card"><p class="card-label">Rata-rata sisa per bulan</p><strong class="big-num">${fmtRp(Math.round(HISTORY.reduce((s, h) => s + (h.income - h.expense), 0) / 6))}</strong><p class="card-sub">6 bulan · total ditabung ${fmtRp(HISTORY.reduce((s, h) => s + (h.income - h.expense), 0))}</p></div>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Pemasukan vs pengeluaran — 6 bulan</h2>
      ${monthlyBars(HISTORY)}
      <p class="legend"><span class="dot" style="background:#2e7d4f"></span> Pemasukan &nbsp; <span class="dot" style="background:#c2703d"></span> Pengeluaran</p>
      <div class="table-wrap"><table class="tx"><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Sisa</th></tr></thead>
      <tbody>${HISTORY.map((h) => `<tr><td>${h.month} 2026</td><td class="num">${fmtRp(h.income)}</td><td class="num">${fmtRp(h.expense)}</td><td class="num"><strong>${fmtRp(h.income - h.expense)}</strong></td></tr>`).join('')}</tbody></table></div>
    </article>
    <article class="card">
      <h2>Per kategori — November</h2>
      <div class="table-wrap"><table class="tx"><thead><tr><th>Kategori</th><th class="num">Belanja</th><th class="num">Anggaran</th><th class="num">Sisa</th></tr></thead>
      <tbody>${rows.map((c) => `<tr><td>${c.icon} ${esc(c.name)}</td><td class="num">${fmtRp(spent[c.id] || 0)}</td><td class="num">${fmtRp(c.budget)}</td><td class="num">${fmtRp(Math.max(0, c.budget - (spent[c.id] || 0)))}</td></tr>`).join('')}</tbody></table></div>
      <p class="muted">Total belanja ${fmtRp(expense)} dari pemasukan ${fmtRp(income)} — ${Math.round((expense / income) * 100)}% pemasukan terpakai, ${Math.round(((income - expense) / income) * 100)}% tersisa.</p>
      <h2>Tiga bulan paling hemat</h2>
      <ol class="rank-list">
        <li><strong>November 2026</strong> — sisa ${fmtRp(13700000 - 7446200)} (pengeluaran terendah)</li>
        <li><strong>September 2026</strong> — sisa ${fmtRp(13700000 - 9438000)}</li>
        <li><strong>Juli 2026</strong> — sisa ${fmtRp(13200000 - 9586000)}</li>
      </ol>
    </article>
  </section>`;
}

export function viewCalculator() {
  const income = totalIncome();
  return `
  <section class="page-head">
    <div><p class="eyebrow">Aturan 50/30/20 · sesuaikan dengan gajimu</p>
    <h1>Kalkulator Anggaran</h1>
    <p class="lede">Bagi pemasukan jadi tiga: 50% kebutuhan, 30% keinginan, 20% tabungan. Geser penghasilanmu dan lihat angkanya berubah — lalu bandingkan dengan kondisi nyata keluarga Wijaya bulan ini.</p></div>
  </section>
  <section class="grid-2">
    <article class="card">
      <h2>Penghasilanmu</h2>
      <label class="calc-label">Penghasilan bulanan (Rp)
        <input type="range" id="calc-income" min="3000000" max="30000000" step="100000" value="${income}">
      </label>
      <p class="calc-income-out"><strong id="calc-income-val">${fmtRp(income)}</strong> per bulan</p>
      <div class="calc-results">
        <div class="calc-row"><span class="dot" style="background:#2e7d4f"></span> <span class="calc-label-text">Kebutuhan (50%)</span> <strong id="calc-need">${fmtRp(income * 0.5)}</strong></div>
        <div class="calc-row"><span class="dot" style="background:#c2703d"></span> <span class="calc-label-text">Keinginan (30%)</span> <strong id="calc-want">${fmtRp(income * 0.3)}</strong></div>
        <div class="calc-row"><span class="dot" style="background:#3d6fb4"></span> <span class="calc-label-text">Tabungan (20%)</span> <strong id="calc-save">${fmtRp(income * 0.2)}</strong></div>
      </div>
      <p class="muted">Geser untuk gaji lain — misal ${fmtRp(8000000)} memberi tabungan ${fmtRp(1600000)} per bulan, cukup untuk dana darurat ${fmtRp(15000000)} dalam 10 bulan.</p>
    </article>
    <article class="card">
      <h2>Keluarga Wijaya bulan ini — kenyataannya</h2>
      <p class="muted">Pemasukan ${fmtRp(income)}. Kebutuhan nyata (belanja, tagihan, transport, pendidikan, kesehatan) ${fmtRp(6282200)} — 46%, di bawah jatah 50%. Keinginan (makan di luar, hiburan, pakaian) ${fmtRp(1164000)} — 8%, jauh di bawah 30%. Sisanya ${fmtRp(6253800)} — 46% — masuk tabungan dan dana darurat, lebih dari dua kali jatah 20%.</p>
      <div class="calc-results">
        <div class="calc-row">Kebutuhan nyata <strong>46% · ${fmtRp(6282200)}</strong></div>
        <div class="calc-row">Keinginan nyata <strong>8% · ${fmtRp(1164000)}</strong></div>
        <div class="calc-row">Tabungan & sisa <strong>46% · ${fmtRp(6253800)}</strong></div>
      </div>
      <p><strong>Penilaian:</strong> keluarga ini menabung lebih dari dua kali aturan 50/30/20 — karena makan di luar dijaga dan tidak ada cicilan besar selain motor.</p>
      <h2>Berapa lama dana darurat penuh?</h2>
      <p>Kurang ${fmtRp(5750000)}. Dengan setoran ${fmtRp(SAVINGS_TARGET)} per bulan: <strong>2 bulan lagi</strong> (Januari 2027).</p>
    </article>
  </section>`;
}

export const VIEWS = {
  '': viewHome,
  transaksi: viewTransactions,
  anggaran: viewBudget,
  tujuan: viewGoals,
  tagihan: viewBills,
  laporan: viewReport,
  kalkulator: viewCalculator,
};

export const NAV = [
  ['#/','Beranda'],
  ['#/transaksi','Transaksi'],
  ['#/anggaran','Anggaran'],
  ['#/tujuan','Tujuan'],
  ['#/tagihan','Tagihan'],
  ['#/laporan','Laporan'],
  ['#/kalkulator','Kalkulator'],
];
