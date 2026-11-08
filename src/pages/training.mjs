import cfg from '../../site.config.mjs';
import { esc, href, abs, money, clamp, fitTitle, listJoin, lowerFirst, shuffle, hash, taskPhrase, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, sideLinks, answerBox, icon } from '../lib/layout.mjs';
import { trainingCheckout } from '../lib/forms.mjs';
import { pick, searchKeywords } from '../lib/career-helpers.mjs';
import { catBySlug } from '../data/categories.mjs';
import { moduleWeights, minutesLabel } from '../data/course-pricing.mjs';
import { partnerById, partnerCourses, partnerTable, tierTable, providerLine } from '../lib/partners.mjs';
import { courseFor, offerData } from '../lib/offer.mjs';

// An item for the browser cart (site.js reads data-add-cart)
export const cartItem = (o) => esc(JSON.stringify(o));

const usd = (n) => '$' + Number(n).toFixed(2);

export function modules(c) {
  const terms = c.terms.map((t) => t[0]);
  const list = [
    [`Introduction to the ${c.title} Role`, [`What ${c.pluralLower} do and why the role matters`, 'Where they work: settings, employers and teams', 'Pay, job outlook and the career ladder', 'Professional and ethical expectations']],
    ['A Day on the Job', ['A realistic shift, start to finish', 'Schedules, shifts and workload', 'Working with supervisors, coworkers and customers', 'The best and hardest parts of the job']],
    [`Essential ${c.title} Vocabulary`, [...terms.slice(0, 5).map((t) => `Key term: ${t}`), `Plus ${Math.max(terms.length - 5, 0)} more terms with practice drills`]],
    ['Core Duties and Responsibilities', c.duties.slice(0, 5)],
    ['Common Tasks, Step by Step', c.howto.map((h) => `How to ${taskPhrase(h.t)}`).concat(['Common mistakes and how to avoid them'])],
    ['Tools, Equipment and Technology', c.tools.slice(0, 5)],
    ['Safety, Compliance and Professional Standards', c.safety.map((s) => s.split(/[,;]/)[0].trim())],
    ['Skills Employers Look For', [...c.hard.slice(0, 3), ...c.soft.slice(0, 2)]],
    [`Launching Your ${c.title} Career`, ['Education and training pathways', ...c.certs.slice(0, 2).map(([n]) => `Credential overview: ${n}`), 'Resume and interview preparation', 'Your first 90 days on the job']],
    ['Final Knowledge Check', ['Comprehensive practice exam with explanations', `${cfg.course.certificate} on passing`]]
  ];
  return list.map(([t, ls], i) => [t, ls, c.hours * 60 * moduleWeights[i]]);
}

export function outcomes(c) {
  return [
    `Explain what ${c.a} ${c.lower} does day to day, where they work and how the role fits into the team`,
    `Use ${c.terms.length}+ essential ${c.lower} terms correctly`,
    `Walk through ${listJoin(c.howto.map((h) => taskPhrase(h.t)))} step by step`,
    `Identify the tools, equipment and technology used on the job`,
    `Apply core safety, compliance and professional standards`,
    `Map your path into the field, including credentials such as ${c.certs[0][0]}`
  ];
}

export function practiceQuestions(c) {
  const qs = c.quiz.map(([q, o, a, why]) => ({ q, o, a, why }));
  const terms = c.terms;
  const order = shuffle(terms.map((_, i) => i), c.slug).slice(0, Math.min(10, terms.length));
  order.forEach((ti, k) => {
    const [t, d] = terms[ti];
    const distract = shuffle(terms.map((_, i) => i).filter((i) => i !== ti), hash(c.slug + t)).slice(0, 3);
    const choiceIdx = shuffle([ti, ...distract], hash(t + c.slug));
    if (k % 2 === 0) qs.push({ q: `Which term matches this definition: “${d}”`, o: choiceIdx.map((i) => terms[i][0]), a: choiceIdx.indexOf(ti), why: `${t}: ${d}` });
    else qs.push({ q: `What does “${t}” mean?`, o: choiceIdx.map((i) => terms[i][1]), a: choiceIdx.indexOf(ti), why: `${t}: ${d}` });
  });
  return qs;
}

