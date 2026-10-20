// Newsletter sign-up and unsubscribe pages (embedded forms). The blog itself is a separate repo ("blog"),
// published at /blog/; it links here for sign-ups.
import cfg from '../../site.config.mjs';
import { href, clamp, fitTitle } from '../lib/util.mjs';
import { pageHero, sideLinks } from '../lib/layout.mjs';
import { typeformEmbed } from '../lib/forms.mjs';

export function newsletterPages() {
  const pages = [];
  {
    const path = '/newsletter/';
    const crumbs = [['Home', '/'], ['Blog', '/blog/'], ['Newsletter', path]];
    pages.push({ path, crumbs, og: '/og/blog.png', kind: 'Page', name: 'Newsletter', title: fitTitle('Career Advice Newsletter'), desc: clamp('Sign up for the free Career Education Institute newsletter: new blog articles on career advice, salaries, training and hiring, sent to your inbox.'),
      body: `${pageHero({ crumbs, eyebrow: 'Newsletter', h1: 'Get the Career Education Institute Newsletter', lead: 'New career advice, salary updates, training tips and hiring insights from our blog, sent to your inbox.', meta: false })}<div class="wrap layout"><div>${typeformEmbed(cfg.forms.newsletterSignup)}<p class="small muted" style="margin-top:14px">You can <a href="${href('/newsletter/unsubscribe/')}">unsubscribe</a> at any time. See our <a href="${href('/privacy-policy/')}">Privacy Policy</a>.</p></div>
<aside><div class="side-box"><h2>What you get</h2><ul class="nl-list"><li>New blog articles when they publish</li><li>Salary and job outlook updates</li><li>Training and career-change tips</li><li>Hiring and onboarding insights for employers</li></ul></div>${sideLinks('More ways to follow', [['Read the blog', '/blog/'], ['Subscribe via RSS', '/blog/feed.xml'], ['Unsubscribe', '/newsletter/unsubscribe/']])}</aside></div>`, schema: [] });
  }
  {
    const path = '/newsletter/unsubscribe/';
    const crumbs = [['Home', '/'], ['Newsletter', '/newsletter/'], ['Unsubscribe', path]];
    pages.push({ path, crumbs, og: '/og/blog.png', noindex: true, title: fitTitle('Newsletter Unsubscribe'), desc: clamp('Unsubscribe from the Career Education Institute newsletter. Use this form to stop receiving our blog and career advice emails.'),
      body: `${pageHero({ crumbs, eyebrow: 'Newsletter', h1: 'Unsubscribe from the Newsletter', lead: 'Use the form below to stop receiving the Career Education Institute newsletter.', meta: false })}<div class="wrap layout"><div>${typeformEmbed(cfg.forms.newsletterUnsubscribe)}<p class="small muted" style="margin-top:14px">Questions? Email <a href="mailto:${cfg.email}">${cfg.email}</a>.</p></div>
<aside>${sideLinks('Changed your mind?', [['Sign up again', '/newsletter/'], ['Read the blog', '/blog/'], ['Contact us', '/contact/']])}</aside></div>`, schema: [] });
  }

  return pages;
}
