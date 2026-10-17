import cfg from '../../site.config.mjs';
import { esc, href, abs, money, clamp, fitTitle, listJoin, lowerFirst, shuffle, hash, taskPhrase } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, sideLinks, answerBox, icon } from '../lib/layout.mjs';
import { enrollForm } from '../lib/forms.mjs';
import { pick } from '../lib/career-helpers.mjs';
import { catBySlug } from '../data/categories.mjs';
import { moduleWeights, minutesLabel } from '../data/course-pricing.mjs';
import { partnerById, partnerCourses, partnerTable, tierTable, providerLine } from '../lib/partners.mjs';

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
    ['How do I enroll?', `Use the enrollment form on this page. It opens a pre-filled email to our team, and we reply with your payment link or invoice and your LMS access. You can also call ${cfg.phone}.`],
    ['Do you offer group or employer pricing?', `${cfg.course.groupNote}. Choose “My team or employees” on the form or visit our employer training page.`],
    ['What do I receive when I finish?', `${cfg.course.certificate} from Career Education Institute after you pass the final knowledge check.`]
  ];
}

const replacedIntro = {
  'truck-driver': ['Federal rules require new commercial drivers to complete Entry-Level Driver Training (ELDT) theory before taking the Class A or Class B CDL skills test, or certain endorsement knowledge tests, for the first time.', 'The course below is the theory training for a Class A CDL, the license most tractor-trailer jobs require. Driving a straight truck, dump truck or delivery truck instead? The Class B course is listed further down.'],
  'forklift-operator': ['OSHA requires every forklift operator to be trained and evaluated before operating a powered industrial truck on their own (29 CFR 1910.178).', 'The course below covers the formal classroom instruction. Your employer completes the hands-on practice and the workplace evaluation on the trucks you will use.']
};