function courseFaqs(c) {
  return [
    [`How long is the ${c.title} training?`, `About ${c.hours} hours, ${cfg.course.format.toLowerCase()}. You get ${cfg.course.access}, so you can learn around work or school.`],
    [`How much does the ${c.title} training cost?`, `${usd(c.price)} per learner. Volume pricing applies automatically from 2 learners, up to 10% off for large groups.`],
    ['Is the course online?', `Yes. The course runs on our online learning platform (LMS). After you enroll, we email your login details.`],
    [`Will this course make me a licensed or certified ${c.lower}?`, `No. This is a general career-preparation course. It does not by itself grant a state license, national certification or academic credit. ${c.license ? c.license + ' ' : ''}It is designed to help you understand the job and prepare for the formal training, exams and interviews that follow.`],
    ['Who is this course for?', `Students exploring careers, adults changing careers, new hires who want a faster ramp-up, and employers onboarding ${c.pluralLower}.`],
    ['How do I enroll?', `Use the checkout form on this page: enter your details and the number of learners, and we email your LMS access. You can also call ${cfg.phone}.`],
    ['Do you offer group or employer pricing?', `${cfg.course.groupNote}. Enter the number of seats on the checkout form or visit our employer training page.`],
    ['What do I receive when I finish?', `${cfg.course.certificate} from Career Education Institute after you pass the final knowledge check.`]
  ];
}

