// Generates social-share (Open Graph) images and app icons with sharp.
// If sharp is unavailable the build still succeeds and falls back to static/og/default.png.
import fs from 'node:fs';
import path from 'node:path';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, max) => {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
};

const mark = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 48})"><rect width="48" height="48" rx="11" fill="#13294b" stroke="#ffffff" stroke-opacity=".25"/><path d="M11.5 36V17l9.5 10.5L31.5 12v24" fill="none" stroke="#fff" stroke-width="5.4" stroke-linejoin="round" stroke-linecap="square"/><rect x="35.2" y="30.6" width="5.6" height="5.6" rx="1" fill="#f2b134"/></g>`;

export function ogSvg({ title, kicker, footer }) {
  const lines = wrap(title, title.length > 34 ? 22 : 18).slice(0, 3);
  const size = lines.length > 2 ? 76 : 88;
  const grid = Array.from({ length: 28 }, (_, i) => `<path d="M${i * 46} 0V630" stroke="#ffffff" stroke-opacity=".05"/>`).join('') + Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 46}H1200" stroke="#ffffff" stroke-opacity=".05"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#13294b"/>${grid}<rect x="0" y="600" width="1200" height="30" fill="#f2b134"/>${mark(70, 64, 84)}<text x="172" y="112" font-family="Georgia, 'DejaVu Serif', serif" font-size="40" font-weight="700" fill="#ffffff"><tspan font-style="italic" font-weight="400">Mr</tspan>Press</text><text x="174" y="142" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="17" font-weight="700" letter-spacing="6" fill="#f2b134">EDUCATION</text><text x="70" y="${250}" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#7fd1c4">${esc(kicker.toUpperCase())}</text>${lines.map((l, i) => `<text x="68" y="${330 + i * (size + 8)}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join('')}<text x="70" y="568" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="26" fill="#c9d3e6">${esc(footer)}</text></svg>`;
}

function ico(png32) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16); entry.writeUInt8(32, 0); entry.writeUInt8(32, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6); entry.writeUInt32LE(png32.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png32]);
}

export async function writeImages({ DIST, careers, categories, posts }) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { console.warn('! sharp not installed — skipping image generation'); return; }
  const og = path.join(DIST, 'og'); const icons = path.join(DIST, 'icons');
  fs.mkdirSync(og, { recursive: true }); fs.mkdirSync(icons, { recursive: true });
  const render = (svg, file) => sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  const jobs = [];
  const fixed = [
    ['default', 'Find the career that fits — then train for it', 'Career training by job title', '50 careers · Free quizzes · Salary data · U.S.-focused'],
    ['training', 'Online career training by job title', 'Training catalog', 'Self-paced · Practical · Certificate of completion'],
    ['compare', 'Compare careers side by side', 'Career comparison', 'Pay · Training time · Job growth · Daily duties'],
    ['quiz', 'Free career quizzes', 'Quizzes', 'Career Match · College vs. Trade School · Career Change'],
    ['guides', 'Career guides for every stage', 'Guides', 'Students · Career changers · Working professionals'],
    ['blog', 'The MrPress Education Blog', 'Blog', 'Career advice, industry news and training tips']
  ];
  for (const [f, t, k, foot] of fixed) jobs.push(render(ogSvg({ title: t, kicker: k, footer: foot }), path.join(og, f + '.png')));
  for (const c of careers) jobs.push(render(ogSvg({ title: c.title, kicker: categories.find((x) => x.slug === c.cat).name + ' career', footer: `Median pay $${c.l.wages.median.toLocaleString('en-US')} · Training: ${c.train} · Salary · How to become` }), path.join(og, c.slug + '.png')));
  for (const cat of categories) jobs.push(render(ogSvg({ title: `${cat.name} careers`, kicker: 'Career category', footer: 'Pay, training time and outlook for every role' }), path.join(og, 'cat-' + cat.slug + '.png')));
  for (const p of posts) {
    if (p.cover) jobs.push(sharp(path.join(p.dir, p.cover)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(og, 'blog-' + p.slug + '.jpg')));
    else jobs.push(render(ogSvg({ title: p.title, kicker: 'Blog', footer: p.category }), path.join(og, 'blog-' + p.slug + '.png')));
  }
  // Icons
  const markSvg = (size, rx, pad) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48"><rect width="48" height="48" rx="${rx}" fill="#13294b"/><g transform="translate(${pad} ${pad}) scale(${(48 - pad * 2) / 48})"><path d="M11.5 36V17l9.5 10.5L31.5 12v24" fill="none" stroke="#fff" stroke-width="5.4" stroke-linejoin="round" stroke-linecap="square"/><rect x="35.2" y="30.6" width="5.6" height="5.6" rx="1" fill="#f2b134"/></g></svg>`;
  jobs.push(render(markSvg(180, 0, 3), path.join(DIST, 'apple-touch-icon.png')));
  jobs.push(render(markSvg(192, 11, 0), path.join(icons, 'icon-192.png')));
  jobs.push(render(markSvg(512, 11, 0), path.join(icons, 'icon-512.png')));
  jobs.push(render(markSvg(512, 0, 8), path.join(icons, 'icon-maskable-512.png')));
  await Promise.all(jobs);
  const png32 = await sharp(Buffer.from(markSvg(32, 11, 0))).png().toBuffer();
  fs.writeFileSync(path.join(DIST, 'favicon.ico'), ico(png32));
}
