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
  }
};