export function trainingPages(c, ctx) {
  const { careers, byslug } = ctx;
  const pages = [];
  const cat = catBySlug[c.cat];
  const og = `/og/${c.slug}.png`;
  const mods = modules(c);
  const outs = outcomes(c);
  const qs = practiceQuestions(c);
  const faqs = courseFaqs(c);

  // ---------- Course page ----------
  // A career whose training is a checkout course: the course page (courses.mjs) is its training page.
  if (!(c.replacedBy && partnerById[c.replacedBy])) {
    const path = c.trainingUrl;
    const crumbs = [['Home', '/'], ['Training', '/training/'], [cat.name, `/training/#${cat.slug}`], [`${c.title} Training`, path]];
    const price = usd(c.price);
    const main = `${answerBox(`What you’ll learn in ${c.title} training`, `A practical, general introduction to the ${esc(c.lower)} job: what the role involves, ${c.terms.length}+ key terms, how to perform common tasks such as ${listJoin(c.howto.slice(0, 2).map((h) => esc(taskPhrase(h.t))))}, safety essentials and how to launch your career. ${esc(cfg.course.format)}, about ${c.hours} hours, ${price}.`)}
<ul class="facts"><li class="fact"><div class="k">Tuition</div><div class="v">${price}</div><div class="n">${esc(cfg.course.groupNote)}</div></li><li class="fact"><div class="k">Length</div><div class="v">${c.hours} hours</div><div class="n">${mods.length} modules</div></li><li class="fact"><div class="k">Format</div><div class="v">Online</div><div class="n">Self-paced, any device</div></li><li class="fact"><div class="k">Access</div><div class="v">12 months</div><div class="n">LMS access</div></li><li class="fact"><div class="k">Level</div><div class="v">Beginner</div><div class="n">To intermediate</div></li><li class="fact"><div class="k">You receive</div><div class="v">Certificate</div><div class="n">Of completion</div></li></ul>
<h2 id="outcomes">Learning outcomes</h2><p>By the end of this course you will be able to:</p><ul class="checks">${outs.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
<h2 id="syllabus">Course syllabus</h2><p>${mods.length} modules, about ${c.hours} hours in total.</p><div class="modules">${mods.map(([t, ls, mins], i) => `<details${i === 0 ? ' open' : ''}><summary><span class="n">MODULE ${String(i + 1).padStart(2, '0')}</span><span>${esc(t)}</span><span class="dur">${minutesLabel(mins)}</span></summary><ul>${ls.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></details>`).join('')}</div>
<h2 id="who">Who this training is for</h2><ul><li><strong>Students:</strong> find out what the ${esc(c.lower)} job is really like before choosing a program or major.</li><li><strong>Career changers:</strong> test-drive the field and build vocabulary and confidence before investing in formal training.</li><li><strong>New hires and employers:</strong> shorten ramp-up time with a consistent foundation for every new ${esc(c.lower)}.</li></ul>
<h2 id="pricing">Pricing</h2><p><strong>${price} per learner.</strong> Buying for a team? Volume pricing applies automatically from 2 learners.</p><div class="buy-strip"><div><p class="buy-strip-price">${price} <span>per learner</span></p><p class="small muted">Online, self-paced · about ${c.hours} hours · ${esc(cfg.course.certificate)}</p></div><div class="btn-row"><a class="btn btn-primary" href="#enroll">Buy now</a></div></div>${tierTable()}
<h2 id="preview">Free preview lessons</h2><p>Sample the course material for free:</p><ul><li><a href="${href(c.url + 'glossary/')}">${esc(c.title)} vocabulary (${c.terms.length} terms)</a></li>${c.howto.map((h) => `<li><a href="${href(`${c.url}how-to/${h.slug}/`)}">How to ${esc(taskPhrase(h.t))}</a></li>`).join('')}<li><a href="${href(path + 'practice-test/')}">${esc(c.title)} practice test (${qs.length} questions)</a></li><li><a href="${href(c.url + 'day-in-the-life/')}">A day in the life of ${c.a} ${esc(c.lower)}</a></li></ul>
<h2 id="career">Why train for this career</h2><p>${esc(c.summary)} BLS reports a median wage of <strong>${money(c.l.wages.median)}</strong> (${ctx.labor.meta.oewsLabel}) and about <strong>${c.l.annualOpenings.toLocaleString('en-US')}</strong> openings per year. <a href="${href(c.url)}">Read the full ${esc(c.lower)} career profile</a> or <a href="${href(c.url + 'salary/')}">see salary details</a>.</p>
<aside class="callout info"><p><strong>Try the career before you commit to it.</strong> Find out if being ${c.a} ${esc(c.lower)} is right for you for ${price}, before you spend thousands of dollars and months of your time on a full training program.</p><p><strong>Important:</strong> This is a general, non-credit career-preparation course. It does not by itself grant a state license, national certification, college credit or a guarantee of employment, and it does not replace any state-required training program. ${c.license ? esc(c.license) : ''}</p></aside>
${trainingCheckout({ course: c, heading: `Buy ${c.title} Training` })}
${faqBlock(faqs, `${c.title} training FAQ`)}
<h2 id="related">Related trainings</h2><div class="grid">${c.related.map((s) => byslug[s]).filter(Boolean).map((r) => `<article class="card link"><h3><a class="stretch" href="${href(r.trainingUrl)}">${esc(r.title)} Training</a></h3><p>${esc(r.blurb)}</p></article>`).join('')}</div>`;
    const aside = `<div class="cta-card"><h2>${esc(c.title)} Training</h2><p class="buy-price">${price}<span> per learner</span></p><p>${esc(cfg.course.format)} · about ${c.hours} hours · ${esc(cfg.course.certificate)}</p><ul><li>${mods.length} modules</li><li>${c.terms.length}+ key terms</li><li>${qs.length}-question practice exam</li></ul><a class="btn btn-primary" href="#enroll">Buy now</a><button class="btn btn-light" type="button" data-add-cart="${cartItem({ k: 'training', s: c.slug, t: `${c.title} Training`, p: c.price, u: href(c.trainingUrl) })}">Add to cart</button></div>${sideLinks(`Explore the ${c.lower} career`, [['Career overview', c.url], ['Salary & pay scale', c.url + 'salary/'], ['How to become one', c.url + 'how-to-become/'], ['Interview questions', c.url + 'interview-questions/'], ['Is it right for me? (quiz)', c.url + 'is-it-right-for-me/']])}`;
    pages.push({
      path, crumbs, og, kind: 'Training', name: `${c.title} Training`, keywords: searchKeywords(c),
      mcta: `<a class="btn btn-primary" href="#enroll">Buy now · ${price}</a><a class="btn" href="${href(path + 'practice-test/')}">Free practice test</a>`,
      title: fitTitle(pick([`${c.title} Training Course (Online)`, `${c.title} Training (Online)`, `${c.short} Training Course (Online)`])),
      desc: clamp(`Online ${c.lower} training: ${c.hours} hours, ${price}. Learn the duties, ${c.terms.length}+ key terms, step-by-step tasks, safety and how to get hired. Self-paced, with a certificate.`),
      body: `${pageHero({ crumbs, eyebrow: `${cat.name} training`, h1: `${esc(c.title)} Training`, lead: `Learn what ${esc(c.pluralLower)} do and how they do it: a semi-in-depth, practical course covering the role, vocabulary, common procedures, safety and career launch.`, extra: `<p class="buy-strip-price" style="margin:14px 0 0">${price} <span>per learner · about ${c.hours} hours · start today</span></p><div class="btn-row"><a class="btn btn-primary" href="#enroll">Buy now · ${price}</a><button class="btn" type="button" data-add-cart="${cartItem({ k: 'training', s: c.slug, t: `${c.title} Training`, p: c.price, u: href(c.trainingUrl) })}">Add to cart</button><a class="btn" href="#syllabus">View syllabus</a></div>` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
      schema: [{
        '@type': 'Course', '@id': abs(path) + '#course', name: `${c.title} Training`, description: `General online training for aspiring and new ${c.pluralLower}: role overview, key vocabulary, common procedures, safety and career launch.`,
        provider: { '@id': abs('/#org') }, url: abs(path), inLanguage: 'en-US', educationalLevel: cfg.course.level, teaches: outs, about: { '@type': 'Occupation', name: c.title },
        syllabusSections: mods.map(([t, ls]) => ({ '@type': 'Syllabus', name: t, description: ls.join('; ') })),
        hasCourseInstance: [{ '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${c.hours}H`, inLanguage: 'en-US' }],
        offers: [{ '@type': 'Offer', category: 'Paid', price: c.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: abs(path), eligibleRegion: { '@type': 'Country', name: 'US' } }],
        educationalCredentialAwarded: cfg.course.certificate
      }, faqSchema(faqs, path)]
    });
  }

  // ---------- Practice test ----------
  {
    const path = c.trainingUrl + 'practice-test/';
    const crumbs = [['Home', '/'], ['Training', '/training/'], [`${c.title} Training`, c.trainingUrl], ['Practice Test', path]];
    const k = courseFor(c);
    const data = { type: 'graded', answers: qs.map((q) => q.a), passing: 70, offer: offerData(c), cta: { text: `Ready to go deeper? ${k.name} covers every topic on this test and more.`, link: href(k.buy), btn: `Buy ${k.name} · ${usd(k.price)}` } };
    const main = `${answerBox('About this practice test', `${qs.length} multiple-choice questions on ${esc(c.lower)} knowledge, safety and vocabulary. Submit to see your score and explanations, or open any question’s answer as you go. Nothing is saved or shared.`)}
<form class="quiz" data-quiz novalidate>${qs.map((q, i) => `<fieldset id="q${i + 1}"><legend><span class="qn">Question ${i + 1} of ${qs.length}</span>${esc(q.q)}</legend><div class="opts">${q.o.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}"><span>${esc(o)}</span></label>`).join('')}</div><details class="explain"><summary>Show answer</summary><p><strong>Answer: ${esc(q.o[q.a])}.</strong> ${esc(q.why)}</p></details></fieldset>`).join('')}
<div class="quiz-bar"><div class="progress" aria-hidden="true"><i></i></div><button class="btn btn-primary" type="submit">Grade my test</button></div></form>
<section class="results" aria-live="polite" tabindex="-1"></section>
<script type="application/json" id="quiz-data">${JSON.stringify(data)}</script>
<h2 id="study">How to study</h2><ul><li>Review the <a href="${href(c.url + 'glossary/')}">${esc(c.lower)} glossary</a>: half of these questions test vocabulary.</li><li>Read the step-by-step guides: ${c.howto.map((h) => `<a href="${href(`${c.url}how-to/${h.slug}/`)}">${esc(taskPhrase(h.t))}</a>`).join(', ')}.</li><li>Retake the test until you score 90% or higher.</li></ul>`;
    const aside = `<div class="cta-card"><h2>Go beyond the practice test</h2><p class="buy-price">${usd(k.price)}<span> per learner</span></p><p>${esc(k.name)}: about ${k.hours} hours, with a full final exam and certificate. Start today.</p><a class="btn btn-primary" href="${href(k.buy)}">Buy now</a><a class="btn btn-light" href="${href(k.url)}">Course details</a></div>${sideLinks('Study resources', [['Glossary', c.url + 'glossary/'], ['How-to guides', c.url + 'how-to/'], ['Interview questions', c.url + 'interview-questions/'], ['Career overview', c.url]])}`;
    pages.push({
      path, crumbs, og, kind: 'Practice test', name: `${c.title} practice test`, scripts: ['quiz'],
      mcta: `<a class="btn btn-primary" href="${href(k.buy)}">Buy training · ${usd(k.price)}</a>`,
      title: fitTitle(pick([`${c.title} Practice Test: ${qs.length} Free Questions`, `${c.title} Practice Test (Free)`, `${c.short} Practice Test: ${qs.length} Free Questions`])),
      desc: clamp(`Free ${c.lower} practice test: ${qs.length} multiple-choice questions on job knowledge, safety and key vocabulary, with answers and explanations. Instant score.`),
      body: `${pageHero({ crumbs, eyebrow: 'Free practice test', h1: `${esc(c.title)} Practice Test`, lead: `Check what you know about the ${esc(c.lower)} job with ${qs.length} free questions and instant explanations.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
      schema: [{ '@type': 'Quiz', name: `${c.title} Practice Test`, about: { '@type': 'Thing', name: c.title }, educationalLevel: 'Beginner', hasPart: qs.map((q) => ({ '@type': 'Question', eduQuestionType: 'Multiple choice', text: q.q, acceptedAnswer: { '@type': 'Answer', text: q.o[q.a] }, suggestedAnswer: q.o.filter((_, j) => j !== q.a).map((o) => ({ '@type': 'Answer', text: o })) })) }]
    });
  }
  return pages;
}

// One row of the training catalog: name, length, price and the button that gets the learner started. Rows stay small
// (700+ on one page): site.js builds the cart item from the row (data-buy marks a checkout course) on "+ Cart".
let rowN = 0;
function catalogRow({ title, url, hours, price, buy, k = '' }) {
  const id = `r${++rowN}`;
  return `<li${k ? ` data-k="${esc(k.toLowerCase())}"` : ''}${buy ? ` data-buy="${buy}"` : ''}><a href="${href(url)}" id="${id}">${esc(title)}</a><small>${hours} hours${buy ? ' · <b>Instant access</b>' : ''}</small><strong>${usd(price)}</strong><a class="btn btn-sm btn-primary" href="${buy ? href(`/checkout/?course=${buy}`) : `${href(url)}#enroll`}" aria-describedby="${id}">Buy now</a><button class="btn btn-sm" type="button" aria-describedby="${id}">+ Cart</button></li>`;
}

export function trainingCatalog(ctx) {
  const { careers, categories } = ctx;
  const path = '/training/';
  const crumbs = [['Home', '/'], ['Training', path]];
  const rowsFor = (cat) => {
    const rows = careers.filter((c) => c.cat === cat.slug).map((c) => {
      const m = c.replacedBy && partnerById[c.replacedBy];
      return m
        ? { title: m.title, url: m.url, hours: m.hoursNum, price: m.price, buy: m.slug, k: searchKeywords(c) }
        : { title: `${c.title} Training`, url: c.trainingUrl, hours: c.hours, price: c.price, k: searchKeywords(c) };
    });
    // Checkout courses with no career profile of their own (mold inspector) sit in their field too
    for (const m of partnerCourses.filter((p) => p.field === cat.slug && !careers.some((c) => c.replacedBy === p.id))) rows.push({ title: m.title, url: m.url, hours: m.hoursNum, price: m.price, buy: m.slug });
    return rows.sort((a, b) => a.title.localeCompare(b.title));
  };
  const all = categories.map((cat) => [cat, rowsFor(cat)]);
  const total = all.reduce((n, [, r]) => n + r.length, 0);
  const prices = all.flatMap(([, r]) => r.map((x) => x.price));
  const body = `${pageHero({ crumbs, eyebrow: `${countLabel(total)} job-title trainings`, h1: 'Career Training by Job Title', lead: `Self-paced online courses that teach you what a job really involves: duties, vocabulary, common procedures, safety and how to get hired. Trainings start at ${usd(Math.min(...prices))}.`, meta: false, extra: `<form class="tl-search" role="search" data-catalog-search><label class="vh" for="tl-q">Search trainings</label><input id="tl-q" name="q" type="search" placeholder="Search ${countLabel(total)} trainings, for example “welder” or “nurse”" autocomplete="off"><select name="cat" aria-label="Career field"><option value="">All fields</option>${categories.map((cat) => `<option value="${cat.slug}">${esc(cat.name)}</option>`).join('')}</select></form><p class="tl-count small muted" data-catalog-count aria-live="polite">${total} trainings</p>` })}
<div class="wrap tl-wrap" data-catalog><p class="tl-note small muted">Every training is online and self-paced, with a certificate of completion. Pick your job title and press Buy now. Trainings marked “Instant access” start right after card checkout; the rest start as soon as we confirm your order by email.</p><ul class="tl-jump" aria-label="Jump to a field">${categories.map((cat) => `<li><a href="#${cat.slug}">${esc(cat.short || cat.name)}</a></li>`).join('')}</ul>
${all.map(([cat, rows]) => `<section class="tl-group" id="${cat.slug}" data-cat="${cat.slug}"><div class="tl-head"><h2>${icon(cat.slug, 24)} ${esc(cat.name)}</h2><span class="muted small" data-group-count>${rows.length} trainings</span></div><ul class="tl-list">${rows.map(catalogRow).join('')}</ul></section>`).join('')}
<div class="tl-empty" data-catalog-empty hidden><h2>No training matches that search</h2><p>Try a shorter word, or tell us the job title and we’ll point you to the closest training.</p><div class="btn-row"><a class="btn btn-primary" href="${href('/quizzes/career-match/')}">Take the Career Match Quiz</a><a class="btn" href="${href('/contact/')}">Ask us</a></div></div>
<section class="tl-includes"><h2>Every training includes</h2><ul class="checks">${['Role foundations: what the job is, where people work, pay and the career ladder', 'A realistic day-on-the-job walkthrough', 'The vocabulary you’ll hear on day one, with practice drills', 'Step-by-step procedures for the common tasks of the role', 'Safety, compliance and professional standards', 'A final exam and certificate of completion'].map((t) => `<li>${t}</li>`).join('')}</ul><div class="btn-row"><a class="btn btn-primary" href="${href('/quizzes/career-match/')}">Find your career match</a><a class="btn" href="${href('/for-employers/')}">Training a team?</a></div></section>
<aside class="callout info" style="margin-top:30px"><p><strong>Try a career before you commit to it.</strong> Find out if a career is right for you for ${usd(Math.min(...prices))} to ${usd(Math.max(...prices))}, before you spend thousands of dollars and months of your time on a full training program.</p><p>Career Education Institute trainings are general, non-credit career-preparation courses for U.S. learners. They do not replace state-required licensing programs. ${esc(cfg.course.groupNote)}.</p></aside></div>`;
  return {
    path, crumbs, og: '/og/training.png', kind: 'Training catalog', name: 'All trainings',
    mcta: `<a class="btn btn-primary" href="#tl-q">Search trainings</a><a class="btn" href="${href('/cart/')}">View cart</a>`,
    title: fitTitle(`Online Career Training by Job Title (${countLabel(careers.length)} Courses)`),
    desc: clamp(`Browse ${countLabel(careers.length)} online career trainings by job title, most under $50: healthcare, skilled trades, safety, logistics, business, tech and public safety. Self-paced, with a certificate.`),
    body,
    schema: []
  };
}
