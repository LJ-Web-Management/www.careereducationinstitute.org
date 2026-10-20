// Career categories (hub pages at /careers/{slug}/)
export const icons = {
  healthcare: '<path d="M12 20.5C6.6 17 3.5 13.6 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3 .8 4 2.1C13 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 4-3.1 7.4-8.5 10.9z"/><path d="M7 11.5h2.2l1.3-2.3 2 4.6 1.3-2.3H17"/>',
  'skilled-trades': '<path d="M3 17.5h18"/><path d="M5.5 17.5V15a6.5 6.5 0 0 1 13 0v2.5"/><path d="M10 9.2V6.5h4v2.7"/>',
  'mechanics-and-manufacturing': '<path d="M14.6 6.4a4.2 4.2 0 0 0-5.4 5.3L4 16.9 7.1 20l5.2-5.2a4.2 4.2 0 0 0 5.3-5.4l-2.5 2.5-2.6-.6-.6-2.6z"/>',
  'safety-and-environmental': '<path d="M12 3l7 3v5.5c0 4.4-3 7.7-7 9.5-4-1.8-7-5.1-7-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  'transportation-and-logistics': '<path d="M3 6.5h11v9H3z"/><path d="M14 9.5h3.5l3 3v3H14"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  'business-and-office': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
  technology: '<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M8 20h8M12 16.5V20"/><path d="M10 8.5l-2 2 2 2M14 8.5l2 2-2 2"/>',
  'public-safety': '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  'energy-and-utilities': '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  'science-and-engineering': '<path d="M9.5 3.5h5"/><path d="M10.5 3.5v5.2L5 18.2a1.6 1.6 0 0 0 1.4 2.3h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5"/><path d="M7.6 14.5h8.8"/>',
  'sales-and-retail': '<path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  'hospitality-and-food-service': '<path d="M3 18.5h18"/><path d="M5 18.5a7 7 0 0 1 14 0"/><path d="M12 11.5V9.5"/><path d="M10.5 9.5h3"/>',
  'arts-media-and-design': '<rect x="3" y="7" width="18" height="12.5" rx="2"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/><circle cx="12" cy="13.2" r="3.4"/>',
  'education-and-childcare': '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.6v4.1c0 1.2 2.5 2.8 5.5 2.8s5.5-1.6 5.5-2.8v-4.1"/><path d="M21.5 9.5v5"/>',
  'community-and-social-services': '<circle cx="8.5" cy="8" r="2.8"/><circle cx="16.5" cy="9" r="2.3"/><path d="M3.5 19c0-3 2.2-5.2 5-5.2s5 2.2 5 5.2"/><path d="M13.8 14.6c.8-.5 1.7-.8 2.7-.8 2.4 0 4 1.9 4 4.6"/>',
  'beauty-fitness-and-personal-care': '<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><path d="M8.6 8 20 18.5M8.6 16 20 5.5"/>',
  'agriculture-and-animal-care': '<path d="M12 20.5v-8"/><path d="M12 12.5c0-4 3-7 8-7 0 4.5-3 7-8 7z"/><path d="M12 15C12 11.5 9.5 9 4.5 9c0 4 2.5 6 7.5 6z"/>'
};

