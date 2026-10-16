# MrPress Education — www.mrpress-education.org

Static website for MrPress Education: career training by job title, plus free career resources
(50 career profiles, salary data, quizzes, guides, employer hiring/onboarding resources and a blog).
U.S.-only service. Hosted on GitHub Pages.

## What’s in the site (≈1,170 pages)
| Section | Pages |
|---|---|
| 50 career hubs | Overview, day in the life, salary, how to become, skills, glossary, how-to index + 3 step-by-step task pages, interview questions, FAQ, fit quiz |
| 50 trainings | Course page with syllabus + enrollment form, free practice test |
| Comparisons | ~100 “X vs. Y” career comparisons |
| Quizzes | Career Match, College vs. Trade School, Career Change Readiness, Work Style, 8 field quizzes |
| Guides | 46 guides for students, career changers, professionals and employers |
| Employers | Buyer pages (employers, staffing agencies, workforce programs, 8 industries), 50 hiring guides, 50 job description templates, 50 onboarding plans, ROI calculator, onboarding assessment |
| Lists & data | 14 “best careers” lists, salary guide, A–Z glossary |
| Students / changers / professionals hubs, worksheets, blog, company and legal pages | |

## Everyday tasks
| Task | How |
|---|---|
| Publish a blog post | Upload a zip to `blog-uploads/` on GitHub — see **BLOG-UPLOAD-GUIDE.md** |
| Change phone, emails, course length, price | Edit `site.config.mjs` |
| Edit a career | `src/data/careers/*.mjs` |
| Edit a guide | `src/data/guides/*.mjs` (Markdown in the `body` field) |
| Edit legal pages | `src/pages/legal.mjs` |
| Refresh BLS pay data (each spring) | `npm run update-salaries -- 2026` (year of the new OEWS release), then rebuild (projections in `src/data/labor.json` are updated by hand each fall from BLS Table 1.2) |
| Mark content as reviewed | Change `updated` in `site.config.mjs` |

Every push to `main` rebuilds and deploys automatically (GitHub Actions → Pages), runs the SEO audit and
publishes any uploaded blog zips.

## Run locally
```bash
npm install
npm run dev        # builds to dist/ and serves http://localhost:4173
npm run audit      # SEO checks: titles, descriptions, H1s, canonicals, broken links, schema, orphans
```

## Enrollment
There is no database. Enrollment, contact and employer forms open a pre-filled email to
`info@hazwoper-osha.com` (cc `hasan@hazwoper-osha.com`), configured in `site.config.mjs`.

## Connecting the domain later (www.mrpress-education.org)
1. Buy the domain and add DNS records: a `CNAME` record for `www` → `<github-user>.github.io`
   (and GitHub’s apex `A` records if you also want `mrpress-education.org`).
2. Create `static/CNAME` containing `www.mrpress-education.org` and push.
3. In the repo: **Settings → Pages → Custom domain** → `www.mrpress-education.org`, then tick **Enforce HTTPS**.
4. The next build automatically switches every canonical URL, sitemap and structured-data link to the new domain,
   and GitHub redirects the old github.io address.

## After launch (SEO)
- Add the site to **Google Search Console** and **Bing Webmaster Tools**; put the verification codes in
  `site.config.mjs → verification`, push, then submit `/sitemap.xml`.
- `robots.txt` and `llms.txt` only take effect at the domain root, so they become active once the custom domain is connected.
- Optional analytics: add a GA4 ID in `site.config.mjs → analytics.ga4`. It loads only after page load,
  never for visitors with Global Privacy Control, and respects the opt-out on /your-privacy-choices/.

## Tech
Zero-dependency Node.js generator (`scripts/build.mjs`) producing plain HTML with inline CSS and tiny
deferred scripts — no framework, no tracking, no cookies by default. `sharp` generates social images and icons.
