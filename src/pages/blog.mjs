import fs from 'node:fs';
import path from 'node:path';
import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, md, fmtDate, slugify, wordCount } from '../lib/util.mjs';
import { pageHero, ctaCard, sideLinks } from '../lib/layout.mjs';

export function loadPosts(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'post.json'))).map((d) => {
    const p = JSON.parse(fs.readFileSync(path.join(dir, d, 'post.json'), 'utf8').replace(/[ \t]*—[ \t]*/g, ', '));
    const files = fs.readdirSync(path.join(dir, d)).filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f));
    return { ...p, slug: p.slug || d, dir: path.join(dir, d), images: files, category: p.category || 'Career Advice' };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

const picture = (p, cls, eager = false) => p.cover ? `<picture>${p.coverWebp ? `<source type="image/webp" srcset="${href(`/blog/${p.slug}/${p.coverWebp}`)}">` : ''}<img class="${cls}" src="${href(`/blog/${p.slug}/${p.cover}`)}" alt="${esc(p.coverAlt || p.title)}" width="${p.width || 1200}" height="${p.height || 630}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>` : '';

const card = (p) => `<article class="card link post-card">${picture(p, '')}<span class="chip">${esc(p.category)}</span><h3 style="margin-top:8px"><a class="stretch" href="${href(`/blog/${p.slug}/`)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p><p class="small muted" style="margin:0"><time datetime="${p.date}">${fmtDate(p.date)}</time></p></article>`;

