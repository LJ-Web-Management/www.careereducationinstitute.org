// Syncs partner course data (price, hours, languages, facts, syllabus, objectives, FAQs)
// from the HAZWOPER-OSHA.com catalog into src/data/partner-courses.json.
// Usage: node scripts/fetch-partner-courses.mjs
// Prices must match the LMS because checkout charges the LMS price for each course id.
import fs from 'node:fs';
import { selection } from '../src/data/partner-selection.mjs';

const BASE = 'https://hazwoper-osha.com/';
const OUT = new URL('../src/data/partner-courses.json', import.meta.url);
const UA = { 'User-Agent': 'Mozilla/5.0 (MrPress Education catalog sync)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…', reg: '®', trade: '™', copy: '©', deg: '°', frac12: '½', bull: '•', middot: '·', eacute: 'é', ntilde: 'ñ' };
const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m));
const text = (h) => decode(h.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([.,;:!?)])/g, '$1').replace(/([(])\s+/g, '$1').trim();
const firstPerson = /\b(we|we're|we've|we'll|our|ours|us)\b/i;
const keep = (s) => s && !firstPerson.test(s) && !/click here|add to cart|enroll now|buy now/i.test(s);
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z“"])/).filter(keep).join(' ');

function listAfter(h, start, stop) {
  const seg = h.slice(start, stop > start ? stop : start + 20000);
  const ul = seg.match(/<ul[^>]*>([\s\S]*?)<\/ul>/);
  return ul ? [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter(keep) : [];
}

function sectionByH2(h, re) {
  const all = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
  const i = all.findIndex((m) => re.test(text(m[1])));
  if (i < 0) return null;
  const start = all[i].index + all[i][0].length;
  const stop = all[i + 1] ? all[i + 1].index : start + 30000;
  return { start, stop, html: h.slice(start, stop) };
}

function toMarkdown(html) {
  let s = html.replace(/<a [^>]*>([\s\S]*?)<\/a>/g, '$1');
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (m, x) => `\n- ${text(x)}\n`);
  s = s.replace(/<(p|h[1-6]|div)[^>]*>([\s\S]*?)<\/\1>/g, (m, t, x) => `\n\n${text(x)}\n\n`);
  s = decode(s.replace(/<[^>]+>/g, ' '));
  const blocks = s.split(/\n{2,}/).map((b) => b.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean)).filter((b) => b.length);
  return blocks.map((b) => b.map((l) => (l.startsWith('- ') ? (keep(l) ? l : '') : sentences(l))).filter(Boolean).join('\n')).filter(Boolean).join('\n\n');
}

function parseDetail(h) {
  h = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? text(h1[1]) : '';
  const afterH1 = h1 ? h1.index + h1[0].length : 0;
  const introUl = h.slice(afterH1, afterH1 + 8000).match(/<ul[^>]*>([\s\S]*?)<\/ul>/);
  const intro = introUl ? [...introUl[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter((l) => keep(l) && !/SCORM|virtual|in-person|face-to-face|streaming|Available in|any device|on-the-go|mobile|own pace|own schedule|audio|read aloud|narration|certificate (immediately|instantly|as soon)|immediately receive|instantly|anytime, anywhere/i.test(l)) : [];
  const ceu = (h.match(/CEU:\s*<\/?[^>]*>?\s*([\d.]+)/) || h.match(/CEU:[\s\S]{0,80}?([\d.]+)/) || [])[1] || '';
  const facts = {};
  const factSec = sectionByH2(h, /^Course Facts$/i);
  if (factSec) {
    for (const m of factSec.html.matchAll(/<h5[^>]*>([\s\S]*?)<\/h5>\s*<div[^>]*>([\s\S]*?)<\/div>/g)) facts[text(m[1])] = text(m[2]);
  }
  // Overview paragraphs: between the Course Facts block and the first content h2 after it
  let overview = [];
  const ovStart = h.indexOf('id="overview"') > 0 ? h.indexOf('id="overview"') : factSec ? factSec.start : -1;
  const allH2 = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
  const nextH2 = allH2.find((m) => m.index > ovStart + 50 && !/Course Facts/i.test(text(m[1])));
  if (ovStart > 0 && nextH2) {
    overview = [...h.slice(ovStart, nextH2.index).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => sentences(text(m[1]))).filter((p) => p && p.length > 40 && !/\?$/.test(p));
  }
  const who = sectionByH2(h, /^Who (Needs|Should)/i);
  const reqs = sectionByH2(h, /Requirement/i);
  const syl = sectionByH2(h, /Syllabus/i);
  const syllabus = { intro: '', modules: [] };
  if (syl) {
    const p = syl.html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    syllabus.intro = p ? sentences(text(p[1])) : '';
    const heads = [...syl.html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/g)];
    heads.forEach((m, i) => {
      const body = syl.html.slice(m.index + m[0].length, heads[i + 1] ? heads[i + 1].index : syl.html.length);
      const d = body.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      const lessons = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((x) => text(x[1])).filter(Boolean);
      const t = text(m[1]);
      if (t) syllabus.modules.push({ title: t, desc: d ? sentences(text(d[1])) : '', lessons });
    });
  }
  const objBlock = h.match(/id="learning-objective-content"[\s\S]*?<ul[^>]*>([\s\S]*?)<\/ul>/);
  const objectives = objBlock ? [...objBlock[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter(keep) : [];
  const faqs = [];
  const faqSec = h.indexOf('id="faqAccordion"');
  if (faqSec > 0) {
    const seg = h.slice(faqSec, faqSec + 60000);
    const qs = [...seg.matchAll(/<button[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="card-body">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)];
    for (const m of qs) {
      const q = text(m[1]);
      const a = toMarkdown(m[2]);
      if (q && a && keep(q) && a.length > 30) faqs.push([q, a]);
    }
  }
  return { title, intro, ceu, facts, overview, audience: who ? listAfter(h, who.start, who.stop) : [], requirements: reqs ? listAfter(h, reqs.start, reqs.stop) : [], syllabus, objectives, faqs: faqs.slice(0, 8) };
}

// 1) Catalog listing: id, price, hours, languages, detail path
const listing = await (await fetch(BASE + 'online-courses', { headers: UA })).text();
const cat = {};
for (const m of listing.matchAll(/<[^>]*\bdata-id="(\d+)"[^>]*data-title="[^"]*"[^>]*>/g)) {
  const id = Number(m[1]);
  if (cat[id]) continue;
  const tag = m[0];
  const price = Number((tag.match(/data-price="([\d.]+)"/) || [])[1]);
  const start = Math.max(0, listing.lastIndexOf('<div class="card"', m.index));
  const end = listing.indexOf('<div class="card"', m.index + 10);
  const blk = listing.slice(start, end > 0 ? end : m.index + 8000);
  cat[id] = {
    price,
    hours: ((blk.match(/fa-clock[^>]*><\/i>\s*([^<]+)</) || [])[1] || '').trim(),
    langs: [...new Set([...blk.matchAll(/alt="(EN|ES)"/g)].map((x) => x[1]))],
    path: (blk.match(/href="(?:https:\/\/hazwoper-osha\.com\/)?(online-courses\/[^"#?]+)"/) || [])[1] || ''
  };
}

// 2) Detail pages for the selected courses
const out = [];
for (const { id, job, career = null } of selection) {
  const c = cat[id];
  if (!c || !c.path) { console.warn('! not found in catalog:', id); continue; }
  const html = await (await fetch(BASE + c.path, { headers: UA })).text();
  const d = parseDetail(html);
  const slug = c.path.split('/').pop();
  out.push({ id, slug, job, career, price: c.price, hours: c.hours, langs: c.langs, ...d, fetched: new Date().toLocaleDateString('en-CA') });
  process.stdout.write('.');
  await sleep(250);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`\nSaved ${out.length} partner courses.`);
