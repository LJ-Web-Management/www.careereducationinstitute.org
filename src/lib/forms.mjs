import cfg from '../../site.config.mjs';
import { esc, href } from './util.mjs';

export const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Puerto Rico', 'U.S. Virgin Islands', 'Guam', 'American Samoa', 'Northern Mariana Islands'];

// Enrollment form. Submitting opens a pre-filled email (no data is stored by the website).
export function enrollForm(careers, { course = '', kind = 'enroll', heading = 'Request enrollment', id = 'enroll' } = {}) {
  const opts = careers.slice().sort((a, b) => a.title.localeCompare(b.title)).map((c) => `<option value="${esc(c.title)} Training"${c.slug === course ? ' selected' : ''}>${esc(c.title)} Training</option>`).join('');
  const isEmployer = kind === 'employer';
  const isContact = kind === 'contact';
  return `<section class="form-box" id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${esc(heading)}</h2>
<p class="small muted">Fill this out and press the button — your email app will open with a pre-filled message to our enrollment team (${esc(cfg.enrollTo)}). We reply with pricing, payment options and your learning-platform login. Nothing you type is stored on this website.</p>
<noscript><p class="callout">JavaScript is turned off, so this form can’t open your email app. Please email <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a> or call ${cfg.phone} to enroll.</p></noscript>
<form class="form" data-enroll data-kind="${kind}" data-to="${esc(cfg.enrollTo)}" data-cc="${esc(cfg.enrollCc)}" method="post" novalidate>
<div class="row2"><div class="field"><label for="${id}-name">Full name <span class="req" aria-hidden="true">*</span></label><input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-email">Email <span class="req" aria-hidden="true">*</span></label><input id="${id}-email" name="Email" type="email" autocomplete="email" required></div></div>
<div class="row2"><div class="field"><label for="${id}-phone">Phone <span class="muted small">(optional)</span></label><input id="${id}-phone" name="Phone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="${id}-state">State <span class="req" aria-hidden="true">*</span></label><select id="${id}-state" name="State" autocomplete="address-level1" required><option value="">Select your state</option>${STATES.map((s) => `<option>${s}</option>`).join('')}</select><div class="hint">We currently serve U.S. residents only.</div></div></div>
${isContact ? `<div class="field"><label for="${id}-topic">Topic</label><select id="${id}-topic" name="Topic"><option>General question</option><option>Course question</option><option>Group or employer training</option><option>Billing or refund</option><option>Accessibility request</option><option>Privacy request</option><option>Other</option></select></div>` : `<div class="field"><label for="${id}-course">${isEmployer ? 'Training(s) of interest' : 'Course'} <span class="req" aria-hidden="true">*</span></label><select id="${id}-course" name="Course" required><option value="">Choose a training</option>${isEmployer ? '<option>Multiple trainings / not sure yet</option>' : ''}${opts}</select></div>
<div class="row2"><div class="field"><label for="${id}-who">Enrolling</label><select id="${id}-who" name="Enrolling"><option${isEmployer ? '' : ' selected'}>Myself</option><option${isEmployer ? ' selected' : ''}>My team or employees</option><option>My student or child (I am the parent/guardian)</option></select></div>
<div class="field"><label for="${id}-seats">Number of learners</label><input id="${id}-seats" name="Learners" type="number" min="1" max="5000" value="${isEmployer ? 5 : 1}" inputmode="numeric"></div></div>
${isEmployer ? `<div class="field"><label for="${id}-org">Organization</label><input id="${id}-org" name="Organization" type="text" autocomplete="organization"></div>` : ''}
<div class="field"><label for="${id}-start">When would you like to start?</label><select id="${id}-start" name="Start"><option>As soon as possible</option><option>Within 2 weeks</option><option>Within a month</option><option>Just exploring for now</option></select></div>`}
<div class="field"><label for="${id}-msg">${isContact ? 'Message' : 'Questions or notes'} ${isContact ? '<span class="req" aria-hidden="true">*</span>' : '<span class="muted small">(optional)</span>'}</label><textarea id="${id}-msg" name="Message"${isContact ? ' required' : ''}></textarea></div>
<label class="check"><input type="checkbox" name="Age" value="Confirmed" required><span>I am 18 or older, or I am a parent/guardian submitting for a minor. <span class="req" aria-hidden="true">*</span></span></label>
<label class="check"><input type="checkbox" name="Consent" value="Agreed" required><span>I agree to be contacted by email or phone about this request and accept the <a href="${href('/terms-of-use/')}">Terms of Use</a> and <a href="${href('/privacy-policy/')}">Privacy Policy</a>. Consent is not a condition of purchase. <span class="req" aria-hidden="true">*</span></span></label>
<p class="err" role="alert" hidden></p>
<button class="btn btn-primary btn-block" type="submit">${isContact ? 'Send message by email' : isEmployer ? 'Request group training' : 'Send enrollment request'}</button>
<p class="small muted" style="margin:0">Prefer to call? <a href="tel:${cfg.phoneE164}">${cfg.phone}</a> · Email <a href="mailto:${cfg.email}">${cfg.email}</a></p>
</form>
<div class="notice" role="status" tabindex="-1"><p><strong>Your email app should now be open with your request.</strong> Just press send. If nothing opened, copy the message below and email it to <a href="mailto:${cfg.enrollTo}">${cfg.enrollTo}</a> (cc ${cfg.enrollCc}).</p><pre></pre><button class="btn btn-sm" type="button" data-copy>Copy message</button></div>
</section>`;
}
