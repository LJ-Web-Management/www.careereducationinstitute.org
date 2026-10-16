// Generates the logo files, favicons, app icons and social-share (Open Graph) images with sharp,
// starting from the brand mark in src/brand/mp-mark.png (transparent PNG).
// If sharp is unavailable the build still succeeds without images.
import fs from 'node:fs';
import path from 'node:path';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, max) => {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
};

export const LOGO = { w: 68, h: 40 }; // header display size (CSS pixels)

export function ogSvg({ title, kicker, footer, markB64, markW, markH }) {
  const lines = wrap(title, title.length > 34 ? 22 : 18).slice(0, 3);
  const size = lines.length > 2 ? 76 : 88;
  const grid = Array.from({ length: 28 }, (_, i) => `<path d="M${i * 46} 0V630" stroke="#ffffff" stroke-opacity=".05"/>`).join('') + Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 46}H1200" stroke="#ffffff" stroke-opacity=".05"/>`).join('');
  const bh = 92, bw = Math.round((markW / markH) * 60) + 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0a2a66"/>${grid}<rect x="0" y="600" width="1200" height="30" fill="#f2b134"/><rect x="70" y="58" width="${bw}" height="${bh}" rx="18" fill="#ffffff"/><image x="90" y="74" width="${bw - 40}" height="60" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${markB64}"/><text x="${90 + bw}" y="108" font-family="Georgia, 'DejaVu Serif', serif" font-size="40" font-weight="700" fill="#ffffff"><tspan font-style="italic" font-weight="400">Mr</tspan>Press</text><text x="${92 + bw}" y="138" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="17" font-weight="700" letter-spacing="6" fill="#f2b134">EDUCATION</text><text x="70" y="250" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#7cc8ff">${esc(kicker.toUpperCase())}</text>${lines.map((l, i) => `<text x="68" y="${330 + i * (size + 8)}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join('')}<text x="70" y="568" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="26" fill="#c9d5ec">${esc(footer)}</text></svg>`;
}

function ico(png32) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16); entry.writeUInt8(32, 0); entry.writeUInt8(32, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6); entry.writeUInt32LE(png32.length, 8); entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png32]);
}

export async function writeImages({ DIST, ROOT, careers, categories, posts }) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { console.warn('! sharp not installed — skipping image generation'); return; }
  const markPath = path.join(ROOT, 'src/brand/mp-mark.png');
  const og = path.join(DIST, 'og'); const icons = path.join(DIST, 'icons'); const brand = path.join(DIST, 'brand');
  [og, icons, brand].forEach((d) => fs.mkdirSync(d, { recursive: true }));
  const meta = await sharp(markPath).metadata();

  // Logo files for header/footer (2x of the display size) and a large version for structured data
  await sharp(markPath).resize({ height: LOGO.h * 2 }).webp({ quality: 90 }).toFile(path.join(brand, 'mp-logo.webp'));
  await sharp(markPath).resize({ height: LOGO.h * 2 }).png({ compressionLevel: 9 }).toFile(path.join(brand, 'mp-logo.png'));

  // Square icons: mark centered on a white tile
  const tile = async (size, frac, file, round = 0) => {
    const w = Math.round(size * frac);
    const mark = await sharp(markPath).resize({ width: w }).toBuffer();
    const mm = await sharp(mark).metadata();
    const bg = round ? Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${round}" fill="#ffffff"/></svg>`) : null;
    const base = bg ? sharp(bg) : sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } });
    return base.composite([{ input: mark, left: Math.round((size - mm.width) / 2), top: Math.round((size - mm.height) / 2) }]).png({ compressionLevel: 9 }).toFile(file);
  };
  await tile(180, 0.8, path.join(DIST, 'apple-touch-icon.png'));
  await tile(192, 0.8, path.join(icons, 'icon-192.png'), 36);
  await tile(512, 0.8, path.join(icons, 'icon-512.png'), 96);
  await tile(512, 0.6, path.join(icons, 'icon-maskable-512.png'));
  // Favicons: transparent background, mark fills the width
  const fav = async (size) => {
    const mark = await sharp(markPath).resize({ width: size, height: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    return mark;
  };
  fs.writeFileSync(path.join(DIST, 'favicon-32.png'), await fav(32));
  fs.writeFileSync(path.join(DIST, 'favicon-48.png'), await fav(48));
  fs.writeFileSync(path.join(DIST, 'favicon.ico'), ico(await fav(32)));

  // Open Graph images
  const markB64 = (await sharp(markPath).resize({ height: 120 }).png().toBuffer()).toString('base64');
  const render = (o, file) => sharp(Buffer.from(ogSvg({ ...o, markB64, markW: meta.width, markH: meta.height }))).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  const jobs = [];
  const fixed = [
    ['default', 'Find the career that fits, then train for it', 'Career training by job title', '50 careers · Free quizzes · Salary data · U.S.-focused'],
    ['training', 'Online career training by job title', 'Training catalog', 'Self-paced · Practical · Certificate of completion'],
    ['courses', 'OSHA, HAZWOPER and CDL ELDT courses', 'Safety and compliance courses', 'Buy online · Self-paced · Volume pricing'],
    ['compare', 'Compare careers side by side', 'Career comparison', 'Pay · Training time · Job growth · Daily duties'],
    ['quiz', 'Free career quizzes', 'Quizzes', 'Career Match · College vs. Trade School · Career Change'],
    ['guides', 'Career guides for every stage', 'Guides', 'Students · Career changers · Working professionals'],
    ['blog', 'The MrPress Education Blog', 'Blog', 'Career advice, industry news and training tips']
  ];
  for (const [f, title, kicker, footer] of fixed) jobs.push(render({ title, kicker, footer }, path.join(og, f + '.png')));
  for (const c of careers) jobs.push(render({ title: c.title, kicker: categories.find((x) => x.slug === c.cat).name + ' career', footer: `Median pay $${c.l.wages.median.toLocaleString('en-US')} · Training: ${c.train}` }, path.join(og, c.slug + '.png')));
  for (const cat of categories) jobs.push(render({ title: `${cat.name} careers`, kicker: 'Career category', footer: 'Pay, training time and outlook for every role' }, path.join(og, 'cat-' + cat.slug + '.png')));
  for (const p of posts) {
    if (p.cover) jobs.push(sharp(path.join(p.dir, p.cover)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(og, 'blog-' + p.slug + '.jpg')));
    else jobs.push(render({ title: p.title, kicker: 'Blog', footer: p.category }, path.join(og, 'blog-' + p.slug + '.png')));
  }
  await Promise.all(jobs);
}