export const categories = [
  {
    slug: 'healthcare', short: 'Healthcare',
    name: 'Healthcare',
    noun: 'healthcare',
    blurb: 'Patient-facing and behind-the-scenes roles that keep clinics, hospitals and pharmacies running.',
    intro: [
      'Healthcare is one of the most dependable places to build a career in the United States. Hospitals, physician offices, nursing homes, pharmacies and ambulance services hire year-round, and many roles can be started with a certificate program that takes months rather than years.',
      'The careers below range from entry-level support roles such as nursing assistants and phlebotomists to licensed professions such as practical and registered nursing. Many people start in a shorter program, gain experience, and then use employer tuition help to climb into higher-paying roles.'
    ],
    payFactors: ['Work setting (hospitals and outpatient care centers often pay more than physician offices or nursing homes)', 'Shift differentials for nights, weekends and holidays', 'Credentials such as national certification or state licensure', 'Specialty experience (surgery, cardiology, oncology, pediatrics)'],
    tips: 'Healthcare employers screen for reliability, background checks, immunizations and CPR/BLS certification, so get those in order early.'
  },
  {
    slug: 'skilled-trades', short: 'Skilled Trades',
    name: 'Skilled Trades & Construction',
    noun: 'skilled trades',
    blurb: 'Build, wire, plumb and power the country, usually through paid apprenticeships instead of student debt.',
    intro: [
      'Skilled trades and construction careers let you earn while you learn. Most electricians, plumbers and carpenters train through apprenticeships that combine paid on-the-job hours with classroom instruction, and many finish with no student loans.',
      'Demand is strong because of retirements, infrastructure investment and the shift to clean energy. The trade-off is physical work, outdoor conditions and safety hazards that require serious respect for procedures and personal protective equipment.'
    ],
    payFactors: ['Union versus non-union employment and local wage agreements', 'License level (apprentice, journeyworker, master or contractor)', 'Overtime, per diem and travel work', 'Specialization (industrial, commercial, renewable energy, high voltage)'],
    tips: 'Start with OSHA 10 safety training, a valid driver’s license and basic math skills: apprenticeship programs test for all three.'
  },
  {
    slug: 'mechanics-and-manufacturing', short: 'Mechanics & Manufacturing',
    name: 'Mechanics, Maintenance & Manufacturing',
    noun: 'mechanical and manufacturing',
    blurb: 'Diagnose, repair and make the machines, vehicles and aircraft everything else depends on.',
    intro: [
      'If you like figuring out why something stopped working, mechanical and manufacturing careers reward that curiosity. Technicians keep trucks, cars, aircraft and factory equipment running, while machinists turn raw material into precision parts.',
      'Modern equipment is computer-controlled, so these jobs mix hands-on skill with diagnostic software, sensors and programming. Certificates from technical schools, manufacturer programs and FAA or ASE credentials can raise pay quickly.'
    ],
    payFactors: ['Certifications such as ASE, FAA A&P or manufacturer credentials', 'Flat-rate versus hourly pay plans in repair shops', 'Industry (aerospace and utilities often pay more than general repair)', 'Shift work and overtime in plants running around the clock'],
    tips: 'Buy tools gradually, document every repair you do, and earn certifications one at a time: employers notice steady progress.'
  },
  {
    slug: 'safety-and-environmental', short: 'Safety & Environmental',
    name: 'Safety & Environmental',
    noun: 'safety and environmental',
    blurb: 'Protect workers, communities and natural resources through inspection, cleanup and compliance.',
    intro: [
      'Safety and environmental careers exist because every workplace, building and water system has rules designed to keep people alive and healthy. These professionals inspect, test, clean up and teach, and they are often the people who stop an incident before it happens.',
      'Many roles require specific federal or state training, such as OSHA HAZWOPER for hazardous waste work or state operator certification for water treatment. That training is a real barrier to entry, which helps keep demand and pay steady for those who earn it.'
    ],
    payFactors: ['Required credentials (HAZWOPER, CSP, state inspector or operator licenses)', 'Government versus private-sector employment', 'Hazard level and emergency-response duties', 'Industry (construction, energy, chemical and federal contracting)'],
    tips: 'Pair a recognized safety certificate with clear writing skills: reports and documentation are a big part of these jobs.'
  },
  {
    slug: 'transportation-and-logistics', short: 'Transportation & Logistics',
    name: 'Transportation & Logistics',
    noun: 'transportation and logistics',
    blurb: 'Move freight from factories to front doors, on the road, in the warehouse and behind the dashboard.',
    intro: [
      'Transportation and logistics jobs keep shelves stocked and packages moving. Some roles, such as warehouse associate and forklift operator, can start in days with on-the-job training; others, such as truck driving, need a Commercial Driver’s License (CDL).',
      'The field also has a clear ladder into planning and management. Many logistics coordinators and supply chain analysts started on a warehouse floor or behind the wheel and moved up after learning how the whole system fits together.'
    ],
    payFactors: ['Licenses and endorsements (CDL Class A, hazmat, tanker)', 'Overtime and peak-season premium pay', 'Long-haul versus local routes', 'Equipment certifications and safety record'],
    tips: 'A clean driving record, drug-test readiness and a forklift or CDL credential open the most doors fastest.'
  },
  {
    slug: 'business-and-office', short: 'Business & Office',
    name: 'Business & Office',
    noun: 'business and office',
    blurb: 'Keep organizations organized: money, people, projects, customers and contracts.',
    intro: [
      'Business and office careers are found in every industry, from hospitals and construction firms to software companies and government agencies. That flexibility makes them a strong choice if you are not yet sure which industry you want to work in.',
      'Entry points range from customer service and administrative roles that require a high school diploma to accounting and project management roles that usually need a bachelor’s degree or professional certification. Strong software skills and clear communication raise pay at every level.'
    ],
    payFactors: ['Industry and company size', 'Professional credentials (CPA, PMP, SHRM-CP, paralegal certificates)', 'Software skills such as Excel, QuickBooks, CRM and HR systems', 'Remote or hybrid roles tied to higher-cost labor markets'],
    tips: 'Learn spreadsheets well. Nearly every office role uses Excel or Google Sheets, and it is one of the easiest skills to prove in an interview.'
  },
  {
    slug: 'technology', short: 'Technology',
    name: 'Technology',
    noun: 'technology',
    blurb: 'Support, secure, build and market the digital tools every business runs on.',
    intro: [
      'Technology careers offer some of the highest median pay in the country, and many of them value demonstrated skill as much as formal degrees. Help desk and IT support roles are common starting points, while cybersecurity, networking and web development reward deeper specialization.',
      'The field changes quickly, so the most successful people build a habit of learning. Industry certifications, portfolio projects and home labs are practical ways to prove ability to employers.'
    ],
    payFactors: ['Specialization (security and cloud skills typically pay more)', 'Certifications such as CompTIA, Cisco, AWS or Google', 'Portfolio quality and real project experience', 'Location and remote-work eligibility'],
    tips: 'Build something you can show: a home lab, a website, a write-up of a fixed problem. Proof of skill beats a list of buzzwords.'
  },
  {
    slug: 'public-safety', short: 'Public Safety',
    name: 'Public Safety & Security',
    noun: 'public safety',
    blurb: 'Respond, protect and serve, in communities, buildings and emergencies.',
    intro: [
      'Public safety and security careers attract people who want work that matters and are comfortable making decisions under pressure. Police officers and firefighters serve communities through government agencies, while security officers protect people and property for businesses of every kind.',
      'Hiring processes are thorough: expect written exams, physical fitness tests, background investigations and academy training. Pay and benefits, including pensions in many public agencies, tend to rise steadily with rank and years of service.'
    ],
    payFactors: ['Agency size and local government budgets', 'Rank, seniority and specialty assignments', 'Overtime, shift differentials and court time', 'State licensing and armed-guard credentials for security work'],
    tips: 'Keep your record clean and start a fitness routine now: background and physical tests are pass/fail gates.'
  },
  {
    slug: 'energy-and-utilities', short: 'Energy & Utilities',
    name: 'Energy & Utilities',
    noun: 'energy and utilities',
    blurb: 'Generate, move and maintain the power, fuel and communications every home and business runs on.',
    intro: [
      'Energy and utility workers run power plants, operate the grid, drill and service oil and gas wells, and keep substations and telecommunications lines working. Many of these jobs pay well above the national median without a four-year degree, because the work is technical, round-the-clock and safety-critical.',
      'Most employers train new hires on the job for a year or more, often through formal operator or apprenticeship programs, and some roles require federal or company licensing, such as Nuclear Regulatory Commission operator licenses. Expect shift work, drug testing and strict safety rules in exchange for strong pay and benefits.'
    ],
    payFactors: ['Plant type and employer (nuclear, utility and refinery roles often pay the most)', 'Operator qualifications and licenses earned on the job', 'Shift differentials, overtime and on-call pay', 'Remote and rotational oilfield schedules with per diem'],
    tips: 'Mechanical aptitude, math skills and a clean drug test matter most. Utility and plant employers often test applicants with aptitude exams such as the EEI POSS, so practice before you apply.'
  },
  {
    slug: 'science-and-engineering', short: 'Science & Engineering',
    name: 'Science, Engineering & Lab',
    noun: 'science and engineering',
    blurb: 'Test, measure, design and solve problems in labs, plants, offices and in the field.',
    intro: [
      'Science and engineering careers range from lab and engineering technicians, who often need an associate degree or certificate, to engineers and scientists with bachelor’s degrees. They share a common core: careful measurement, clear documentation and a habit of asking why something works the way it does.',
      'Technician roles are an underrated entry point. They pay solid wages, employers frequently fund further education, and many technicians move into engineering, quality or lab management roles with experience.'
    ],
    payFactors: ['Education level (associate, bachelor’s or graduate degree)', 'Industry (semiconductors, energy, pharmaceuticals and federal labs often pay more)', 'Licenses and certifications such as the PE, FE or ASCP', 'Specialized instruments, software and regulated-lab experience'],
    tips: 'Keep a portfolio of lab reports, CAD drawings or projects. Hiring managers want proof that you can follow procedures and document results accurately.'
  },
  {
    slug: 'sales-and-retail', short: 'Sales & Retail',
    name: 'Sales & Retail',
    noun: 'sales and retail',
    blurb: 'Help customers find what they need, from the store floor to six-figure business deals.',
    intro: [
      'Sales and retail is one of the largest and most accessible fields in the country. Retail roles such as sales associate, cashier and stock associate hire constantly and train on the job, which makes them a common first job and a flexible second one.',
      'The field also has a high ceiling. People who learn to understand customers, explain products and close deals can move into store management, insurance or financial sales, account management and sales engineering, where commission and bonuses can push pay well past the median.'
    ],
    payFactors: ['Commission, bonus and base-pay mix', 'Product type (technical, financial and B2B sales usually pay more)', 'Licenses such as state insurance or FINRA securities licenses', 'Territory, customer base and track record'],
    tips: 'Track your numbers. Sales hiring managers want to hear specifics, such as average ticket, quota attainment or customer reviews, even from a retail job.'
  },
  {
    slug: 'hospitality-and-food-service', short: 'Hospitality & Food',
    name: 'Hospitality, Food & Tourism',
    noun: 'hospitality',
    blurb: 'Feed, host and look after guests in restaurants, hotels, casinos and on tours.',
    intro: [
      'Hospitality, food service and tourism employ millions of people and hire year-round. Many roles can be started with no experience, and restaurants and hotels are known for promoting people who show up reliably and learn fast, from line cook to sous chef or front desk agent to hotel manager.',
      'The work is fast-paced, physical and people-focused, with evening, weekend and holiday shifts. Tips make up a large share of pay in many front-of-house roles, and food safety and alcohol-service certifications are standard requirements.'
    ],
    payFactors: ['Tips and service charges in front-of-house roles', 'Type of establishment (fine dining, resorts and casinos often pay more)', 'Supervisory and management responsibility', 'Certifications such as ServSafe Manager and culinary credentials'],
    tips: 'Get a food handler or ServSafe certificate and responsible alcohol-service training before you apply. They cost little and show managers you are ready to work a shift on day one.'
  },
  {
    slug: 'arts-media-and-design', short: 'Arts, Media & Design',
    name: 'Arts, Media & Design',
    noun: 'arts, media and design',
    blurb: 'Create, record, edit and communicate: design, photography, video, sound, writing and language.',
    intro: [
      'Arts, media and design careers turn creativity into a paycheck. Designers, editors, writers, photographers and production technicians work for agencies, studios, broadcasters, manufacturers, publishers and live-event companies, and many freelance.',
      'Portfolios matter more than credentials in most of these jobs. A bachelor’s degree is common for designers and writers, while many audio, video and lighting technicians learn through certificates, apprenticeships and work on real productions.'
    ],
    payFactors: ['Portfolio strength and client list', 'Industry (advertising, film, tech and corporate roles often pay more)', 'Freelance rates versus salaried positions', 'Software skills such as Adobe Creative Cloud, DaVinci Resolve or Pro Tools'],
    tips: 'Build a focused portfolio of 8 to 12 of your best pieces, aimed at the job you want. Quality beats quantity, and explaining your process helps in interviews.'
  },
  {
    slug: 'education-and-childcare', short: 'Education & Childcare',
    name: 'Education & Childcare',
    noun: 'education and childcare',
    blurb: 'Teach, care for and support learners, from infants and preschoolers to adults.',
    intro: [
      'Education and childcare careers include childcare workers, teacher assistants and tutors, who can start with a high school diploma or a short credential, and licensed teachers, counselors and librarians, who need a bachelor’s or master’s degree. Schools and childcare centers hire every year to replace retiring and departing staff.',
      'Public school teaching requires a state license, and most states now offer alternative certification routes for career changers who already hold a bachelor’s degree. Childcare and preschool roles often require a Child Development Associate (CDA) credential, background checks and CPR and first aid training.'
    ],
    payFactors: ['Public versus private schools and centers', 'Degree level and state salary schedules', 'Subject or specialty shortages (special education, STEM, career and technical education)', 'Extra-duty pay for coaching, summer school and tutoring'],
    tips: 'Volunteer, substitute or work as a teacher assistant first. Classroom experience is the best way to find out whether you enjoy the work, and schools often hire from their own pool.'
  },
  {
    slug: 'community-and-social-services', short: 'Community & Social Services',
    name: 'Community, Social & Government Services',
    noun: 'community and social service',
    blurb: 'Help people and communities through counseling, case work, outreach and public service.',
    intro: [
      'Community, social and government service careers help people get through hard times and keep public programs running. They include counselors, social workers, case aides, community health workers, eligibility interviewers, court clerks and planners working for nonprofits, hospitals, schools and government agencies.',
      'Entry points vary widely. Human service assistants and community health workers can start with a high school diploma and on-the-job training, while counselors and clinical social workers need a master’s degree and a state license. Many people start in an assistant role and earn a degree while working.'
    ],
    payFactors: ['Degree level and state licensure (such as LCSW, LPC or LMFT)', 'Employer type (hospitals and government often pay more than small nonprofits)', 'Clinical specialization and supervision credentials', 'Government pay grades, steps and benefits'],
    tips: 'Volunteer with a local nonprofit, crisis line or community program. It builds experience, references and a clear answer to the interview question “why this work?”'
  },
  {
    slug: 'beauty-fitness-and-personal-care', short: 'Beauty & Fitness',
    name: 'Beauty, Fitness & Personal Care',
    noun: 'beauty, fitness and personal care',
    blurb: 'Help people look, feel and move their best, from salons and spas to gyms and funeral homes.',
    intro: [
      'Beauty, fitness and personal care careers are built on skill and relationships. Cosmetologists, barbers, estheticians and nail technicians complete state-approved programs and pass licensing exams, then build a clientele; trainers and coaches earn certifications; and funeral service workers complete a degree and an apprenticeship.',
      'Many of these professionals work for themselves or rent a booth or studio, so income depends on how many clients they keep. Strong customer service, reliability and social media marketing often matter as much as technical skill.'
    ],
    payFactors: ['Commission, booth rental or self-employment versus hourly pay', 'Tips and product sales', 'Repeat clients and reputation', 'State licenses and specialty certifications'],
    tips: 'Check your state board’s licensing rules before you enroll. Required training hours vary by state, and choosing a program that meets your state’s rules saves time and money.'
  },
  {
    slug: 'agriculture-and-animal-care', short: 'Agriculture & Animal Care',
    name: 'Agriculture, Landscaping & Animal Care',
    noun: 'agriculture and animal care',
    blurb: 'Grow food, care for animals and keep land, trees and green spaces healthy.',
    intro: [
      'Agriculture, landscaping and animal care careers are for people who would rather work outdoors, with plants and animals, than at a desk. They range from entry-level farmworkers, landscapers and kennel staff to veterinary technicians, equipment mechanics, arborists and farm managers.',
      'Many roles train on the job, and licenses and certifications move pay up quickly: a state pesticide applicator license, an ISA arborist certification, a CDL for hauling, or credentialing as a veterinary technician. Work is often seasonal and weather-dependent, with long days at planting, harvest and peak landscaping season.'
    ],
    payFactors: ['Seasonal versus year-round employment', 'Licenses and certifications (pesticide applicator, ISA arborist, credentialed vet tech)', 'Equipment skills and CDL endorsements', 'Supervisory responsibility and business ownership'],
    tips: 'A valid driver’s license, a willingness to work outdoors in all weather and basic equipment skills open most doors. Ask employers about paid training and certification support.'
  }
];

export const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
