# Career Education Institute: www.careereducationinstitute.org

Static website for Career Education Institute: career training by job title, a few complete job-title courses from
HAZWOPER-OSHA.com sold through an online checkout, plus free career resources (700+ career profiles, salary data, quizzes,
guides, employer hiring and onboarding resources). Hosted on GitHub Pages. The blog is its own site in a separate repository
(`blog.careereducationinstitute.org`): see **The blog** below.

- **Operated by:** Industrial Certified Training, LLC ([ictraining.us](https://www.ictraining.us)), which also runs HAZWOPER-OSHA.com
- **Preview:** https://lj-web-management.github.io/www.careereducationinstitute.org/ (until the custom domain is connected)
- **Domain (planned):** https://www.careereducationinstitute.org

## What's in the site (about 15,200 pages)
| Section | Pages |
|---|---|
| 700+ career hubs in 17 fields | Overview, day in the life, salary, how to become, skills, glossary, how-to index plus 3 step-by-step task pages, interview questions, FAQ, fit quiz |
| 700+ job-title trainings | Course page with price, length, timed syllabus and enrollment form, plus a free practice test. Truck driver, forklift operator and flagger point to the matching provider course instead |
| 5 provider courses | Complete job-title training from HAZWOPER-OSHA.com: CDL ELDT Class A and Class B, forklift operator, flagger and mold inspector, each with a buy button, listed at `/courses/` |
| Checkout | `/checkout/?course=<slug>`: Stripe card payment and enrollment in the provider LMS |
| Comparisons | About 2,200 "X vs. Y" career comparisons, plus a comparison hub for each field |
| Quizzes | Career Match, College vs. Trade School, Career Change Readiness, Work Style, 17 field quizzes |
| Guides | 46 guides for students, career changers, professionals and employers |
| Employers | Buyer pages (employers, staffing agencies, workforce programs, 17 industries), 700+ hiring guides, 700+ job description templates, 700+ onboarding plans, ROI calculator, onboarding assessment |
| Lists and data | 14 "best careers" lists, salary guide, A to Z glossary |
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
| Edit a career | `src/data/careers/*.mjs` |
| Edit a guide | `src/data/guides/*.mjs` (Markdown in the `body` field) |
| Edit legal pages | `src/pages/legal.mjs` |
| Refresh BLS pay data (each spring) | `BLS_API_KEY=<your key> npm run update-salaries -- 2026` (year of the new OEWS release), then rebuild. A free key from data.bls.gov/registrationEngine is needed now that there are 700+ careers (the keyless API allows only 25 requests a day). Projections in `src/data/labor.json` are updated by hand each fall from BLS Table 1.2 |
| Mark content as reviewed | Change `updated` in `site.config.mjs` |
| Replace the logo | Swap `src/brand/logo-full.png` (header and footer) or `src/brand/logo-icon.png` (favicons, app icons, social images). Transparent PNGs; the build trims and resizes them |

Every push to `main` rebuilds and deploys automatically (GitHub Actions to Pages) and runs the SEO audit. Each build
also writes `/assets/shell.json` (header, footer, stylesheet) for the blog, shows the blog's latest posts on the homepage
(from the blog's `posts.json`) and site search merges the blog's `search-index.json`.

## Pricing and course length
Job-title trainings are priced by length: 6 hours $49.99, 8 hours $59.99, 10 hours $74.99, 12 hours $89.99,
14 hours $99.99. Each course splits into 10 timed modules. **COURSE-SPECS.md** lists every training's
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
The blog is its own static site in the repository `LJ-Web-Management/blog.careereducationinstitute.org` (prepared locally in
`../careereducationinstitute-blog`). It uses this site's header, footer and stylesheet (read from `/assets/shell.json` at
build time), and its links to careers, trainings and guides point back here.

| | Main site | Blog |
|---|---|---|
| Repository | `LJ-Web-Management/www.careereducationinstitute.org` | `LJ-Web-Management/blog.careereducationinstitute.org` |
| Address now | https://lj-web-management.github.io/www.careereducationinstitute.org/ | https://lj-web-management.github.io/blog.careereducationinstitute.org/ |
| Address with custom domains | https://www.careereducationinstitute.org | https://blog.careereducationinstitute.org |

How the two connect: in this site, links written as `/blog/...` go to `cfg.blogUrl` (`site.config.mjs`), which follows this
site's address (github.io stays github.io, the custom domain uses the blog subdomain). The repository variable `BLOG_URL`
overrides it, for example while only one of the two custom domains is connected.

Custom domains, when you are ready:
1. DNS: a `CNAME` record for `www` and one for `blog`, both pointing to `lj-web-management.github.io` (plus GitHub's apex `A`
   records if you also want `careereducationinstitute.org`).
2. In each repository: **Settings → Pages → Custom domain** (`www.careereducationinstitute.org` here,
   `blog.careereducationinstitute.org` in the blog), then tick **Enforce HTTPS**.
3. Run this repository's workflow, then the blog's, so each picks up the other's new address.

Optional automatic rebuilds: make a fine-grained token with **Contents: read and write** on both repositories and save it as
the secret `SITE_DISPATCH_TOKEN` in both. Add the variable `BLOG_REPO` = `LJ-Web-Management/blog.careereducationinstitute.org`
here and `MAIN_SITE_REPO` = `LJ-Web-Management/www.careereducationinstitute.org` in the blog. A new post then refreshes this
site's homepage, and menu or style changes here refresh the blog. Without them, the homepage picks up new posts on this
site's next deploy (site search reads the blog's live index, so it is always current).

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