export function blogPages(ctx) {
  const { posts } = ctx;
  const pages = [];
  const cats = [...new Set(posts.map((p) => p.category))];
  const og = (p) => (p.cover ? `/og/blog-${p.slug}.jpg` : `/og/blog-${p.slug}.png`);

  for (const p of posts) {
    const path = `/blog/${p.slug}/`;
    const crumbs = [['Home', '/'], ['Blog', '/blog/'], [p.title, path]];
    const { html, toc } = md(p.body);
    const words = wordCount(html);
    const related = posts.filter((x) => x !== p && x.category === p.category).slice(0, 3).concat(posts.filter((x) => x !== p && x.category !== p.category)).slice(0, 3);
    const share = encodeURIComponent(abs(path));
    const body = `${pageHero({ crumbs, eyebrow: p.category, h1: esc(p.title), lead: esc(p.description), meta: false, extra: `<div class="meta"><span>By ${esc(p.author || 'Career Education Institute')}</span><span>Published <time datetime="${p.date}">${fmtDate(p.date)}</time></span>${p.updated && p.updated !== p.date ? `<span>Updated <time datetime="${p.updated}">${fmtDate(p.updated)}</time></span>` : ''}<span>${Math.max(1, Math.round(words / 230))} min read</span></div>` })}
<div class="wrap layout"><article class="prose">${picture(p, 'cover', true)}${html}
${p.tags?.length ? `<p class="chips">${p.tags.map((t) => `<span class="chip">#${esc(t)}</span>`).join(' ')}</p>` : ''}
<p class="small">Share: <a href="https://www.linkedin.com/sharing/share-offsite/?url=${share}" rel="noopener nofollow">LinkedIn</a> · <a href="https://www.facebook.com/sharer/sharer.php?u=${share}" rel="noopener nofollow">Facebook</a> · <a href="https://twitter.com/intent/tweet?url=${share}" rel="noopener nofollow">X</a> · <a href="mailto:?subject=${encodeURIComponent(p.title)}&amp;body=${share}">Email</a></p>
${related.length ? `<h2 id="more-posts">More from the blog</h2><div class="grid-2">${related.map(card).join('')}</div>` : ''}</article>
<aside>${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}${ctaCard({ title: 'Find your career fit', text: 'Take the free Career Match Quiz, then learn the job with practical online training.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}</aside></div>`;
    pages.push({ path, crumbs, body, og: og(p), ogAlt: p.coverAlt, type: 'article', kind: 'Blog', scripts: ['newsletter'], name: p.title, published: p.date, modified: p.updated || p.date,
      title: fitTitle(p.title), desc: clamp(p.description),
      schema: [{ '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated || p.date, author: { '@type': p.author ? 'Person' : 'Organization', name: p.author || cfg.name }, publisher: { '@id': abs('/#org') }, mainEntityOfPage: abs(path), image: abs(og(p)), articleSection: p.category, keywords: (p.tags || []).join(', '), wordCount: words, inLanguage: 'en-US' }] });
  }

  const listBody = (list, heading, lead, crumbs, path) => `${pageHero({ crumbs, eyebrow: 'Blog', h1: heading, lead, meta: false })}<div class="wrap" style="padding-top:30px;padding-bottom:60px">${cats.length > 1 ? `<p>${cats.map((c) => `<a class="chip" href="${href(`/blog/category/${slugify(c)}/`)}"${path.endsWith(`/${slugify(c)}/`) ? ' aria-current="page"' : ''}>${esc(c)}</a>`).join(' ')}</p>` : ''}${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : '<p>New articles are on the way. In the meantime, explore our <a href="' + href('/guides/') + '">career guides</a>.</p>'}<p style="margin-top:24px"><a href="${href('/newsletter/')}">Get new posts by email</a> · <a href="${href('/blog/feed.xml')}">Subscribe via RSS</a></p></div>`;
  {
    const path = '/blog/';
    const crumbs = [['Home', '/'], ['Blog', path]];
    pages.push({ path, crumbs, og: '/og/blog.png', kind: 'Blog', name: 'Blog', scripts: ['newsletter'], title: fitTitle('Career Advice Blog'), desc: clamp('The Career Education Institute blog: career advice, industry trends, salary news, training tips and hiring insights for U.S. students, career changers and employers.'), body: listBody(posts, 'The Career Education Institute Blog', 'Career advice, industry news, salary updates and training tips.', crumbs, path), schema: [{ '@type': 'Blog', name: 'Career Education Institute Blog', url: abs(path), publisher: { '@id': abs('/#org') }, blogPost: posts.slice(0, 20).map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(`/blog/${p.slug}/`), datePublished: p.date })) }], modified: posts[0]?.date });
  }
  for (const c of cats) {
    const path = `/blog/category/${slugify(c)}/`;
    const crumbs = [['Home', '/'], ['Blog', '/blog/'], [c, path]];
    const list = posts.filter((p) => p.category === c);
    pages.push({ path, crumbs, og: '/og/blog.png', kind: 'Blog', name: `Blog: ${c}`, title: fitTitle(`${c} Articles`), desc: clamp(`${c} articles from the Career Education Institute blog: practical career advice and insights for U.S. learners and employers. ${list.length} article${list.length === 1 ? '' : 's'}.`), body: listBody(list, `${esc(c)}`, `${list.length} article${list.length === 1 ? '' : 's'} in ${esc(c)}.`, crumbs, path), schema: [], modified: list[0]?.date });
  }
  // Newsletter sign-up and unsubscribe pages (Typeform live embeds; the forms have a
  // transparent background, so they sit on a white card)
  const typeform = (id) => `<div class="tf-box"><div data-tf-live="${esc(id)}"></div></div><script src="https://embed.typeform.com/next/embed.js" async></script>`;
  {
    const path = '/newsletter/';
    const crumbs = [['Home', '/'], ['Blog', '/blog/'], ['Newsletter', path]];
    pages.push({ path, crumbs, og: '/og/blog.png', kind: 'Page', name: 'Newsletter', title: fitTitle('Career Advice Newsletter'), desc: clamp('Sign up for the free Career Education Institute newsletter: new blog articles on career advice, salaries, training and hiring, sent to your inbox.'),
      body: `${pageHero({ crumbs, eyebrow: 'Newsletter', h1: 'Get the Career Education Institute Newsletter', lead: 'New career advice, salary updates, training tips and hiring insights from our blog, sent to your inbox.', meta: false })}<div class="wrap layout"><div>${typeform(cfg.newsletter.signupForm)}<p class="small muted" style="margin-top:14px">You can <a href="${href('/newsletter/unsubscribe/')}">unsubscribe</a> at any time. See our <a href="${href('/privacy-policy/')}">Privacy Policy</a>.</p></div>
<aside><div class="side-box"><h2>What you get</h2><ul class="nl-list"><li>New blog articles when they publish</li><li>Salary and job outlook updates</li><li>Training and career-change tips</li><li>Hiring and onboarding insights for employers</li></ul></div>${sideLinks('More ways to follow', [['Read the blog', '/blog/'], ['Subscribe via RSS', '/blog/feed.xml'], ['Unsubscribe', '/newsletter/unsubscribe/']])}</aside></div>`, schema: [] });
  }
  {
    const path = '/newsletter/unsubscribe/';
    const crumbs = [['Home', '/'], ['Newsletter', '/newsletter/'], ['Unsubscribe', path]];
    pages.push({ path, crumbs, og: '/og/blog.png', noindex: true, title: fitTitle('Newsletter Unsubscribe'), desc: clamp('Unsubscribe from the Career Education Institute newsletter. Use this form to stop receiving our blog and career advice emails.'),
      body: `${pageHero({ crumbs, eyebrow: 'Newsletter', h1: 'Unsubscribe from the Newsletter', lead: 'Use the form below to stop receiving the Career Education Institute newsletter.', meta: false })}<div class="wrap layout"><div>${typeform(cfg.newsletter.unsubscribeForm)}<p class="small muted" style="margin-top:14px">Questions? Email <a href="mailto:${cfg.email}">${cfg.email}</a>.</p></div>
<aside>${sideLinks('Changed your mind?', [['Sign up again', '/newsletter/'], ['Read the blog', '/blog/'], ['Contact us', '/contact/']])}</aside></div>`, schema: [] });
  }

  // RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Career Education Institute Blog</title><link>${abs('/blog/')}</link><atom:link href="${abs('/blog/feed.xml')}" rel="self" type="application/rss+xml"/><description>Career advice, industry news and training tips from Career Education Institute.</description><language>en-us</language>${posts.slice(0, 30).map((p) => `<item><title>${esc(p.title)}</title><link>${abs(`/blog/${p.slug}/`)}</link><guid>${abs(`/blog/${p.slug}/`)}</guid><pubDate>${new Date(p.date + 'T12:00:00Z').toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.description)}</description></item>`).join('')}</channel></rss>\n`;
  pages.push({ path: '/blog/feed.xml', file: 'blog/feed.xml', raw: true, content: rss });
  return pages;
}
