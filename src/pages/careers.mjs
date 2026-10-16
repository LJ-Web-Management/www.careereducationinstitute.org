import cfg from '../../site.config.mjs';
import { esc, href, abs, money, money2, pct, num, fmtDate, clamp, fitTitle, listJoin, lowerFirst, year, taskPhrase } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, icon } from '../lib/layout.mjs';
import { subnav, pick, dataNote, facts, rangeBar, occupationSchema, relatedCards, compareSlug, genFaqs, stateNote, growthWord, SUB } from '../lib/career-helpers.mjs';
import { catBySlug } from '../data/categories.mjs';
import { careerCourses } from '../data/partner-selection.mjs';
import { partnerById, partnerTable } from '../lib/partners.mjs';

const usd = (n) => '$' + Number(n).toFixed(2);

const Y = year();

function shell(c, ctx, { path, h1, lead, eyebrow, main, aside = '', showAka = false, crumb, trail = [] }) {
  const cat = catBySlug[c.cat];
  const crumbs = [['Home', '/'], ['Careers', '/careers/'], [cat.name, `/careers/${cat.slug}/`], [c.title, c.url], ...trail];
  if (path !== c.url) crumbs.push([crumb || eyebrow, path]);
  const side = aside || defaultAside(c, ctx, path);
  return {
    crumbs,
    body: `${pageHero({ crumbs, eyebrow: eyebrow || cat.name, h1, lead, aka: showAka && c.aka?.length ? `Also called: ${c.aka.map(esc).join(' · ')}` : '' })}${subnav(c, path)}<div class="wrap layout"><div class="prose">${main}</div><aside>${side}</aside></div>`
  };
}

function defaultAside(c, ctx, path) {
  const links = SUB.filter(([, p]) => c.url + p !== path).map(([t, p]) => [`${c.short} ${t === 'Overview' ? 'overview' : t.toLowerCase()}`, c.url + p]);
  const m = c.replacedBy && partnerById[c.replacedBy];
  return `${m ? ctaCard({ title: `${c.title} Training`, text: `Start with ${esc(m.title)}, the training this job requires.`, items: [`${usd(m.price)} per learner`, m.hours, 'Online, self-paced'], btn: 'View training', link: c.trainingUrl }) : ctaCard({ title: `${c.title} Training`, text: `Learn the job before you start it: duties, vocabulary, common procedures and safety in one self-paced online course.`, items: [`${usd(c.price)} per learner`, `About ${c.hours} hours`, cfg.course.certificate], btn: 'View training & enroll', link: c.trainingUrl })}${sideLinks(`More about ${c.pluralLower}`, links.slice(0, 9))}${sideLinks('Related careers', c.related.map((s) => ctx.byslug[s]).filter(Boolean).map((r) => [r.title, r.url]))}`;
}

const mcta = (c) => `<a class="btn btn-primary" href="${href(c.trainingUrl)}">Enroll in training</a><a class="btn" href="${href(c.url + 'is-it-right-for-me/')}">Take fit quiz</a>`;
const og = (c) => `/og/${c.slug}.png`;
const sources = (c, labor) => `<section class="sources"><h2>Sources</h2><ul><li>U.S. Bureau of Labor Statistics, ${esc(labor.meta.wageSource)}, SOC ${c.l.soc} (${esc(c.l.blsTitle)}).</li><li>U.S. Bureau of Labor Statistics, ${esc(labor.meta.projectionsSource)}.</li><li><a href="https://www.onetonline.org/link/summary/${c.l.soc}.00" rel="noopener">O*NET OnLine summary for ${esc(c.l.blsTitle)}</a> (U.S. Department of Labor).</li><li><a href="https://www.bls.gov/ooh/" rel="noopener">BLS Occupational Outlook Handbook</a>.</li></ul><p>Reviewed by the MrPress Education Curriculum Team. Pay figures are national estimates; local pay varies. See our <a href="${href('/editorial-policy/')}">editorial policy</a>.</p></section>`;

