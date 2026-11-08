// Downloads the U.S. Department of Education's IPEDS data (National Center for Education Statistics) and writes the
// college and university directory used by the College & Career Finder: src/data/colleges.json.
// Usage: node scripts/fetch-colleges.mjs [year]      (default 2024: the 2024-25 directory and 2023-24 completions)
//
// Files (public, no key needed), from https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx:
//   HD<year>      Institutional characteristics: name, city, state, ZIP, website, public or private, 2- or 4-year
//   IC<year>      Educational offerings: whether the school offers programs entirely by distance education (online)
//   C<year>_A     Completions: every program (CIP code) and award level the school reported awarding
//   CIPCode2020   Program titles for the CIP codes
//
// Kept: institutions active in the current year, degree-granting and eligible for federal student aid (Title IV), in
// U.S. states, DC and U.S. territories. Nothing is edited or estimated: corrections go in
// src/data/finder/colleges-custom.json (managed from the finder admin page), which the build lays over this file.
import fs from 'node:fs';
import zlib from 'node:zlib';

const YEAR = Number(process.argv[2] || 2024);
const OUT = new URL('../src/data/colleges.json', import.meta.url);
const BASE = 'https://nces.ed.gov/ipeds/datacenter/data/';
const UA = { 'User-Agent': 'Career Education Institute college directory sync' };

// Reads the single CSV inside an IPEDS zip (a minimal zip reader: central directory, then deflate).
function unzipFirst(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Not a zip file');
  let p = buf.readUInt32LE(eocd + 16);
  const n = buf.readUInt16LE(eocd + 10);
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20), nameLen = buf.readUInt16LE(p + 28), extra = buf.readUInt16LE(p + 30), comment = buf.readUInt16LE(p + 32), local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extra + comment;
    if (!/\.csv$/i.test(name) || /_rv\.csv$/i.test(name)) continue; // skip revised-data companions
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const data = buf.subarray(start, start + size);
    return (method === 8 ? zlib.inflateRawSync(data) : data).toString('utf8').replace(/^﻿/, '');
  }
  throw new Error('No CSV in zip');
}

// CSV with quoted fields (IPEDS quotes text, leaves numbers bare)
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  const keys = head.map((h) => h.trim().toUpperCase());
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

async function get(url) {
  for (let tries = 1; ; tries++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(120000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (tries >= 4) throw new Error(`${url}: ${e.message}`);
      await new Promise((res) => setTimeout(res, 2000 * 2 ** tries));
    }
  }
}
const table = async (file) => { console.log(`Downloading ${file}…`); return parseCsv(unzipFirst(await get(`${BASE}${file}.zip`))); };

const hd = await table(`HD${YEAR}`);
const ic = Object.fromEntries((await table(`IC${YEAR}`)).map((r) => [r.UNITID, r]));
const comp = await table(`C${YEAR}_A`);
console.log('Downloading CIP titles…');
const cipRows = parseCsv((await get('https://nces.ed.gov/ipeds/cipcode/Files/CIPCode2020.csv')).toString('utf8').replace(/^﻿/, ''));

// Freely associated states (FM, MH, PW) report to IPEDS but are not U.S. jurisdictions.
const NOT_US = new Set(['FM', 'MH', 'PW']);
const keep = hd.filter((r) => r.CYACTIVE === '1' && r.DEGGRANT === '1' && r.PSET4FLG === '1' && !NOT_US.has(r.STABBR));
const ids = new Set(keep.map((r) => r.UNITID));

const url = (u) => {
  u = (u || '').trim();
  if (!u || u === '-2' || u === '.') return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { return new URL(u).href; } catch { return ''; }
};
const yes = (v) => v === '1';

