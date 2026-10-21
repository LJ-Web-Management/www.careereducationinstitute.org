// Generates the logo files, favicons, app icons and social-share (Open Graph) images with sharp,
// starting from the two transparent brand PNGs in src/brand/:
//   logo-full.png  book mark + "Career Education Institute" wordmark (header, footer)
//   logo-icon.png  book mark only (favicons, app icons, social-share images)
// If sharp is unavailable the build still succeeds without images.
import fs from 'node:fs';
import path from 'node:path';
import { countLabel } from '../src/lib/util.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, max) => {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
};

export const LOGO = { w: 260, h: 54 }; // header display size (CSS pixels); keep in sync with logo() in src/lib/layout.mjs

export function ogSvg({ title, kicker, footer, iconB64, iconW, iconH }) {
  const lines = wrap(title, title.length > 34 ? 22 : 18).slice(0, 3);
  const size = lines.length > 2 ? 76 : 88;
  const grid = Array.from({ length: 28 }, (_, i) => `<path d="M${i * 46} 0V630" stroke="#ffffff" stroke-opacity=".05"/>`).join('') + Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 46}H1200" stroke="#ffffff" stroke-opacity=".05"/>`).join('');
  const t = 112, iw = 92, ih = Math.round((iconH / iconW) * iw);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#022350"/>${grid}<rect x="0" y="600" width="1200" height="30" fill="#cc9628"/><rect x="70" y="52" width="${t}" height="${t}" rx="22" fill="#ffffff"/><image x="${70 + (t - iw) / 2}" y="${52 + (t - ih) / 2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${iconB64}"/><text x="206" y="106" font-family="Georgia, 'DejaVu Serif', serif" font-size="44" font-weight="700" fill="#ffffff">Career Education</text><text x="208" y="146" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="18" font-weight="700" letter-spacing="10" fill="#cc9628">INSTITUTE</text><text x="70" y="250" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="#7fd3e0">${esc(kicker.toUpperCase())}</text>${lines.map((l, i) => `<text x="68" y="${330 + i * (size + 8)}" font-family="Georgia, 'DejaVu Serif', serif" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join('')}<text x="70" y="568" font-family="Helvetica, Arial, 'DejaVu Sans', sans-serif" font-size="26" fill="#c9d5ec">${esc(footer)}</text></svg>`;
}

// favicon.ico holding PNG images: [[size, png], ...]
function ico(images) {
  const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(([size, png]) => {
    const e = Buffer.alloc(16); e.writeUInt8(size % 256, 0); e.writeUInt8(size % 256, 1);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12);
    offset += png.length; return e;
  });
  return Buffer.concat([header, ...entries, ...images.map(([, png]) => png)]);
}

