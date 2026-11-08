import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, md, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, sideLinks, answerBox } from '../lib/layout.mjs';
import { STATES, enrollForm } from '../lib/forms.mjs';
import { partnerCourses, partnerTable, tierTable, providerLine } from '../lib/partners.mjs';
import { movedFrom } from '../data/partner-selection.mjs';
import { cartItem } from './training.mjs';

const price = (p) => '$' + Number(p).toFixed(2);

// Why the job needs this training: the short intro on courses that match a career.
const intro = {
  'forklift-operator': ['OSHA requires every forklift operator to be trained and evaluated before operating a powered industrial truck on their own (29 CFR 1910.178).', 'This training covers the formal classroom instruction. Your employer completes the hands-on practice and the workplace evaluation on the trucks you will use.'],
  flagger: ['The federal Manual on Uniform Traffic Control Devices (MUTCD) calls for flaggers to be trained in safe traffic control practices, and most contractors and many states require a flagger certificate before you work in a road work zone.', 'This training covers federal flagging and work zone standards online, in English or Spanish. Some states issue their own flagger card instead, so check with your state DOT or employer before you buy.']
};

export function coursePages(ctx) {
  const { byslug } = ctx;
  const pages = [];
  const coursesHub = ['Training', '/training/'];

  // ---------- Course pages ----------
  for (const c of partnerCourses) {
    const path = c.url;
    const fieldName = (ctx.categories.find((x) => x.slug === c.field) || {}).name;
    const crumbs = [['Home', '/'], coursesHub, ...(fieldName ? [[fieldName, `/training/#${c.field}`]] : []), [c.title, path]];
    const factRows = [
      ['Price', `${price(c.price)} per learner`],
      ['Length', c.hours],
      ['Format', c.facts['Learning Type'] || '100% online, self-paced'],
      ['Language', c.langLabel],
      ['Course access', c.facts['Course Access Validity']],
      ['You receive', c.facts['What You Get'] || 'Certificate of completion'],
      ['Certificate validity', c.facts['Certificate Validity']],
      ['Continuing education units (CEU)', c.ceu],
      ['Regulation', c.regulation]
    ].filter(([, v]) => v);
    const career = c.career && byslug[c.career];
    const related = partnerCourses.filter((x) => x !== c);
    const [p1, p2] = intro[c.career] || [];
    const faqs = c.faqs.map(([q, a]) => [q, md(a, { headingIds: false }).html.replace(/^<p>|<\/p>$/g, '')]);
    const summary = `${c.title} is the ${c.hoursAdj} online training for the ${c.jobLower} job${c.regulation ? `, covering ${c.regulation}` : ''}. It is available in ${c.langLabel} and costs ${price(c.price)} per learner.`;
    const main = `${answerBox('Course at a glance', esc(summary))}
${p1 ? `<p>${esc(p1)} ${esc(p2)}</p>` : ''}
<div class="buy-strip"><div><p class="buy-strip-price">${price(c.price)} <span>per learner</span></p><p class="small muted">Instant access after checkout · ${esc(c.hours)} · ${esc(c.langLabel)}</p></div><div class="btn-row"><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now</a><button class="btn" type="button" data-add-cart="${cartItem({ k: 'course', s: c.slug, t: c.title, p: c.price, u: href(c.url) })}">Add to cart</button></div></div>
<div class="table-wrap"><table><tbody>${factRows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
${c.overview.length ? `<h2 id="overview">Overview</h2>${c.overview.map((p) => `<p>${esc(p)}</p>`).join('')}` : ''}
${c.extras.length ? `<ul class="checks">${c.extras.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
${c.audience.length ? `<h2 id="who">Who should take this course</h2><ul>${c.audience.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
${c.requirements.length ? `<h2 id="requirements">Requirements to know</h2><ul>${c.requirements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
${c.syllabus.modules.length ? `<h2 id="syllabus">Course syllabus</h2>${c.syllabus.intro ? `<p>${esc(c.syllabus.intro)}</p>` : ''}<div class="modules">${c.syllabus.modules.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span>${esc(m.title)}</span></summary><div class="mod-body">${m.desc ? `<p>${esc(m.desc)}</p>` : ''}${m.lessons.length ? `<ul>${m.lessons.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div></details>`).join('')}</div>` : ''}
${c.objectives.length ? `<h2 id="objectives">What you will be able to do</h2><ul class="checks">${c.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
<h2 id="buy">Enroll</h2><p>Buy online with a credit or debit card. Buying for a team? Enter the number of learners at checkout and volume pricing is applied automatically.</p><div class="btn-row"><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now for ${price(c.price)}</a><button class="btn" type="button" data-add-cart="${cartItem({ k: 'course', s: c.slug, t: c.title, p: c.price, u: href(c.url) })}">Add to cart</button></div>
<details class="more-info"><summary>Volume pricing</summary>${tierTable()}</details>
${faqs.length ? faqBlock(faqs, 'Frequently asked questions') : ''}
${career ? `<h2 id="career">The ${esc(career.lower)} career</h2><p>${esc(career.blurb)} <a href="${href(career.url)}">Read the ${esc(career.lower)} career profile</a>, including <a href="${href(career.url + 'salary/')}">pay</a> and <a href="${href(career.url + 'day-in-the-life/')}">a day in the life</a>, or take the free <a href="${href(career.trainingUrl + 'practice-test/')}">practice test</a>.</p>` : ''}
${related.length ? `<h2 id="related">More trainings you can start today</h2>${partnerTable(related)}` : ''}`;
    const aside = `<div class="cta-card buy-box"><p class="eyebrow" style="color:#ffd88a">Job-title training</p><h2>${esc(c.short)}</h2><p class="buy-price">${price(c.price)}<span> per learner</span></p><ul><li>${esc(c.hours)}</li><li>${esc(c.langLabel)}</li><li>${esc(c.facts['What You Get'] || 'Certificate of completion')}</li>${c.ceu ? `<li>${esc(c.ceu)} CEU</li>` : ''}</ul><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now</a><p class="small" style="margin:.8em 0 0">Invoice or purchase order? Call <a href="tel:${cfg.phoneE164}" style="color:#fff">${cfg.phone}</a>.</p></div>${sideLinks('Keep exploring', [...(career ? [[`${career.title} career`, career.url], ['Free practice test', career.trainingUrl + 'practice-test/']] : []), ['All job-title trainings', '/training/'], ['Refund policy', '/refund-policy/']])}`;
    pages.push({
      path, crumbs, og: career ? `/og/${career.slug}.png` : '/og/training.png', kind: 'Training', name: c.title, scripts: [],
      mcta: `<a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now · ${price(c.price)}</a>`,
      title: fitTitle(`${c.title} Course (Online)`),
      desc: clamp(`${c.title}: ${c.hoursAdj} online course${c.regulation ? ` aligned with ${c.regulation}` : ''}. ${c.langLabel}, ${price(c.price)} per learner, certificate of completion. Buy online today.`),
      body: `${pageHero({ crumbs, eyebrow: `${fieldName || 'Job-title'} training`, h1: esc(c.title), lead: esc(`${c.hours} · ${c.langLabel} · ${price(c.price)} per learner`), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now</a><button class="btn" type="button" data-add-cart="${cartItem({ k: 'course', s: c.slug, t: c.title, p: c.price, u: href(c.url) })}">Add to cart</button>${c.syllabus.modules.length ? `<a class="btn" href="#syllabus">View syllabus</a>` : ''}</div>` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
      schema: [{
        '@type': 'Course', '@id': abs(path) + '#course', name: c.title, description: summary,
        provider: { '@type': 'Organization', name: cfg.checkout.provider, legalName: cfg.checkout.providerLegal },
        inLanguage: c.langs.map((l) => (l === 'ES' ? 'es' : 'en')),
        educationalCredentialAwarded: c.facts['What You Get'] || 'Certificate of completion',
        ...(c.objectives.length ? { teaches: c.objectives.slice(0, 8) } : {}),
        hasCourseInstance: [{ '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${Math.round(c.hoursNum || 1)}H` }],
        offers: [{ '@type': 'Offer', category: 'Paid', price: c.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: abs(path), seller: { '@id': abs('/#org') } }]
      }, ...(faqs.length ? [faqSchema(c.faqs.map(([q, a]) => [q, md(a).html]), path)] : [])]
    });
  }

  // ---------- Old /courses/ addresses: these trainings now live under /training/ ----------
  for (const [from, to] of Object.entries(movedFrom)) {
    pages.push({ path: from, noindex: true, redirect: to, og: '/og/training.png', title: 'This Page Has Moved | Career Education Institute', desc: 'This training has moved. You are being sent to its new page in the Career Education Institute job-title training catalog.', body: `${pageHero({ eyebrow: 'Moved', h1: 'This page has moved', lead: `Continue to <a href="${href(to)}">the new page</a>.`, meta: false })}`, schema: [] });
  }

  // ---------- /subscriptions/ was removed: old links go to the training catalog ----------
  pages.push({ path: '/subscriptions/', noindex: true, redirect: '/training/', og: '/og/training.png', title: 'This Page Has Moved | Career Education Institute', desc: 'This page has moved. You are being sent to the Career Education Institute training catalog, where every course can be bought on its own.', body: `${pageHero({ eyebrow: 'Moved', h1: 'This page has moved', lead: `Every training can now be bought on its own. Continue to <a href="${href('/training/')}">the training catalog</a>.`, meta: false })}`, schema: [] });

  // ---------- Checkout (noindex) ----------
  {
    const path = '/checkout/';
    const crumbs = [['Home', '/'], coursesHub, ['Checkout', path]];
    const data = { key: cfg.checkout.stripePublishableKey, api: cfg.checkout.apiBase, from: cfg.checkout.orderFrom, tiers: cfg.bulkTiers, phone: cfg.phone, email: cfg.email, courses: Object.fromEntries(partnerCourses.map((c) => [c.slug, { id: c.id, t: c.title, p: c.price, h: c.hours, u: href(c.url) }])) };
    const field = (id, label, type = 'text', req = true, extra = '') => `<div class="field"><label for="${id}">${label}${req ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label><input id="${id}" name="${id}" type="${type}"${req ? ' required' : ''}${extra}></div>`;
    const body = `${pageHero({ crumbs, eyebrow: 'Secure checkout', h1: 'Checkout', lead: 'Enter your details and card to enroll. Your course login is emailed as soon as your order is complete.', meta: false })}
<div class="wrap layout checkout"><div>
<noscript><p class="callout">Checkout needs JavaScript. To order by phone, call ${cfg.phone} or email ${cfg.email}.</p></noscript>
<form class="form form-box" id="checkoutForm" novalidate>
<h2>Learners</h2>
<div class="field"><label for="seats">Number of learners</label><input id="seats" name="seats" type="number" min="1" max="1000" value="1" inputmode="numeric"><div class="hint">Volume pricing applies automatically from 2 learners. You can add learner names after purchase.</div></div>
<h2>Your details</h2>
<div class="row2">${field('firstName', 'First name', 'text', true, ' autocomplete="given-name"')}${field('lastName', 'Last name', 'text', true, ' autocomplete="family-name"')}</div>
<div class="row2">${field('email', 'Email', 'email', true, ' autocomplete="email"')}${field('phone', 'Phone', 'tel', true, ' autocomplete="tel"')}</div>
${field('company', 'Company or organization', 'text', false, ' autocomplete="organization"')}
<h2>Billing address</h2>
${field('address1', 'Street address', 'text', true, ' autocomplete="address-line1"')}
${field('address2', 'Apartment, suite or unit', 'text', false, ' autocomplete="address-line2"')}
<div class="row2">${field('city', 'City', 'text', true, ' autocomplete="address-level2"')}<div class="field"><label for="state">State <span class="req" aria-hidden="true">*</span></label><select id="state" name="state" required autocomplete="address-level1"><option value="">Select</option>${STATES.slice(0, 51).map((s) => `<option>${s}</option>`).join('')}</select></div></div>
<div class="row2">${field('zip', 'ZIP code', 'text', true, ' autocomplete="postal-code" inputmode="numeric" maxlength="10"')}<div class="field"><label for="country">Country</label><input id="country" name="country" type="text" value="United States" readonly></div></div>
<h2>Payment</h2>
<div class="field"><label for="code">Discount code <span class="muted small">(optional)</span></label><div class="code-row"><input id="code" name="code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="codeMsg"><button class="btn btn-sm" type="button" id="codeBtn">Apply</button></div><p class="hint" id="codeMsg" aria-live="polite"></p></div>
<div class="field"><label for="card-element">Card</label><div id="card-element" class="card-input" aria-live="polite">Loading secure card form…</div><div class="hint">Card details go directly to Stripe and are never stored by Career Education Institute.</div></div>
<label class="check"><input type="checkbox" id="agree" required><span>I agree to the <a href="${href('/terms-of-use/')}">Terms of Use</a> and <a href="${href('/refund-policy/')}">Refund Policy</a>, and I understand my order is fulfilled by ${esc(cfg.checkout.provider)}. <span class="req" aria-hidden="true">*</span></span></label>
<p class="err" role="alert" id="checkoutError" hidden></p>
<button class="btn btn-primary btn-block" type="submit" id="payBtn">Pay now</button>
<p class="small muted" style="margin:0">Need an invoice or purchase order instead? Call <a href="tel:${cfg.phoneE164}">${cfg.phone}</a> or email <a href="mailto:${cfg.email}">${cfg.email}</a>.</p>
</form>
<section class="result-card" id="checkoutSuccess" hidden tabindex="-1"><p class="eyebrow">Order complete</p><h2>Thank you for your order</h2><p>Order reference: <strong data-order-ref></strong></p><p>Your receipt and course login details are being sent to <strong data-order-email></strong>. If you don’t see them within 15 minutes, check your spam folder or call ${cfg.phone}.</p><div class="btn-row"><a class="btn" href="${href('/training/')}">Browse more trainings</a></div></section>
</div>
<aside><div class="side-box order-summary"><h2>Order summary</h2><p class="summary-course" data-sum-name>Select a course</p><p class="small muted" data-sum-meta></p><table><tbody><tr><th scope="row" data-sum-qty>1 × $0.00</th><td class="num" data-sum-sub>$0.00</td></tr><tr data-sum-discount-row hidden><th scope="row" data-sum-discount-label>Volume discount</th><td class="num" data-sum-discount>-$0.00</td></tr><tr data-sum-code-row hidden><th scope="row" data-sum-code-label>Discount code</th><td class="num" data-sum-code>-$0.00</td></tr><tr class="total"><th scope="row">Total</th><td class="num" data-sum-total>$0.00</td></tr></tbody></table><p class="small muted">Prices in U.S. dollars. ${esc(providerLine())}.</p><p class="small"><a data-sum-link href="${href('/training/')}">View course details</a></p></div></aside></div>
<script type="application/json" id="checkout-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
    pages.push({ path, crumbs, noindex: true, og: '/og/courses.png', scripts: ['checkout'], title: 'Checkout | Career Education Institute', desc: 'Secure card checkout for Career Education Institute job-title trainings, with volume pricing from 2 learners and instant access by email.', body, schema: [] });

  // Cart (saved in the visitor's browser by site.js): online courses go to card checkout together; job-title trainings
  // go to one enrollment request. The page data carries current prices so a saved cart never shows stale ones.
  {
    const path = '/cart/';
    const crumbs = [['Home', '/'], ['Cart', path]];
    const data = { tiers: cfg.bulkTiers, courses: Object.fromEntries(partnerCourses.map((c) => [c.slug, { t: c.title, p: c.price, u: href(c.url) }])), trainings: Object.fromEntries(ctx.careers.filter((c) => !c.replacedBy).map((c) => [c.slug, c.price])), checkout: href('/checkout/?cart=1') };
    const body = `${pageHero({ crumbs, eyebrow: 'Your cart', h1: 'Cart', lead: 'Your cart is saved in this browser only. Trainings marked “buy now” check out together by card; the rest are requested in one enrollment email.', meta: false })}
<div class="wrap layout cart-page" data-cart><div>
<noscript><p class="callout">The cart needs JavaScript. You can still enroll from any training’s page, or call ${cfg.phone}.</p></noscript>
<div data-cart-empty hidden><p class="lead" style="margin-top:0">Your cart is empty.</p><div class="btn-row"><a class="btn btn-primary" href="${href('/training/')}">Browse trainings</a><a class="btn" href="${href('/quizzes/career-match/')}">Find your career match</a></div></div>
<section data-cart-group="course" hidden><h2 style="margin-top:0">Buy now: instant access</h2><p class="muted small">These trainings check out by card. Your login is emailed right after checkout.</p><ul class="cart-lines" data-lines></ul></section>
<section data-cart-group="training" hidden><h2>Job-title trainings</h2><p class="muted small" data-training-intro="multi">Send one request for every training below. We reply with a payment link or invoice and your learning-platform login. Prices with volume discounts are estimates until your invoice.</p><p class="muted small" data-training-intro="single" hidden>Check out on the training’s page, where you can set the number of learners.</p><ul class="cart-lines" data-lines></ul>
<div class="form-box" id="cart-checkout" data-training-single hidden><h2>Check out this training</h2><p class="small muted">One training checks out on its own page. Enter your details and the number of learners there.</p><a class="btn btn-primary btn-block" data-single-link href="#">Go to checkout</a></div>
<div data-training-multi>${enrollForm({ kind: 'cart', id: 'cart-enroll', heading: 'Request enrollment for these trainings' })}</div></section>
</div>
<aside><div class="side-box cart-sum" data-cart-summary hidden><h2>Summary</h2><div data-sum-course hidden><p class="small" style="margin:0"><strong>Buy now</strong></p><table><tbody data-sum-rows></tbody></table><a class="btn btn-primary btn-block" data-checkout href="${data.checkout}">Check out online</a></div><div data-sum-training hidden style="margin-top:16px"><p class="small" style="margin:0"><strong>By request</strong> <span class="muted">(estimate)</span></p><table><tbody data-sum-rows></tbody></table><a class="btn btn-block" data-training-cta href="#cart-enroll">Request enrollment</a></div><p class="small muted" style="margin:12px 0 0">Volume pricing applies from 2 learners per course. Prices in U.S. dollars.</p></div>${sideLinks('Keep browsing', [['All job-title trainings', '/training/'], ['Training for employers', '/for-employers/']])}</aside></div>
<script type="application/json" id="cart-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
    pages.push({ path, crumbs, noindex: true, og: '/og/courses.png', scripts: ['cart', 'enroll'], title: 'Cart | Career Education Institute', desc: 'Your Career Education Institute cart: trainings to buy now by card and trainings to request together in one enrollment email.', body, schema: [] });
  }  }
  return pages;
}