// Award levels, simplified: C certificate, A associate, B bachelor, M master, D doctoral
const LEVEL = { 1: 'C', 2: 'C', 4: 'C', 6: 'C', 8: 'C', 20: 'C', 21: 'C', 3: 'A', 5: 'B', 7: 'M', 17: 'D', 18: 'D', 19: 'D' };
const programs = {};
for (const r of comp) {
  if (!ids.has(r.UNITID) || r.MAJORNUM !== '1' || !(Number(r.CTOTALT) > 0)) continue;
  const cip = r.CIPCODE.replace(/^="?|"$/g, '');
  if (!/^\d\d\.\d{4}$/.test(cip) || cip.startsWith('99')) continue; // 99 = institution total
  const lv = LEVEL[r.AWLEVEL];
  if (!lv) continue;
  const p = (programs[r.UNITID] ||= {});
  p[cip] = (p[cip] || '') + (p[cip]?.includes(lv) ? '' : lv);
}
const ORDER = 'CABMD';
const sortLv = (s) => [...s].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join('');

const used = new Set();
const institutions = keep.map((r) => {
  const i = ic[r.UNITID] || {};
  const prog = Object.entries(programs[r.UNITID] || {}).sort().map(([cip, lv]) => { used.add(cip); return `${cip}:${sortLv(lv)}`; });
  return {
    id: Number(r.UNITID),
    name: r.INSTNM,
    alias: r.IALIAS && r.IALIAS !== '-2' && r.IALIAS.length < 80 ? r.IALIAS : undefined,
    city: r.CITY,
    state: r.STABBR,
    zip: r.ZIP.slice(0, 5),
    web: url(r.WEBADDR),
    admissions: url(r.ADMINURL) || undefined,
    netPrice: url(r.NPRICURL) || undefined,
    control: Number(r.CONTROL), // 1 public, 2 private nonprofit, 3 private for-profit
    level: Number(r.ICLEVEL), // 1 four-year or above, 2 two-year
    ug: yes(r.UGOFFER) ? 1 : 0,
    grad: yes(r.GROFFER) ? 1 : 0,
    // Online: the school reported offering whole programs by distance education (IPEDS IC: DISTPGS, DSTNUGP, DSTNGP)
    online: yes(i.DISTPGS) ? 1 : 0,
    onlineUg: yes(i.DSTNUGP) ? 1 : 0,
    onlineGrad: yes(i.DSTNGP) ? 1 : 0,
    hbcu: yes(r.HBCU) ? 1 : undefined,
    tribal: yes(r.TRIBAL) ? 1 : undefined,
    lat: Number(Number(r.LATITUDE).toFixed(3)),
    lon: Number(Number(r.LONGITUD).toFixed(3)),
    programs: prog.join(',')
  };
}).sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));

// Titles for the CIP codes in use (CIP 2020); also 2- and 4-digit family titles for grouping
const clean = (s) => s.replace(/^="?|"$/g, '');
const cip = {};
for (const r of cipRows) {
  const code = clean(r.CIPCODE);
  const fam = code.length === 2;
  if (fam || code.length === 5 || used.has(code)) cip[code] = r.CIPTITLE.replace(/\.$/, '').replace(/\s+/g, ' ').trim();
}
for (const k of Object.keys(cip)) if (k.length === 2) cip[k] = cip[k].charAt(0) + cip[k].slice(1).toLowerCase().replace(/\b(u\.s|k-12)\b/g, (m) => m.toUpperCase());

const out = {
  meta: {
    source: 'U.S. Department of Education, National Center for Education Statistics, Integrated Postsecondary Education Data System (IPEDS)',
    sourceUrl: 'https://nces.ed.gov/ipeds/',
    directory: `IPEDS ${YEAR}-${String(YEAR + 1).slice(2)} institutional characteristics (HD${YEAR}, IC${YEAR})`,
    completions: `IPEDS completions, awards conferred July ${YEAR - 1} to June ${YEAR} (C${YEAR}_A)`,
    year: YEAR,
    fetched: new Date().toISOString().slice(0, 10),
    filter: 'Active, degree-granting institutions eligible for federal student aid (Title IV) in U.S. states, DC and territories',
    count: institutions.length
  },
  cip,
  institutions
};
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote ${institutions.length} institutions, ${used.size} program codes (${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB) to src/data/colleges.json`);
