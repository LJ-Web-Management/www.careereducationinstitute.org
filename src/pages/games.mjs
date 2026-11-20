// Daily games: the /games/ hub and Career Radar (/games/career-radar/), a once-a-day "guess the mystery career"
// game. The game itself runs in src/assets/career-radar.js; closeness rankings come from src/lib/career-radar.mjs.
import { esc, href, clamp, fitTitle, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox } from '../lib/layout.mjs';
import { radarConfig } from '../lib/career-radar.mjs';
import { radar } from '../data/career-radar.mjs';

const RADAR = '/games/career-radar/';

export function gamePages(ctx) {
  const { careers } = ctx;
  const n = countLabel(careers.length);
  const pages = [];
  const hub = ['Daily games', '/games/'];

  // Career Radar
  {
    const path = RADAR;
    const crumbs = [['Home', '/'], hub, ['Career Radar', path]];
    const faqs = [
      ['How does Career Radar work?', `Each day there is one mystery career, the same for everyone. Type any job title and the game ranks it by how close it is to the mystery career, out of all ${n} careers we profile. #1 is the answer. Use the ranks to close in.`],
      ['How is “closeness” measured?', 'From real career data, not guesswork: the duties, skills, tools and vocabulary each job uses, its job group in the U.S. Bureau of Labor Statistics occupation system (SOC), its career field, careers we list as related, its Holland interest code, its work style and the level of training it takes.'],
      ['Can I play more than once a day?', 'You get one mystery career per day. Keep guessing as long as you like; once you find it or give up, the game locks until midnight (your local time) and a new career is ready.'],
      ['What does the hint do?', 'A hint adds a career that is closer than your best guess so far. Hints count toward your result, so try a few guesses first.'],
      ['Do I need an account? Is my data saved?', 'No account and no sign-up. Your guesses, streak and stats are saved only in this browser on this device. Clearing your browser data resets them.'],
      ['Which careers can be the answer?', `The mystery career is one of ${radar.answers.length} well-known careers with large numbers of U.S. jobs. Your guesses can be any of our ${n} careers, and you can type common job titles too, such as “RN” or “cook”.`]
    ];
    const reasons = [['Similar duties, skills and tools', 'the work itself: what the job does, the skills it needs, the tools it uses and its vocabulary'], ['BLS job group', 'careers in the same group of the federal Standard Occupational Classification (SOC)'], ['Career field', `the same one of our ${ctx.categories.length} career fields`], ['Related careers', 'careers we list as related on each profile'], ['Interests and work style', 'Holland interest code (RIASEC) and traits like hands-on, outdoors or desk work'], ['Training level', 'the education or training it typically takes to start']];
    const body = `${pageHero({ crumbs, eyebrow: 'Daily game · New mystery career every day', h1: 'Career Radar: Guess Today’s Mystery Career', lead: `Guess the secret career in as few tries as you can. Every guess is ranked by how close it is, out of all ${n} careers we profile.`, meta: false })}
<div class="wrap layout"><div class="prose">
<section class="radar" data-radar aria-label="Career Radar game">
<div class="radar-top"><p class="radar-day" data-day>Career Radar</p><p class="radar-count" data-count aria-live="polite"></p></div>
<form class="radar-form" data-form autocomplete="off"><div class="radar-input"><label class="vh" for="radar-guess">Type a job title</label><input id="radar-guess" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="radar-list" placeholder="Loading today’s career…" spellcheck="false" autocapitalize="off" disabled><ul class="radar-list" id="radar-list" role="listbox" aria-label="Matching job titles" hidden></ul></div><button class="btn btn-primary" type="submit" disabled>Guess</button></form>
<div class="radar-end" data-end hidden></div>
<p class="radar-msg" data-msg aria-live="polite"></p>
<div class="radar-latest" data-latest hidden></div>
<ol class="radar-guesses" data-guesses aria-label="Your guesses, closest first"></ol>
<div class="radar-tools"><button class="btn btn-sm" type="button" data-hint disabled>Hint</button><button class="btn btn-sm" type="button" data-giveup disabled>Give up</button><button class="btn btn-sm" type="button" data-show-stats>Stats</button><button class="btn btn-sm" type="button" data-show-help>How to play</button></div>
<noscript><p class="radar-msg">Career Radar needs JavaScript. Turn it on to play, or explore <a href="${href('/careers/')}">all careers</a>.</p></noscript>
<dialog class="radar-dialog" data-stats aria-labelledby="radar-stats-h"><h2 id="radar-stats-h">Your Career Radar stats</h2><div data-stats-body></div><form method="dialog"><button class="btn btn-primary" type="submit">Close</button></form></dialog>
<dialog class="radar-dialog" data-help aria-labelledby="radar-help-h"><h2 id="radar-help-h">How to play</h2><ul><li>Type a job title and pick it from the list.</li><li>Your guess gets a rank: <strong>#1 is the mystery career</strong>, #2 is the closest career to it, and so on.</li><li><span class="radar-key hot">Green</span> is very close, <span class="radar-key warm">yellow</span> is warm, <span class="radar-key cold">red</span> is far.</li><li>Tap any guess to see why it is close.</li><li>One mystery career per day. A new one starts at midnight.</li></ul><form method="dialog"><button class="btn btn-primary" type="submit">Play</button></form></dialog>
</section>
<script type="application/json" id="radar-data">${JSON.stringify(radarConfig(careers))}</script>
${answerBox('How to play', `Type any job title. Career Radar ranks your guess by how close it is to today’s mystery career, out of all ${n} careers we profile: #1 is the answer. Guess as many times as you need, use a hint if you get stuck, and come back tomorrow for a new career.`)}
<h2 id="closeness">How Career Radar measures closeness</h2>
<p>Ranks come from the same data behind our career profiles. Two careers are close when they share:</p>
<ul>${reasons.map(([t, d]) => `<li><strong>${esc(t)}:</strong> ${esc(d)}</li>`).join('')}</ul>
<p>Tap any guess to see what it shares with the mystery career. When the game ends, you’ll see the 10 closest careers, each linked to its full profile, salary data and training.</p>
<h2 id="tips">Tips for finding the mystery career</h2>
<ul><li>Start broad: try careers from very different fields, like a nurse, an electrician, a cashier and a software developer.</li><li>Follow the green: once a guess ranks in the top 25, try careers that do similar work.</li><li>Read the reasons: “Same career field” and “Similar duties, skills and tools” tell you which way to go.</li><li>Not sure what jobs exist? Browse <a href="${href('/careers/')}">all ${n} careers</a> by field.</li></ul>
${faqBlock(faqs)}</div>
<aside>${ctaCard({ title: 'Found a career you like?', text: 'Every career has an online, self-paced job-title training, so you can learn the job before you commit.', btn: 'Browse trainings', link: '/training/' })}${sideLinks('More ways to explore', [['Career Match Quiz', '/quizzes/career-match/'], ['Work Style Quiz', '/quizzes/work-style/'], ['All career quizzes', '/quizzes/'], ['College & Career Finder', '/college-and-career-finder/'], ['All careers', '/careers/'], ['All daily games', '/games/']])}</aside></div>`;
    pages.push({ path, crumbs, body, og: '/og/quiz.png', kind: 'Quiz', name: 'Career Radar: daily career guessing game', keywords: 'daily game, career game, guess the job, mystery career', title: fitTitle('Career Radar: Daily Career Guessing Game'), desc: clamp(`Free daily career game: guess today’s mystery career. Each guess is ranked by how close it is, out of ${n} careers. New career every day, no sign-up.`), scripts: ['career-radar'], schema: [faqSchema(faqs, path)] });
  }

  // Hub
  {
    const path = '/games/';
    const crumbs = [['Home', '/'], hub];
    const more = [['Career Match Quiz', '/quizzes/career-match/', 'Match your interests to careers in about 4 minutes.'], ['Practice tests', '/quizzes/#practice-tests', 'Check your job knowledge for any career we profile.'], ['College & Career Finder', '/college-and-career-finder/', 'Explore majors, colleges and careers step by step.']];
    const body = `${pageHero({ crumbs, eyebrow: 'Free daily games', h1: 'Daily Career Games', lead: 'A new puzzle every day, the same for everyone. Play in a couple of minutes, keep your streak going and learn about careers while you play. No sign-up.', meta: false })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px"><h2 style="margin-top:0">Today’s games</h2><div class="grid-2"><article class="card link game-card"><p class="eyebrow">New mystery career every day</p><h3><a class="stretch" href="${href(RADAR)}">Career Radar</a></h3><p>Guess today’s mystery career. Every guess is ranked by how close it is, out of all ${n} careers we profile. #1 is the answer.</p><span class="more">Play today’s game →</span></article></div>
<h2>More ways to explore careers</h2><div class="grid">${more.map(([t, l, d]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p></article>`).join('')}</div></div>`;
    pages.push({ path, crumbs, body, og: '/og/quiz.png', kind: 'Quiz', name: 'Daily career games', title: fitTitle('Daily Career Games'), desc: clamp(`Free daily career games from Career Education Institute. Play Career Radar: guess today’s mystery career from ${n} careers, keep your streak and learn about jobs.`), schema: [] });
  }
  return pages;
}
