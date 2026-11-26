// PundiKita — grafik SVG yang digambar tangan dari data.js sendiri.
// Tanpa library, tanpa request jaringan: semua titik dihitung di sini.

export function fmtRp(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function fmtShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1).replace('.', ',') + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return fmtRp(n);
}

export function fmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return d + ' ' + names[m - 1];
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Grafik batang: pemasukan vs pengeluaran per bulan (Jun–Nov 2026).
export function monthlyBars(history) {
  const W = 640;
  const H = 260;
  const padL = 64;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...history.map((h) => Math.max(h.income, h.expense))) * 1.08;
  const plotW = W - padL - 12;
  const plotH = H - padT - padB;
  const groupW = plotW / history.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  let bars = '';
  let labels = '';
  history.forEach((h, i) => {
    const x0 = padL + i * groupW + (groupW - barW * 2 - 6) / 2;
    const hi = (h.income / max) * plotH;
    const he = (h.expense / max) * plotH;
    bars += `<rect x="${x0.toFixed(1)}" y="${(padT + plotH - hi).toFixed(1)}" width="${barW}" height="${hi.toFixed(1)}" rx="3" fill="#2e7d4f"><title>Pemasukan ${h.month}: ${fmtRp(h.income)}</title></rect>`;
    bars += `<rect x="${(x0 + barW + 6).toFixed(1)}" y="${(padT + plotH - he).toFixed(1)}" width="${barW}" height="${he.toFixed(1)}" rx="3" fill="#c2703d"><title>Pengeluaran ${h.month}: ${fmtRp(h.expense)}</title></rect>`;
    labels += `<text x="${(padL + i * groupW + groupW / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="12" fill="#5b6470">${h.month}</text>`;
  });
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - 12}" y2="${y.toFixed(1)}" stroke="#e3e0d8" stroke-width="1"/><text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#8a919c">${(max * f / 1000000).toFixed(1).replace('.', ',')} jt</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang pemasukan dan pengeluaran Juni sampai November 2026" style="width:100%;height:auto;display:block">${grid}<line x1="${padL}" y1="${padT + plotH}" x2="${W - 12}" y2="${padT + plotH}" stroke="#c9c4b8" stroke-width="1"/>${bars}${labels}</svg>`;
}

// Donat: porsi pengeluaran per kategori bulan ini.
export function categoryDonut(categories, spent, income) {
  const total = categories.reduce((s, c) => s + (spent[c.id] || 0), 0) || 1;
  const cx = 110;
  const cy = 110;
  const r = 84;
  const ir = 52;
  let a0 = -Math.PI / 2;
  let slices = '';
  for (const c of categories) {
    const v = spent[c.id] || 0;
    if (v <= 0) continue;
    const a1 = a0 + (v / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1);
    const yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0);
    const yi0 = cy + ir * Math.sin(a0);
    slices += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${ir} ${ir} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${c.color}"><title>${esc(c.name)}: ${fmtRp(v)}</title></path>`;
    a0 = a1;
  }
  const pct = income > 0 ? Math.round((total / income) * 100) : 0;
  return `<svg viewBox="0 0 220 220" role="img" aria-label="Donat pengeluaran per kategori" style="width:100%;max-width:220px;height:auto;display:block;margin:0 auto">${slices}<text x="110" y="104" text-anchor="middle" font-size="22" font-weight="700" fill="#22303c">${fmtShort(total)}</text><text x="110" y="126" text-anchor="middle" font-size="12" fill="#5b6470">total belanja</text><text x="110" y="142" text-anchor="middle" font-size="11" fill="#8a919c">${pct}% pemasukan</text></svg>`;
}

// Bilah kemajuan anggaran satu kategori (dipakai di Beranda & Anggaran).
export function budgetBar(spent, budget) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = spent > budget;
  const color = over ? '#b3372f' : pct >= 85 ? '#c2703d' : '#2e7d4f';
  return `<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${pct} persen anggaran terpakai"><span style="width:${pct}%;background:${color}"></span></div>`;
}

export { esc };