export async function writeImages({ DIST, ROOT, careers, categories }) {
  let sharp;
  try { sharp = (await import('sharp')).default; } catch { console.warn('! sharp not installed: skipping image generation'); return; }
  const og = path.join(DIST, 'og'); const icons = path.join(DIST, 'icons'); const brand = path.join(DIST, 'brand');
  [og, icons, brand].forEach((d) => fs.mkdirSync(d, { recursive: true }));
  // Crop the transparent margins so sizes below refer to the artwork itself
  const full = await sharp(path.join(ROOT, 'src/brand/logo-full.png')).trim({ threshold: 10 }).png().toBuffer();
  const icon = await sharp(path.join(ROOT, 'src/brand/logo-icon.png')).trim({ threshold: 10 }).png().toBuffer();
  const iconMeta = await sharp(icon).metadata();

  // Full logo for header/footer (2x of the display height). A palette PNG is smaller than WebP for this artwork.
  await sharp(full).resize({ height: LOGO.h * 2 }).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toFile(path.join(brand, 'logo.png'));

  // Square icons: book mark centered on a white tile
  const tile = async (size, frac, round = 0) => {
    const mark = await sharp(icon).resize({ width: Math.round(size * frac) }).toBuffer();
    const mm = await sharp(mark).metadata();
    const bg = round ? Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${round}" fill="#ffffff"/></svg>`) : null;
    const base = bg ? sharp(bg) : sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } });
    return base.composite([{ input: mark, left: Math.round((size - mm.width) / 2), top: Math.round((size - mm.height) / 2) }]).png(size >= 180 ? { compressionLevel: 9, palette: true, quality: 90, effort: 10 } : { compressionLevel: 9 }).toBuffer();
  };
  fs.writeFileSync(path.join(DIST, 'apple-touch-icon.png'), await tile(180, 0.8));
  fs.writeFileSync(path.join(icons, 'icon-192.png'), await tile(192, 0.8, 36));
  fs.writeFileSync(path.join(icons, 'icon-512.png'), await tile(512, 0.8, 96));
  fs.writeFileSync(path.join(icons, 'icon-maskable-512.png'), await tile(512, 0.6));
  // Favicons (browser tabs): transparent, the mark centered between its box center and its visual center (the book
  // is heavier than the thin arc), with a white outline so it stands out on light and dark tab bars alike.
  // Drawn at 8x, then scaled down.
  const favicon = async (size, frac = 0.82, stroke = 0.075) => {
    const k = 8, S = size * k;
    const mark = await sharp(icon).resize({ width: Math.round(S * frac) }).png().toBuffer({ resolveWithObject: true });
    const { data, info } = await sharp(mark.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let sy = 0, n = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 128) { sy += y; n++; }
    const top = Math.round(((S - info.height) / 2 + (S / 2 - sy / n)) / 2), left = Math.round((S - info.width) / 2);
    const placed = await sharp({ create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: mark.data, left, top }]).png().toBuffer();
    // Outline: grow the alpha (blur, then threshold; sharp needs two passes for that order), fill enclosed holes, paint white
    const soft = await sharp(placed).extractChannel(3).blur((stroke * S) / 2).png().toBuffer();
    const grown0 = await sharp(soft).threshold(6).toColourspace('b-w').raw().toBuffer();
    const grown = Buffer.alloc(S * S, 255), seen = new Uint8Array(S * S), todo = [];
    for (let i = 0; i < S; i++) todo.push(i, (S - 1) * S + i, i * S, i * S + S - 1);
    while (todo.length) {
      const p = todo.pop(); if (seen[p] || grown0[p] > 127) continue;
      seen[p] = 1; grown[p] = 0; const x = p % S, y = (p - x) / S;
      if (x > 0) todo.push(p - 1); if (x < S - 1) todo.push(p + 1); if (y > 0) todo.push(p - S); if (y < S - 1) todo.push(p + S);
    }
    const white = await sharp({ create: { width: S, height: S, channels: 3, background: '#ffffff' } }).joinChannel(grown, { raw: { width: S, height: S, channels: 1 } }).png().toBuffer();
    const big = await sharp(white).composite([{ input: placed }]).png().toBuffer();
    return sharp(big).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
  };
  const fav = { 16: await favicon(16), 32: await favicon(32), 48: await favicon(48) };
  fs.writeFileSync(path.join(DIST, 'favicon-32.png'), fav[32]);
  fs.writeFileSync(path.join(DIST, 'favicon-48.png'), fav[48]);
  fs.writeFileSync(path.join(DIST, 'favicon.ico'), ico([[16, fav[16]], [32, fav[32]], [48, fav[48]]]));

  // Open Graph images
  const iconB64 = (await sharp(icon).resize({ width: 276 }).png().toBuffer()).toString('base64');
  const render = (o, file) => sharp(Buffer.from(ogSvg({ ...o, iconB64, iconW: iconMeta.width, iconH: iconMeta.height }))).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  const jobs = [];
  const fixed = [
    ['default', 'Find the career that fits, then train for it', 'Career training by job title', `${countLabel(careers.length)} careers · Free quizzes · Salary data · U.S.-focused`],
    ['training', 'Online career training by job title', 'Training catalog', 'Self-paced · Practical · Certificate of completion'],
    ['courses', 'Job-title courses to buy online', 'CDL ELDT, forklift, flagger, mold inspector', 'Buy online · Self-paced · Volume pricing'],
    ['compare', 'Compare careers side by side', 'Career comparison', 'Pay · Training time · Job growth · Daily duties'],
    ['quiz', 'Free career quizzes', 'Quizzes', 'Career Match · College vs. Trade School · Career Change'],
    ['guides', 'Career guides for every stage', 'Guides', 'Students · Career changers · Working professionals'],
    ['blog', 'The Career Education Institute Blog', 'Blog', 'Career advice, industry news and training tips'],
    ['partners', 'Partner discount program', 'Partners', 'School districts · Colleges · Companies · Organizations']
  ];
  for (const [f, title, kicker, footer] of fixed) jobs.push(render({ title, kicker, footer }, path.join(og, f + '.png')));
  for (const c of careers) jobs.push(render({ title: c.title, kicker: categories.find((x) => x.slug === c.cat).name + ' career', footer: `Median pay $${c.l.wages.median.toLocaleString('en-US')} · Training: ${c.train}` }, path.join(og, c.slug + '.png')));
  for (const cat of categories) jobs.push(render({ title: `${cat.name} careers`, kicker: 'Career category', footer: 'Pay, training time and outlook for every role' }, path.join(og, 'cat-' + cat.slug + '.png')));
  await Promise.all(jobs);
}
