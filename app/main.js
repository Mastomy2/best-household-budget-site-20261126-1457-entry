// PundiKita — router dan semua kontrol. Hash route memilih halaman dari
// views.js; setiap aksi (tambah, ubah, hapus, setor tujuan, lunas tagihan)
// menulis ke localStorage lalu me-render ulang, jadi semua halaman cocok.

import { CATEGORIES, loadState, saveState, resetState, totalExpense } from './data.js';
import { VIEWS, NAV } from './views.js';
import { fmtRp } from './charts.js';

let state = loadState();
const app = document.getElementById('app');
const navEl = document.getElementById('nav');

function route() {
  return (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
}

function render() {
  const r = route();
  const view = VIEWS[r] || VIEWS[''];
  navEl.innerHTML = NAV.map(([href, label]) => {
    const active = ('#/' + r) === href || (r === '' && href === '#/');
    return `<a href="${href}"${active ? ' aria-current="page" class="active"' : ''}>${label}</a>`;
  }).join('');
  app.innerHTML = view(state);
  document.title = 'PundiKita — ' + (NAV.find(([h]) => h === '#/' + r)?.[1] || 'Beranda') + ' | Anggaran Keluarga Wijaya';
  wire(r);
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

function downloadCsv() {
  const head = 'tanggal,keterangan,kategori,jumlah_rp\n';
  const rows = [...state.transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => {
      const cat = CATEGORIES.find((c) => c.id === t.cat)?.name || t.cat;
      return `${t.date},"${t.desc.replace(/"/g, '""')}",${cat},${t.amount}`;
    });
  const blob = new Blob([head + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pundikita-transaksi-nov-2026.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function wire(r) {
  // Tambah transaksi.
  const form = document.getElementById('add-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const amount = Number(fd.get('amount'));
      const desc = String(fd.get('desc') || '').trim();
      const date = String(fd.get('date') || '2026-11-26');
      const cat = String(fd.get('cat') || 'belanja');
      const msg = document.getElementById('form-msg');
      if (!desc || !(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        if (msg) msg.textContent = 'Isi tanggal, keterangan, dan jumlah yang benar.';
        return;
      }
      state.transactions.push({ id: 't' + Date.now().toString(36), date, cat, desc, amount: Math.round(amount) });
      state.transactions.sort((a, b) => a.date.localeCompare(b.date));
      rerender();
      const after = document.getElementById('form-msg');
      if (after) after.textContent = 'Tersimpan: ' + desc + ' — ' + fmtRp(amount) + '. Total bulan ini sekarang ' + fmtRp(totalExpense(state)) + '.';
    });
    const resetBtn = document.getElementById('reset-data');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      state = resetState();
      rerender();
    });
    const dl = document.getElementById('dl-csv');
    if (dl) dl.addEventListener('click', downloadCsv);
    const search = document.getElementById('tx-search');
    const catSel = document.getElementById('tx-cat');
    const applyFilter = () => {
      const q = (search?.value || '').toLowerCase();
      const cat = catSel?.value || '';
      let shown = 0;
      let sum = 0;
      document.querySelectorAll('#tx-table tbody tr').forEach((tr) => {
        const text = tr.textContent.toLowerCase();
        const ok = (!q || text.includes(q)) && (!cat || tr.querySelector('.chip')?.textContent.includes(CATEGORIES.find((c) => c.id === cat)?.name || ''));
        tr.style.display = ok ? '' : 'none';
        if (ok) {
          shown += 1;
          const amt = Number(tr.querySelector('.num')?.textContent.replace(/[^\d]/g, '') || 0);
          sum += amt;
        }
      });
      const count = document.getElementById('tx-count');
      if (count) count.textContent = shown + ' transaksi ditampilkan · total ' + fmtRp(sum);
    };
    if (search) search.addEventListener('input', applyFilter);
    if (catSel) catSel.addEventListener('change', applyFilter);
  }

  // Ubah / hapus transaksi, setor tujuan, lunas tagihan: delegasi klik
  // dipasang sekali di #app (bukan per render) agar tidak menumpuk.

  // Kalkulator 50/30/20.
  const slider = document.getElementById('calc-income');
  if (slider) {
    const update = () => {
      const v = Number(slider.value);
      const val = document.getElementById('calc-income-val');
      const need = document.getElementById('calc-need');
      const want = document.getElementById('calc-want');
      const save = document.getElementById('calc-save');
      if (val) val.textContent = fmtRp(v);
      if (need) need.textContent = fmtRp(v * 0.5);
      if (want) want.textContent = fmtRp(v * 0.3);
      if (save) save.textContent = fmtRp(v * 0.2);
    };
    slider.addEventListener('input', update);
  }
}

function onTableClick(ev) {
  const del = ev.target.closest('[data-del]');
  const edit = ev.target.closest('[data-edit]');
  if (del) {
    const id = del.getAttribute('data-del');
    state.transactions = state.transactions.filter((t) => t.id !== id);
    rerender();
    return;
  }
  if (edit) {
    const id = edit.getAttribute('data-edit');
    const t = state.transactions.find((x) => x.id === id);
    if (!t) return;
    const desc = window.prompt('Keterangan:', t.desc);
    if (desc === null) return;
    const amount = window.prompt('Jumlah (Rp):', String(t.amount));
    if (amount === null) return;
    const n = Number(String(amount).replace(/[^\d]/g, ''));
    if (desc.trim() && n > 0) {
      t.desc = desc.trim();
      t.amount = n;
      rerender();
    }
  }
}

function onGoalClick(ev) {
  const btn = ev.target.closest('[data-goal]');
  if (!btn) return;
  const goal = state.goals.find((g) => g.id === btn.getAttribute('data-goal'));
  if (!goal) return;
  const amt = Number(btn.getAttribute('data-amt') || 0);
  goal.saved = Math.min(goal.target, goal.saved + amt);
  rerender();
}

function onBillClick(ev) {
  const btn = ev.target.closest('[data-pay]');
  if (!btn) return;
  const bill = state.bills.find((b) => b.id === btn.getAttribute('data-pay'));
  if (!bill) return;
  bill.status = 'Lunas';
  rerender();
}

window.addEventListener('hashchange', render);
app.addEventListener('click', onTableClick);
app.addEventListener('click', onGoalClick);
app.addEventListener('click', onBillClick);
render();