export function careerPages(c, ctx) {
  const { labor, byslug } = ctx;
  const w = c.l.wages;
  const pages = [];
  const allFaqs = [...c.faq, ...genFaqs(c, labor)];

  // ---------- Overview ----------
  {
    const path = c.url;
    const faqs = allFaqs.slice(0, 6);
    const main = `${answerBox(`What does ${c.a} ${c.lower} do?`, `${esc(c.summary)} The median pay is <strong>${money(w.median)} per year</strong> (BLS, ${labor.meta.oewsLabel}), most people train for about <strong>${esc(c.train)}</strong>, and employment is projected to grow <strong>${pct(c.l.growthPct)}</strong> from ${labor.meta.projections}.`)}
${dataNote(labor)}${facts(c, labor)}
<h2 id="what-they-do">What ${c.pluralLower} do</h2>${c.overview.map((p) => `<p>${esc(p)}</p>`).join('')}
<h3>Typical duties</h3><ul>${c.duties.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
<h2 id="work-environment">Work environment and schedule</h2><p>${esc(c.env)}</p><p><strong>Schedule:</strong> ${esc(c.schedule)}</p>
<h2 id="day">A day in the life</h2><ol class="timeline">${c.day.slice(0, 4).map(([t, d]) => `<li><time>${t}</time>${esc(d)}</li>`).join('')}</ol><p><a href="${href(c.url + 'day-in-the-life/')}">See a full day in the life of ${c.a} ${esc(c.lower)} →</a></p>
<h2 id="salary">${esc(c.title)} salary</h2><p>Half of ${esc(c.pluralLower)} earned more than ${money(w.median)} and half earned less in ${labor.meta.oewsLabel}. Pay ranged from about ${money(w.p10)} for the lowest 10% to ${money(w.p90)} for the top 10%.</p>${rangeBar(w)}<p><a href="${href(c.url + 'salary/')}">Full ${esc(c.lower)} pay scale and hourly rates →</a></p>
<h2 id="how-to-become">How to become ${c.a} ${esc(c.lower)}</h2><ol>${c.steps.map(([t]) => `<li>${esc(t)}</li>`).join('')}</ol><p>${esc(c.edu)}</p><p><a href="${href(c.url + 'how-to-become/')}">Step-by-step guide to becoming ${c.a} ${esc(c.lower)} →</a></p>
<h2 id="skills">Skills and tools</h2><div class="cols"><div><h3>Technical skills</h3><ul class="checks">${c.hard.slice(0, 5).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div><div><h3>People skills</h3><ul class="checks">${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div></div><p style="margin-top:1em"><a href="${href(c.url + 'skills/')}">All ${esc(c.lower)} skills and tools →</a></p>
<h2 id="pros-cons">Pros and cons</h2><div class="cols"><div><h3>Pros</h3><ul class="checks">${c.pros.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div><div><h3>Cons</h3><ul class="crosses">${c.cons.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
<h2 id="certifications">Certifications and licenses</h2><ul>${c.certs.map(([n, d]) => `<li><strong>${esc(n)}:</strong> ${esc(d)}</li>`).join('')}</ul>${stateNote(c)}
<h2 id="career-path">Career path</h2><ol class="ladder">${c.path.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join('')}</ol>
<h2 id="learn-the-job">Learn the job before day one</h2>${c.replacedBy && partnerById[c.replacedBy] ? `<p>The training this job requires is <a href="${href(partnerById[c.replacedBy].url)}">${esc(partnerById[c.replacedBy].title)}</a> (${esc(partnerById[c.replacedBy].hours.toLowerCase())}, ${usd(partnerById[c.replacedBy].price)}), available online. Our free resources cover the rest: ${c.terms.length}+ key terms, step-by-step procedures such as ${listJoin(c.howto.slice(0, 2).map((h) => `<a href="${href(`${c.url}how-to/${h.slug}/`)}">${esc(taskPhrase(h.t))}</a>`))} and a practice test.</p>` : `<p>Our <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a> (${c.hours} hours, ${usd(c.price)}) covers the role, ${c.terms.length}+ key terms, step-by-step procedures such as ${listJoin(c.howto.slice(0, 2).map((h) => `<a href="${href(`${c.url}how-to/${h.slug}/`)}">${esc(taskPhrase(h.t))}</a>`))}, safety and how to land your first job.</p>`}<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">View ${esc(c.title)} training</a><a class="btn" href="${href(c.url + 'is-it-right-for-me/')}">Is this career right for me?</a></div>
${(careerCourses[c.slug] || []).length ? `<h2 id="certifications">Certification and safety courses for ${esc(c.pluralLower)}</h2><p>Courses employers often ask ${esc(c.pluralLower)} to complete. Each is 100% online and can be purchased right now.</p>${partnerTable(careerCourses[c.slug].slice(0, 6), { caption: `Courses for ${c.pluralLower}` })}` : ''}
<h2 id="related">Related careers</h2>${relatedCards(c.related, byslug)}<p style="margin-top:14px">Compare: ${c.related.filter((s) => byslug[s]).map((s) => `<a href="${href(`/compare/${compareSlug(c.slug, s)}/`)}">${esc(c.short)} vs. ${esc(byslug[s].short)}</a>`).join(' · ')}</p>
${faqBlock(faqs, `${c.title} FAQ`)}<p><a href="${href(c.url + 'faq/')}">More ${esc(c.lower)} questions →</a></p>${sources(c, labor)}`;
    const s = shell(c, ctx, { path, h1: esc(c.title), lead: `What ${esc(c.pluralLower)} do, what they earn, how long training takes and how to get started, with official BLS pay data and practical, job-level detail.`, eyebrow: `${catBySlug[c.cat].name} career`, main, showAka: true });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Career', name: c.title,
      title: fitTitle(pick([`What Does ${c.a === 'an' ? 'an' : 'a'} ${c.title} Do? Duties, Pay & Outlook`, `${c.title}: Job Description, Pay & Outlook`, `${c.title} Career Guide`, c.title])),
      desc: clamp(`What does ${c.a} ${c.lower} do? Duties, a typical day, ${money(w.median)} median pay (BLS ${labor.meta.oewsLabel}), ${c.train} of training, skills, certifications and how to start.`),
      schema: [occupationSchema(c, labor, abs(path)), faqSchema(faqs, path)]
    });
  }

  // ---------- Salary ----------
  {
    const path = c.url + 'salary/';
    const rows = [['10th percentile', w.p10, 'Typical for new workers, part-time markets and lower-paying settings'], ['25th percentile', w.p25, 'Early career, a year or two of experience'], ['Median (50th)', w.median, 'Mid-career: half earn more, half earn less'], ['75th percentile', w.p75, 'Experienced workers, specialists and higher-paying employers'], ['90th percentile', w.p90, 'Top earners: senior, specialized, supervisory or high-cost areas']];
    const rel = [c.slug, ...c.related].map((s) => byslug[s]).filter(Boolean).sort((a, b) => b.l.wages.median - a.l.wages.median);
    const max = Math.max(...rel.map((r) => r.l.wages.median));
    const cat = catBySlug[c.cat];
    const faqs = [
      [`How much does ${c.a} ${c.lower} make per hour?`, `The median hourly wage for ${c.pluralLower} was ${money2(w.hourly)} in ${labor.meta.oewsLabel} (BLS). Hourly pay for the lowest 10% was about ${money2(w.p10 / 2080)} and the top 10% earned about ${money2(w.p90 / 2080)} or more.`],
      [`How much does ${c.a} ${c.lower} make a month?`, `At the median annual wage of ${money(w.median)}, that works out to about ${money(w.median / 12)} per month before taxes, or about ${money(w.median / 26)} every two weeks.`],
      [`What is the starting salary for ${c.a} ${c.lower}?`, `New ${c.pluralLower} often start near the lower end of the range. The 10th percentile was ${money(w.p10)} and the 25th percentile was ${money(w.p25)} per year in ${labor.meta.oewsLabel}. Starting pay depends on location, employer and credentials.`],
      [`How can ${c.pluralLower} earn more?`, `Common ways include earning ${listJoin(c.certs.slice(0, 2).map((x) => x[0]))}, gaining specialty experience, taking shifts or roles with premium pay, and moving up the career ladder to roles such as ${c.path[2][0].toLowerCase()}.`]
    ];
    const main = `${answerBox(`How much does ${c.a} ${c.lower} make?`, `The median ${esc(c.lower)} salary in the U.S. is <strong>${money(w.median)} per year</strong>, or <strong>${money2(w.hourly)} per hour</strong>, based on Bureau of Labor Statistics data for ${labor.meta.oewsLabel}. The lowest-paid 10% earned under ${money(w.p10)}, while the top 10% earned more than ${money(w.p90)}.`)}
${dataNote(labor)}
<h2 id="pay-scale">${esc(c.title)} pay scale</h2>${rangeBar(w)}
<div class="table-wrap"><table><caption class="vh">${esc(c.title)} pay by percentile, ${labor.meta.oewsLabel}</caption><thead><tr><th scope="col">Percentile</th><th scope="col" class="num">Annual</th><th scope="col" class="num">Hourly*</th><th scope="col">What it usually reflects</th></tr></thead><tbody>${rows.map(([p, v, t]) => `<tr><th scope="row">${p}</th><td class="num">${money(v)}</td><td class="num">${money2(v / 2080)}</td><td>${t}</td></tr>`).join('')}</tbody></table></div>
<p class="small muted">*Hourly figures other than the median are annual wages divided by 2,080 hours. Percentile descriptions are general patterns, not guarantees.</p>
<h2 id="monthly">Monthly and biweekly pay</h2><div class="table-wrap"><table><thead><tr><th scope="col">Pay period</th><th scope="col" class="num">At 25th percentile</th><th scope="col" class="num">At median</th><th scope="col" class="num">At 75th percentile</th></tr></thead><tbody>${[['Per year', 1], ['Per month', 12], ['Every two weeks', 26], ['Per week', 52]].map(([n, d]) => `<tr><th scope="row">${n}</th><td class="num">${money(w.p25 / d)}</td><td class="num">${money(w.median / d)}</td><td class="num">${money(w.p75 / d)}</td></tr>`).join('')}</tbody></table></div><p class="small muted">Gross pay before taxes and deductions.</p>
<h2 id="factors">What affects ${esc(c.lower)} pay</h2><ul>${cat.payFactors.map((f) => `<li>${esc(f)}</li>`).join('')}<li>Geography and cost of living: metropolitan areas and some states pay well above the national median</li></ul>
<h2 id="earn-more">How to earn more as ${c.a} ${esc(c.lower)}</h2><ol><li><strong>Get credentialed:</strong> ${c.certs.slice(0, 3).map(([n]) => esc(n)).join(', ')}.</li><li><strong>Build specialty experience:</strong> ${esc(c.path[1][1])}</li><li><strong>Move up:</strong> roles such as ${esc(c.path[2][0].toLowerCase())} and ${esc(c.path[3][0].toLowerCase())} typically pay more.</li><li><strong>Negotiate:</strong> research local pay and use our <a href="${href('/guides/how-to-negotiate-salary/')}">salary negotiation guide</a>.</li></ol>
<h2 id="compare">${esc(c.title)} pay vs. related careers</h2><ul class="bars">${rel.map((r) => `<li class="${r.slug === c.slug ? 'me' : ''}"><a href="${href(r.url + 'salary/')}">${esc(r.title)}</a><span class="b"><i style="width:${((r.l.wages.median / max) * 100).toFixed(1)}%"></i></span><span>${money(r.l.wages.median)}</span></li>`).join('')}</ul>
<h2 id="outlook">Job outlook</h2><p>BLS projects employment of ${esc(c.pluralLower)} to change by <strong>${pct(c.l.growthPct)}</strong> from ${labor.meta.projections}, ${growthWord(c.l.growthPct)} compared with the 3.5% average for all occupations. About <strong>${num(c.l.annualOpenings)}</strong> openings are projected each year, on average, including openings to replace workers who retire or change occupations.</p>
<h2 id="methodology">About this data</h2><p>Figures come from the BLS Occupational Employment and Wage Statistics survey (${labor.meta.oewsLabel}), which covers wage and salary workers nationwide under SOC code ${c.l.soc} (“${esc(c.l.blsTitle)}”). Wages exclude self-employment income, overtime and most bonuses unless they are part of regular pay. We refresh these numbers when BLS releases new estimates each spring.</p>
${faqBlock(faqs, `${c.title} salary FAQ`)}<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Start ${esc(c.title)} training</a><a class="btn" href="${href('/salary-guide/')}">Compare all 50 salaries</a></div>${sources(c, labor)}`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} Salary &amp; Pay Scale (${Y})`, lead: `What ${esc(c.pluralLower)} earn per year, per hour and per month, with the full percentile range, the factors that move pay and how to earn more.`, eyebrow: 'Salary guide', crumb: 'Salary', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Salary', name: `${c.title} salary`,
      title: fitTitle(pick([`${c.title} Salary (${Y}): Pay Scale & Hourly Wage`, `${c.title} Salary (${Y}) & Pay Scale`, `${c.short} Salary (${Y}): Pay Scale & Hourly Wage`, `${c.title} Salary (${Y})`])),
      desc: clamp(`${c.title} salary: ${money(w.median)} median per year (${money2(w.hourly)}/hr), per BLS ${labor.meta.oewsLabel} data. Full pay scale from ${money(w.p10)} to ${money(w.p90)}, monthly pay and how to earn more.`),
      schema: [occupationSchema(c, labor, abs(path)), faqSchema(faqs, path)]
    });
  }

  // ---------- Day in the life ----------
  {
    const path = c.url + 'day-in-the-life/';
    const main = `${answerBox(`What is a typical day like for ${c.a} ${c.lower}?`, `${esc(c.day[0][1])} From there, the day usually includes ${listJoin(c.duties.slice(0, 3).map((d) => esc(lowerFirst(d))))}. ${esc(c.schedule)}`)}
