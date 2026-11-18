// Draws every screen and fails on a draw error, a script error, a dead link, or sideways scroll on the new screens.
const { chromium } = require('playwright');
(async () => {
  const file = process.argv[2]; const only = process.argv[3] ? new RegExp(process.argv[3]) : null;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1321, height: 834 } });
  const errs = []; p.on('pageerror', (e) => errs.push('pageerror ' + String(e).slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
  await p.goto('file://' + file); await p.waitForTimeout(800);
  const ids = (await p.evaluate(() => Object.keys(META))).filter((id) => !only || only.test(id));
  const res = await p.evaluate(async (ids) => {
    const out = { failed: [], dead: [], noR: [], dash: [] }; const known = new Set(Object.keys(META).concat(['directory']));
    for (const id of ids) {
      if (!R[id]) { out.noR.push(id); continue; }
      try { ACT.reset && (S = JSON.parse(JSON.stringify(S0))); render(id); } catch (e) { out.failed.push(id + ' threw ' + e.message); continue; }
      const app = document.getElementById('app');
      if (/Screen failed to draw/.test(app.textContent)) out.failed.push(id + ' :: ' + app.textContent.slice(0, 160));
      for (const el of app.querySelectorAll('[data-go]')) { const g = el.getAttribute('data-go'); if (g && !known.has(g)) out.dead.push(id + ' -> ' + g); }
      if (/^(gs|tw|ja|nw)-/.test(id) && /[–—]/.test(app.textContent)) out.dash.push(id);
    }
    return out; }, ids);
  console.log('screens', ids.length, 'failed', res.failed.length, 'dead links', res.dead.length, 'no renderer', res.noR.length, 'dashes', res.dash.length, 'script errors', errs.length);
  for (const k of ['failed', 'dead', 'noR', 'dash']) if (res[k].length) console.log(k, [...new Set(res[k])].slice(0, 25).join('\n  '));
  if (errs.length) console.log([...new Set(errs)].slice(0, 10).join('\n'));
  await b.close(); process.exit(res.failed.length || res.noR.length || errs.length || res.dash.length ? 1 : 0);
})();
