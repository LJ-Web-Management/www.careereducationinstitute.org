// Refreshes src/data/labor.json from the U.S. Bureau of Labor Statistics public API.
// Usage: node scripts/fetch-bls.mjs [year]   (OEWS May estimates, released each spring)
// Projections/education columns come from BLS Employment Projections table 1.2 and are kept as-is.
import fs from 'node:fs';
const file = new URL('../src/data/labor.json', import.meta.url);
const labor = JSON.parse(fs.readFileSync(file, 'utf8'));
const year = process.argv[2] || String(labor.meta.oewsYear);
const types = { '11': 'p10', '12': 'p25', '13': 'median', '14': 'p75', '15': 'p90', '08': 'hourly' };
const ids = [];
for (const [slug, o] of Object.entries(labor.careers)) {
  for (const t of Object.keys(types)) ids.push({ slug, t, id: `OEUN0000000000000${o.soc.replace('-', '')}${t}` });
}
for (let i = 0; i < ids.length; i += 25) {
  const chunk = ids.slice(i, i + 25);
  const res = await fetch('https://api.bls.gov/publicAPI/v1/timeseries/data/', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seriesid: chunk.map(c => c.id), startyear: year, endyear: year })
  });
  const json = await res.json();
  if (json.status !== 'REQUEST_SUCCEEDED') { console.error(json.message); process.exit(1); }
  for (const s of json.Results.series) {
    const c = chunk.find(x => x.id === s.seriesID);
    const v = s.data?.[0]?.value;
    const n = v && v !== '-' ? Number(String(v).replace(/[^0-9.]/g, '')) : null;
    labor.careers[c.slug].wages[types[c.t]] = n;
  }
  process.stdout.write('.');
}
labor.meta.oewsYear = Number(year);
labor.meta.oewsLabel = `May ${year}`;
labor.meta.wageSource = `BLS Occupational Employment and Wage Statistics (OEWS), May ${year}`;
labor.meta.fetched = new Date().toLocaleDateString('en-CA');
fs.writeFileSync(file, JSON.stringify(labor, null, 1));
console.log('\nUpdated', Object.keys(labor.careers).length, 'careers');
