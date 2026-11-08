import cfg from '../../site.config.mjs';
import { esc, href } from './util.mjs';

export const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico', 'U.S. Virgin Islands', 'Guam', 'American Samoa', 'Northern Mariana Islands'];

// Embedded Typeform (live embed id from site.config.mjs → forms). The forms have a transparent
// background, so they sit on a white card. Typeform's auto-resize undershoots, so `height` sets
// the minimum height that shows the whole form (it still grows if the form gets longer).
export const typeformEmbed = (id, height = 520) => `<div class="tf-box" style="--tf-h:${height}px"><div data-tf-live="${esc(id)}"></div></div><script src="https://embed.typeform.com/next/embed.js" async></script>`;

// Checkout Typeform for one job-title training, on that training's own page. The form has a transparent background
// and auto height, so it sits straight on the page (no card, no minimum height). page_url (this page's address,
// including any query string) is set as a hidden field before Typeform's script reads the embed.
// The panel around it (a "Checkout" header, an order summary and numbered steps) makes it read as checkout, not as a
// contact form.
const lock = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
export function trainingCheckout({ course, heading, id = 'enroll' }) {
  return `<section class="tf-checkout" id="${id}" aria-labelledby="${id}-h">
<div class="tfc-head"><p class="tfc-kicker"><span>Checkout</span><span class="tfc-secure">${lock} Secure order form</span></p><h2 id="${id}-h">${esc(heading)}</h2></div>
<div class="tfc-summary"><p class="tfc-label">Your order</p><div class="tfc-line"><div><strong>${esc(course.title)} Training</strong><span>Online, self-paced · about ${course.hours} hours · ${esc(cfg.course.access)} · ${esc(cfg.course.certificate)}</span></div><div class="tfc-price">$${course.price.toFixed(2)}<small>per learner</small></div></div><p class="tfc-note">Buying for more than one learner? Enter the number of learners in the form. Volume pricing applies from 2.</p></div>
<div class="tfc-form"><p class="tfc-step"><span class="tfc-num" aria-hidden="true">1</span>Fill in the checkout form below</p>
<div data-tf-live="${esc(cfg.forms.trainingCheckout)}"></div>
<script>(function(){var f=document.currentScript.previousElementSibling;if(f)f.setAttribute('data-tf-hidden','page_url='+encodeURIComponent(location.href));})();</script>
<script src="https://embed.typeform.com/next/embed.js" async></script>
<noscript><p class="callout">The checkout form needs JavaScript. Please email <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a> or call ${cfg.phone} to place your order.</p></noscript>
<p class="tfc-step tfc-after"><span class="tfc-num" aria-hidden="true">2</span>We email your order confirmation and course login</p>
<p class="small muted" style="margin:0">Questions about your order? Call <a href="tel:${cfg.phoneE164}">${cfg.phone}</a> or email <a href="mailto:${cfg.email}">${cfg.email}</a>.</p></div>
</section>`;
}

const req = '<span class="req" aria-hidden="true">*</span>';
const opt = '<span class="muted small">(optional)</span>';
const stateField = (id) => `<div class="field"><label for="${id}-state">State ${req}</label><select id="${id}-state" name="State" autocomplete="address-level1" required><option value="">Select your state</option>${STATES.map((s) => `<option>${s}</option>`).join('')}</select><div class="hint">We currently serve U.S. residents only.</div></div>`;
const consent = (about, purchase = true) => `<label class="check"><input type="checkbox" name="Consent" value="Agreed" required><span>I agree to be contacted by email or phone about ${about} and accept the <a href="${href('/terms-of-use/')}">Terms of Use</a> and <a href="${href('/privacy-policy/')}">Privacy Policy</a>.${purchase ? ' Consent is not a condition of purchase.' : ''} ${req}</span></label>`;
const callLine = `<p class="small muted" style="margin:0">Prefer to call? <a href="tel:${cfg.phoneE164}">${cfg.phone}</a> · Email <a href="mailto:${cfg.email}">${cfg.email}</a></p>`;
const notice = `<div class="notice" role="status" tabindex="-1"><p><strong>Your email app should now be open with your request.</strong> Just press send. If nothing opened, copy the message below and email it to <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a>.</p><pre></pre><button class="btn btn-sm" type="button" data-copy>Copy message</button></div>`;
const noscript = (what) => `<noscript><p class="callout">JavaScript is turned off, so this form can’t open your email app. Please email <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a> or call ${cfg.phone} to ${what}.</p></noscript>`;