function replacedPage(c, ctx) {
  const m = partnerById[c.replacedBy];
  const cat = catBySlug[c.cat];
  const path = c.trainingUrl;
  const crumbs = [['Home', '/'], ['Training', '/training/'], [cat.name, `/training/#${cat.slug}`], [`${c.title} Training`, path]];
  const others = partnerCourses.filter((p) => p.career === c.slug && p.id !== m.id);
  const [p1, p2] = replacedIntro[c.slug] || ['', ''];
  const buy = href(`/checkout/?course=${m.slug}`);
  const facts = [['Price', `${usd(m.price)} per learner`], ['Length', m.hours], ['Language', m.langLabel], ['Regulation', m.regulation], ['Course access', m.facts['Course Access Validity']], ['Certificate validity', m.facts['Certificate Validity']]].filter(([, v]) => v);
  const provider = m.isEldt
    ? `${providerLine()}, our affiliated training provider, which provides this Entry-Level Driver Training and is an approved provider listed on the FMCSA Training Provider Registry. After you pass, your completion record is submitted to the registry. Behind-the-wheel training, if your state requires it, is completed separately.`
    : `${providerLine()}, our affiliated training provider. Buying here enrolls you directly in the provider’s online learning platform, and your login is emailed to you.`;
  const faqs = [
    [`What training do I need to become ${c.a} ${c.lower}?`, `${p1} ${c.edu}`],
    [`How much does ${m.short} cost?`, `${usd(m.price)} per learner, with volume pricing from 2 learners. It takes about ${m.hours.toLowerCase()} and is completed online.`],
    ['How do I get started after buying?', 'Your login details are emailed as soon as checkout is complete, and you can start right away at your own pace.']
  ];
  const main = `${answerBox(`Training to become ${c.a} ${c.lower}`, esc(p1))}
<p>${esc(p2)}</p>
<section class="feature-course"><p class="eyebrow">Recommended course</p><h2 style="margin-top:0"><a href="${href(m.url)}">${esc(m.title)}</a></h2><div class="table-wrap"><table><tbody>${facts.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
${m.objectives.length ? `<h3>What you will learn</h3><ul class="checks">${m.objectives.slice(0, 6).map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
<div class="btn-row"><a class="btn btn-primary" href="${buy}">Buy now for ${usd(m.price)}</a><a class="btn" href="${href(m.url)}">Full course details and syllabus</a></div></section>
<p class="small muted">${esc(provider)}</p>
${others.length ? `<h2 id="more-courses">More courses for ${esc(c.pluralLower)}</h2>${partnerTable(others, { caption: `Courses for ${c.pluralLower}` })}` : ''}
<h2 id="prepare">Prepare for the career</h2><ul><li><a href="${href(c.trainingUrl + 'practice-test/')}">${esc(c.title)} practice test</a></li><li><a href="${href(c.url + 'glossary/')}">${esc(c.title)} vocabulary</a></li><li><a href="${href(c.url + 'how-to/')}">Step-by-step ${esc(c.lower)} tasks</a></li><li><a href="${href(c.url + 'day-in-the-life/')}">A day in the life</a> and <a href="${href(c.url + 'salary/')}">salary data</a></li></ul>
${faqBlock(faqs, `${c.title} training FAQ`)}`;
  const aside = `<div class="cta-card buy-box"><h2>${esc(m.short)}</h2><p class="buy-price">${usd(m.price)}<span> per learner</span></p><ul><li>${esc(m.hours)}</li><li>${esc(m.langLabel)}</li><li>${esc(m.facts['What You Get'] || 'Certificate of completion')}</li></ul><a class="btn btn-primary" href="${buy}">Buy now</a></div>${sideLinks(`Explore the ${c.lower} career`, [['Career overview', c.url], ['Salary & pay scale', c.url + 'salary/'], ['How to become one', c.url + 'how-to-become/'], ['Interview questions', c.url + 'interview-questions/']])}`;
  return {
    path, crumbs, og: `/og/${c.slug}.png`, kind: 'Training', name: `${c.title} Training`,
    mcta: `<a class="btn btn-primary" href="${buy}">Buy now · ${usd(m.price)}</a>`,
    title: fitTitle(pick([`${c.title} Training: ${m.short}`, `${c.title} Training (Online)`])),
    desc: clamp(`${c.title} training online: ${m.title}, ${m.hours.toLowerCase()}, ${usd(m.price)}. ${p1}`),
    body: `${pageHero({ crumbs, eyebrow: `${cat.name} training`, h1: `${esc(c.title)} Training`, lead: esc(`Start with the training the job requires: ${m.title}. ${m.hours}, online, ${usd(m.price)}.`), extra: `<div class="btn-row"><a class="btn btn-primary" href="${buy}">Buy now</a><a class="btn" href="${href(m.url)}">Course details</a></div>` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
    schema: [faqSchema(faqs, path)]
  };
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
  if (c.replacedBy && partnerById[c.replacedBy]) pages.push(replacedPage(c, ctx));
  else {
    const path = c.trainingUrl;
    const crumbs = [['Home', '/'], ['Training', '/training/'], [cat.name, `/training/#${cat.slug}`], [`${c.title} Training`, path]];
    const price = usd(c.price);
    const main = `${answerBox(`What you’ll learn in ${c.title} training`, `A practical, general introduction to the ${esc(c.lower)} job: what the role involves, ${c.terms.length}+ key terms, how to perform common tasks such as ${listJoin(c.howto.slice(0, 2).map((h) => esc(taskPhrase(h.t))))}, safety essentials and how to launch your career. ${esc(cfg.course.format)}, about ${c.hours} hours, ${price}.`)}
<ul class="facts"><li class="fact"><div class="k">Tuition</div><div class="v">${price}</div><div class="n">${esc(cfg.course.groupNote)}</div></li><li class="fact"><div class="k">Length</div><div class="v">${c.hours} hours</div><div class="n">${mods.length} modules</div></li><li class="fact"><div class="k">Format</div><div class="v">Online</div><div class="n">Self-paced, any device</div></li><li class="fact"><div class="k">Access</div><div class="v">12 months</div><div class="n">LMS access</div></li><li class="fact"><div class="k">Level</div><div class="v">Beginner</div><div class="n">To intermediate</div></li><li class="fact"><div class="k">You receive</div><div class="v">Certificate</div><div class="n">Of completion</div></li></ul>
<h2 id="outcomes">Learning outcomes</h2><p>By the end of this course you will be able to:</p><ul class="checks">${outs.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
<h2 id="syllabus">Course syllabus</h2><p>${mods.length} modules, about ${c.hours} hours in total.</p><div class="modules">${mods.map(([t, ls, mins], i) => `<details${i === 0 ? ' open' : ''}><summary><span class="n">MODULE ${String(i + 1).padStart(2, '0')}</span><span>${esc(t)}</span><span class="dur">${minutesLabel(mins)}</span></summary><ul>${ls.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></details>`).join('')}</div>
<h2 id="who">Who this training is for</h2><ul><li><strong>Students:</strong> find out what the ${esc(c.lower)} job is really like before choosing a program or major.</li><li><strong>Career changers:</strong> test-drive the field and build vocabulary and confidence before investing in formal training.</li><li><strong>New hires and employers:</strong> shorten ramp-up time with a consistent foundation for every new ${esc(c.lower)}.</li></ul>
<h2 id="pricing">Pricing</h2><p><strong>${price} per learner.</strong> Buying for a team? Volume pricing applies automatically from 2 learners.</p>${tierTable()}
<h2 id="preview">Free preview lessons</h2><p>Sample the course material for free:</p><ul><li><a href="${href(c.url + 'glossary/')}">${esc(c.title)} vocabulary (${c.terms.length} terms)</a></li>${c.howto.map((h) => `<li><a href="${href(`${c.url}how-to/${h.slug}/`)}">How to ${esc(taskPhrase(h.t))}</a></li>`).join('')}<li><a href="${href(path + 'practice-test/')}">${esc(c.title)} practice test (${qs.length} questions)</a></li><li><a href="${href(c.url + 'day-in-the-life/')}">A day in the life of ${c.a} ${esc(c.lower)}</a></li></ul>
<h2 id="career">Why train for this career</h2><p>${esc(c.summary)} BLS reports a median wage of <strong>${money(c.l.wages.median)}</strong> (${ctx.labor.meta.oewsLabel}) and about <strong>${c.l.annualOpenings.toLocaleString('en-US')}</strong> openings per year. <a href="${href(c.url)}">Read the full ${esc(c.lower)} career profile</a> or <a href="${href(c.url + 'salary/')}">see salary details</a>.</p>
<aside class="callout info"><p><strong>Important:</strong> This is a general, non-credit career-preparation course. It does not by itself grant a state license, national certification, college credit or a guarantee of employment, and it does not replace any state-required training program. ${c.license ? esc(c.license) : ''}</p></aside>
${enrollForm({ course: c, heading: `Enroll in ${c.title} Training` })}
${faqBlock(faqs, `${c.title} training FAQ`)}
<h2 id="related">Related trainings</h2><div class="grid">${c.related.map((s) => byslug[s]).filter(Boolean).map((r) => `<article class="card link"><h3><a class="stretch" href="${href(r.trainingUrl)}">${esc(r.title)} Training</a></h3><p>${esc(r.blurb)}</p></article>`).join('')}</div>`;
    const aside = `<div class="cta-card"><h2>${esc(c.title)} Training</h2><p class="buy-price">${price}<span> per learner</span></p><p>${esc(cfg.course.format)} · about ${c.hours} hours · ${esc(cfg.course.certificate)}</p><ul><li>${mods.length} modules</li><li>${c.terms.length}+ key terms</li><li>${qs.length}-question practice exam</li></ul><a class="btn btn-primary" href="#enroll">Enroll now</a></div>${sideLinks(`Explore the ${c.lower} career`, [['Career overview', c.url], ['Salary & pay scale', c.url + 'salary/'], ['How to become one', c.url + 'how-to-become/'], ['Interview questions', c.url + 'interview-questions/'], ['Is it right for me? (quiz)', c.url + 'is-it-right-for-me/']])}`;
    pages.push({
      path, crumbs, og, kind: 'Training', name: `${c.title} Training`, scripts: ['enroll'],
      mcta: `<a class="btn btn-primary" href="#enroll">Enroll now</a><a class="btn" href="${href(path + 'practice-test/')}">Free practice test</a>`,
      title: fitTitle(pick([`${c.title} Training Course (Online)`, `${c.title} Training (Online)`, `${c.short} Training Course (Online)`])),
      desc: clamp(`Online ${c.lower} training: ${c.hours} hours, ${price}. Learn the duties, ${c.terms.length}+ key terms, step-by-step tasks, safety and how to get hired. Self-paced, with a certificate.`),
      body: `${pageHero({ crumbs, eyebrow: `${cat.name} training`, h1: `${esc(c.title)} Training`, lead: `Learn what ${esc(c.pluralLower)} do and how they do it: a semi-in-depth, practical course covering the role, vocabulary, common procedures, safety and career launch.`, extra: `<div class="btn-row"><a class="btn btn-primary" href="#enroll">Enroll now</a><a class="btn" href="#syllabus">View syllabus</a></div>` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
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
    const data = { type: 'graded', answers: qs.map((q) => q.a), passing: 70, cta: { text: `Ready to go deeper? ${c.title} training covers every topic on this test and more.`, link: href(c.trainingUrl), btn: `Enroll in ${c.title} training` } };
    const main = `${answerBox('About this practice test', `${qs.length} multiple-choice questions on ${esc(c.lower)} knowledge, safety and vocabulary. Submit to see your score and explanations, or open any question’s answer as you go. Nothing is saved or shared.`)}
<form class="quiz" data-quiz novalidate>${qs.map((q, i) => `<fieldset id="q${i + 1}"><legend><span class="qn">Question ${i + 1} of ${qs.length}</span>${esc(q.q)}</legend><div class="opts">${q.o.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}"><span>${esc(o)}</span></label>`).join('')}</div><details class="explain"><summary>Show answer</summary><p><strong>Answer: ${esc(q.o[q.a])}.</strong> ${esc(q.why)}</p></details></fieldset>`).join('')}
<div class="quiz-bar"><div class="progress" aria-hidden="true"><i></i></div><button class="btn btn-primary" type="submit">Grade my test</button></div></form>
<section class="results" aria-live="polite" tabindex="-1"></section>
<script type="application/json" id="quiz-data">${JSON.stringify(data)}</script>
<h2 id="study">How to study</h2><ul><li>Review the <a href="${href(c.url + 'glossary/')}">${esc(c.lower)} glossary</a>: half of these questions test vocabulary.</li><li>Read the step-by-step guides: ${c.howto.map((h) => `<a href="${href(`${c.url}how-to/${h.slug}/`)}">${esc(taskPhrase(h.t))}</a>`).join(', ')}.</li><li>Retake the test until you score 90% or higher.</li></ul>`;
    const aside = `<div class="cta-card"><h2>Go beyond the practice test</h2><p>${esc(c.title)} training includes ${mods.length} modules and a full final exam.</p><a class="btn btn-primary" href="${href(c.trainingUrl)}">View training</a></div>${sideLinks('Study resources', [['Glossary', c.url + 'glossary/'], ['How-to guides', c.url + 'how-to/'], ['Interview questions', c.url + 'interview-questions/'], ['Career overview', c.url]])}`;
    pages.push({
      path, crumbs, og, kind: 'Practice test', name: `${c.title} practice test`, scripts: ['quiz'],
      mcta: `<a class="btn btn-primary" href="${href(c.trainingUrl)}">View training</a>`,
      title: fitTitle(pick([`${c.title} Practice Test: ${qs.length} Free Questions`, `${c.title} Practice Test (Free)`, `${c.short} Practice Test: ${qs.length} Free Questions`])),
      desc: clamp(`Free ${c.lower} practice test: ${qs.length} multiple-choice questions on job knowledge, safety and key vocabulary, with answers and explanations. Instant score.`),
      body: `${pageHero({ crumbs, eyebrow: 'Free practice test', h1: `${esc(c.title)} Practice Test`, lead: `Check what you know about the ${esc(c.lower)} job with ${qs.length} free questions and instant explanations.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
      schema: [{ '@type': 'Quiz', name: `${c.title} Practice Test`, about: { '@type': 'Thing', name: c.title }, educationalLevel: 'Beginner', hasPart: qs.map((q) => ({ '@type': 'Question', eduQuestionType: 'Multiple choice', text: q.q, acceptedAnswer: { '@type': 'Answer', text: q.o[q.a] }, suggestedAnswer: q.o.filter((_, j) => j !== q.a).map((o) => ({ '@type': 'Answer', text: o })) })) }]
    });
  }
  return pages;
}

export function trainingCatalog(ctx) {
  const { careers, categories } = ctx;
  const path = '/training/';
  const crumbs = [['Home', '/'], ['Training', path]];
  const body = `${pageHero({ crumbs, eyebrow: `${careers.length} job-title trainings`, h1: 'Career Training by Job Title', lead: `Practical, self-paced online courses that teach you what a job really involves: duties, vocabulary, common procedures, safety and how to get hired. Pick a job title to start.`, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href('/enroll/')}">Enroll</a><a class="btn" href="${href('/quizzes/career-match/')}">Not sure? Take the Career Match Quiz</a></div>`})}
<section class="section alt"><div class="wrap"><div class="section-head"><h2>What every training includes</h2></div><div class="grid-3">${[['Role foundations', 'What the job is, where people work, pay and the career ladder.'], ['Day-on-the-job walkthrough', 'A realistic shift so you know what to expect.'], ['Essential vocabulary', 'The terms you’ll hear on day one, with practice drills.'], ['Step-by-step procedures', 'How to perform the common tasks of the role.'], ['Safety & compliance', 'Hazards, standards and professional expectations.'], ['Career launch & final exam', 'Credentials, resumes, interviews and a certificate of completion.']].map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section>
<div class="wrap" style="padding-top:20px;padding-bottom:60px">${categories.map((cat) => `<section id="${cat.slug}" style="scroll-margin-top:90px"><h2>${icon(cat.slug, 26)} ${esc(cat.name)} trainings</h2><p class="muted">${esc(cat.blurb)}</p><div class="grid">${careers.filter((c) => c.cat === cat.slug).map((c) => `<article class="card link"><h3><a class="stretch" href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p>${esc(c.blurb)}</p><ul class="chips"><li class="chip pay">${c.replacedBy && partnerById[c.replacedBy] ? `From ${usd(partnerById[c.replacedBy].price)}` : usd(c.price)}</li><li class="chip">${c.replacedBy && partnerById[c.replacedBy] ? esc(partnerById[c.replacedBy].hours) : `${c.hours} hours`}</li></ul></article>`).join('')}</div></section>`).join('')}
<section id="buy-online" style="scroll-margin-top:90px;margin-top:34px"><h2>More job titles: buy online</h2><p class="muted">Complete online training for these job titles comes from our affiliated training provider. Buy online and start right away.</p>${partnerTable(partnerCourses.filter((p) => !careers.some((c) => c.replacedBy === p.id)), { caption: 'More job-title courses' })}</section>
<aside class="callout info" style="margin-top:30px"><p>Career Education Institute trainings are general, non-credit career-preparation courses for U.S. learners. They do not replace state-required licensing programs. ${esc(cfg.course.groupNote)}: see <a href="${href('/for-employers/')}">training for employers</a>.</p></aside></div>`;
  return {
    path, crumbs, og: '/og/training.png', kind: 'Training catalog', name: 'All trainings',
    title: fitTitle('Online Career Training by Job Title (50 Courses)'),
    desc: clamp(`Browse ${careers.length} online career trainings by job title: healthcare, skilled trades, safety, logistics, business, tech and public safety. Self-paced, practical and built for U.S. learners.`),
    body,
    schema: [{ '@type': 'ItemList', name: 'Career Education Institute trainings', itemListElement: careers.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(c.trainingUrl), name: `${c.title} Training` })) }]
  };
}
