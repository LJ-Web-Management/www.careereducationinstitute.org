import cfg from '../../site.config.mjs';
import { esc, href } from './util.mjs';

export const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico', 'U.S. Virgin Islands', 'Guam', 'American Samoa', 'Northern Mariana Islands'];

// Embedded Typeform (live embed id from site.config.mjs → forms). The forms have a transparent
// background, so they sit on a white card. Typeform's auto-resize undershoots, so `height` sets
// the minimum height that shows the whole form (it still grows if the form gets longer).
export const typeformEmbed = (id, height = 520) => `<div class="tf-box" style="--tf-h:${height}px"><div data-tf-live="${esc(id)}"></div></div><script src="https://embed.typeform.com/next/embed.js" async></script>`;

// Checkout Typeform for one job-title training, on that training's own page. The form has a transparent background
// and auto height, so it sits straight on the page (no card, no minimum height). page_url (this page's address,
// including any ?code= partner link) is set as a hidden field before Typeform's script reads the embed.
export function trainingCheckout({ course, heading, id = 'enroll' }) {
  return `<section class="tf-checkout" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">${esc(course.title)} Training · about ${course.hours} hours · $${course.price.toFixed(2)} per learner. Buying for several learners? Enter the number of seats in the form. Volume pricing applies from 2.</p>
<div data-tf-live="${esc(cfg.forms.trainingCheckout)}"></div>
<script>(function(){var f=document.currentScript.previousElementSibling;if(f)f.setAttribute('data-tf-hidden','page_url='+encodeURIComponent(location.href));})();</script>
<script src="https://embed.typeform.com/next/embed.js" async></script>
<noscript><p class="callout">The checkout form needs JavaScript. Please email <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a> or call ${cfg.phone} to enroll.</p></noscript>
${callLine}
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
${isEmployer ? '' : `<div class="field"><label for="${id}-code">Partner discount code ${opt}</label><input id="${id}-code" name="Code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false"><div class="hint">Got a code from your school, college, employer or organization? Enter it to save ${Math.round(cfg.partnerProgram.discount * 100)}%.</div></div>`}
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

// Partner discount program sign-up. Like the enrollment form, it opens a pre-filled email.
export const PARTNER_TYPES = ['School district', 'College or university', 'Company', 'Organization or nonprofit'];
export function partnerForm({ type = '', heading = 'Get your discount code', id = 'signup' } = {}) {
  return `<section class="form-box" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">Fill this out and press the button: your email app will open with a pre-filled sign-up request to our team (${esc(cfg.enrollTo)}). We reply with your discount code and program details, usually within one business day. Nothing you type is stored on this website.</p>
${noscript('join the partner program')}
<form class="form" data-enroll data-kind="partner" data-to="${esc(cfg.enrollTo)}" method="post" novalidate>
<div class="row2"><div class="field"><label for="${id}-org">Organization name ${req}</label><input id="${id}-org" name="Organization" type="text" autocomplete="organization" required></div>
<div class="field"><label for="${id}-type">Organization type ${req}</label><select id="${id}-type" name="Type" required><option value="">Select a type</option>${PARTNER_TYPES.map((t) => `<option${t === type ? ' selected' : ''}>${t}</option>`).join('')}</select></div></div>
<div class="row2"><div class="field"><label for="${id}-name">Your name ${req}</label><input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-role">Your title or role ${opt}</label><input id="${id}-role" name="Role" type="text" autocomplete="organization-title"></div></div>
<div class="row2"><div class="field"><label for="${id}-email">Work email ${req}</label><input id="${id}-email" name="Email" type="email" autocomplete="email" required></div>
<div class="field"><label for="${id}-phone">Phone ${opt}</label><input id="${id}-phone" name="Phone" type="tel" autocomplete="tel"></div></div>
<div class="row2">${stateField(id)}
<div class="field"><label for="${id}-web">Website ${opt}</label><input id="${id}-web" name="Website" type="text" inputmode="url" autocomplete="url" placeholder="example.org"></div></div>
<div class="row2"><div class="field"><label for="${id}-reach">People who could use your code ${opt}</label><input id="${id}-reach" name="Reach" type="number" min="1" inputmode="numeric" placeholder="For example: 500"></div>
<div class="field"><label for="${id}-code">Preferred code ${opt}</label><input id="${id}-code" name="Code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="For example: LINCOLN10"><div class="hint">Letters and numbers. We’ll confirm it or suggest another.</div></div></div>
<div class="field"><label for="${id}-msg">How will you share the code? ${opt}</label><textarea id="${id}-msg" name="Message" placeholder="For example: career center page, family newsletter, employee intranet"></textarea></div>
<label class="check"><input type="checkbox" name="Authorized" value="Confirmed" required><span>I am authorized to sign up on behalf of this organization. ${req}</span></label>
${consent('the partner program', false)}
<p class="err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">Request my discount code</button>
${callLine}
</form>
${notice}
</section>`;
}

// Program seat subscription request (/for-workforce-programs/). Like the enrollment form it opens a pre-filled email;
// no prices are shown, every request is quoted.
export function subscriptionForm({ heading = 'Request a subscription', id = 'subscribe' } = {}) {
  const S = cfg.subscriptions;
  return `<section class="form-box" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">Tell us how many seats you need. Pressing the button opens your email app with a pre-filled request to our team (${esc(cfg.enrollTo)}). We reply with your quote, usually within one business day. Nothing you type is stored on this website.</p>
${noscript('request a subscription')}
<form class="form" data-enroll data-kind="subscription" data-to="${esc(cfg.enrollTo)}" method="post" novalidate>
<div class="row2"><div class="field"><label for="${id}-org">School, program or organization ${req}</label><input id="${id}-org" name="Organization" type="text" autocomplete="organization" required></div>
<div class="field"><label for="${id}-type">Type of program ${opt}</label><select id="${id}-type" name="Type"><option value="">Select</option>${['High school or CTE program', 'Community college or adult education', 'Workforce board or American Job Center', 'Reentry, veterans or youth program', 'Nonprofit job-readiness program', 'Employer', 'Other'].map((t) => `<option>${t}</option>`).join('')}</select></div></div>
<div class="row2"><div class="field"><label for="${id}-name">Full name ${req}</label><input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-email">Email ${req}</label><input id="${id}-email" name="Email" type="email" autocomplete="email" required></div></div>
<div class="row2"><div class="field"><label for="${id}-phone">Phone ${opt}</label><input id="${id}-phone" name="Phone" type="tel" autocomplete="tel"></div>
${stateField(id)}</div>
<div class="row2"><div class="field"><label for="${id}-seats">Seats ${req}</label><input id="${id}-seats" name="Seats" type="number" min="1" max="100000" value="25" inputmode="numeric" required><div class="hint">One seat is one learner. You can add seats any time.</div></div>
<div class="field"><label for="${id}-cycle">Billing ${req}</label><select id="${id}-cycle" name="Billing" required>${S.cycles.map((c, i) => `<option${i === 0 ? ' selected' : ''}>${c}${i === 0 ? ' (recommended)' : ''}</option>`).join('')}</select></div></div>
<div class="field"><label for="${id}-roles">Trainings or job titles of interest ${opt}</label><input id="${id}-roles" name="Trainings" type="text" placeholder="For example: CNA, welder, warehouse associate"></div>
<div class="field"><label for="${id}-msg">Questions or notes ${opt}</label><textarea id="${id}-msg" name="Message"></textarea></div>
<label class="check"><input type="checkbox" name="Authorized" value="Confirmed" required><span>I am authorized to request this subscription for my organization. ${req}</span></label>
${consent('this subscription request')}
<p class="err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">Request my subscription quote</button>
${callLine}
</form>
${notice}
</section>`;
}

// How program subscription billing and the loyalty discount work (/for-workforce-programs/).
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