// Enrollment form. Submitting opens a pre-filled email (no data is stored by the website).
// kind 'enroll' needs the course (a career) of the page it sits on; 'employer' is a team quote.
export function enrollForm({ course = null, kind = 'enroll', heading = 'Request enrollment', id = 'enroll' } = {}) {
  const isEmployer = kind === 'employer', isCart = kind === 'cart'; // cart: the trainings and learner counts come from the cart page
  return `<section class="form-box" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">Fill this out and press the button: your email app will open with a pre-filled message to our enrollment team (${esc(cfg.enrollTo)}). We reply with ${isEmployer ? 'volume pricing, invoicing options and setup details' : 'a payment link or invoice and your learning-platform login'}. Nothing you type is stored on this website.</p>
${noscript('enroll')}
<form class="form" data-enroll data-kind="${kind}" data-to="${esc(cfg.enrollTo)}" method="post" novalidate>
${course ? `<p class="form-course"><span class="k">Course</span> <strong>${esc(course.title)} Training</strong> <span class="muted">· ${course.hours} hours · $${course.price.toFixed(2)} per learner</span><input type="hidden" name="Course" value="${esc(course.title)} Training" data-price="${course.price}"></p>` : ''}
<div class="row2"><div class="field"><label for="${id}-name">Full name ${req}</label><input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-email">Email ${req}</label><input id="${id}-email" name="Email" type="email" autocomplete="email" required></div></div>
<div class="row2"><div class="field"><label for="${id}-phone">Phone ${opt}</label><input id="${id}-phone" name="Phone" type="tel" autocomplete="tel"></div>
${stateField(id)}</div>
${isEmployer ? `<div class="row2"><div class="field"><label for="${id}-org">Organization</label><input id="${id}-org" name="Organization" type="text" autocomplete="organization"></div>
<div class="field"><label for="${id}-roles">Roles or trainings of interest ${opt}</label><input id="${id}-roles" name="Trainings" type="text" placeholder="For example: new CNAs and pharmacy techs"></div></div>` : ''}
<div class="row2"><div class="field"><label for="${id}-who">Enrolling</label><select id="${id}-who" name="Enrolling"><option${isEmployer ? '' : ' selected'}>Myself</option><option${isEmployer ? ' selected' : ''}>My team or employees</option><option>My student or child (I am the parent/guardian)</option></select></div>
${isCart ? '<input type="hidden" name="Cart" value=""><input type="hidden" name="CartCount" value="0">' : `<div class="field"><label for="${id}-seats">Number of learners</label><input id="${id}-seats" name="Learners" type="number" min="1" max="5000" value="${isEmployer ? 5 : 1}" inputmode="numeric"></div>`}</div>
<div class="field"><label for="${id}-msg">Questions or notes ${opt}</label><textarea id="${id}-msg" name="Message"></textarea></div>
<label class="check"><input type="checkbox" name="Age" value="Confirmed" required><span>I am 18 or older, or I am a parent/guardian submitting for a minor. ${req}</span></label>
${consent('this request')}
<p class="err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">${isEmployer ? 'Request group training' : isCart ? 'Place my order' : 'Buy now: place my order'}</button>
${callLine}
</form>
${notice}
</section>`;
}

// The two subscription programs. Each one is quoted by email from the seats per month, and every subscriber gets its
// own landing page for its learners; white label is a paid add-on.
export const PROGRAMS = {
  workforce: {
    path: '/for-employers/', name: 'Jobs and Workforce', short: 'Jobs/Workforce', what: 'onboarding and retraining',
    types: ['Employer: onboarding new hires', 'Employer: retraining or upskilling current employees', 'Workforce board or American Job Center', 'Nonprofit, reentry, veterans or youth program', 'Other'],
    org: 'Company or organization', people: 'employees', seatHint: 'One seat is one learner. When someone finishes, give the seat to the next new hire.'
  },
  school: {
    path: '/for-schools/', name: 'Schools', short: 'Schools', what: 'career training for students',
    types: ['High school', 'High school CTE program', 'Community college', 'College or university', 'Adult education', 'Other'],
    org: 'School or college', people: 'students', seatHint: 'One seat is one student. When a student finishes, give the seat to the next one.'
  }
};
export const WHITE_LABEL = ['No, our standard landing page is fine', 'Yes, quote white label too', 'Not sure yet'];