<h2 id="timeline">Hour by hour: a typical shift</h2><p>No two days are identical, but this timeline reflects a realistic day for ${c.a} ${esc(c.lower)} working full time.</p><ol class="timeline">${c.day.map(([t, d]) => `<li><time>${t}</time>${esc(d)}</li>`).join('')}</ol>
<h2 id="environment">Where ${esc(c.pluralLower)} work</h2><p>${esc(c.env)}</p>
<h2 id="schedule">Hours and schedule</h2><p>${esc(c.schedule)}</p>
<h2 id="tasks">Tasks you’ll do most often</h2><ul class="checks">${c.duties.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
<h2 id="tools">Tools you’ll use every day</h2><ul>${c.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
<h2 id="best-worst">The best and hardest parts of the job</h2><div class="cols"><div><h3>What people like</h3><ul class="checks">${c.pros.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div><div><h3>What’s hard</h3><ul class="crosses">${c.cons.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
<h2 id="thrive">You’ll likely thrive if…</h2><ul>${c.fit.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><p>Not sure? Take the free <a href="${href(c.url + 'is-it-right-for-me/')}">${esc(c.title)} fit quiz</a> or the <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a>.</p>
<h2 id="safety">Staying safe on the job</h2><ul>${c.safety.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Train to become ${c.a} ${esc(c.lower)}</a><a class="btn" href="${href(c.url + 'how-to/')}">See step-by-step job tasks</a></div>`;
    const s = shell(c, ctx, { path, h1: `A Day in the Life of ${c.a === 'an' ? 'an' : 'a'} ${esc(c.title)}`, lead: `What ${esc(c.pluralLower)} actually do from the start of a shift to the end: the tasks, tools, schedule and realities of the job.`, eyebrow: 'Day in the life', crumb: 'Day in the Life', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Day in the life', name: `Day in the life of ${c.a} ${c.lower}`, type: 'article',
      title: fitTitle(pick([`A Day in the Life of ${c.a === 'an' ? 'an' : 'a'} ${c.title}`, `${c.title}: A Day in the Life`, `Day in the Life: ${c.short}`])),
      desc: clamp(`What does ${c.a} ${c.lower} do all day? An hour-by-hour look at a real shift: tasks, tools, schedule, work environment, and the best and hardest parts of the job.`),
      schema: [{ '@type': 'Article', headline: `A Day in the Life of ${c.a} ${c.title}`, author: { '@id': abs('/#org') }, publisher: { '@id': abs('/#org') }, datePublished: cfg.launched, dateModified: cfg.updated, mainEntityOfPage: abs(path), image: abs(og(c)), about: { '@id': abs(c.url) + '#occupation' } }]
    });
  }

  // ---------- How to become ----------
  {
    const path = c.url + 'how-to-become/';
    const faqs = allFaqs.filter(([q]) => /long|degree|certif/i.test(q)).slice(0, 4);
    const main = `${answerBox(`How do you become ${c.a} ${c.lower}?`, `To become ${c.a} ${esc(c.lower)}: ${c.steps.map(([t], i) => `(${i + 1}) ${esc(lowerFirst(t))}`).join(', ')}. Most people need about <strong>${esc(c.train)}</strong>. BLS lists “${esc(c.l.entryEducation.toLowerCase())}” as the typical entry-level education.`)}
<h2 id="steps">${c.steps.length} steps to become ${c.a} ${esc(c.lower)}</h2><ol class="steps">${c.steps.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
<h2 id="education">Education and training requirements</h2><p>${esc(c.edu)}</p><div class="table-wrap"><table><tbody><tr><th scope="row">Typical entry-level education (BLS)</th><td>${esc(c.l.entryEducation)}</td></tr><tr><th scope="row">Related work experience</th><td>${esc(c.l.relatedExperience)}</td></tr><tr><th scope="row">On-the-job training</th><td>${esc(c.l.onTheJobTraining)}</td></tr><tr><th scope="row">Typical training time</th><td>${esc(c.train)}</td></tr></tbody></table></div>
<h2 id="certifications">Certifications and licenses</h2><ul>${c.certs.map(([n, d]) => `<li><strong>${esc(n)}:</strong> ${esc(d)}</li>`).join('')}</ul>${stateNote(c)}
<h2 id="skills-to-build">Skills to build now</h2><p>Start with ${listJoin(c.hard.slice(0, 3).map((s) => esc(s.toLowerCase())))}, and practice ${listJoin(c.soft.slice(0, 2).map((s) => esc(s.toLowerCase())))}. Learning the <a href="${href(c.url + 'glossary/')}">${esc(c.lower)} vocabulary</a> early makes training and interviews easier.</p>
<h2 id="career-ladder">Where the career can lead</h2><ol class="ladder">${c.path.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join('')}</ol>
<h2 id="get-started">Get a head start</h2><p>Our self-paced <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a> gives you a realistic, practical overview of the job (duties, terminology, step-by-step tasks, safety and interview prep) so you can decide with confidence and show employers you’re serious.</p><div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Enroll in ${esc(c.title)} training</a><a class="btn" href="${href(c.url + 'interview-questions/')}">Prep for interviews</a></div>
${faqBlock(faqs, 'Common questions about getting started')}${sources(c, labor)}`;
    const s = shell(c, ctx, { path, h1: `How to Become ${c.a === 'an' ? 'an' : 'a'} ${esc(c.title)}`, lead: `The education, training, certifications and steps it takes to start working as ${c.a} ${esc(c.lower)}, plus how long it takes and where the career can lead.`, eyebrow: 'Career roadmap', crumb: 'How to Become', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'How to become', name: `How to become ${c.a} ${c.lower}`, type: 'article',
      title: fitTitle(pick([`How to Become ${c.a === 'an' ? 'an' : 'a'} ${c.title} in ${c.steps.length} Steps`, `How to Become ${c.a === 'an' ? 'an' : 'a'} ${c.title}`, `How to Become ${c.a === 'an' ? 'an' : 'a'} ${c.short}`])),
      desc: clamp(`How to become ${c.a} ${c.lower} in ${c.steps.length} steps: education, ${c.train} of training, certifications such as ${c.certs[0][0]}, skills to build and how to land your first job.`),
      schema: [{ '@type': 'HowTo', name: `How to become ${c.a} ${c.lower}`, description: `Steps to start a career as ${c.a} ${c.lower}.`, step: c.steps.map(([t, d], i) => ({ '@type': 'HowToStep', position: i + 1, name: t, text: d, url: abs(path) + '#steps' })) }, faqSchema(faqs, path)]
    });
  }

  // ---------- Skills ----------
  {
    const path = c.url + 'skills/';
    const main = `${answerBox(`What skills do ${c.pluralLower} need?`, `${esc(c.plural)} need technical skills such as ${listJoin(c.hard.slice(0, 3).map((s) => esc(s.toLowerCase())))}, plus people skills like ${listJoin(c.soft.slice(0, 2).map((s) => esc(s.toLowerCase())))}. They also use tools such as ${listJoin(c.tools.slice(0, 2).map(esc))}.`)}
<h2 id="hard-skills">Technical (hard) skills</h2><ul class="checks">${c.hard.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<h2 id="soft-skills">People (soft) skills</h2><ul class="checks">${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<h2 id="tools">Tools, equipment and technology</h2><ul>${c.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
<h2 id="tasks">Skills in action: common tasks</h2><p>These step-by-step guides show how ${esc(c.pluralLower)} put their skills to work:</p><ul>${c.howto.map((h) => `<li><a href="${href(`${c.url}how-to/${h.slug}/`)}">How to ${esc(taskPhrase(h.t))}</a></li>`).join('')}</ul>
<h2 id="resume">How to show these skills on a resume</h2><ul><li>Lead your skills section with the technical skills from the job posting, for example, “${esc(c.hard[0])}” and “${esc(c.hard[1])}.”</li><li>Prove soft skills with results: instead of listing “${esc(c.soft[0].toLowerCase())},” describe a situation where you used it.</li><li>List credentials such as ${esc(c.certs[0][0])} near the top, with the issuing organization and date.</li><li>Use the employer’s vocabulary. Our <a href="${href(c.url + 'glossary/')}">${esc(c.lower)} glossary</a> covers the terms hiring managers expect.</li></ul>
<h2 id="build">How to build these skills</h2><p>Formal training, supervised practice and certification are the most direct routes. Our <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a> introduces each of these skills with plain-language lessons, procedures and a final knowledge check: a strong foundation before hands-on training or your first day.</p>
<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Build these skills</a><a class="btn" href="${href(c.trainingUrl + 'practice-test/')}">Test your knowledge</a></div>`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} Skills &amp; Tools`, lead: `The technical skills, people skills and tools employers look for in ${esc(c.pluralLower)}, and how to build and show them.`, eyebrow: 'Skills', crumb: 'Skills', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Skills', name: `${c.title} skills`,
      title: fitTitle(pick([`${c.title} Skills: Hard Skills, Soft Skills & Tools`, `${c.title} Skills & Tools`, `${c.short} Skills & Tools`])),
      desc: clamp(`The top ${c.lower} skills employers want: ${c.hard.slice(0, 3).join(', ').toLowerCase()} and more, plus soft skills, tools and how to show them on your resume.`),
      schema: [{ '@type': 'ItemList', name: `${c.title} skills`, itemListElement: [...c.hard, ...c.soft].map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x })) }]
    });
  }

  // ---------- Glossary ----------
  {
    const path = c.url + 'glossary/';
    const terms = [...c.terms].sort((a, b) => a[0].localeCompare(b[0]));
    const main = `${answerBox(`Key ${c.lower} vocabulary`, `These ${terms.length} terms come up constantly in ${esc(c.lower)} training, on the job and in interviews. Knowing them helps you follow instructions, document accurately and sound prepared.`)}
<dl class="glossary">${terms.map(([t, d]) => `<dt id="${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>
<h2 id="practice">Practice these terms</h2><p>Test yourself with the free <a href="${href(c.trainingUrl + 'practice-test/')}">${esc(c.title)} practice test</a>: it includes vocabulary questions built from this list. For a complete course, see <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a>.</p><p>Browse terms from every career in our <a href="${href('/glossary/')}">career glossary</a>.</p>`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} Terms &amp; Vocabulary`, lead: `${terms.length} essential ${esc(c.lower)} terms with plain-English definitions: the vocabulary you’ll hear in training and on day one.`, eyebrow: 'Glossary', crumb: 'Glossary', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Glossary', name: `${c.title} vocabulary`,
      title: fitTitle(pick([`${c.title} Terms & Vocabulary: ${terms.length} Key Definitions`, `${c.title} Vocabulary: ${terms.length} Key Terms`, `${c.short} Vocabulary: ${terms.length} Key Terms`])),
      desc: clamp(`${terms.length} essential ${c.lower} terms defined in plain English, including ${terms.slice(0, 3).map((t) => t[0]).join(', ')}. Learn the vocabulary used in training and on the job.`),
      schema: [{ '@type': 'DefinedTermSet', '@id': abs(path) + '#terms', name: `${c.title} glossary`, hasDefinedTerm: terms.map(([t, d]) => ({ '@type': 'DefinedTerm', name: t, description: d, inDefinedTermSet: abs(path) + '#terms' })) }]
    });
  }

  // ---------- How-to index + each procedure ----------
  {
    const path = c.url + 'how-to/';
    const main = `${answerBox(`Common ${c.lower} tasks`, `Step-by-step overviews of tasks ${esc(c.pluralLower)} perform regularly. Use them to understand the job, prepare for training or refresh your memory.`)}
<div class="grid-2">${c.howto.map((h) => `<article class="card link"><h3><a class="stretch" href="${href(`${path}${h.slug}/`)}">How to ${esc(taskPhrase(h.t))}</a></h3><p>${esc(h.intro)}</p><span class="more">${h.steps.length} steps →</span></article>`).join('')}</div>
<h2 id="disclaimer">Before you practice</h2><aside class="callout warn"><p>These guides are general educational overviews. Always follow your employer’s procedures, manufacturer instructions, supervisor direction and applicable laws and regulations. Some tasks require formal training, supervision or a license before you may perform them.</p></aside>
<h2 id="learn-more">Learn every core task</h2><p>Our <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a> walks through these procedures and more, alongside vocabulary, safety and career-launch lessons.</p>`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} How-To Guides`, lead: `Step-by-step guides to common ${esc(c.lower)} tasks: the practical side of the job.`, eyebrow: 'How-to guides', crumb: 'How-To Guides', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'How-to guides', name: `${c.title} how-to guides`,
      title: fitTitle(pick([`${c.title} How-To Guides: Common Tasks Step by Step`, `${c.title} How-To Guides`, `${c.short} How-To Guides`])),
      desc: clamp(`Step-by-step ${c.lower} how-to guides: ${c.howto.map((h) => taskPhrase(h.t)).join(', ')}. Practical overviews for students, trainees and new hires.`),
      schema: [{ '@type': 'ItemList', itemListElement: c.howto.map((h, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`${path}${h.slug}/`), name: `How to ${h.t}` })) }]
    });

    c.howto.forEach((h) => {
      const hp = `${path}${h.slug}/`;
      const others = c.howto.filter((x) => x !== h);
      const main2 = `${answerBox('Quick answer', `${esc(h.intro)} In short: ${h.steps.slice(0, 3).map((s) => esc(lowerFirst(s.split(/[.: ]/)[0].trim()))).join('; ')}, then complete the remaining steps below.`)}
<h2 id="steps">Step by step</h2><ol class="steps">${h.steps.map((s, i) => `<li id="step-${i + 1}"><p>${esc(s)}</p></li>`).join('')}</ol>
<aside class="callout"><p><strong>Pro tip:</strong> ${esc(h.tip)}</p></aside>
<h2 id="safety">Safety reminders for ${esc(c.pluralLower)}</h2><ul>${c.safety.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<aside class="callout warn"><p>This is a general educational overview, not a substitute for hands-on training. Follow your employer’s procedures, manufacturer instructions and applicable regulations, and perform tasks only within your training and scope of practice.</p></aside>
<h2 id="related-terms">Key terms</h2><p>${c.terms.slice(0, 6).map(([t]) => esc(t)).join(' · ')}: see the full <a href="${href(c.url + 'glossary/')}">${esc(c.lower)} glossary</a>.</p>
${others.length ? `<h2 id="more">More ${esc(c.lower)} how-to guides</h2><ul>${others.map((o) => `<li><a href="${href(`${path}${o.slug}/`)}">How to ${esc(taskPhrase(o.t))}</a></li>`).join('')}</ul>` : ''}
<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Learn this in ${esc(c.title)} training</a><a class="btn" href="${href(c.trainingUrl + 'practice-test/')}">Take the practice test</a></div>`;
      const s2 = shell(c, ctx, { path: hp, h1: `How to ${esc(h.t)}`, lead: esc(h.intro), eyebrow: `${c.title} how-to`, main: main2, trail: [['How-To Guides', path]], crumb: `How to ${h.t}` });
      pages.push({
        path: hp, ...s2, og: og(c), mcta: mcta(c), kind: 'How-to', name: `How to ${h.t}`, type: 'article',
        title: fitTitle(pick([`How to ${h.t} (Step by Step)`, `How to ${h.t}`])),
        desc: clamp(`How to ${taskPhrase(h.t)}: a ${h.steps.length}-step guide for ${c.pluralLower} and trainees, with safety reminders and a pro tip. ${h.intro}`),
        schema: [{ '@type': 'HowTo', name: `How to ${h.t}`, description: h.intro, step: h.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s, url: abs(hp) + `#step-${i + 1}` })) }]
      });
    });
  }

  // ---------- Interview questions ----------
  {
    const path = c.url + 'interview-questions/';
    const generic = [
      [`Why do you want to be ${c.a} ${c.lower}?`, `Connect a real motivation to the work itself. Mention what drew you to ${c.pluralLower}’ day-to-day tasks (for example, ${lowerFirst(c.duties[0])}) and show you understand the challenges as well as the rewards.`],
      ['Tell me about yourself.', `Give a 60–90 second summary: your background, the training or experience that prepared you for this role, and why this employer. Keep it relevant to ${c.lower} work.`],
      ['Describe a time you made a mistake. What did you do?', 'Pick a real, low-stakes example. Explain how you owned it, fixed it and changed your process. Employers want honesty and learning, not perfection.'],
      ['How do you handle stress or a heavy workload?', `Describe a specific system: prioritizing safety-critical work first, communicating early when you are behind, and staying organized. A short example from school or work makes it credible.`],
      ['What questions do you have for us?', 'Always ask two or three: what training looks like for new hires, how success is measured in the first 90 days, and what the team likes most about working there.']
    ];
    const all = [...c.iq, ...generic];
    const main = `${answerBox(`How to prepare for ${c.a} ${c.lower} interview`, `Expect questions about technical knowledge (such as ${esc(c.hard[0].toLowerCase())}), safety and how you work with people. Use the STAR method (Situation, Task, Action, Result) and practice out loud. Below are ${all.length} common questions with guidance on strong answers.`)}
<h2 id="role-specific">${esc(c.title)}-specific questions</h2>${c.iq.map(([q, a], i) => `<h3>${i + 1}. ${esc(q)}</h3><p>${esc(a)}</p>`).join('')}
<h2 id="general">General and behavioral questions</h2>${generic.map(([q, a], i) => `<h3>${c.iq.length + i + 1}. ${esc(q)}</h3><p>${esc(a)}</p>`).join('')}
<h2 id="vocab">Speak the language</h2><p>Hiring managers notice when candidates use the right terms naturally. Review these before your interview: ${c.terms.slice(0, 8).map(([t]) => esc(t)).join(', ')}. See the full <a href="${href(c.url + 'glossary/')}">glossary</a>.</p>
<h2 id="checklist">Interview checklist</h2><ul class="checks"><li>Research the employer and the specific role</li><li>Bring copies of your resume and any certifications (${esc(c.certs[0][0])} if you have it)</li><li>Prepare three STAR stories: teamwork, a problem you solved and a time you stayed calm under pressure</li><li>Dress one step more formal than the job’s daily attire</li><li>Send a short thank-you email within 24 hours</li></ul><p>More tips: <a href="${href('/guides/job-interview-tips/')}">job interview guide</a> · <a href="${href('/guides/how-to-write-a-resume/')}">resume guide</a>.</p>
<div class="btn-row"><a class="btn btn-primary" href="${href(c.trainingUrl)}">Prepare with ${esc(c.title)} training</a></div>`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} Interview Questions &amp; Answers`, lead: `${all.length} questions employers ask ${esc(c.pluralLower)}, and what a strong answer looks like.`, eyebrow: 'Interview prep', crumb: 'Interview Questions', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Interview questions', name: `${c.title} interview questions`, type: 'article',
      title: fitTitle(pick([`${c.title} Interview Questions & Answers`, `${c.title} Interview Questions`, `${c.short} Interview Questions & Answers`, `${c.short} Interview Questions`])),
      desc: clamp(`${all.length} common ${c.lower} interview questions with tips for strong answers, including “${c.iq[0][0]}”, plus a prep checklist and key terms.`),
      schema: [{ '@type': 'Article', headline: `${c.title} Interview Questions & Answers`, author: { '@id': abs('/#org') }, publisher: { '@id': abs('/#org') }, datePublished: cfg.launched, dateModified: cfg.updated, mainEntityOfPage: abs(path), image: abs(og(c)) }]
    });
  }

  // ---------- FAQ ----------
  {
    const path = c.url + 'faq/';
    const main = `${answerBox(`${c.title} FAQ`, `Straight answers to the questions people ask most about becoming ${c.a} ${esc(c.lower)}: pay, training time, degrees, certifications and whether it’s a good career.`)}${faqBlock(allFaqs, `${allFaqs.length} questions about ${c.pluralLower}`, 'questions')}
