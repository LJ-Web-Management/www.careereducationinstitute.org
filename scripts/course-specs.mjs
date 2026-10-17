// Writes COURSE-SPECS.md: length, price and module plan for each job-title training, for the course builders.
// Run: npm run course-specs (after changing course-pricing.mjs or a career's data).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import cfg from '../site.config.mjs';
import { categories } from '../src/data/categories.mjs';
import { enrich } from '../src/lib/career-helpers.mjs';
import { modules } from '../src/pages/training.mjs';
import { minutesLabel, priceForHours } from '../src/data/course-pricing.mjs';
import { partnerCourses } from '../src/lib/partners.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labor = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/labor.json'), 'utf8'));
const dir = path.join(ROOT, 'src/data/careers');
let raw = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort()) raw = raw.concat((await import(pathToFileURL(path.join(dir, f)).href)).default);
const order = categories.map((c) => c.slug);
const careers = raw.map((c) => enrich(c, labor)).sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat) || a.title.localeCompare(b.title));
const catName = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
const $ = (n) => `$${n.toFixed(2)}`;

const build = careers.filter((c) => !c.replacedBy);
const replaced = careers.filter((c) => c.replacedBy);
let md = `# Career Education Institute course specs

Generated ${new Date().toLocaleDateString('en-CA')} by \`npm run course-specs\`. Do not edit by hand: change \`src/data/course-pricing.mjs\` (hours) or the career data, then run the script again.

Each job-title training is self-paced online with ${cfg.course.access}, ends with a final knowledge check and awards a ${cfg.course.certificate.toLowerCase()}. Seat time below is the target the website advertises, so build each course to that length.

## Price ladder

| Length | Price per learner |
|---|---|
${Object.entries(priceForHours).map(([h, p]) => `| ${h} hours | ${$(p)} |`).join('\n')}

Volume discounts at checkout and on quotes: ${cfg.bulkTiers.filter((t) => t.discount > 0).map((t) => `${t.min} to ${t.max} seats ${Math.round(t.discount * 100)}%`).join(', ')}.

## Trainings to build (${build.length})

| Training | Category | Hours | Price |
|---|---|---|---|
${build.map((c) => `| ${c.title} | ${catName[c.cat]} | ${c.hours} | ${$(c.price)} |`).join('\n')}

## Sold as provider courses (no build needed)

These job titles are covered by a complete HAZWOPER-OSHA.com course sold through the website checkout${replaced.length ? ` (these replace our ${replaced.map((c) => c.title.toLowerCase()).join(' and ')} trainings)` : ''}.

| Job title | Course | Hours | Price | LMS course id |
|---|---|---|---|---|
${partnerCourses.map((m) => `| ${m.job} | ${m.title} | ${m.hoursNum} | ${$(m.price)} | ${m.id} |`).join('\n')}

## Module plans
`;
for (const c of build) {
  md += `\n### ${c.title} Training: ${c.hours} hours, ${$(c.price)}\n\n| # | Module | Time | Lessons |\n|---|---|---|---|\n`;
  md += modules(c).map(([t, ls, mins], i) => `| ${i + 1} | ${t} | ${minutesLabel(mins)} | ${ls.join('; ').replace(/\|/g, '/')} |`).join('\n') + '\n';
}
fs.writeFileSync(path.join(ROOT, 'COURSE-SPECS.md'), md.replace(/[ \t]*—[ \t]*/g, ', '));
console.log(`Wrote COURSE-SPECS.md (${build.length} trainings to build, ${partnerCourses.length} provider courses)`);
