// Employer-facing details per career field: sourcing, screening, onboarding pitch and KPIs.
export const employerCats = {
  healthcare: {
    audience: 'clinics, hospitals, pharmacies, labs and care facilities',
    pitch: 'Healthcare onboarding has to cover clinical tasks, terminology, infection control and patient privacy, before a new hire is on their own with patients. Job-title training gives every new hire the same foundation, so preceptors spend their time on your workflows instead of the basics.',
    pains: ['Preceptors pulled off the floor to teach the basics again and again', 'New hires who don’t yet know the terminology charting and handoffs depend on', 'Uneven grounding in infection control, HIPAA and patient-identification habits', 'Early turnover when the job turns out to be different than expected'],
    sources: ['Community college and vocational program career centers', 'Clinical externship and student-placement partnerships', 'State nurse aide registries and healthcare job boards', 'Employee referral programs'],
    screening: ['Verify certifications and state registry or license status with the issuing body', 'Background checks and federal exclusion-list (OIG LEIE) screening as required for your organization', 'Immunization records, TB testing and drug screening according to policy and law', 'Current BLS/CPR certification'],
    kpis: ['Days until the new hire works without a preceptor', 'Competency sign-offs completed on time', 'Documentation or charting error rate', '90-day retention']
  },
  'skilled-trades': {
    audience: 'contractors, builders, utilities and energy companies',
    pitch: 'On a job site, a new hire who doesn’t know the vocabulary, the tools or the safety basics slows down the whole crew, or gets hurt. Job-title training gives apprentices and helpers a common foundation before they pick up a tool.',
    pains: ['Foremen spending hours explaining basic terms and tools', 'New helpers who don’t recognize hazards on day one', 'Inconsistent knowledge across crews and job sites', 'Apprentices who wash out because the work wasn’t what they expected'],
    sources: ['Registered apprenticeship programs and union halls', 'Trade and technical school placement offices', 'Pre-apprenticeship and veterans programs', 'Referrals from current crew members'],
    screening: ['Verify state licenses (apprentice registration, journeyworker, master) where required', 'OSHA 10 or OSHA 30 cards and prior safety record', 'Valid driver’s license and driving record if operating company vehicles', 'A practical skills test or supervised trial task'],
    kpis: ['Weeks until the new hire works without close supervision', 'Recordable incidents and near-misses in the first 90 days', 'Rework caused by new-hire errors', 'Apprentice retention through year one']
  },
  'mechanics-and-manufacturing': {
    audience: 'repair shops, fleets, plants and aviation maintenance organizations',
    pitch: 'Technicians and machinists are expensive to slow down. Job-title training covers the vocabulary, procedures, measurement basics and safety culture so your senior techs can focus on your equipment and your standards.',
    pains: ['Senior techs losing billable hours to basic training', 'Comebacks and scrap from new-hire mistakes', 'Lockout/tagout and shop-safety habits that vary by person', 'Long ramp-up before a tech can work flat-rate efficiently'],
    sources: ['Technical college automotive, diesel, aviation and machining programs', 'Manufacturer and dealer training programs', 'Military transition and SkillBridge programs', 'Manufacturing career fairs and referrals'],
    screening: ['ASE, FAA A&P, NIMS or other credentials as applicable', 'A hands-on diagnostic, measurement or setup test', 'Tool inventory for roles where technicians supply tools', 'Safety record and lockout/tagout knowledge'],
    kpis: ['Time to independent work orders', 'Comeback, rework or scrap rate', 'Billable or productive hours versus target', '90-day retention']
  },
  'safety-and-environmental': {
    audience: 'environmental contractors, utilities, municipalities and EHS departments',
    pitch: 'In safety and environmental work, the basics are not optional. Job-title training reinforces terminology, procedures and documentation habits so required regulatory training lands on a solid foundation.',
    pains: ['New hires who struggle with technical vocabulary and documentation', 'Gaps between classroom regulatory training and field reality', 'Inconsistent report quality across team members', 'Costly mistakes in sampling, labeling or recordkeeping'],
    sources: ['University and community college EHS and environmental programs', 'Professional associations such as ASSP', 'Remediation and environmental contractor networks', 'Veterans with military safety backgrounds'],
    screening: ['OSHA HAZWOPER (such as 40-hour) and current refresher where required', 'State licenses (asbestos, lead, water operator, inspector) as applicable', 'Medical surveillance and respirator fit-test eligibility under OSHA standards when respirators are used', 'A writing sample or report review'],
    kpis: ['Time to independent field work', 'Report or documentation corrections required', 'Regulatory findings or near-misses', 'Training and certification currency']
  },
  'transportation-and-logistics': {
    audience: 'warehouses, distribution centers, carriers and 3PLs',
    pitch: 'High-volume hiring means onboarding has to scale. Job-title training gives every new driver, operator and associate the same safety and process foundation, without pulling leads off the floor for every class.',
    pains: ['High-volume hiring that overwhelms trainers', 'Early turnover in the first 30–90 days', 'Safety incidents involving new operators', 'Inconsistent scanning, picking and documentation accuracy'],
    sources: ['CDL schools and trucking academies', 'Local workforce centers and staffing partners', 'Military transition programs', 'Referral bonuses for current drivers and associates'],
    screening: ['CDL, endorsements and DOT medical card for drivers', 'Motor vehicle record and FMCSA Drug & Alcohol Clearinghouse query for CDL drivers', 'Forklift operator training and evaluation, which OSHA requires employers to provide', 'Pre-employment drug screening according to policy and law'],
    kpis: ['Units per hour or stops per day versus target', 'Pick, scan or delivery accuracy', 'Incidents and equipment damage', '30- and 90-day retention']
  },
  'business-and-office': {
    audience: 'offices, firms, agencies and corporate teams',
    pitch: 'Business roles look simple from the outside, but every one has its own vocabulary, systems and standards. Job-title training shortens the learning curve so managers can focus on your processes and culture.',
    pains: ['Managers re-explaining the fundamentals to every new hire', 'Errors in data entry, billing or documentation', 'Slow ramp-up on core software and workflows', 'Unclear expectations that lead to early turnover'],
    sources: ['Community college business programs and career centers', 'Professional associations (such as SHRM, PMI and state CPA societies)', 'LinkedIn and niche job boards', 'Internal promotion from front-line roles'],
    screening: ['A skills assessment (Excel, writing or role software)', 'Credential verification (CPA, PMP, SHRM-CP, paralegal certificate)', 'Reference checks focused on reliability and accuracy', 'A structured interview with a short work sample'],
    kpis: ['Time to independent work', 'Error or rework rate', 'Internal customer satisfaction', '90-day retention']
  },
  technology: {
    audience: 'IT departments, MSPs, agencies and software teams',
    pitch: 'Tech hires come in with uneven fundamentals. Job-title training establishes shared vocabulary and core procedures (ticketing, troubleshooting, security hygiene) so your senior engineers aren’t stuck teaching the basics.',
    pains: ['Uneven fundamentals across bootcamp, degree and self-taught hires', 'Security mistakes from people who don’t yet know the risks', 'Senior staff time lost to repeated basic training', 'Slow ramp-up on documentation and ticket quality'],
    sources: ['Community college IT programs and bootcamps', 'Certification communities (CompTIA, Cisco, cloud providers)', 'Portfolio and GitHub reviews', 'Help desk promotion paths and IT apprenticeships'],
    screening: ['A hands-on troubleshooting or technical exercise', 'Certification verification (CompTIA, Cisco, cloud)', 'Portfolio or code review', 'Background check for roles with privileged access'],
    kpis: ['Time to first independent ticket or deployment', 'First-contact resolution or defect rate', 'Security incidents caused by user or configuration error', '90-day retention']
  },
  'public-safety': {
    audience: 'security firms, property managers, agencies and campus safety departments',
    pitch: 'Security officers often start on post within days of hire. Job-title training reinforces observation, reporting, de-escalation and emergency basics so new officers are prepared, on every shift and every site.',
    pains: ['Officers posted before they fully understand reporting standards', 'Inconsistent incident reports across sites', 'De-escalation and emergency-response gaps', 'High turnover in the first months on post'],
    sources: ['Licensed security training schools', 'Military and law-enforcement transition programs', 'Community job fairs and workforce centers', 'Referrals from current officers'],
    screening: ['State security license or guard card verification', 'Background checks according to state licensing rules', 'Driving record if patrol vehicles are used', 'A scenario-based interview on judgment and de-escalation'],
    kpis: ['Report quality and completeness', 'Post-order compliance in audits', 'Client complaints or incidents', '90-day retention']
  },
  'energy-and-utilities': {
    audience: 'utilities, power plants, refineries and oilfield service companies',
    pitch: 'Plants, grids and well sites run around the clock, and a new operator who doesn’t know the vocabulary or the safety rules is a risk to the whole crew. Job-title training gives every new hire the same foundation before qualification on your own systems begins.',
    pains: ['Long qualification timelines before operators can stand watch alone', 'Retirements taking decades of system knowledge with them', 'New hires who don’t yet recognize energized, pressurized or toxic-gas hazards', 'Uneven grounding in lockout/tagout, permits and procedures'],
    sources: ['Community college power plant, process technology and line programs', 'Military nuclear and engineering veterans', 'Utility and union apprenticeship programs', 'Referrals and internal transfers from maintenance crews'],
    screening: ['Aptitude testing such as EEI POSS, MASS or CAST where used', 'Drug and alcohol testing, including DOT rules for covered roles', 'Background checks and site-access requirements', 'Physical capability for climbing, lifting and respirator use where required'],
    kpis: ['Weeks to first qualification sign-off', 'Procedure compliance and safety observations', 'Recordable incidents and near-misses', 'First-year retention']
  },
  'science-and-engineering': {
    audience: 'labs, engineering firms, manufacturers and research organizations',
    pitch: 'Technical hires arrive with uneven lab and documentation habits. Job-title training builds shared vocabulary, measurement discipline and good recordkeeping so your senior staff can focus on your methods and your projects.',
    pains: ['Documentation and data-integrity errors from new staff', 'Senior scientists and engineers pulled into basic training', 'Inconsistent safety and chemical-handling habits', 'Slow ramp-up on instruments, CAD tools and quality systems'],
    sources: ['Community college and university engineering technology and science programs', 'Co-op and internship programs', 'Professional societies such as ASCE, ASME and IEEE', 'Military technical veterans'],
    screening: ['Degree, transcript or credential verification (PE, FE, ASCP) where required', 'A practical exercise, lab test or CAD drawing review', 'Background checks for regulated or secure facilities', 'Reference checks focused on accuracy and documentation'],
    kpis: ['Time to independent work on instruments or projects', 'Documentation or data corrections required', 'Rework, out-of-spec results or failed audits', '90-day retention']
  },
  'sales-and-retail': {
    audience: 'retailers, dealerships, distributors, agencies and B2B sales teams',
    pitch: 'Sales and retail teams turn over fast, and every new hire needs product knowledge, customer service skills and loss-prevention basics before the first rush. Job-title training gets associates and reps productive faster without pulling your best sellers off the floor.',
    pains: ['High turnover and constant onboarding', 'New hires who can’t answer basic product or policy questions', 'Inconsistent customer experience across stores and reps', 'Long ramp to quota for new sales reps'],
    sources: ['Local job fairs, workforce centers and student job boards', 'Internal promotion from part-time and seasonal staff', 'Referrals from top performers', 'Industry associations and licensing schools for insurance and financial sales'],
    screening: ['A structured interview with role-play or a customer scenario', 'License verification (state insurance, real estate or FINRA) where required', 'Background checks for cash-handling and financial roles', 'Availability for scheduled shifts and peak seasons'],
    kpis: ['Time to independent shifts or first sale', 'Sales per hour, conversion or quota attainment', 'Customer satisfaction scores', '30- and 90-day retention']
  },
  'hospitality-and-food-service': {
    audience: 'restaurants, hotels, resorts, casinos and caterers',
    pitch: 'In hospitality, a new hire is in front of guests on the first shift. Job-title training covers service standards, food safety, vocabulary and the realities of the job, so managers spend less time re-teaching and more time running the floor.',
    pains: ['Turnover that keeps managers in permanent training mode', 'Food safety and sanitation habits that vary by person', 'Guest complaints from new staff who don’t know service standards', 'No-shows and quits from hires who didn’t know what the job involves'],
    sources: ['Culinary and hospitality school career centers', 'Local job fairs and workforce programs', 'Employee referral bonuses', 'Internal promotion from entry-level roles'],
    screening: ['Food handler or ServSafe certification where required', 'Responsible alcohol-service certification for bar staff', 'Working interview or stage (trial shift) for kitchen roles', 'Availability for nights, weekends and holidays'],
    kpis: ['Days to independent shifts', 'Health inspection and audit results', 'Guest satisfaction and review scores', '30- and 90-day retention']
  },
  'arts-media-and-design': {
    audience: 'agencies, studios, publishers, broadcasters and in-house creative teams',
    pitch: 'Creative and technical media hires bring talent but different habits. Job-title training builds a shared vocabulary, workflow basics and professional standards, so creative leads can focus on the work instead of the fundamentals.',
    pains: ['Uneven fundamentals across self-taught and degree-trained hires', 'Missed deadlines from unclear workflow and file-handling habits', 'Copyright, licensing and brand-standard mistakes', 'Senior creatives pulled into basic training'],
    sources: ['Portfolio sites and creative communities', 'Art, design, film and journalism school career centers', 'Freelancers who have already worked with your team', 'Professional associations such as AIGA and PRSA'],
    screening: ['Portfolio or reel review', 'A short paid test project', 'Software proficiency check', 'References from clients or creative directors'],
    kpis: ['Time to first independent project', 'Revision rounds per project', 'On-time delivery rate', '90-day retention']
  },
  'education-and-childcare': {
    audience: 'schools, childcare centers, districts and training departments',
    pitch: 'New teachers, aides and childcare staff need classroom basics, safety rules and child development vocabulary before they can be effective. Job-title training gives every new hire a common foundation so mentors can focus on your curriculum and your students.',
    pains: ['Staff shortages that leave little time for mentoring', 'New hires unprepared for classroom management', 'Inconsistent knowledge of safety, supervision and mandated-reporter duties', 'Early resignations when the job is harder than expected'],
    sources: ['College education programs and student-teaching placements', 'Alternative certification and residency programs', 'Substitute and paraprofessional pools', 'Community colleges with early childhood (CDA) programs'],
    screening: ['State license or certification verification where required', 'Fingerprint background checks and child abuse registry clearances', 'CPR and first aid certification for childcare roles', 'A sample lesson or classroom observation'],
    kpis: ['Time to independent classroom work', 'Observation and evaluation scores', 'Licensing or compliance findings', 'First-year retention']
  },
  'community-and-social-services': {
    audience: 'nonprofits, agencies, hospitals and government offices',
    pitch: 'Caseloads are heavy and new staff need to understand programs, documentation rules, confidentiality and boundaries quickly. Job-title training builds that foundation so supervisors can focus on clinical judgment and your agency’s procedures.',
    pains: ['Large caseloads that leave little time to train new staff', 'Documentation and confidentiality errors', 'Burnout and turnover in the first year', 'Inconsistent knowledge of programs, eligibility rules and referrals'],
    sources: ['Social work, counseling and human services programs', 'Field placements and internships', 'Community members and peers with lived experience', 'Government job boards and civil service lists'],
    screening: ['State license verification (LCSW, LPC, LMFT) where required', 'Background checks and abuse registry clearances', 'Valid driver’s license for home visits and outreach', 'A scenario-based interview on ethics and boundaries'],
    kpis: ['Time to independent caseload', 'Documentation timeliness and audit results', 'Client outcomes and satisfaction', 'First-year retention']
  },
  'beauty-fitness-and-personal-care': {
    audience: 'salons, spas, gyms, studios and funeral homes',
    pitch: 'Licensed professionals know the techniques, but new hires still need your service standards, sanitation habits and client-retention skills. Job-title training reinforces the fundamentals and professional expectations so they can build a book of clients faster.',
    pains: ['New stylists and trainers who struggle to rebook clients', 'Sanitation and safety habits that vary by person', 'Turnover when income ramps up slowly', 'Uneven customer service across the team'],
    sources: ['Cosmetology, barbering and massage school career days', 'Certification bodies and continuing education classes', 'Social media and client referrals', 'Assistants and apprentices already on your team'],
    screening: ['State license verification with the licensing board', 'A practical skills demonstration or trial service', 'Liability insurance and certification checks where required', 'References focused on reliability and client service'],
    kpis: ['Rebooking and retention rates', 'Revenue or sessions per week', 'Client reviews and complaints', '90-day retention']
  },
  'agriculture-and-animal-care': {
    audience: 'farms, ranches, nurseries, landscapers and veterinary practices',
    pitch: 'Seasonal and entry-level hires need equipment safety, chemical-handling basics and animal-handling habits on day one. Job-title training gives every new worker the same foundation, so crew leads can focus on the work instead of the basics.',
    pains: ['Seasonal hiring that leaves little time for training', 'Equipment and chemical-handling injuries among new workers', 'Animal-handling mistakes and client complaints', 'Language and literacy differences across crews'],
    sources: ['Agricultural, horticulture and veterinary technology programs', 'FFA, 4-H and community college networks', 'Seasonal worker programs and labor contractors', 'Referrals from current crew members'],
    screening: ['Driver’s license and CDL where hauling is required', 'Pesticide applicator license or certification where required', 'Practical equipment or animal-handling check', 'Physical ability to work outdoors and lift as required'],
    kpis: ['Time to independent work', 'Injuries and equipment damage', 'Quality checks, client complaints or animal outcomes', 'Seasonal return rate']
  }
};