<h2 id="next">Still deciding?</h2><p>Try the <a href="${href(c.url + 'is-it-right-for-me/')}">${esc(c.title)} fit quiz</a>, compare with <a href="${href(byslug[c.related[0]]?.url || '/careers/')}">${esc(byslug[c.related[0]]?.title || 'other careers')}</a>, or explore <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a>.</p>${sources(c, labor)}`;
    const s = shell(c, ctx, { path, h1: `${esc(c.title)} FAQ`, lead: `Answers to the most common questions about working as ${c.a} ${esc(c.lower)}.`, eyebrow: 'FAQ', crumb: 'FAQ', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'FAQ', name: `${c.title} FAQ`,
      title: fitTitle(pick([`${c.title} FAQ: ${allFaqs.length} Common Questions Answered`, `${c.title} FAQ: ${allFaqs.length} Questions Answered`, `${c.title} FAQ`])),
      desc: clamp(`${c.title} FAQ: how much ${c.pluralLower} make, how long training takes, whether you need a degree or certification, and if it's a good career. ${allFaqs.length} answers.`),
      schema: [faqSchema(allFaqs, path)]
    });
  }

  // ---------- Fit quiz ----------
  {
    const path = c.url + 'is-it-right-for-me/';
    const statements = [...c.fit, `I’m willing to spend about ${c.train} training for this career`, `A typical salary around ${money(w.median)} a year would meet my needs`];
    const rel = c.related.map((s) => byslug[s]).filter(Boolean);
    const data = {
      type: 'band', scale: true,
      bands: [
        { min: 80, title: `Strong fit: ${c.title} looks like a great match`, text: `Your answers line up closely with what the job demands day to day. A practical next step is a structured course so you know exactly what to expect.`, links: [[`Explore ${c.title} training`, href(c.trainingUrl)], [`How to become ${c.a} ${c.lower}`, href(c.url + 'how-to-become/')]] },
        { min: 60, title: `Promising fit: worth exploring further`, text: `Many parts of this career match you. Look closely at the statements you were unsure about; a day-in-the-life read or informational interview can settle them.`, links: [[`A day in the life of ${c.a} ${c.lower}`, href(c.url + 'day-in-the-life/')], [`${c.title} training`, href(c.trainingUrl)]] },
        { min: 40, title: `Mixed fit: compare a few options`, text: `Some parts of the job suit you and some may not. Compare closely related careers that use similar skills.`, links: rel.slice(0, 3).map((r) => [r.title, href(r.url)]) },
        { min: 0, title: `Probably not your best match`, text: `That’s useful to know! Take the Career Match Quiz to find careers that fit your interests better.`, links: [['Career Match Quiz', href('/quizzes/career-match/')], ['Browse all careers', href('/careers/')]] }
      ]
    };
    const main = `${answerBox('How this quiz works', `Rate how much you agree with each statement. The quiz compares your answers with the realities of the ${esc(c.lower)} job and gives you an honest fit score in under two minutes. Nothing is saved or sent anywhere.`)}
<form class="quiz" data-quiz novalidate>${statements.map((st, i) => `<fieldset><legend><span class="qn">Statement ${i + 1} of ${statements.length}</span>${esc(st)}</legend><div class="scale">${['Strongly disagree', 'Disagree', 'Not sure', 'Agree', 'Strongly agree'].map((lab, v) => `<label class="opt"><input type="radio" name="q${i}" value="${v + 1}" required><span>${lab}</span></label>`).join('')}</div></fieldset>`).join('')}
<div class="quiz-bar"><div class="progress" aria-hidden="true"><i></i></div><button class="btn btn-primary" type="submit">See my fit score</button></div></form>
<section class="results" aria-live="polite" tabindex="-1"></section>
<script type="application/json" id="quiz-data">${JSON.stringify(data)}</script>
<h2 id="about">What this career really involves</h2><p>${esc(c.summary)}</p><ul>${c.duties.slice(0, 5).map((d) => `<li>${esc(d)}</li>`).join('')}</ul><p>Read a full <a href="${href(c.url + 'day-in-the-life/')}">day in the life</a> or see <a href="${href(c.url + 'salary/')}">${esc(c.lower)} salary data</a>.</p>`;
    const s = shell(c, ctx, { path, h1: `Is ${esc(c.title)} the Right Career for You?`, lead: `A quick, free ${statements.length}-question quiz to see how well the ${esc(c.lower)} career fits your personality, preferences and goals.`, eyebrow: 'Career fit quiz', crumb: 'Fit Quiz', main });
    pages.push({
      path, ...s, og: og(c), mcta: mcta(c), kind: 'Quiz', name: `${c.title} fit quiz`, scripts: ['quiz'],
      title: fitTitle(pick([`Should I Become ${c.a === 'an' ? 'an' : 'a'} ${c.title}? Free Fit Quiz`, `Is ${c.title} Right for Me? Free Quiz`, `${c.short} Career Fit Quiz`])),
      desc: clamp(`Should you become ${c.a} ${c.lower}? Take this free ${statements.length}-question fit quiz to see how the job’s daily realities, training time and pay match your goals. Instant results.`),
      schema: []
    });
  }

  return pages;
}

