import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, md } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, sideLinks, answerBox } from '../lib/layout.mjs';
import { STATES } from '../lib/forms.mjs';
import { partnerCourses, partnerTable, tierTable, providerLine } from '../lib/partners.mjs';

const price = (p) => '$' + Number(p).toFixed(2);

function providerNote(c) {
  const base = `${providerLine()}, our affiliated training provider. When you buy this course here, you are enrolled directly in the provider’s online learning platform and your login details are emailed to you.`;
  if (c.isEldt) return `${base} ${cfg.checkout.provider} provides this Entry-Level Driver Training and is an approved training provider listed on the Federal Motor Carrier Safety Administration (FMCSA) Training Provider Registry. After you pass, your completion record is submitted to the registry, which you need before taking the related CDL test. Behind-the-wheel training, if your state requires it, is not included and must be completed separately.`;
  return base;
}

export function coursePages(ctx) {
  const { byslug } = ctx;
  const pages = [];
  const coursesHub = ['Courses', '/courses/'];

  // ---------- Course pages ----------
  for (const c of partnerCourses) {
    const path = c.url;
    const crumbs = [['Home', '/'], coursesHub, [c.short, path]];
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
    const faqs = c.faqs.map(([q, a]) => [q, md(a, { headingIds: false }).html.replace(/^<p>|<\/p>$/g, '')]);
    const summary = `${c.title} is the ${c.hoursAdj} online training for the ${c.jobLower} job${c.regulation ? `, covering ${c.regulation}` : ''}. It is available in ${c.langLabel} and costs ${price(c.price)} per learner.`;
    const main = `${answerBox('Course at a glance', esc(summary))}
<div class="table-wrap"><table><tbody>${factRows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
${c.overview.length ? `<h2 id="overview">Overview</h2>${c.overview.map((p) => `<p>${esc(p)}</p>`).join('')}` : ''}
${c.extras.length ? `<ul class="checks">${c.extras.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
${c.audience.length ? `<h2 id="who">Who should take this course</h2><ul>${c.audience.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
${c.requirements.length ? `<h2 id="requirements">Requirements to know</h2><ul>${c.requirements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
${c.syllabus.modules.length ? `<h2 id="syllabus">Course syllabus</h2>${c.syllabus.intro ? `<p>${esc(c.syllabus.intro)}</p>` : ''}<div class="modules">${c.syllabus.modules.map((m, i) => `<details${i === 0 ? ' open' : ''}><summary><span>${esc(m.title)}</span></summary><div class="mod-body">${m.desc ? `<p>${esc(m.desc)}</p>` : ''}${m.lessons.length ? `<ul>${m.lessons.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div></details>`).join('')}</div>` : ''}
${c.objectives.length ? `<h2 id="objectives">What you will be able to do</h2><ul class="checks">${c.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
<h2 id="provider">About the course provider</h2><p>${esc(providerNote(c))}</p>
<h2 id="buy">Enroll</h2><p>Buy online with a credit or debit card. Buying for a team? Enter the number of learners at checkout and volume pricing is applied automatically.</p><div class="btn-row"><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now for ${price(c.price)}</a></div>
<details class="more-info"><summary>Volume pricing</summary>${tierTable()}</details>
${faqs.length ? faqBlock(faqs, 'Frequently asked questions') : ''}
${career ? `<h2 id="career">The ${esc(career.lower)} career</h2><p>${esc(career.blurb)} <a href="${href(career.url)}">Read the ${esc(career.lower)} career profile</a>, including <a href="${href(career.url + 'salary/')}">pay</a> and <a href="${href(career.url + 'day-in-the-life/')}">a day in the life</a>.</p>` : ''}
${related.length ? `<h2 id="related">Other job-title courses you can buy online</h2>${partnerTable(related)}` : ''}`;
    const aside = `<div class="cta-card buy-box"><p class="eyebrow" style="color:#ffd88a">Online course</p><h2>${esc(c.short)}</h2><p class="buy-price">${price(c.price)}<span> per learner</span></p><ul><li>${esc(c.hours)}</li><li>${esc(c.langLabel)}</li><li>${esc(c.facts['What You Get'] || 'Certificate of completion')}</li>${c.ceu ? `<li>${esc(c.ceu)} CEU</li>` : ''}</ul><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now</a><p class="small" style="margin:.8em 0 0">Invoice or purchase order? Call <a href="tel:${cfg.phoneE164}" style="color:#fff">${cfg.phone}</a>.</p></div>${sideLinks('Online courses', [['All online courses', '/courses/'], ...(career ? [[`${career.title} career`, career.url]] : []), ['All job-title trainings', '/training/'], ['Refund policy', '/refund-policy/']])}`;
    pages.push({
      path, crumbs, og: '/og/courses.png', kind: 'Course', name: c.title, scripts: [],
      mcta: `<a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now · ${price(c.price)}</a>`,
      title: fitTitle(c.short.length <= 44 ? `${c.short} (Online)` : c.short),
      desc: clamp(`${c.title}: ${c.hoursAdj} online course${c.regulation ? ` aligned with ${c.regulation}` : ''}. ${c.langLabel}, ${price(c.price)} per learner, certificate of completion. Buy online today.`),
      body: `${pageHero({ crumbs, eyebrow: `Job-title training: ${c.job}`, h1: esc(c.title), lead: esc(`${c.hours} · ${c.langLabel} · ${price(c.price)} per learner`), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`/checkout/?course=${c.slug}`)}">Buy now</a>${c.syllabus.modules.length ? `<a class="btn" href="#syllabus">View syllabus</a>` : ''}</div>` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
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

  // ---------- Catalog ----------
  {
    const path = '/courses/';
    const crumbs = [['Home', '/'], coursesHub];
    const faqs = [
      ['Who provides these courses?', `${providerLine()}, our affiliated training provider. You buy here and are enrolled directly in the provider’s online learning platform.`],
      ['How do I get access after I pay?', 'Your login details are emailed to the address you enter at checkout, usually right away. You can start immediately and learn at your own pace.'],
      ['Can I buy for my team?', 'Yes. Enter the number of learners at checkout. Volume pricing applies automatically from 2 learners, and invoice or purchase-order billing is available by phone or email.'],
      ['What is your refund policy?', `You can cancel within 30 days of purchase for a full refund, subject to the conditions in our <a href="${href('/refund-policy/')}">Refund Policy</a>.`]
    ];
    const careerLinks = partnerCourses.filter((c) => c.career && byslug[c.career]);
    pages.push({
      path, crumbs, og: '/og/courses.png', kind: 'Course category', name: 'Job-title courses to buy online',
      title: fitTitle('CDL ELDT, Forklift, Flagger and Mold Inspector Courses'),
      desc: clamp(`Buy complete online training for ${partnerCourses.length} job titles: ${partnerCourses.map((c) => c.jobLower.replace(/ \(.*\)/, '')).join(', ')}. Self-paced, with certificates and instant enrollment.`),
      body: `${pageHero({ crumbs, eyebrow: `${partnerCourses.length} online courses`, h1: 'Job-Title Courses You Can Buy Online', lead: 'Complete online training for a specific job title, provided by our affiliated training provider. Buy here and start right away.', meta: false })}
<div class="wrap layout"><div class="prose">${partnerTable(partnerCourses, { caption: 'Job-title courses' })}
<p class="small muted">All courses are 100% online and self-paced. ${esc(providerLine())}. Prices are per learner; volume pricing applies automatically from 2 learners.</p>
<p>Looking for something else? Our <a href="${href('/training/')}">job-title trainings</a> cover ${ctx.careers.length} careers, from medical assistant to electrician.</p>
${faqBlock(faqs, 'Buying courses')}</div>
<aside>${sideLinks('Related careers', careerLinks.map((c) => [`${byslug[c.career].title} career`, byslug[c.career].url]).filter((x, i, a) => a.findIndex((y) => y[1] === x[1]) === i).concat([['All job-title trainings', '/training/']]))}</aside></div>`,
      schema: [faqSchema(faqs, path)]
    });
  }

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
<div class="field"><label for="card-element">Card</label><div id="card-element" class="card-input" aria-live="polite">Loading secure card form…</div><div class="hint">Card details go directly to Stripe and are never stored by MrPress Education.</div></div>
<label class="check"><input type="checkbox" id="agree" required><span>I agree to the <a href="${href('/terms-of-use/')}">Terms of Use</a> and <a href="${href('/refund-policy/')}">Refund Policy</a>, and I understand my order is fulfilled by ${esc(cfg.checkout.provider)}. <span class="req" aria-hidden="true">*</span></span></label>
<p class="err" role="alert" id="checkoutError" hidden></p>
<button class="btn btn-primary btn-block" type="submit" id="payBtn">Pay now</button>
<p class="small muted" style="margin:0">Need an invoice or purchase order instead? Call <a href="tel:${cfg.phoneE164}">${cfg.phone}</a> or email <a href="mailto:${cfg.email}">${cfg.email}</a>.</p>
</form>
<section class="result-card" id="checkoutSuccess" hidden tabindex="-1"><p class="eyebrow">Order complete</p><h2>Thank you for your order</h2><p>Order reference: <strong data-order-ref></strong></p><p>Your receipt and course login details are being sent to <strong data-order-email></strong>. If you don’t see them within 15 minutes, check your spam folder or call ${cfg.phone}.</p><div class="btn-row"><a class="btn" href="${href('/courses/')}">Browse more courses</a></div></section>
</div>
<aside><div class="side-box order-summary"><h2>Order summary</h2><p class="summary-course" data-sum-name>Select a course</p><p class="small muted" data-sum-meta></p><table><tbody><tr><th scope="row" data-sum-qty>1 × $0.00</th><td class="num" data-sum-sub>$0.00</td></tr><tr data-sum-discount-row hidden><th scope="row" data-sum-discount-label>Volume discount</th><td class="num" data-sum-discount>-$0.00</td></tr><tr class="total"><th scope="row">Total</th><td class="num" data-sum-total>$0.00</td></tr></tbody></table><p class="small muted">Prices in U.S. dollars. ${esc(providerLine())}.</p><p class="small"><a data-sum-link href="${href('/courses/')}">View course details</a></p></div></aside></div>
<script type="application/json" id="checkout-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
    pages.push({ path, crumbs, noindex: true, og: '/og/courses.png', scripts: ['checkout'], title: 'Checkout | MrPress Education', desc: 'Secure card checkout for MrPress Education online job-title courses, with volume pricing from 2 learners.', body, schema: [] });
  }
  return pages;
}
