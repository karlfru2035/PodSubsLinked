const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(800);
  const ids = await p.evaluate(() => Object.keys(META).filter((k) => /^(gs|tw|ja|nw)-/.test(k)).concat(['landing-page']));
  const bad = [];
  for (const id of ids) { await p.evaluate((id) => { location.hash = '#/' + id; }, id); await p.waitForTimeout(120);
    const o = await p.evaluate(() => { const w = innerWidth; const off = [...document.querySelectorAll('#app *')].filter((e) => { const r = e.getBoundingClientRect(); if (r.width === 0) return false; let n = e.parentElement; while (n && n.id !== 'app') { const ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false; n = n.parentElement; } return r.right > w + 2; }); return { over: document.documentElement.scrollWidth - w, n: off.length, first: off[0] ? off[0].className.toString().slice(0, 40) + ' ' + off[0].tagName : '' }; });
    if (o.over > 1 || o.n) bad.push(id + ' ' + JSON.stringify(o)); }
  console.log('phone screens', ids.length, 'overflowing', bad.length, 'errors', errs.length); console.log(bad.join('\n'));
  await b.close(); process.exit(bad.length || errs.length ? 1 : 0); })();