// ---------- Career comparison pages ----------
export function comparePage(a, b, ctx) {
  const { labor } = ctx;
  const path = `/compare/${compareSlug(a.slug, b.slug)}/`;
  const [x, y] = [a, b].sort((p, q) => p.slug.localeCompare(q.slug));
  const wx = x.l.wages, wy = y.l.wages;
  const higher = wx.median >= wy.median ? x : y, lower = higher === x ? y : x;
  const faster = x.months <= y.months ? x : y;
  const growthier = x.l.growthPct >= y.l.growthPct ? x : y;
  const row = (k, f) => `<tr><th scope="row">${k}</th><td>${f(x)}</td><td>${f(y)}</td></tr>`;
  const shared = x.traits.filter((t) => y.traits.includes(t) && !['no-degree', 'fast-track'].includes(t));
  const traitWords = { people: 'working with people', 'hands-on': 'hands-on work', data: 'working with information', helping: 'helping others', outdoors: 'working outdoors', indoors: 'indoor work', physical: 'physical work', desk: 'desk work', 'fast-paced': 'a fast pace', steady: 'steady routines', team: 'teamwork', independent: 'working independently', 'shift-work': 'shift work', travel: 'travel', 'remote-friendly': 'remote-friendly work', creative: 'creative work', 'problem-solving': 'problem-solving', 'high-responsibility': 'high responsibility' };
  const pickFor = (c) => c.fit.slice(0, 3).map((f) => `<li>${esc(f)}</li>`).join('');
  const crumbs = [['Home', '/'], ['Careers', '/careers/'], ['Compare careers', '/compare/'], [`${x.short} vs. ${y.short}`, path]];
  const faqs = [
    [`Which pays more, ${x.lower} or ${y.lower}?`, `${higher.plural} earn more at the median: ${money(higher.l.wages.median)} versus ${money(lower.l.wages.median)} for ${lower.pluralLower}, based on BLS ${labor.meta.oewsLabel} data.`],
    [`Which takes less time to train for?`, `${faster.plural} typically train faster (${faster.train}) than ${(faster === x ? y : x).pluralLower} (${(faster === x ? y : x).train}).`],
    [`Which career has better job growth?`, `BLS projects ${growthier.pluralLower} to grow ${pct(growthier.l.growthPct)} from ${labor.meta.projections}, compared with ${pct((growthier === x ? y : x).l.growthPct)} for ${(growthier === x ? y : x).pluralLower}.`]
  ];
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const main = `${answerBox(`${x.title} vs. ${y.title}: the short answer`, `${esc(cap(higher.pluralLower))} earn more at the median (${money(higher.l.wages.median)} vs. ${money(lower.l.wages.median)}), while ${esc(faster.pluralLower)} usually get to work faster (${esc(faster.train)} of training). ${esc(cap(x.pluralLower))} ${esc(lowerFirst(x.blurb))} ${esc(cap(y.pluralLower))} ${esc(lowerFirst(y.blurb))}`)}
${dataNote(labor)}
<div class="table-wrap"><table><thead><tr><th scope="col"></th><th scope="col"><a href="${href(x.url)}">${esc(x.title)}</a></th><th scope="col"><a href="${href(y.url)}">${esc(y.title)}</a></th></tr></thead><tbody>
${row('Median pay', (c) => `${money(c.l.wages.median)} (${money2(c.l.wages.hourly)}/hr)`)}${row('Pay range (10th–90th)', (c) => `${money(c.l.wages.p10)} – ${money(c.l.wages.p90)}`)}${row(`Job growth, ${labor.meta.projections}`, (c) => `${pct(c.l.growthPct)} (${growthWord(c.l.growthPct)})`)}${row('Openings per year', (c) => num(c.l.annualOpenings))}${row('Typical entry education', (c) => esc(c.l.entryEducation))}${row('Training time', (c) => esc(c.train))}${row('Key credential', (c) => esc(c.certs[0][0]))}${row('Work setting', (c) => esc(c.env.split('. ')[0]) + '.')}
</tbody></table></div>
<h2 id="duties">What each job does</h2><div class="cols"><div><h3>${esc(x.title)}</h3><ul>${x.duties.slice(0, 5).map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div><div><h3>${esc(y.title)}</h3><ul>${y.duties.slice(0, 5).map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div></div>
<h2 id="similarities">How they’re similar</h2><p>${shared.length ? `Both careers involve ${listJoin(shared.slice(0, 4).map((t) => traitWords[t] || t))}.` : 'They draw on different strengths, which makes the choice clearer.'} ${x.cat === y.cat ? `Both are part of the ${esc(catBySlug[x.cat].name.toLowerCase())} field, so many skills transfer between them.` : `They sit in different fields, ${esc(catBySlug[x.cat].name.toLowerCase())} and ${esc(catBySlug[y.cat].name.toLowerCase())}, but share transferable skills such as ${esc(listJoin([x.soft[0].toLowerCase(), y.soft[0].toLowerCase()]))}.`}</p>
<h2 id="choose">Which should you choose?</h2><div class="cols"><div><h3>Choose ${esc(x.lower)} if…</h3><ul>${pickFor(x)}</ul></div><div><h3>Choose ${esc(y.lower)} if…</h3><ul>${pickFor(y)}</ul></div></div>
<p>Still torn? Take the <a href="${href(x.url + 'is-it-right-for-me/')}">${esc(x.title)} fit quiz</a> and the <a href="${href(y.url + 'is-it-right-for-me/')}">${esc(y.title)} fit quiz</a>, or the full <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a>.</p>
${faqBlock(faqs, 'Quick comparisons')}
<div class="btn-row"><a class="btn btn-primary" href="${href(x.trainingUrl)}">${esc(x.title)} training</a><a class="btn btn-primary" href="${href(y.trainingUrl)}">${esc(y.title)} training</a></div>`;
  const aside = `${ctaCard({ title: 'Try both before you commit', text: 'Each training gives you a realistic look at the job: duties, vocabulary, procedures and safety.', btn: 'Browse all trainings', link: '/training/' })}${sideLinks('Learn more', [[`${x.title} overview`, x.url], [`${x.title} salary`, x.url + 'salary/'], [`${y.title} overview`, y.url], [`${y.title} salary`, y.url + 'salary/'], ['All career comparisons', '/compare/']])}`;
  return {
    path, crumbs, og: '/og/compare.png', kind: 'Comparison', name: `${x.title} vs. ${y.title}`,
    title: fitTitle(pick([`${x.title} vs. ${y.title}: Pay & Training`, `${x.title} vs. ${y.title}`, `${x.short} vs. ${y.short}: Pay & Training`, `${x.short} vs. ${y.short}`])),
    desc: clamp(`${x.title} vs. ${y.title}: compare median pay (${money(wx.median)} vs. ${money(wy.median)}), training time, job growth, duties and which career fits you best.`),
    body: `${pageHero({ crumbs, eyebrow: 'Career comparison', h1: `${esc(x.title)} vs. ${esc(y.title)}`, lead: `Side-by-side pay, training, growth and day-to-day duties to help you choose between two related careers.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`,
    schema: [faqSchema(faqs, path)]
  };
}
