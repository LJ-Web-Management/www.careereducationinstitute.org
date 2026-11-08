import cfg from '../../site.config.mjs';
import { esc, href } from './util.mjs';
import { partnerById } from './partners.mjs';

// Every career has one training to buy: its job-title training, or the checkout course that replaces it.
// courseFor() is the single place that says what that training is called, what it costs and where "Buy now" goes,
// so career profiles, quizzes, practice tests, comparisons and the finder all sell the same course the same way.
export const usd = (n) => '$' + Number(n).toFixed(2);

export function courseFor(c) {
  const m = c.replacedBy && partnerById[c.replacedBy];
  if (m) return { name: m.title, url: m.url, price: m.price, hours: m.hoursNum, buy: `/checkout/?course=${m.slug}`, instant: true, cart: { k: 'course', s: m.slug, t: m.title, p: m.price, u: href(m.url) } };
  const name = `${c.title} Training`;
  return { name, url: c.trainingUrl, price: c.price, hours: c.hours, buy: `${c.trainingUrl}#enroll`, instant: false, cart: { k: 'training', s: c.slug, t: name, p: c.price, u: href(c.trainingUrl) } };
}

const cartAttr = (k) => esc(JSON.stringify(k.cart));

// "HVAC Technician Training: $39.99, start today" with Buy now and Add to cart.
export function offerBox(c, { kicker = 'Your matching training', id = '' } = {}) {
  const k = courseFor(c);
  return `<div class="offer"${id ? ` id="${id}"` : ''}><div class="offer-txt"><p class="offer-k">${esc(kicker)}</p><p class="offer-h"><a href="${href(k.url)}">${esc(k.name)}</a>: <strong>${usd(k.price)}</strong>, start today</p><p class="offer-meta">${k.hours} hours · ${esc(cfg.course.format)} · ${esc(cfg.course.certificate)}${k.instant ? ' · Instant access' : ''}</p></div><div class="offer-btns"><a class="btn btn-primary" href="${href(k.buy)}">Buy now</a><button class="btn" type="button" data-add-cart="${cartAttr(k)}">Add to cart</button></div></div>`;
}

// Mobile sticky bar for career pages
export const offerMcta = (c) => {
  const k = courseFor(c);
  return `<a class="btn btn-primary" href="${href(k.buy)}">Buy training · ${usd(k.price)}</a><a class="btn" href="${href(k.url)}">Course details</a>`;
};

// Compact data for scripts that render results in the browser (quizzes):
// [name, course url, price, buy url, instant (1 = checkout course), cart slug]
export const offerData = (c) => {
  const k = courseFor(c);
  return [k.name, href(k.url), k.price, href(k.buy), k.instant ? 1 : 0, k.cart.s];
};