// Subscription request for one program. Like the enrollment form it opens a pre-filled email; no prices are shown,
// every request is quoted.
export function subscriptionForm({ program = 'workforce', heading = 'Request a subscription quote', id = 'subscribe' } = {}) {
  const S = cfg.subscriptions, P = PROGRAMS[program];
  return `<section class="form-box" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">Tell us how many seats you need each month. Pressing the button opens your email app with a pre-filled request to our team (${esc(cfg.enrollTo)}). We reply with your quote, usually within one business day. Nothing you type is stored on this website.</p>
${noscript('request a subscription')}
<form class="form" data-enroll data-kind="subscription" data-program="${esc(P.short)}" data-to="${esc(cfg.enrollTo)}" method="post" novalidate>
<div class="row2"><div class="field"><label for="${id}-org">${esc(P.org)} ${req}</label><input id="${id}-org" name="Organization" type="text" autocomplete="organization" required></div>
<div class="field"><label for="${id}-type">Type ${opt}</label><select id="${id}-type" name="Type"><option value="">Select</option>${P.types.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div></div>
<div class="row2"><div class="field"><label for="${id}-name">Full name ${req}</label><input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-email">Email ${req}</label><input id="${id}-email" name="Email" type="email" autocomplete="email" required></div></div>
<div class="row2"><div class="field"><label for="${id}-phone">Phone ${opt}</label><input id="${id}-phone" name="Phone" type="tel" autocomplete="tel"></div>
${stateField(id)}</div>
<div class="row2"><div class="field"><label for="${id}-seats">Seats per month ${req}</label><input id="${id}-seats" name="Seats" type="number" min="1" max="100000" value="25" inputmode="numeric" required><div class="hint">${esc(P.seatHint)}</div></div>
<div class="field"><label for="${id}-cycle">Billing ${req}</label><select id="${id}-cycle" name="Billing" required>${S.cycles.map((c, i) => `<option${i === 0 ? ' selected' : ''}>${c}${i === 0 ? ' (recommended)' : ''}</option>`).join('')}</select></div></div>
<div class="field"><label for="${id}-wl">White label (paid add-on) ${opt}</label><select id="${id}-wl" name="WhiteLabel">${WHITE_LABEL.map((w, i) => `<option${i === 0 ? ' selected' : ''}>${w}</option>`).join('')}</select><div class="hint">Every subscription includes your own landing page. White label puts your name and logo on it and on the training, in place of ours.</div></div>
<div class="field"><label for="${id}-roles">Trainings or job titles of interest ${opt}</label><input id="${id}-roles" name="Trainings" type="text" placeholder="${program === 'school' ? 'For example: CNA, electrician, IT support' : 'For example: warehouse associate, CNA, welder'}"></div>
<div class="field"><label for="${id}-msg">Questions or notes ${opt}</label><textarea id="${id}-msg" name="Message"></textarea></div>
<label class="check"><input type="checkbox" name="Authorized" value="Confirmed" required><span>I am authorized to request this subscription for my ${program === 'school' ? 'school' : 'organization'}. ${req}</span></label>
${consent('this subscription request')}
<p class="err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">Request my subscription quote</button>
${callLine}
</form>
${notice}
</section>`;
}

// How subscription billing and the loyalty discount work (both programs).
export function subscriptionTerms() {
  const { step, max } = cfg.subscriptions.loyalty;
  const years = Math.round(max / step) + 1;
  const pc = (n) => `${Math.round(n * 100)}%`;
  const ladder = Array.from({ length: years }, (_, i) => Math.min(i * step, max));
  return `<h2 id="billing">Pay yearly (recommended) or monthly</h2>
<div class="grid-3"><div class="card"><h3>Yearly (recommended)</h3><p>One payment and one invoice a year for all your seats. Easy to budget, easy to fund from a grant or program year, and nothing to manage month to month.</p></div><div class="card"><h3>Monthly</h3><p>Pay each month for the seats you use, if your program needs to start small.</p></div><div class="card"><h3>Add seats any time</h3><p>Adding learners mid-year never resets your loyalty discount.</p></div></div>
<h2 id="loyalty">Your price drops every year you stay</h2>
<p>On monthly and yearly plans, your price goes down by <strong>${pc(step)}</strong> after every full year you keep your subscription, until you reach <strong>${pc(max)} off</strong> your original price.</p>
<ol class="loyalty" aria-label="Loyalty discount by year">${ladder.map((d, i) => `<li><i style="height:${Math.round(110 * (1 - d * 2.4))}px" aria-hidden="true"></i><b>${d ? `${pc(d)} off` : 'Full price'}</b>Year ${i + 1}${i === ladder.length - 1 ? '+' : ''}</li>`).join('')}</ol>
<aside class="callout"><p><strong>Keep your seat count to keep your discount.</strong> The loyalty discount resets to full price if you reduce your number of seats or cancel. Adding seats never resets it.</p></aside>`;
}
