# MrPress Education: www.mrpress-education.org

Static website for MrPress Education: career training by job title, safety and CDL certification courses
sold through an online checkout, plus free career resources (50 career profiles, salary data, quizzes,
guides, employer hiring and onboarding resources, and a blog). Hosted on GitHub Pages.

## What's in the site (about 1,280 pages)
| Section | Pages |
|---|---|
| 50 career hubs | Overview, day in the life, salary, how to become, skills, glossary, how-to index plus 3 step-by-step task pages, interview questions, FAQ, fit quiz, recommended certification courses |
| 50 job-title trainings | Course page with price, length, timed syllabus and enrollment form, plus a free practice test. Truck driver, forklift operator and HAZMAT technician point to the matching provider course instead |
| 96 certification courses | OSHA Outreach, HAZWOPER, CDL ELDT, construction, workplace, electrical, equipment, healthcare, environmental, incident command and competent person courses, each with a buy button, in 11 category pages and a catalog at `/courses/` |
| Checkout | `/checkout/?course=<slug>`: Stripe card payment and enrollment in the provider LMS |
| Comparisons | About 100 "X vs. Y" career comparisons |
| Quizzes | Career Match, College vs. Trade School, Career Change Readiness, Work Style, 8 field quizzes |
| Guides | 46 guides for students, career changers, professionals and employers |
| Employers | Buyer pages (employers, staffing agencies, workforce programs, 8 industries), 50 hiring guides, 50 job description templates, 50 onboarding plans, ROI calculator, onboarding assessment |
| Lists and data | 14 "best careers" lists, salary guide, A to Z glossary |
| Students, changers and professionals hubs, worksheets, blog, company and legal pages | |

## Everyday tasks
| Task | How |
|---|---|
| Publish a blog post | Upload a zip to `blog-uploads/` on GitHub. See **BLOG-UPLOAD-GUIDE.md** |
| Change phone, emails, governing state, volume discounts | Edit `site.config.mjs` |
| Change a job-title training's length | Edit `src/data/course-pricing.mjs` (the price follows the length ladder), then run `npm run course-specs` |
| Add or remove a certification course | Edit `src/data/partner-selection.mjs` (LMS course id and category), then run `npm run update-partner-courses` |
| Refresh certification course prices and details | `npm run update-partner-courses` (reads the provider catalog and rewrites `src/data/partner-courses.json`) |
| Edit a career | `src/data/careers/*.mjs` |
| Edit a guide | `src/data/guides/*.mjs` (Markdown in the `body` field) |
| Edit legal pages | `src/pages/legal.mjs` |
| Refresh BLS pay data (each spring) | `npm run update-salaries -- 2026` (year of the new OEWS release), then rebuild. Projections in `src/data/labor.json` are updated by hand each fall from BLS Table 1.2 |
| Mark content as reviewed | Change `updated` in `site.config.mjs` |

Every push to `main` rebuilds and deploys automatically (GitHub Actions to Pages), runs the SEO audit and
publishes any uploaded blog zips.

## Pricing and course length
Job-title trainings are priced by length: 6 hours $59.99, 8 hours $74.99, 10 hours $89.99, 12 hours $109.99,
14 hours $129.99. Each course splits into 10 timed modules. **COURSE-SPECS.md** lists every training's
length, price and module plan for the course builders. Regenerate it with `npm run course-specs`.

Certification courses use the provider's own price, because the provider LMS charges by course id.
Volume discounts (2 to 1,000 seats) are set in `site.config.mjs → bulkTiers`.

## Checkout
`src/assets/checkout.js` follows the same flow as datacentertraining.us:
1. Stripe Elements card, then `stripe.createPaymentMethod` (publishable key only, in `site.config.mjs → checkout`).
2. `POST https://hazwoper-osha.com/api/add_new_user` creates the learner account.
3. `POST /api/add_order` with the LMS `course_id`, seat count and `order_from: mrpress-education.org`.
4. `stripe.confirmCardPayment` when the order returns a client secret. The learner gets their login by email.

Never put a Stripe secret key in this repository. Card data goes straight to Stripe and never touches this site.

## Enrollment requests
Job-title trainings and employer quotes use forms that open a pre-filled email to
`info@hazwoper-osha.com` (cc `hasan@hazwoper-osha.com`), configured in `site.config.mjs`.

## Run locally
```bash
npm install
npm run dev        # builds to dist/ and serves http://localhost:4173
npm run audit      # SEO checks: titles, descriptions, H1s, canonicals, broken links, schema, orphans, em dashes
```

## Connecting the domain later (www.mrpress-education.org)
1. Buy the domain and add DNS records: a `CNAME` record for `www` pointing to `<github-user>.github.io`
   (and GitHub's apex `A` records if you also want `mrpress-education.org`).
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
Zero-dependency Node.js generator (`scripts/build.mjs`) producing plain HTML with inline CSS and small
deferred scripts. No framework and no tracking. Stripe.js loads only on the checkout page.
`sharp` generates the logo, icons and social images from `src/brand/`.
