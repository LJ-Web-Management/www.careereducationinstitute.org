// Keyword landing pages (one per keyword cluster in CEI_200_SEO_and_AI_Keyword_Research.xlsx). Rendered by
// src/pages/landing.mjs at /<slug>/.
//
// Text is Markdown and can use these tokens, filled in at build time so figures never go stale:
//   {careers}            number of career profiles / job-title trainings, written "700+"
//   {pay:<slug>}         a career's BLS median pay        {hours:<slug>} / {price:<slug>}  its training length and price
//   {minPrice} {maxPrice} {minHours} {maxHours}           the job-title training price and length ladder
//   {table:<key>}        (own line) a table of the trainings listed in `tables[key]`: hours, price, career median pay
//   {list:<key>}         (own line) a computed list: fastest-growing, no-degree-pay, fast-track
//   {tiers}              (own line) the volume discount table
//   {fields}             (own line) links to the four field training pages
//
// Accuracy rules (from the keyword research notes): only describe what the site really offers. Job-title trainings are
// general, non-credit career-preparation courses. Never imply a license, accreditation, certification, academic credit
// or job placement.
export const landingPages = [
  // ---------------------------------------------------------------- Core online career training (keywords 1 to 20)
  {
    slug: 'online-career-training', cluster: 'core', crumb: 'Online career training',
    metaTitle: 'Online Career Training by Job Title, Under $50',
    desc: 'Self-paced online career training for {careers} job titles. Each course runs {minHours} to {maxHours} hours, costs {minPrice} to {maxPrice} and needs no degree.',
    eyebrow: 'Online career training', h1: 'Online Career Training and Career Courses by Job Title',
    lead: 'Short, self-paced online job training for {careers} careers. Learn what a job really involves, its vocabulary, tasks, tools and safety rules, before you spend months or thousands of dollars on a program.',
    answer: 'Career Education Institute offers online career training for {careers} job titles. Each course is self-paced, takes {minHours} to {maxHours} hours, costs {minPrice} to {maxPrice}, includes 12 months of access and ends with a certificate of completion. The courses are general, non-credit career preparation: they teach the job, but they do not grant a license, certification or college credit.',
    keywords: 'online career training, online career courses, online job training, career training programs, online vocational training, career education courses, self paced career training, affordable online career courses, job skills courses online, occupational training online, career training without a degree, short term career training, career courses for adults, career training for beginners, job preparation courses, career change training',
    tables: { popular: ['medical-assistant', 'electrician', 'hvac-technician', 'it-support-specialist', 'pharmacy-technician', 'bookkeeper', 'welder', 'truck-driver', 'customer-service-representative', 'forklift-operator'] },
    body: `## What our online career courses are
Every course on this site is built around one job title, such as [medical assistant](/training/medical-assistant/), [HVAC technician](/training/hvac-technician/) or [bookkeeper](/training/bookkeeper/). Instead of a general “career skills” class, you learn the actual job: what people in the role do all day, the words they use, the tasks they perform step by step, the tools they handle and the safety and compliance rules they follow.

That makes the training useful at three moments:

- **Before you commit** to a longer program, to find out whether you would enjoy the work.
- **While you job hunt**, so you can speak the language of the job in an interview.
- **In your first weeks** in a new role, as a structured head start.

## How each course works
Every job-title training follows the same ten-module plan, timed to the course length:

1. Introduction to the role: where people work, pay and the career ladder
2. A day on the job
3. Essential vocabulary, with practice drills
4. Core duties and responsibilities
5. Common tasks, step by step
6. Tools, equipment and technology
7. Safety, compliance and professional standards
8. Skills employers look for
9. Launching your career: training paths, credentials, resume and interview preparation
10. Final knowledge check, then a certificate of completion

Each training also has a **free practice test** you can take before you buy, so you can see the style and level of the material.

## Popular online career courses
{table:popular}

Browse all {careers} in the [searchable training catalog](/training/), or start with one of the career fields below.

{fields}

## Self-paced, short-term and affordable
- **Self-paced:** there are no class times. Learn on a phone or computer whenever you have 20 minutes.
- **Short-term:** courses run {minHours} to {maxHours} hours, so most people finish in one to three weeks of evenings.
- **Affordable:** prices run from {minPrice} to {maxPrice} by course length, with no application fee. Groups get volume pricing from 2 learners, and [employers](/for-employers/) and [schools](/for-schools/) can subscribe to training seats by the month.
- **12 months of access**, so you can come back to the material once you start the job.

## Career training without a degree
Most of the jobs we train for do not require a four-year degree. Many start with a high school diploma plus a short certificate program, an apprenticeship or paid on-the-job training. Some of the best-paying examples:

{list:no-degree-pay}

See the full list of [highest-paying jobs without a degree](/best-careers/highest-paying-jobs-without-a-degree/) and the [fastest careers to train for](/best-careers/fastest-careers-to-train-for/).

## Who the training is for
- **Beginners and students** who want to explore a career with real detail, not just a job description.
- **Adults changing careers**, who need to test a new field quickly and affordably. Our [career change guide](/guides/how-to-change-careers/) walks through the full plan.
- **New hires** who want to ramp up faster, and the **employers** who onboard them. See [employee training programs](/employee-training-programs/).
- **Schools and workforce programs** that need career education for many learners at once. See [career readiness programs for schools](/career-readiness-programs-for-schools/).

## What the training is not
We want you to choose with clear eyes. Our job-title trainings are **general, non-credit career-preparation courses**:

- They do **not** grant a state license, a national certification or college credit.
- They do **not** replace state-approved programs, apprenticeships, OSHA-required training or an employer’s site-specific training.
- They do **not** include job placement or a guarantee of employment.

Where a career needs a license or exam, the course’s “Launching your career” module explains that path, and the career’s [how to become](/careers/medical-assistant/how-to-become/) page lists the steps.

## How to choose the right course
1. Not sure which career fits? Take the free [Career Match Quiz](/quizzes/career-match/).
2. Read the career profile: pay, outlook and a day in the life.
3. Take the free practice test for the training.
4. Enroll, learn at your own pace and earn your certificate of completion.

Still comparing options? Our [guide to choosing online career training](/choosing-online-career-training/) answers the questions people ask most.`,
    faq: [
      ['What is online career training?', 'Online career training is instruction delivered over the internet that prepares you for a specific job or field. At Career Education Institute each course covers one job title: its duties, vocabulary, step-by-step tasks, tools, safety rules and the path into the career.'],
      ['How much do your online career courses cost?', 'Job-title trainings cost {minPrice} to {maxPrice}, depending on length ({minHours} to {maxHours} hours). Volume pricing starts at 2 learners.'],
      ['Are the courses self-paced?', 'Yes. There are no live sessions or deadlines. You get 12 months of access to the learning platform and can study on any device.'],
      ['Do I need a degree or experience to enroll?', 'No. The courses are written for beginners. There are no prerequisites, applications or entrance exams.'],
      ['Is this the same as vocational school?', 'No. A vocational or trade school program usually lasts months, includes hands-on practice and can lead to a license or certification exam. Our courses are short, online and non-credit. Many learners use one to decide which vocational program to pursue, or to prepare for it.'],
      ['Will a course help me change careers?', 'It helps you test a new field, learn its vocabulary and prepare for interviews and formal training. It is not a substitute for a credential the job legally requires.'],
      ['What do I get when I finish?', 'A certificate of completion from Career Education Institute after you pass the final knowledge check. It shows you completed the training; it is not a license or industry certification.']
    ],
    related: [['Training catalog', '/training/'], ['Job readiness training', '/job-readiness-training/'], ['How to choose online career training', '/choosing-online-career-training/'], ['Career exploration questions', '/career-exploration/'], ['How it works', '/how-it-works/']]
  },

  // ---------------------------------------------------------------- Job readiness (keywords 21 to 40)
  {
    slug: 'job-readiness-training', cluster: 'readiness', crumb: 'Job readiness training',
    metaTitle: 'Job Readiness Training: Workplace Skills Courses',
    desc: 'Job readiness training for adults: the workplace skills employers screen for, entry-level job training by title, and how to prepare for a new job.',
    eyebrow: 'Job readiness', h1: 'Job Readiness Training and Workplace Skills',
    lead: 'Get ready for work: the workplace skills employers screen for, entry-level job training by job title, and a practical plan for preparing for a new job.',
    answer: 'Job readiness training teaches the skills and habits you need to get hired and succeed at work: communication, reliability, teamwork, time management, problem solving and customer service, plus job-search basics such as resumes and interviews. The fastest way to become job-ready for a specific role is to pair those general skills with training in that job’s actual duties, vocabulary and safety rules.',
    keywords: 'job readiness training, job readiness courses, employment preparation courses, work readiness training, workplace readiness training, entry level job training, job skills training for adults, job training for career changers, workplace skills courses, soft skills training, communication skills for work, customer service training, teamwork, time management, problem solving, critical thinking, professional development, career skills assessment, how to prepare for a new job',
    tables: { entry: ['customer-service-representative', 'warehouse-associate', 'certified-nursing-assistant', 'receptionist', 'retail-sales-associate', 'security-guard', 'construction-laborer', 'home-health-aide', 'delivery-driver', 'office-clerk'] },
    body: `## What job readiness training covers
Job readiness (also called work readiness, workplace readiness or employment preparation) training usually has two parts:

1. **Workplace skills** that apply to every job: showing up on time, communicating clearly, working on a team, managing your time, solving problems and serving customers.
2. **Job-search skills**: finding openings, writing a resume, interviewing and starting strong.

What many programs leave out is the third piece employers care about most: **knowing what the specific job involves**. That is where job-title training comes in.

## The workplace skills employers screen for
| Skill | What it looks like at work | Where to build it |
|---|---|---|
| Communication | Clear updates, good listening, professional email | [Soft skills employers want](/guides/soft-skills-employers-want/) |
| Reliability | On time, every shift; calling ahead when something goes wrong | [Your first job guide](/guides/first-job-guide/) |
| Teamwork | Helping coworkers, taking feedback, sharing information at shift change | [Soft skills employers want](/guides/soft-skills-employers-want/) |
| Time management | Prioritizing tasks, meeting deadlines, working without constant reminders | [Avoiding burnout](/guides/avoid-burnout/) |
| Problem solving and critical thinking | Noticing what is wrong, checking the cause, choosing a fix, asking when unsure | Step-by-step task guides on every career profile |
| Customer service | Patience, accuracy and calm under pressure | [Customer service representative training](/training/customer-service-representative/) |
| Safety awareness | Following procedures, reporting hazards, using PPE | [Workplace safety basics](/guides/workplace-safety-basics/) |

We don’t sell standalone soft-skills classes. Instead, every job-title training includes a **“Skills employers look for”** module that shows how these skills apply in that specific role, plus a **“Launching your career”** module covering resumes, interviews and your first 90 days.

## Entry-level job training
These roles hire many people with no experience. Each training teaches the duties, vocabulary and safety rules you’ll be asked about in the interview:

{table:entry}

More options: [fastest careers to train for](/best-careers/fastest-careers-to-train-for/) and [jobs with paid on-the-job training](/best-careers/jobs-with-paid-on-the-job-training/).

## How to prepare for a new job
1. **Learn the role before day one.** Read the job description again, then study the duties and vocabulary of the role. A job-title training or the career’s [day in the life](/careers/warehouse-associate/day-in-the-life/) page is a quick way to do it.
2. **Confirm the logistics.** Start time, location, parking or transit, dress code, what to bring (ID, documents for your I-9, safety boots) and who to ask for when you arrive.
3. **Get required items done early.** Background checks, drug screens, immunizations, CPR cards or licenses can take days.
4. **Prepare questions** about training, expectations for your first 30 days and how performance is measured.
5. **Plan your first 90 days.** Our [first 90 days guide](/guides/first-90-days-new-job/) shows how to learn fast, build relationships and get early wins.

## Job skills training for adults and career changers
If you are changing careers, you already have transferable skills: customer service, scheduling, leadership, safety awareness or technical troubleshooting. The [transferable skills guide](/guides/transferable-skills/) shows how to name them on a resume, and [how to get a job with no experience](/guides/how-to-get-a-job-with-no-experience/) covers breaking into a new field. Our [career changers hub](/career-changers/) collects every tool in one place.

## Career skills assessment
Not sure where your strengths fit? These free tools take a few minutes:

- [Career Match Quiz](/quizzes/career-match/): matches your interests to careers
- [Work Style Quiz](/quizzes/work-style/): how you like to work
- [Career Change Readiness quiz](/quizzes/career-change-readiness/): whether now is the right time
- [Career assessment tests explained](/guides/career-assessment-tests-explained/): what formal assessments measure

These quizzes are self-reflection tools, not validated psychological tests.

## Professional development for working adults
Already employed? Our [working professionals hub](/professionals/) covers raises, promotions and upskilling, and the [upskilling vs. reskilling guide](/guides/upskilling-vs-reskilling/) helps you decide whether to grow in your role or move to a new one.`,
    faq: [
      ['What is job readiness training?', 'Training that prepares you to get and keep a job: workplace skills such as communication, reliability and teamwork, job-search skills such as resumes and interviews, and ideally an understanding of the specific job you are aiming for.'],
      ['What is the difference between job readiness and work readiness?', 'The terms are used interchangeably. Some programs use “work readiness” for general workplace habits and “job readiness” for preparing for a particular job, but most cover both.'],
      ['Do you offer soft skills training courses?', 'Not as standalone courses. Every job-title training includes a module on the skills employers look for in that role, and our free guides cover soft skills, interviews and the first 90 days.'],
      ['Which entry-level jobs can I train for online?', 'Customer service representative, warehouse associate, receptionist, retail sales associate, security guard, office clerk and many more. Some roles, such as nursing assistant or security guard, also need a state-approved program or license, which the course explains.'],
      ['How long does job readiness training take?', 'Our job-title trainings take {minHours} to {maxHours} hours, self-paced. Community job readiness programs often run one to six weeks.'],
      ['Is job readiness training free?', 'Our career guides, quizzes and practice tests are free. Job-title trainings cost {minPrice} to {maxPrice}. Local workforce boards (American Job Centers) often offer free job readiness workshops, and some cover training costs for eligible adults.']
    ],
    related: [['Online career training', '/online-career-training/'], ['Soft skills employers want', '/guides/soft-skills-employers-want/'], ['First 90 days in a new job', '/guides/first-90-days-new-job/'], ['Job interview tips', '/guides/job-interview-tips/'], ['How to write a resume', '/guides/how-to-write-a-resume/'], ['Career changers hub', '/career-changers/']]
  },

  // ---------------------------------------------------------------- Employer and workforce training (keywords 41 to 60)
  {
    slug: 'employee-training-programs', cluster: 'employers', audience: 'employers', crumb: 'Employee training programs',
    metaTitle: 'Employee Training Programs by Job Title',
    desc: 'Online employee training for new hires, frontline staff and small businesses: job-specific courses for {careers} roles, volume pricing and subscriptions.',
    eyebrow: 'For employers and workforce teams', h1: 'Employee Training Programs by Job Title',
    lead: 'Job-specific online training for new hires, frontline and entry-level staff, upskilling and reskilling. One consistent foundation for every role, priced for small businesses and large teams alike.',
    answer: 'Career Education Institute provides online, self-paced employee training for {careers} job titles. Each course gives a new or current employee a structured foundation in their role: duties, vocabulary, step-by-step tasks, tools and safety standards. Pricing is per learner with volume discounts from 2 seats, or by seat subscription. The courses supplement, and do not replace, legally required or site-specific training.',
    keywords: 'workforce training programs, employee training programs, employee skills training, workforce development training, job specific employee training, new hire training courses, employee onboarding courses, staff training courses online, frontline employee training, entry level employee training, employee professional development, workforce upskilling, reskilling programs for employees, staff development, employee training for small business, training programs for staffing agencies, candidate skills training, pre employment training, workforce readiness programs, corporate training courses online',
    tables: { frontline: ['warehouse-associate', 'customer-service-representative', 'medical-assistant', 'certified-nursing-assistant', 'construction-laborer', 'building-maintenance-technician', 'production-assembler', 'retail-sales-associate', 'security-guard', 'forklift-operator'] },
    body: `## Job-specific training, not generic e-learning
Most corporate training libraries teach topics: harassment prevention, Excel, leadership. They rarely teach a new warehouse associate how a pick-and-pack shift runs, or a new medical assistant how rooming a patient works. Our courses do: each one is built around a single job title and follows the same ten modules, from a day on the job through core tasks, tools, safety and a final knowledge check.

Employers use them for:

- **New hire training and onboarding**: a consistent first-week foundation, before or alongside on-site training. Pair it with a free [30-60-90 onboarding plan](/employers/onboarding-plans/) for the role.
- **Frontline and entry-level employee training**: roles with high turnover where every new person needs the same basics.
- **Upskilling and reskilling**: moving an employee into a new role (for example, a stock associate into a forklift or logistics role). See [upskilling vs. reskilling](/guides/upskilling-vs-reskilling/).
- **Staff development**: refreshing vocabulary, procedures and safety standards for current staff.

## Frontline and entry-level employee training
{table:frontline}

Browse all {careers} job titles in the [training catalog](/training/), or see onboarding training by industry on our [employer training page](/for-employers/).

## Employee training for small business
Small businesses rarely have a trainer or an LMS. With our courses you don’t need either: enroll one employee or ten, and each person gets a login by email, 12 months of access and a certificate when they finish. There is no setup fee or minimum.

## Onboarding and retraining subscriptions
Training more than a few people? The [jobs and workforce program](/for-employers/) is a subscription priced by the number of seats you want each month, for onboarding new hires and retraining current employees. Every subscription includes your own landing page for your learners, and white label (your name and logo in place of ours) is a paid add-on. Workforce boards, American Job Centers and nonprofits use the same program for their participants.

## Pricing
Job-title trainings cost {minPrice} to {maxPrice} per learner, depending on course length. Volume discounts apply automatically:

{tiers}

Training a whole team? [Subscriptions](/for-employers/) are priced by seats per month and quoted on request. Use the [training ROI calculator](/employers/training-roi-calculator/) to estimate what faster ramp-up and lower turnover are worth to you.

## What the training does not replace
Our courses are general, non-credit job-role training. They do not replace OSHA-required training, state licensing programs, manufacturer certification or your own site-specific procedures and equipment sign-offs. Think of them as the classroom foundation that makes your on-site training faster.`,
    faq: [
      ['What employee training programs do you offer?', 'Online, self-paced training for {careers} job titles, from warehouse associate and customer service representative to medical assistant and HVAC technician. Each course covers one role’s duties, vocabulary, tasks, tools and safety standards.'],
      ['Can we use the courses for new hire onboarding?', 'Yes. Many employers assign the course for the new hire’s role during the first week, then follow with on-site training. Free onboarding plans and job description templates are available for every role.'],
      ['Is there a minimum order?', 'No. You can enroll a single employee. Volume discounts start at 2 seats.'],
      ['How do we track completion?', 'Learners earn a certificate of completion after passing the final knowledge check, and we can send completion updates for your group on request.'],
      ['Do you offer corporate training on general topics such as Excel or leadership?', 'Our catalog is organized by job title rather than topic. Office roles such as administrative assistant and bookkeeper cover the software those jobs use, including Microsoft Office and spreadsheets, as part of the role.'],
      ['Can you invoice our company?', 'Yes. Ask for an invoice or provide purchase order details when you request pricing.']
    ],
    cta: { title: 'Get a subscription quote', text: 'Tell us how many seats you need each month. We reply with your price, landing page and white label options.', btn: 'Request a quote', link: '/for-employers/#subscribe' },
    related: [['Jobs and workforce program', '/for-employers/'], ['Schools program', '/for-schools/'], ['Onboarding plans by job', '/employers/onboarding-plans/'], ['Hiring guides by job', '/employers/hiring-guides/'], ['Training ROI calculator', '/employers/training-roi-calculator/']]
  },

  // ---------------------------------------------------------------- Schools and institutions (keywords 61 to 80)
  {
    slug: 'career-readiness-programs-for-schools', cluster: 'schools', audience: 'schools', crumb: 'Career readiness for schools',
    metaTitle: 'Career Readiness Programs for Schools & Students',
    desc: 'Career exploration and readiness resources for high schools, colleges and community programs: free career profiles, quizzes, lessons and training seats.',
    eyebrow: 'For schools and community programs', h1: 'Career Readiness Programs for Schools and Students',
    lead: 'Free career exploration tools for students and teachers, ready-to-use career readiness lesson ideas, and job-title training seats for schools, colleges, nonprofits and adult education programs.',
    answer: 'Schools can run a career readiness program with Career Education Institute in two ways. The free tools (career profiles for {careers} jobs with BLS pay data, career quizzes, guides and printable worksheets) support career exploration and planning lessons at no cost. For deeper learning, schools and workforce programs can subscribe to training seats so each student takes job-title training in the career they are exploring.',
    keywords: 'career readiness programs for students, career exploration programs for schools, career education for high school students, career preparation programs, workforce readiness curriculum, career development programs for schools, career counseling resources for students, career assessment for high school students, career exploration activities for students, online career courses for students, career pathways for high school students, career readiness training for adults, career education programs for adults, workforce development programs for nonprofits, career training for community organizations, career exploration resources for teachers, career readiness lessons, career awareness programs, career planning resources for students',
    body: `## Free career exploration resources for students and teachers
Everything below is free, needs no account and works on school Chromebooks and phones:

- **{careers} career profiles**, each with a day in the life, BLS median pay, job outlook, how to become one, skills, a glossary, interview questions and a fit quiz. Start at [all careers](/careers/).
- **Career quizzes**: the [Career Match Quiz](/quizzes/career-match/), [Work Style Quiz](/quizzes/work-style/), [College or Trade School?](/quizzes/college-or-trade-school/) and a quiz for each of 17 career fields.
- **Guides for students**: [high school career planning](/guides/high-school-career-planning/), [how to choose a career](/guides/how-to-choose-a-career/), [college vs. trade school](/guides/college-vs-trade-school/), [apprenticeships](/guides/apprenticeships-guide/), [financial aid basics](/guides/financial-aid-basics/) and more.
- **Printable worksheets** for career decisions, college visits and job applications in our [free worksheet library](/resources/).
- **Career comparisons** and **best careers lists**, such as [hands-on jobs](/best-careers/hands-on-jobs/) and [jobs that help people](/best-careers/jobs-that-help-people/).

## Career exploration activities for students
1. **Career match and reflect (one class period).** Students take the Career Match Quiz, pick two results and write three reasons each fits or doesn’t.
2. **Day-in-the-life comparison.** Pairs read the day-in-the-life pages for two careers in the same field and present the biggest differences in duties, schedule and work setting.
3. **Salary reality check.** Students look up the median pay for three careers in the [salary guide](/salary-guide/) and build a simple monthly budget for each.
4. **Pathway map.** Using a career’s “how to become” page, students map the steps from today to the first job: courses, programs, credentials and costs.
5. **Mock interview.** Each career profile has interview questions. Students practice answering two in pairs.
6. **Vocabulary challenge.** Every career has a glossary. Teams quiz each other on ten terms from a field they’re curious about.

## A simple career readiness lesson sequence
| Week | Focus | Free resource |
|---|---|---|
| 1 | Interests and strengths | Career Match Quiz, Work Style Quiz |
| 2 | Exploring careers | Career profiles and day-in-the-life pages |
| 3 | Education and training paths | College vs. trade school guide, apprenticeships guide |
| 4 | Money and outlook | Salary guide, fastest-growing careers |
| 5 | Job-search basics | [Resume guide](/guides/how-to-write-a-resume/), [interview tips](/guides/job-interview-tips/) |
| 6 | Workplace readiness | [Soft skills employers want](/guides/soft-skills-employers-want/), [first job guide](/guides/first-job-guide/) |

## Career pathways for high school students
Point students to the field that interests them, where every career is compared by pay, growth and training time:

{fields}

Students who want hands-on work without a four-year degree should also see [highest-paying jobs without a degree](/best-careers/highest-paying-jobs-without-a-degree/) and our [guide to community college](/guides/community-college-guide/).

## Training seats for schools, colleges and workforce programs
When students are ready to go deeper, schools can give them **job-title training**: self-paced online courses of {minHours} to {maxHours} hours for {careers} careers, each with a final knowledge check and certificate of completion. Seats are sold through the [schools program](/for-schools/): a subscription priced by the number of seats you want each month, with your school’s own landing page for students and optional white label (your school’s name and logo in place of ours). Billing is yearly (recommended) or monthly, by invoice or purchase order.

## Career education programs for adults and community organizations
The same tools work for adult education, re-entry, veterans’ and nonprofit workforce programs. Our [career changers hub](/career-changers/) and [job readiness training](/job-readiness-training/) page are written for adults, and workforce organizations can subscribe through the [jobs and workforce program](/for-employers/).

Our trainings are general, non-credit courses. They don’t grant academic credit or replace a CTE program of study, but they fit well alongside one.`,
    faq: [
      ['Are the career exploration resources really free for schools?', 'Yes. Career profiles, salary data, quizzes, guides, worksheets and practice tests are free with no account, sign-up or student data collection.'],
      ['What grade levels are the resources for?', 'They are written for high school students and adults. Middle school teachers often use the career profiles and quizzes with more guidance.'],
      ['Is the Career Match Quiz a formal career assessment?', 'No. It is a free interest-based self-reflection tool that suggests careers to explore. It is not a validated psychological or aptitude test.'],
      ['Can students earn credit for your trainings?', 'No. The trainings are non-credit. Some teachers use them as enrichment or as preparation for a CTE pathway or apprenticeship.'],
      ['How do training seat subscriptions work for schools?', 'Your price is set by the number of seats you want each month, billed yearly (recommended) or monthly. Each seat gives one student access to the catalog, and seats move to new students as others finish. Every subscription includes your school’s own landing page, and white label is a paid add-on. Prices are quoted by email.'],
      ['Can nonprofits and workforce boards use the program?', 'Yes. Workforce boards, nonprofits and community organizations subscribe through the [jobs and workforce program](/for-employers/).']
    ],
    cta: { title: 'Training seats for your school', text: 'Subscriptions priced by seats per month, with your school’s own landing page and optional white label.', btn: 'Request a quote', link: '/for-schools/#subscribe' },
    related: [['For students', '/students/'], ['High school career planning', '/guides/high-school-career-planning/'], ['Career Match Quiz', '/quizzes/career-match/'], ['Free worksheets', '/resources/'], ['Schools program', '/for-schools/']]
  },

  // ---------------------------------------------------------------- Healthcare (keywords 81 to 100)
  {
    slug: 'healthcare-career-training', cluster: 'healthcare', field: 'healthcare', crumb: 'Healthcare career training',
    metaTitle: 'Online Healthcare Career Training & Medical Courses',
    desc: 'Online healthcare career training: medical assistant, billing and coding, pharmacy tech, medical office and patient care courses, and how to get started.',
    eyebrow: 'Healthcare and medical careers', h1: 'Online Healthcare and Medical Career Training',
    lead: 'Explore and prepare for healthcare jobs online: medical assistant, medical billing and coding, pharmacy technician, medical office and patient care roles, with an honest look at what each one requires.',
    answer: 'You can start preparing for a healthcare career online with job-title training for roles such as medical assistant, medical billing and coding specialist, pharmacy technician and medical administrative assistant. Patient-care jobs also require hands-on clinical training, and many require a state-approved program, registration or a certification exam. Our courses teach each role’s duties, medical terminology, tasks and compliance rules so you can choose a path and prepare for it.',
    keywords: 'online healthcare career training, medical career training online, medical assistant career training, medical billing training online, medical coding training online, healthcare administration courses, patient care training courses, pharmacy technician career training, health information management courses, healthcare customer service training, medical office administration courses, healthcare careers without a degree, how to start a career in healthcare, medical receptionist training, medical terminology course online, healthcare compliance training',
    tables: {
      office: ['medical-billing-and-coding-specialist', 'medical-administrative-assistant', 'health-information-technologist', 'receptionist', 'medical-transcriptionist', 'health-services-manager'],
      patient: ['medical-assistant', 'certified-nursing-assistant', 'phlebotomist', 'pharmacy-technician', 'home-health-aide', 'dental-assistant', 'emt', 'surgical-technologist']
    },
    body: `## Medical office, billing and coding training
These roles work with records, insurance and patients at the front desk. Much of the learning can happen online, which makes them popular with career changers.

{table:office}

- **Medical billing and coding:** coders translate visits into ICD-10-CM, CPT and HCPCS codes; billers turn them into claims. Employers often prefer a credential such as the AAPC’s CPC or AHIMA’s CCA or CCS, which you earn by passing an exam after formal training.
- **Medical office administration and medical receptionist:** scheduling, check-in, insurance verification and HIPAA-compliant communication. Usually a high school diploma plus on-the-job training or a short certificate.
- **Health information management:** health information technologists manage the accuracy and privacy of patient records, usually after a certificate or associate degree.

## Patient care training
{table:patient}

Patient-care jobs need **hands-on clinical practice** that no online course can replace:

- **Nursing assistants (CNAs)** complete a state-approved program (federal rules require at least 75 hours, including supervised clinical hours) and pass a state competency exam.
- **Medical assistants** typically complete a certificate program with an externship, and many employers prefer certification such as the CMA or RMA.
- **Pharmacy technicians** must register with or be licensed by the state pharmacy board in most states, and many employers prefer PTCB or NHA certification.
- **Phlebotomists** need supervised venipuncture practice; a few states, including California, require a state certificate.

Our courses prepare you for those programs and interviews by teaching the duties, medical terminology, procedures and safety and compliance standards of each job. They don’t replace them.

## How to start a career in healthcare
1. **Pick a direction:** patient-facing (hands-on care) or behind the scenes (records, billing, administration). The [healthcare career quiz](/quizzes/which-healthcare-career-is-right-for-me/) helps.
2. **Compare roles** by pay, training time and daily work on the [healthcare careers page](/careers/healthcare/).
3. **Check your state’s rules** for the role, and look for accredited or state-approved programs.
4. **Learn the basics first.** A job-title training covers the vocabulary and tasks, so you start your program ahead.
5. **Get the entry requirements in order:** background check, immunizations and CPR/BLS certification are common.
6. **Start in an entry role and climb.** Many nurses and technologists began as CNAs, medical assistants or unit clerks, often with employer tuition help.

## Healthcare careers without a degree
Many healthcare jobs start with a certificate of a year or less, for example [medical assistant](/careers/medical-assistant/) (median pay {pay:medical-assistant}), [phlebotomist](/careers/phlebotomist/) ({pay:phlebotomist}) and [pharmacy technician](/careers/pharmacy-technician/) ({pay:pharmacy-technician}). See the [best entry-level healthcare jobs](/best-careers/best-entry-level-healthcare-jobs/).

## Medical terminology, compliance and customer service
Every healthcare training includes an essential vocabulary module with practice drills, a safety and compliance module (privacy, infection control and professional standards for that role) and a module on the skills employers look for, including patient communication. All healthcare trainings are listed in the [training catalog](/training/#healthcare).`,
    faq: [
      ['Can I train for a healthcare job completely online?', 'Office roles such as medical billing and coding, medical administrative assistant and receptionist can be learned largely online. Patient-care roles such as CNA, medical assistant and phlebotomist also require supervised hands-on clinical training.'],
      ['Will your medical assistant training make me a certified medical assistant?', 'No. Our course is general, non-credit career preparation. Certification such as the CMA or RMA requires completing an eligible program and passing the credentialing exam.'],
      ['How long does medical billing and coding training take?', 'Formal certificate programs commonly take 4 to 12 months. Our job-title training takes about {hours:medical-billing-and-coding-specialist} hours and gives you a foundation in the role and its code sets before you choose a program.'],
      ['What healthcare jobs can I get without a degree?', 'Medical assistant, nursing assistant, phlebotomist, pharmacy technician, medical administrative assistant, home health aide, EMT and medical billing and coding specialist are common options.'],
      ['Do your healthcare courses include medical terminology?', 'Yes. Each healthcare training has a vocabulary module with the essential terms for that role and practice drills.'],
      ['What training do you need for healthcare jobs?', 'It depends on the role: on-the-job training for some support jobs, a certificate of a few months to a year for many entry roles, an associate degree for technologists and registered nurses, and graduate degrees for providers. Most patient-care roles also require state approval or certification.']
    ],
    related: [['Healthcare careers', '/careers/healthcare/'], ['Best entry-level healthcare jobs', '/best-careers/best-entry-level-healthcare-jobs/'], ['Healthcare career quiz', '/quizzes/which-healthcare-career-is-right-for-me/'], ['Healthcare onboarding for employers', '/for-employers/healthcare/'], ['Certifications vs. degrees', '/guides/certifications-vs-degrees/']]
  },

  // ---------------------------------------------------------------- Construction, trades and industrial (keywords 101 to 120)
  {
    slug: 'skilled-trades-training', cluster: 'trades', field: 'skilled-trades', crumb: 'Skilled trades training',
    metaTitle: 'Skilled Trades & Construction Training Online',
    desc: 'Online skilled trades and manufacturing training: HVAC, electrical, welding, plumbing, maintenance and quality control, plus how to start a trade.',
    eyebrow: 'Construction, trades and industrial careers', h1: 'Online Skilled Trades, Construction and Manufacturing Training',
    lead: 'Get a head start on a trade: online training for HVAC, electrical, welding, plumbing, construction, maintenance and manufacturing jobs, and a clear view of the apprenticeships and licenses that follow.',
    answer: 'You can learn the foundations of a skilled trade online: the vocabulary, tools, safety rules and step-by-step tasks of jobs such as electrician, HVAC technician, welder, plumber and industrial maintenance technician. The hands-on skills, and any license, still come from an apprenticeship, trade school or on-the-job training. Our job-title trainings help you choose a trade and show up to that training, or your first job site, prepared.',
    keywords: 'online construction training courses, construction career training programs, skilled trades training online, trade skills courses online, industrial career training, manufacturing training courses online, maintenance technician training online, HVAC career training online, electrical trade training online, welding career training, plumbing career training, industrial safety training courses, manufacturing career paths, construction jobs without experience, mechanical technician training, industrial maintenance courses, quality control training courses, blue collar career training, what skilled trade should I learn, how to start a skilled trades career',
    tables: {
      trades: ['electrician', 'hvac-technician', 'plumber', 'welder', 'carpenter', 'construction-laborer', 'heavy-equipment-operator', 'sheet-metal-worker', 'solar-panel-installer', 'flagger'],
      industrial: ['industrial-maintenance-technician', 'building-maintenance-technician', 'cnc-machinist', 'production-assembler', 'quality-control-inspector', 'mechanical-engineering-technician', 'occupational-safety-specialist', 'safety-technician']
    },
    body: `## Construction and skilled trades training
{table:trades}

What each trade requires after the classroom:

- **Electricians** usually complete a four- to five-year apprenticeship and pass a state or local licensing exam.
- **HVAC technicians** often train through a certificate program or apprenticeship, and anyone who handles refrigerants needs EPA Section 608 certification.
- **Plumbers** typically apprentice for four to five years and are licensed in most states.
- **Welders** build skill in a booth; many employers test applicants to a code such as AWS D1.1.
- **Construction laborers** can often start with no experience; safety training such as OSHA 10 is commonly requested.

## Manufacturing, maintenance and industrial training
{table:industrial}

Manufacturing career paths often start in production or assembly and move into machining, maintenance, quality or supervision. Maintenance technicians troubleshoot mechanical, electrical, hydraulic and pneumatic systems; quality control inspectors measure parts, read blueprints and document defects.

## Industrial safety training
Every trades and industrial training includes a safety, compliance and professional standards module for that job. For required safety training, such as OSHA Outreach courses, follow your employer’s requirements. We also sell complete [flagger](/training/flagger/) and [forklift operator](/training/forklift-operator/) trainings with instant online checkout.

## What skilled trade should I learn?
Pick the trade that fits how you like to work, not just the pay:

| If you like… | Consider |
|---|---|
| Problem solving, electrical systems | Electrician, HVAC technician, industrial maintenance technician |
| Working with metal, steady hands | Welder, sheet metal worker, CNC machinist |
| Building things you can see | Carpenter, mason, construction laborer |
| Big machines | Heavy equipment operator, crane operator |
| Precision and checking details | Quality control inspector, machinist |

The [skilled trades quiz](/quizzes/which-skilled-trades-career-is-right-for-me/) gives a personalized match, and [highest-paying trade jobs](/best-careers/highest-paying-trade-jobs/) ranks trades by median pay. For example, electricians earn a median {pay:electrician}, plumbers {pay:plumber} and HVAC technicians {pay:hvac-technician}.

## How to start a skilled trades career
1. **Choose a trade** using the table above and each trade’s day-in-the-life page.
2. **Learn the basics** of the trade’s tools, terms and safety rules, so you can talk about the work and start training ahead.
3. **Find an apprenticeship or program.** Union and non-union apprenticeships pay you while you learn; see our [apprenticeships guide](/guides/apprenticeships-guide/). Community colleges and trade schools offer certificates.
4. **Get entry basics:** a driver’s license, reliable transportation, basic hand tools and often OSHA 10.
5. **Apply for helper or laborer roles** if apprenticeship slots are full. Many trades hire helpers with no experience.
6. **Track your hours** toward licensing and keep learning.

## Construction jobs without experience
Construction laborer, electrician helper, plumber helper, carpenter helper and flagger roles often hire without experience. Showing up knowing the vocabulary, tools and safety basics of the job sets you apart. Browse every trades training in the [catalog](/training/#skilled-trades).`,
    faq: [
      ['Can you learn a trade online?', 'You can learn the knowledge side online: vocabulary, codes and concepts, tools, safety and step-by-step procedures. The hands-on skill comes from apprenticeships, trade school labs and on-the-job practice.'],
      ['Will your HVAC or electrical training get me licensed?', 'No. Our trainings are general, non-credit courses. Electrician and plumber licenses come from state or local boards after an apprenticeship and exam; HVAC work with refrigerants requires EPA Section 608 certification.'],
      ['What is the fastest skilled trade to get into?', 'Roles such as construction laborer, flagger, welder (through a short program) and solar panel installer can start within weeks to months. Licensed trades such as electrician and plumber take several years of apprenticeship.'],
      ['Do you offer industrial safety training?', 'Every trades and industrial course has a job-specific safety module, and we sell complete flagger and forklift operator trainings online. They don’t replace employer- or OSHA-required training.'],
      ['What are good manufacturing career paths?', 'A common path is production assembler or machine operator, then CNC operator or machinist, maintenance technician or quality inspector, then supervisor or production manager.'],
      ['Is blue collar work a good career?', 'Many trades pay well, are in steady demand and can be started through paid apprenticeships instead of student debt. The work can be physically demanding, so check that it fits your health and interests.']
    ],
    related: [['Skilled trades careers', '/careers/skilled-trades/'], ['Mechanics and manufacturing careers', '/careers/mechanics-and-manufacturing/'], ['Apprenticeships guide', '/guides/apprenticeships-guide/'], ['Highest-paying trade jobs', '/best-careers/highest-paying-trade-jobs/'], ['Skilled trades quiz', '/quizzes/which-skilled-trades-career-is-right-for-me/'], ['College vs. trade school', '/guides/college-vs-trade-school/']]
  },

  // ---------------------------------------------------------------- Transportation and logistics (keywords 121 to 140)
  {
    slug: 'transportation-logistics-training', cluster: 'logistics', field: 'transportation-and-logistics', crumb: 'Transportation and logistics training',
    metaTitle: 'Transportation & Logistics Career Training Online',
    desc: 'Online logistics and supply chain career training: truck driver, dispatcher, warehouse and purchasing courses, plus freight broker and CDL facts.',
    eyebrow: 'Transportation, logistics and operations', h1: 'Online Transportation, Logistics and Supply Chain Training',
    lead: 'Prepare for jobs that move freight and run operations: truck driving, dispatch, warehousing, purchasing, logistics coordination and project management, with clear facts on CDL and freight broker requirements.',
    answer: 'Online training can prepare you for most logistics and supply chain jobs, such as logistics coordinator, freight dispatcher, purchasing agent and warehouse associate, by teaching their vocabulary, systems and daily tasks. Driving jobs are different: a commercial driver’s license requires Entry-Level Driver Training from a provider on the FMCSA Training Provider Registry, plus behind-the-wheel skills and a state CDL test. Our truck driver course is career preparation, not CDL training.',
    keywords: 'online transportation career training, CDL career training online, entry level driver training, freight broker training, logistics career training, supply chain training courses, warehouse operations training, transportation management courses, fleet management training, logistics jobs and training, how to become a freight broker, how to start a career in logistics, transportation industry careers, dispatch training courses online, operations management courses online, inventory management training, procurement training courses, project management training online, business operations training, what jobs are in supply chain',
    tables: {
      logistics: ['logistics-coordinator', 'logistics-manager', 'freight-dispatcher', 'warehouse-associate', 'stock-associate', 'forklift-operator', 'purchasing-agent', 'procurement-clerk', 'transportation-supervisor', 'project-manager', 'general-and-operations-manager'],
      driving: ['truck-driver', 'delivery-driver', 'school-bus-driver', 'transit-bus-driver']
    },
    body: `## Logistics, warehouse and supply chain training
{table:logistics}

These courses cover each role’s systems and daily work: transportation and warehouse management software, inventory control, shipping documents, purchasing and vendor management, scheduling and safety.

## What jobs are in supply chain?
The supply chain runs from buying materials to delivering finished goods. Common jobs by stage:

| Stage | Example jobs |
|---|---|
| Plan and buy | Purchasing agent, procurement clerk, purchasing manager |
| Store and handle | Warehouse associate, stock associate, forklift operator |
| Move | Truck driver, delivery driver, freight dispatcher |
| Coordinate | Logistics coordinator, transportation supervisor |
| Manage | Logistics manager, general and operations manager |

Logistics coordinators earn a median {pay:logistics-coordinator} and logistics managers {pay:logistics-manager}, according to BLS data.

## How to start a career in logistics
1. **Start where hiring is steady:** warehouse associate, forklift operator or delivery driver roles often hire with no experience.
2. **Learn the systems and vocabulary** of coordination roles (bills of lading, freight classes, WMS and TMS software) through job-title training.
3. **Get a forklift certification from your employer** if you work in a warehouse; our [forklift operator training](/training/forklift-operator/) covers the classroom portion, and the employer evaluates you on the truck.
4. **Move into coordination or dispatch** once you know the operation. Spreadsheet skills and clear communication matter most.
5. **Consider a credential** later, such as APICS/ASCM certifications or a logistics degree, for management roles.

## CDL and entry-level driver training
Since February 7, 2022, anyone getting a Class A or B CDL for the first time must complete **Entry-Level Driver Training (ELDT)** from a provider listed on the FMCSA Training Provider Registry before taking the state skills test. You also need a DOT medical certificate, and most interstate driving requires you to be at least 21.

{table:driving}

Our driving trainings explain the job, its vocabulary, hours-of-service basics and safety practices. They are **not ELDT** and don’t qualify you for a CDL test.

## How to become a freight broker
Freight brokers match shippers with carriers. To operate as a broker in the U.S. you need to:

1. Form a business and get a USDOT number.
2. Apply to the FMCSA for broker operating authority (an MC number).
3. File a $75,000 surety bond or trust fund (form BMC-84 or BMC-85).
4. Designate a process agent in each state (form BOC-3).
5. Learn the business: rates, carrier vetting, contracts and load boards. Many brokers start as a [freight dispatcher](/training/freight-dispatcher/) or [logistics coordinator](/training/logistics-coordinator/) to learn the trade first.

We don’t offer a freight broker course; the dispatcher and logistics coordinator trainings cover much of the same vocabulary and workflow.

## Operations, project and inventory management
For operations roles, see [general and operations manager](/training/general-and-operations-manager/) and [project manager](/training/project-manager/) training. Project managers often pursue the PMI’s CAPM or PMP certification after gaining experience. All logistics trainings are in the [catalog](/training/#transportation-and-logistics).`,
    faq: [
      ['Can I get CDL training online?', 'Part of it. The ELDT theory portion can be completed online, but only with a provider on the FMCSA Training Provider Registry, and behind-the-wheel training and the state skills test are in person. Our truck driver course is career preparation, not ELDT.'],
      ['Do you offer freight broker training?', 'No. Becoming a broker requires FMCSA operating authority and a $75,000 bond. Our freight dispatcher and logistics coordinator trainings teach much of the same vocabulary and workflow.'],
      ['What is the easiest way to get into logistics?', 'Entry roles such as warehouse associate, forklift operator and delivery driver often hire with no experience. From there, many people move into dispatch, coordination and supervision.'],
      ['Do you offer forklift training?', 'Yes. Forklift operator training is available with instant online checkout. OSHA requires your employer to evaluate your driving on the equipment you will use before you operate it.'],
      ['How much do logistics coordinators make?', 'Logistics coordinators earn a median of {pay:logistics-coordinator} per year, according to BLS data.'],
      ['Do you have fleet management or transportation management courses?', 'Our transportation supervisor and logistics manager trainings cover scheduling, fleet and driver oversight, compliance and transportation management systems.']
    ],
    related: [['Transportation and logistics careers', '/careers/transportation-and-logistics/'], ['Forklift operator training', '/training/forklift-operator/'], ['Truck driver career profile', '/careers/truck-driver/'], ['Logistics onboarding for employers', '/for-employers/transportation-and-logistics/'], ['Jobs with paid on-the-job training', '/best-careers/jobs-with-paid-on-the-job-training/']]
  },

  // ---------------------------------------------------------------- Technology, business and office (keywords 141 to 160)
  {
    slug: 'technology-business-career-training', cluster: 'tech', field: 'technology', crumb: 'Technology and business training',
    metaTitle: 'IT, Technology & Business Career Training Online',
    desc: 'Online IT and business career training: IT support, cybersecurity, programming, bookkeeping, HR, office admin, marketing and graphic design.',
    eyebrow: 'Technology, business and office careers', h1: 'Online IT, Technology and Business Career Training',
    lead: 'Prepare for IT, cybersecurity, programming, accounting, HR, office and marketing jobs online, and learn which certifications and degrees each path really needs.',
    answer: 'For a technology career, beginners usually start with IT support, then specialize in networking, cybersecurity, programming or data. For business and office careers, common entry points are administrative assistant, bookkeeper and HR assistant. Our online job-title trainings teach each role’s duties, vocabulary, tools and tasks so you can choose a direction; industry certifications such as CompTIA A+ or Security+, or a degree, come next for many roles.',
    keywords: 'online technology career training, IT career training online, cybersecurity career training, computer programming courses online, data analytics career training, AI career training courses, business career training online, accounting courses online, bookkeeping training online, human resources training courses, project management courses online, office administration training online, Microsoft Office training, Excel training, small business management courses, marketing courses for beginners, graphic design courses online, IT support training for beginners, cybersecurity courses for beginners, what career should I choose in technology',
    tables: {
      tech: ['it-support-specialist', 'network-administrator', 'cybersecurity-analyst', 'software-developer', 'web-developer', 'software-qa-tester', 'database-administrator', 'data-scientist'],
      business: ['administrative-assistant', 'office-manager', 'bookkeeper', 'accountant', 'hr-assistant', 'human-resources-specialist', 'project-manager', 'digital-marketing-specialist', 'graphic-designer', 'executive-assistant']
    },
    body: `## IT and technology career training
{table:tech}

- **IT support for beginners:** help desk and IT support roles are the most common way into tech. Many employers look for CompTIA A+, and the role teaches you devices, networks, accounts and troubleshooting.
- **Cybersecurity for beginners:** most cybersecurity analysts start in IT support or networking first. CompTIA Security+ is a common entry credential, and many roles ask for a degree or several years of IT experience.
- **Programming:** software and web developers build skill through projects. A portfolio on GitHub matters as much as a certificate for many entry roles.
- **Data and AI careers:** data scientists usually need a bachelor’s degree or higher plus statistics and Python or SQL. We don’t offer a standalone AI course; the data scientist and software developer trainings explain how those roles use machine learning and AI tools.

## Business and office career training
{table:business}

## Microsoft Office and Excel skills
We don’t sell standalone software courses, but the office trainings teach the software each job uses. The administrative assistant course covers Outlook, Word, Excel and PowerPoint and Google Workspace in the context of real tasks, and the bookkeeper course covers QuickBooks and spreadsheets. If you need a certificate in Excel itself, look at Microsoft Office Specialist (MOS) certification.

## Accounting, bookkeeping and HR
- **Bookkeepers** (median pay {pay:bookkeeper}) usually need a high school diploma plus a short course; the AIPB or NACPB certifications are optional.
- **Accountants** (median pay {pay:accountant}) generally need a bachelor’s degree, and CPAs need a state license.
- **HR assistants and specialists** start with an associate or bachelor’s degree or office experience; SHRM and HRCI certifications help later.

## Marketing, graphic design and small business
[Digital marketing specialist](/training/digital-marketing-specialist/) and [graphic designer](/training/graphic-designer/) trainings are good starting points for beginners; both fields hire on portfolios. If you run or plan to start a small business, the [office manager](/training/office-manager/), [bookkeeper](/training/bookkeeper/) and [general and operations manager](/training/general-and-operations-manager/) trainings cover the operations, money and people side.

## What career should I choose in technology?
| If you enjoy… | Consider |
|---|---|
| Helping people fix problems | IT support specialist |
| How systems connect | Network administrator |
| Defending and investigating | Cybersecurity analyst |
| Building things with code | Software or web developer |
| Finding patterns in numbers | Data scientist, database administrator |
| Finding bugs and details | Software QA tester |

The [technology career quiz](/quizzes/which-technology-career-is-right-for-me/) gives a personalized match, and every role is compared on the [technology careers page](/careers/technology/). Browse all business trainings in the [catalog](/training/#business-and-office).`,
    faq: [
      ['How do I start an IT career with no experience?', 'Start with IT support: learn hardware, operating systems, networking and troubleshooting basics, consider CompTIA A+, and apply for help desk roles. Our IT support specialist training covers the role’s tools, vocabulary and tasks.'],
      ['Can a beginner go straight into cybersecurity?', 'It’s possible but uncommon. Most analysts spend a year or more in IT support, networking or system administration first. Security+ is a common first certification.'],
      ['Do you offer Excel or Microsoft Office training?', 'Not as standalone courses. Office role trainings, such as administrative assistant, cover Microsoft Office and spreadsheets as part of the job. For a software credential, consider Microsoft Office Specialist certification.'],
      ['Do you offer AI career training?', 'We don’t have a standalone AI course. Data scientist and software developer trainings explain how those jobs use machine learning and AI tools.'],
      ['Will your bookkeeping training certify me?', 'No. It is a non-credit course that teaches the bookkeeper role, its software and tasks. Bookkeeping certifications such as those from the AIPB or NACPB require their own exams.'],
      ['Do you offer project management courses?', 'Yes, our project manager training covers the role’s duties, vocabulary and tools. PMI’s CAPM and PMP are the best-known project management certifications.']
    ],
    related: [['Technology careers', '/careers/technology/'], ['Business and office careers', '/careers/business-and-office/'], ['Technology career quiz', '/quizzes/which-technology-career-is-right-for-me/'], ['Remote-friendly careers', '/best-careers/remote-friendly-careers/'], ['Certifications vs. degrees', '/guides/certifications-vs-degrees/']]
  },

  // ---------------------------------------------------------------- Career discovery and comparison (keywords 161 to 180)
  {
    slug: 'career-exploration', cluster: 'discovery', crumb: 'Career exploration questions',
    metaTitle: 'Career Exploration: Answers to 20 Big Career Questions',
    desc: 'Straight answers to big career questions: what career is right for me, what vocational training is, what career training costs and how to change careers.',
    eyebrow: 'Career exploration and planning', h1: 'Career Exploration: Straight Answers to the Biggest Career Questions',
    lead: 'What career is right for you, what training is worth it, how long it takes, what it costs and how to change careers as an adult. Short answers first, then the details.',
    answer: 'To find the right career: list what you enjoy and what you need (pay, schedule, training time), take a career interest quiz, research three to five matches in detail, test them with a conversation, shadowing or a short course, then choose the fastest credible training path. The answers below cover each step.',
    keywords: 'what career is right for me, career with no experience, jobs with online training, what is vocational training, what is career training, what is job readiness training, what is workforce development, online courses that help you get a job, best online career training programs, are online career courses worth it, how long does career training take, how much does online career training cost, do employers accept online career courses, online certificate vs career course, career training vs college degree, what skills are employers looking for, fastest growing careers, how to change careers as an adult, choose an online course for a new career, learn online to get a better job',
    qa: [
      ['What career is right for me?', 'The right career sits where three things overlap: work you enjoy, work you are or can become good at, and work that meets your needs for pay, schedule and training time. Start with the free [Career Match Quiz](/quizzes/career-match/), pick three to five results, then read each one’s day-in-the-life and salary pages. Our guide on [how to choose a career](/guides/how-to-choose-a-career/) walks through the full process.'],
      ['What career can I start with no experience?', 'Many: customer service representative, warehouse associate, retail sales associate, construction laborer, delivery driver, home health aide and security guard all commonly hire beginners and train on the job. See [jobs with paid on-the-job training](/best-careers/jobs-with-paid-on-the-job-training/) and [how to get a job with no experience](/guides/how-to-get-a-job-with-no-experience/).'],
      ['What jobs can I get with online training?', 'Online training alone can prepare you for many office, customer service, IT support, bookkeeping and digital marketing jobs. For hands-on and licensed jobs, such as nursing assistant, electrician or truck driver, online training covers the knowledge side and in-person training or an exam completes it. Our [online career training](/online-career-training/) page explains the difference.'],
      ['What is vocational training?', 'Vocational training (also called career and technical education or trade school) teaches the skills for a specific job, such as welding, medical assisting or HVAC, rather than general academics. Programs typically last a few months to two years and often prepare you for a license or certification exam. Compare it with college in our [college vs. trade school guide](/guides/college-vs-trade-school/).'],
      ['What is career training?', 'Career training is any instruction aimed at preparing you for a particular job: vocational programs, apprenticeships, certificate programs, employer training and short online courses. At Career Education Institute, career training means a self-paced course built around one job title.'],
      ['What is job readiness training?', 'Job readiness training teaches the workplace and job-search skills needed to get and keep a job: communication, reliability, teamwork, problem solving, resumes and interviews. See [job readiness training](/job-readiness-training/).'],
      ['What is workforce development?', 'Workforce development is the system of programs that helps people gain job skills and helps employers find skilled workers: American Job Centers, WIOA-funded training, apprenticeships, community college programs and employer training. Programs for organizations are on our [jobs and workforce](/for-employers/) and [schools](/for-schools/) pages.'],
      ['What online courses help you get a job?', 'The courses that help most are tied to a specific job and teach what employers screen for: the duties, vocabulary, tools and safety rules of the role, plus resume and interview preparation. Courses that lead to a recognized credential employers ask for, such as CompTIA A+ for IT support, also help.'],
      ['What are the best online career training programs?', 'The best program is the one that matches your target job and is honest about outcomes. Look for clear course content, a realistic length and price, a sample or practice test, and plain statements about whether it leads to a license, certification or credit. Our [guide to choosing online career training](/choosing-online-career-training/) has a checklist.'],
      ['Are online career courses worth it?', 'They are worth it when the price is low relative to what you gain: a clearer career decision, a head start in a longer program, or stronger interviews. They are not worth it if a course promises a license, a job or a credential it can’t deliver. A {minPrice} to {maxPrice} course that saves you from enrolling in the wrong program is money well spent.'],
      ['How long does career training take?', 'It ranges widely: a short online course takes hours, a certificate program a few months to a year, an apprenticeship three to five years, and an associate degree two years. Our job-title trainings take {minHours} to {maxHours} hours. See the [fastest careers to train for](/best-careers/fastest-careers-to-train-for/).'],
      ['How much does online career training cost?', 'Short online job courses often cost under $100; ours cost {minPrice} to {maxPrice}. Certificate programs commonly cost a few hundred to several thousand dollars, and trade school programs can cost more. Federal financial aid, WIOA funds and employer tuition help can lower the cost of eligible programs; see [financial aid basics](/guides/financial-aid-basics/).'],
      ['Do employers accept online career courses?', 'Employers value what a course shows: that you understand the job and took initiative. A course is not a substitute for a license or certification the job requires. List the course in a training section of your resume and be ready to talk about what you learned.'],
      ['What is the difference between an online certificate and a career course?', 'A certificate program is usually longer, may be offered by a college, and can prepare you for an industry exam or carry credit. A career course is shorter and focused on learning a job. Our trainings end in a certificate of completion, which shows you finished the course but is not an industry certification. See [certifications vs. degrees](/guides/certifications-vs-degrees/).'],
      ['Is career training better than a college degree?', 'Neither is better for everyone. Career training is faster and cheaper and leads directly to many well-paid trades and technical jobs. A degree is required for professions such as teaching, engineering and nursing (RN) and tends to raise lifetime earnings on average. Take the [College or Trade School? quiz](/quizzes/college-or-trade-school/).'],
      ['What skills are employers looking for?', 'Employers consistently ask for communication, reliability, teamwork, problem solving, adaptability and a willingness to learn, along with the technical skills of the role. Our guide to [soft skills employers want](/guides/soft-skills-employers-want/) explains how to show them.'],
      ['What are the fastest growing careers?', 'These careers have the fastest projected employment growth in our profiles, according to the U.S. Bureau of Labor Statistics:\n\n{list:fastest-growing}\n\nSee the full [fastest-growing careers list](/best-careers/fastest-growing-careers/).'],
      ['How do I change careers as an adult?', 'Get clear on why you want to change, shortlist careers that fit your skills and life, map your transferable skills, test the new field cheaply, close skill gaps with the most efficient training, plan your finances and rebrand your resume. Our [step-by-step career change plan](/guides/how-to-change-careers/) and [career change at 30, 40 or 50](/guides/career-change-at-30-40-50/) guides go deeper.'],
      ['How do I choose an online course for a new career?', 'Choose the career first, then the course. Check that the course covers that job’s real duties and tools, read what it does and doesn’t lead to, look at a sample or practice test, and compare the price with the time you will spend. Avoid courses that guarantee jobs or licenses.'],
      ['What can I learn online to get a better job?', 'Learn the skills your target job asks for in postings: software (spreadsheets, CRM, QuickBooks), industry vocabulary and procedures, safety standards and certifications that can be studied online, such as CompTIA A+. Our [working professionals hub](/professionals/) covers raises, promotions and upskilling.']
    ],
    related: [['Career Match Quiz', '/quizzes/career-match/'], ['How to choose a career', '/guides/how-to-choose-a-career/'], ['How to change careers', '/guides/how-to-change-careers/'], ['Fastest-growing careers', '/best-careers/fastest-growing-careers/'], ['Choosing online career training', '/choosing-online-career-training/'], ['All careers', '/careers/']]
  },

  // ---------------------------------------------------------------- AI search and conversational queries (keywords 181 to 200)
  {
    slug: 'choosing-online-career-training', cluster: 'ai', crumb: 'Choosing online career training',
    metaTitle: 'How to Choose Online Career Training: 20 Answers',
    desc: 'Which online career training is worth taking, what it costs, how to spot a legitimate course and which careers you can train for from home.',
    eyebrow: 'Online career training questions', h1: 'How to Choose Online Career Training: Honest Answers',
    lead: 'Which online career courses are worth taking, how to spot a legitimate one, what to check before you pay, and which careers you can realistically train for from home.',
    answer: 'Online career training is worth taking when it is tied to a specific job you want, is clear about what it does and doesn’t lead to (license, certification, credit or job placement), costs little relative to the time it saves you, and lets you see sample content before you pay. Use it to choose a career and prepare for one; rely on accredited or state-approved programs when a job legally requires a credential.',
    keywords: 'which online career training courses are worth taking, best online career training for adults, affordable career training programs online, careers you can train for from home, online training for entry level jobs, training to change careers quickly, career training vs vocational school, can online courses teach practical job skills, legitimate online career course, before paying for career training, online courses for workplace skills, training programs employers use for new hires, staffing agencies prepare candidates, career readiness programs for high schools, schools help students explore careers online, skills for an office job, beginner courses for an IT career, steps to start a healthcare career, careers without a four year degree, build job skills while working',
    qa: [
      ['Which online career training courses are worth taking?', 'Courses built around a job you are seriously considering, priced low relative to the time they save you, with honest descriptions of what they lead to. Courses that prepare you for a recognized exam the job asks for (for example CompTIA A+ for IT support) are also worth it. Skip anything that guarantees a job, license or salary.'],
      ['What is the best online career training for adults?', 'For adults, the best training fits around work and family: self-paced, short, affordable and directly tied to a target job. Many adults start with a short job-title course to test a field, then commit to a longer certificate or apprenticeship only once they are sure. See [online career training](/online-career-training/) and the [career changers hub](/career-changers/).'],
      ['What are affordable career training programs online?', 'Low-cost options include short job-title courses (ours cost {minPrice} to {maxPrice}), community college certificate programs, free workshops at American Job Centers and employer-paid training. WIOA funds can pay for approved training for eligible adults through your local workforce board.'],
      ['Which careers can I train for from home?', 'Office and computer-based careers can be learned largely from home: medical billing and coding, bookkeeping, administrative assistant, customer service, IT support, web development, digital marketing and graphic design. See [remote-friendly careers](/best-careers/remote-friendly-careers/). Hands-on careers need in-person training too, but you can learn their knowledge side from home.'],
      ['What online training helps you qualify for entry-level jobs?', 'Training that teaches the job’s duties, vocabulary and safety basics helps you interview well for entry roles such as warehouse associate, customer service representative or receptionist. Some entry jobs also require a specific credential, such as a state guard card or CNA certification, which needs its own approved program. See [job readiness training](/job-readiness-training/).'],
      ['What training can help me change careers quickly?', 'The fastest changes are into careers with short training: customer service, warehouse and logistics, many trades helper roles, phlebotomy, pharmacy technician and commercial driving can start within weeks to months. See the [fastest careers to train for](/best-careers/fastest-careers-to-train-for/) and [best careers for career changers](/best-careers/best-careers-for-career-changers/).'],
      ['What is the difference between career training and vocational school?', 'Vocational school is one kind of career training: a structured, often in-person program of months to two years that usually prepares you for a license or certification exam. Career training is the broader term and also includes apprenticeships, employer training and short online courses like ours, which are non-credit and don’t replace vocational programs.'],
      ['Can online courses teach practical job skills?', 'Yes, for knowledge-based skills: procedures, vocabulary, software, regulations, safety rules and step-by-step task sequences. Physical skills, such as drawing blood, welding or driving a truck, need supervised hands-on practice. The best results come from learning the knowledge online, then practicing in person.'],
      ['How do I choose a legitimate online career course?', 'Check that the provider names its company and contact details, describes the course content in detail, states its price and refund policy up front, and is plain about whether the course leads to a license, certification or credit. Be wary of guaranteed jobs or salaries and pressure to pay quickly. For accredited programs, confirm accreditation with the U.S. Department of Education’s database.'],
      ['What should I look for before paying for career training?', 'Before you pay, check: the total cost including fees, books and exams; the length and schedule; whether it leads to a credential the job requires; refund terms; and sample content. For longer programs, ask for completion and job placement rates in writing. Our [refund policy](/refund-policy/) and free practice tests show what we offer.'],
      ['Which online courses help with workplace skills?', 'Courses that put workplace skills in the context of a real job work best, because you see how communication, teamwork and safety apply on a shift. Every one of our job-title trainings includes a module on the skills employers look for in that role. Free guides cover [soft skills](/guides/soft-skills-employers-want/) and [your first 90 days](/guides/first-90-days-new-job/).'],
      ['What training programs do employers use for new hires?', 'Most employers combine an orientation (policies, HR, safety), job-specific training (often online modules plus shadowing a trained coworker), required compliance training and a 30-60-90 day plan. See [employee training programs](/employee-training-programs/) and our free [onboarding plans by job](/employers/onboarding-plans/).'],
      ['How can staffing agencies prepare candidates for work?', 'Agencies can give candidates job-title training before placement so they know the role’s duties, vocabulary and safety rules, screen for reliability, run mock interviews and give clear assignment details.'],
      ['What are good career readiness programs for high schools?', 'Strong programs combine career exploration (interest quizzes, career research), work-based learning (job shadowing, internships), CTE pathways, job-search skills and financial literacy. Our [career readiness resources for schools](/career-readiness-programs-for-schools/) include free tools and lesson ideas.'],
      ['How can schools help students explore careers online?', 'Have students take an interest quiz, research matched careers using day-in-the-life and salary pages, compare two careers side by side and map the training path for one. Every step can be done with our free [career profiles](/careers/) and [quizzes](/quizzes/).'],
      ['What skills should I learn for an office job?', 'Microsoft Office or Google Workspace (especially email, calendar and spreadsheets), typing and data accuracy, phone and customer service etiquette, scheduling, filing and clear writing. Our [administrative assistant training](/training/administrative-assistant/) covers how these are used on the job.'],
      ['What are good beginner courses for an IT career?', 'Start with fundamentals: hardware, operating systems, networking and troubleshooting, often through CompTIA A+ study. Our [IT support specialist training](/training/it-support-specialist/) explains the role’s tools and daily tasks. See [technology career training](/technology-business-career-training/) for next steps into networking and cybersecurity.'],
      ['What are the steps to start a healthcare career?', 'Choose patient care or administrative work, compare roles by training time and pay, check your state’s requirements, complete an approved program where required, get background checks, immunizations and CPR/BLS, then start in an entry role and use employer tuition help to advance. Details are on [healthcare career training](/healthcare-career-training/).'],
      ['What careers have training options without a four-year degree?', 'Skilled trades (electrician, plumber, HVAC technician, welder), healthcare support (medical assistant, phlebotomist, LPN), IT support, commercial driving, logistics and many office jobs. Some of the best-paying:\n\n{list:no-degree-pay}'],
      ['How can adults build new job skills while working?', 'Use short, self-paced online courses in the evenings, ask your employer about tuition assistance or cross-training, take on a stretch project at work, and study for one credential at a time. Our trainings run {minHours} to {maxHours} hours with 12 months of access, so you can fit them around a full-time job.']
    ],
    related: [['Online career training', '/online-career-training/'], ['Career exploration questions', '/career-exploration/'], ['How it works', '/how-it-works/'], ['Refund policy', '/refund-policy/'], ['Free practice tests', '/quizzes/#practice-tests'], ['Training catalog', '/training/']]
  }
];

// The four field training pages, linked from {fields} and from each career field hub.
export const fieldLandings = { healthcare: 'healthcare-career-training', 'skilled-trades': 'skilled-trades-training', 'mechanics-and-manufacturing': 'skilled-trades-training', 'transportation-and-logistics': 'transportation-logistics-training', technology: 'technology-business-career-training', 'business-and-office': 'technology-business-career-training' };
