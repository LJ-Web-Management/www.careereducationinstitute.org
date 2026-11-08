# Career Education Institute: www.careereducationinstitute.org

Static website for Career Education Institute: career training by job title, a few complete job-title courses from
HAZWOPER-OSHA.com sold through an online checkout, plus free career resources (700+ career profiles, salary data, quizzes,
guides, employer hiring and onboarding resources). Hosted on GitHub Pages. The blog lives in a separate repository
(`blog.careereducationinstitute.org`) and is published at `/blog/` of this site: see **The blog** below.

- **Operated by:** Industrial Certified Training, LLC ([ictraining.us](https://www.ictraining.us)), which also runs HAZWOPER-OSHA.com
- **Live address:** https://cei.ictraining.us (GitHub Pages custom domain; see **Deploying to cei.ictraining.us** below)
- **Preview:** https://lj-web-management.github.io/www.careereducationinstitute.org/ (until the custom domain is connected)
- **Domain (planned):** https://www.careereducationinstitute.org

## What's in the site (about 15,200 pages)
| Section | Pages |
|---|---|
| 700+ career hubs in 17 fields | Overview, day in the life, salary, how to become, skills, glossary, how-to index plus 3 step-by-step task pages, interview questions, FAQ, fit quiz |
| 700+ job-title trainings | Course page with price, length, timed syllabus and enrollment form, plus a free practice test. Truck driver, forklift operator and flagger point to the matching provider course instead |
| 3 checkout trainings | Forklift operator, flagger and mold inspector training from HAZWOPER-OSHA.com, named and listed like every other training under `/training/` with a Buy now button. Old `/courses/` links redirect (`movedFrom` in `src/data/partner-selection.mjs`). Prices come from the provider catalog, the same as on HAZWOPER-OSHA.com |
| Subscriptions | `/subscriptions/` (seat plans for individuals and groups) and `/for-workforce-programs/` (program seats): monthly, yearly or decade billing, 3% yearly loyalty discount up to 15%, quoted by email, no published prices. Settings in `site.config.mjs → subscriptions` |
| Checkout | `/checkout/?course=<slug>`: Stripe card payment and enrollment in the provider LMS |
| Comparisons | About 2,200 "X vs. Y" career comparisons, plus a comparison hub for each field |
| Quizzes | Career Match, College vs. Trade School, Career Change Readiness, Work Style, 17 field quizzes |
| Guides | 46 guides for students, career changers, professionals and employers |
| Employers | Buyer pages (employers, staffing agencies, workforce programs, 17 industries), 700+ hiring guides, 700+ job description templates, 700+ onboarding plans, ROI calculator, onboarding assessment |
| Lists and data | 14 "best careers" lists, salary guide, A to Z glossary |
| College & Career Finder | `/college-and-career-finder/`: a nine-step tool (goals, education stage, interests, colleges, majors, minors, career goals, skills, personalized results) that ends in career paths, skills and ranked CEI training recommendations. Plus indexable pages from the same data: `/college-majors/` (109 majors, 16 field pages), `/college-minors/` (50), `/college-majors-and-career-paths/`, `/skills-to-learn/` (12), `/career-options-after-high-school/`, `/colleges/` (search) and a page per state. See **College & Career Finder** below |
| Keyword landing pages | 10 pages built from the SEO and AI keyword research: `/online-career-training/`, `/job-readiness-training/`, `/employee-training-programs/`, `/career-readiness-programs-for-schools/`, four field training pages (healthcare, skilled trades, logistics, technology and business) and two answer-led question pages (`/career-exploration/`, `/choosing-online-career-training/`) |
| Partner program | `/partners/` plus a page each for school districts, colleges, companies and organizations: a discount code for their people and a share of each sale, with a sign-up form |
| Students, changers and professionals hubs, worksheets, newsletter sign-up, company and legal pages | |

## Everyday tasks
| Task | How |
|---|---|
| Publish a blog post | In the **blog.careereducationinstitute.org** repository: upload a zip to its `blog-uploads/` folder. See its BLOG-UPLOAD-GUIDE.md |
| Change the contact, newsletter sign-up or unsubscribe form | Paste the new Typeform live-embed id into `site.config.mjs → forms`. The sign-up popup on the blog home and posts lives in `src/assets/newsletter.js` |
| Change the partner discount, the partner's share or how long a share link lasts | Edit `site.config.mjs → partnerProgram` (10% off for learners, 5% of the discounted price to the partner, share links kept 30 days). Partner page copy lives in `src/pages/partners.mjs`. The discount actually charged at checkout comes from the code set up in the LMS |
| Have Codex write and publish a post | In the **blog.careereducationinstitute.org** repository: send Codex the one-line prompt at the top of its BLOG-POST-PROMPT.md |
| Change phone, emails, legal company, governing state, volume discounts | Edit `site.config.mjs` |
| Change a job-title training's length | Edit `src/data/course-pricing.mjs` (the price follows the length ladder), then run `npm run course-specs` |
| Add or remove a provider course | Edit `src/data/partner-selection.mjs` (LMS course id, page slug, job title, field), then run `npm run update-partner-courses`. Only list courses that are the complete training for a job title, not topic, refresher or endorsement courses |
| Refresh provider course prices and details | `npm run update-partner-courses` (reads the provider catalog and rewrites `src/data/partner-courses.json`) |
| Edit finder majors, minors, interests, skills, rankings or course mappings | Edit `src/data/finder/*.json` (each file has a `_help` note), then push. The build checks every mapping |
| Refresh the college directory (each fall, when IPEDS publishes) | `npm run update-colleges -- 2025` (the IPEDS year), then rebuild |
| Edit a career | `src/data/careers/*.mjs` |
| Edit a guide | `src/data/guides/*.mjs` (Markdown in the `body` field) |
| Edit a keyword landing page | `src/data/landing.mjs` (Markdown with `{careers}`, `{pay:<slug>}`, `{table:<key>}` tokens; rendered by `src/pages/landing.mjs`) |
| Edit legal pages | `src/pages/legal.mjs` |
| Refresh BLS pay data (each spring) | `BLS_API_KEY=<your key> npm run update-salaries -- 2026` (year of the new OEWS release), then rebuild. A free key from data.bls.gov/registrationEngine is needed now that there are 700+ careers (the keyless API allows only 25 requests a day). Projections in `src/data/labor.json` are updated by hand each fall from BLS Table 1.2 |
| Mark content as reviewed | Change `updated` in `site.config.mjs` |
| Replace the logo | Swap `src/brand/logo-full.png` (header and footer) or `src/brand/logo-icon.png` (favicons, app icons, social images). Transparent PNGs; the build trims and resizes them |

Every push to `main` rebuilds and deploys automatically (GitHub Actions to Pages) and runs the SEO audit. Each deploy
also builds the blog repository into `/blog/` (with this build's `/assets/shell.json`: header, footer, stylesheet),
shows the blog's latest posts on the homepage (from the blog's `posts.json`) and site search merges the blog's
`search-index.json`. The workflow also runs every 6 hours, and whenever the blog repository asks for it.

## College & Career Finder
Helps students, parents, job seekers and career changers explore colleges, majors, minors and careers, then connects
their answers to CEI trainings. Career Education Institute is presented throughout as **not** a college, degree-granting
institution or admissions service, and trainings as non-credit courses that do not replace a degree or guarantee
employment.

**Two separate data sources, never mixed**
- **Colleges and programs: U.S. Department of Education IPEDS only.** `npm run update-colleges [year]`
  (`scripts/fetch-colleges.mjs`) downloads the directory (HD), online-education flags (IC), completions by program (C_A)
  and CIP program titles, keeping active, degree-granting, Title IV schools in U.S. states, DC and territories (3,954 in
  the 2024 data). It writes `src/data/colleges.json`. Nothing is invented: no tuition, admission requirements or
  outcomes are shown; each school links to its official website, admissions page, net price calculator (when reported)
  and its College Navigator profile. Verified corrections go in `src/data/finder/colleges-custom.json`.
  A major is "offered" by a school when the school reported awards under one of the major's CIP codes.
- **Training recommendations: the CEI course catalog only.** Every recommendation is a job-title training that exists
  (one per career profile) or the checkout course that replaces it. Prices and course pages come from the catalog. The
  build (`checkFinder` in `src/lib/finder.mjs`) stops if any mapping names a career/training that does not exist.

**Data files** (`src/data/finder/`, each with a `_help` note): `majors.json` (fields and majors: summary, coursework,
skills, degrees, ordered career list, minors with why they pair well, interests, CIP codes), `minors.json`,
`interests.json`, `skills.json`, `questions.json` (answer wording), `recommend.json` (ranking weights, minimum score,
boosts, hidden courses, per-major pins, course overrides), `colleges-custom.json`.

**Recommendation engine** (`src/assets/finder-engine.js`, the same file in the browser and the static pages): each training scores points for connections to the visitor's careers, majors, minors, interests, industries and
skills (earlier items in a list count more). Only trainings reaching `minScore` are shown, so nothing unrelated is
added to fill space. Skill-listed courses count fully only when they share a career field with the rest of the answers.
Ties go to careers with more BLS annual openings.

**Leads**: results are always shown without any personal details. Optional forms (save/email/download results, and
"Request more information") post JSON to `site.config.mjs → finder.leadEndpoint` when set (a Zapier/Make webhook, a
Google Apps Script web app writing to a Sheet, or a CRM form endpoint). With no endpoint, information requests open a
pre-filled email to `enrollTo`, and visitors who email themselves their results and agree to follow-up copy that inbox.
Marketing consent is an unticked, optional box. Names and emails are never sent to analytics.

**Analytics**: the finder uses the site's normal Google Analytics 4 page tracking (no custom events). Names and
emails from the lead forms are never sent to analytics.

## Pricing and course length
Job-title trainings are priced under $50, by length: 6 hours $29.99, 8 hours $34.99, 10 hours $39.99, 12 hours $44.99,
14 hours $49.99. Each course splits into 10 timed modules. **COURSE-SPECS.md** lists every training's
length, price and module plan for the course builders. Regenerate it with `npm run course-specs`.

Provider courses use the provider's own price, because the provider LMS charges by course id.
Volume discounts (2 to 1,000 seats) are set in `site.config.mjs → bulkTiers`.

## Checkout
`src/assets/checkout.js` follows the same flow as datacentertraining.us:
1. Stripe Elements card, then `stripe.createPaymentMethod` (publishable key only, in `site.config.mjs → checkout`).
2. `POST https://hazwoper-osha.com/api/add_new_user` creates the learner account.
3. `POST /api/add_order` with the LMS `course_id`, seat count and `order_from: careereducationinstitute.org`.
4. `stripe.confirmCardPayment` when the order returns a client secret. The learner gets their login by email.

Discount codes: the checkout's code box checks the code with `POST /api/apply_coupon_referral` (LMS coupons, or
referral codes starting with `R-`), shows the discount and sends `coupon_id` or `ref_code` with the order, the same
way the provider's own checkout does. If a code is applied but the LMS returns a higher amount than the page shows,
the card is not charged. Partner share links (`?code=XYZ` on any page) fill the code in at checkout and on enrollment
forms for `partnerProgram.linkDays` days.

Never put a Stripe secret key in this repository. Card data goes straight to Stripe and never touches this site.

## Enrollment requests
Job-title trainings, employer quotes and partner program sign-ups use forms that open a pre-filled email to
`info@hazwoper-osha.com` (cc `hasan@hazwoper-osha.com`), configured in `site.config.mjs`. Learners can enter a
partner discount code on the enrollment form; it appears in the email so the team can apply it to the invoice.
The contact form and the newsletter forms are embedded Typeforms (`site.config.mjs → forms`).

## Run locally
```bash
npm install
npm run dev        # builds to dist/ and serves http://localhost:4173
npm run audit      # SEO checks: titles, descriptions, H1s, canonicals, broken links, schema, orphans, em dashes
```

## The blog
The blog's source is its own repository, `LJ-Web-Management/blog.careereducationinstitute.org`, and it is published at
**/blog/ of this site** (https://cei.ictraining.us/blog/). It uses this site's header, footer and stylesheet, and its links
to careers, trainings and guides point back here.

How the two connect:
- This repository's deploy workflow checks out the blog repository (`blog-repo/`), builds it with
  `SITE_URL=<this site>/blog`, audits it and copies its `dist/` to `dist/blog/`, so both deploy as one Pages site. The
  blog's `sitemap.xml` is listed in this site's `robots.txt`.
- Links written as `/blog/...` go to `cfg.blogUrl` (`site.config.mjs`), which is this site's address + `/blog`. The
  repository variable `BLOG_URL` overrides it; `BLOG_REPO` overrides which repository is built (default
  `LJ-Web-Management/blog.careereducationinstitute.org`).
- When a post is published, the blog's workflow asks this one to redeploy (`repository_dispatch`, `blog-updated`). That needs
  the secret `SITE_DISPATCH_TOKEN` in the blog repository: a fine-grained token with **Contents: read and write** on this
  repository. Without it, new posts go live on the next push here or the 6-hourly scheduled run. If the blog repository is
  ever made private, add the same secret here (with read access to the blog) so this workflow can check it out.
- The blog repository's own Pages address (https://lj-web-management.github.io/blog.careereducationinstitute.org/) only
  redirects old links to the same page under /blog/ here.

### Deploying to cei.ictraining.us
1. DNS for `ictraining.us`: add a `CNAME` record `cei` → `lj-web-management.github.io`.
2. This repository: **Settings → Pages → Custom domain** = `cei.ictraining.us`, save, wait for the DNS check, then tick
   **Enforce HTTPS**. (No `CNAME` file is needed: the site deploys with GitHub Actions.)
3. **Actions → Build and deploy → Run workflow** (or push to `main`). The build reads the domain from Pages, so canonical
   URLs, the sitemap and `robots.txt` all use `https://cei.ictraining.us`, and the blog is at `https://cei.ictraining.us/blog/`.

Moving to www.careereducationinstitute.org later: set that as this repository's custom domain and run the workflow; the
blog follows to `/blog/` automatically. In the blog repository, set the variable `BLOG_URL` to
`https://www.careereducationinstitute.org/blog` so its old-address redirects point to the new place.

## After launch (SEO)
- Add the site to **Google Search Console** and **Bing Webmaster Tools**; put the verification codes in
  `site.config.mjs → verification`, push, then submit `/sitemap.xml`.
- `robots.txt` and `llms.txt` only take effect at the domain root, so they become active once the custom domain is connected.
- Google Analytics 4 (`G-FPKWMLEWMG`) is set in `site.config.mjs → analytics.ga4`. It loads only after page load,
  never for visitors with Global Privacy Control, and respects the opt-out on /your-privacy-choices/.

## Tech
Zero-dependency Node.js generator (`scripts/build.mjs`) producing plain HTML, one shared stylesheet
(`/assets/styles.css`, minified from `src/assets/styles.css`, with a content hash in the link so browsers fetch it again only after it changes) and small deferred scripts. Category icons are drawn once per page as SVG symbols. No framework; the only tracking is Google Analytics (see above). Stripe.js loads only on the checkout page.
`sharp` generates the logo, icons and social images from `src/brand/`.
