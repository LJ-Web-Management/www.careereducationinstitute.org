// Career categories (hub pages at /careers/{slug}/)
export const icons = {
  healthcare: '<path d="M12 20.5C6.6 17 3.5 13.6 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3 .8 4 2.1C13 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 4-3.1 7.4-8.5 10.9z"/><path d="M7 11.5h2.2l1.3-2.3 2 4.6 1.3-2.3H17"/>',
  'skilled-trades': '<path d="M3 17.5h18"/><path d="M5.5 17.5V15a6.5 6.5 0 0 1 13 0v2.5"/><path d="M10 9.2V6.5h4v2.7"/>',
  'mechanics-and-manufacturing': '<path d="M14.6 6.4a4.2 4.2 0 0 0-5.4 5.3L4 16.9 7.1 20l5.2-5.2a4.2 4.2 0 0 0 5.3-5.4l-2.5 2.5-2.6-.6-.6-2.6z"/>',
  'safety-and-environmental': '<path d="M12 3l7 3v5.5c0 4.4-3 7.7-7 9.5-4-1.8-7-5.1-7-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  'transportation-and-logistics': '<path d="M3 6.5h11v9H3z"/><path d="M14 9.5h3.5l3 3v3H14"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  'business-and-office': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
  technology: '<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><path d="M8 20h8M12 16.5V20"/><path d="M10 8.5l-2 2 2 2M14 8.5l2 2-2 2"/>',
  'public-safety': '<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'
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
    blurb: 'Build, wire, plumb and power the country — usually through paid apprenticeships instead of student debt.',
    intro: [
      'Skilled trades and construction careers let you earn while you learn. Most electricians, plumbers and carpenters train through apprenticeships that combine paid on-the-job hours with classroom instruction, and many finish with no student loans.',
      'Demand is strong because of retirements, infrastructure investment and the shift to clean energy. The trade-off is physical work, outdoor conditions and safety hazards that require serious respect for procedures and personal protective equipment.'
    ],
    payFactors: ['Union versus non-union employment and local wage agreements', 'License level (apprentice, journeyworker, master or contractor)', 'Overtime, per diem and travel work', 'Specialization (industrial, commercial, renewable energy, high voltage)'],
    tips: 'Start with OSHA 10 safety training, a valid driver’s license and basic math skills — apprenticeship programs test for all three.'
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
    tips: 'Buy tools gradually, document every repair you do, and earn certifications one at a time — employers notice steady progress.'
  },
  {
    slug: 'safety-and-environmental', short: 'Safety & Environmental',
    name: 'Safety & Environmental',
    noun: 'safety and environmental',
    blurb: 'Protect workers, communities and natural resources through inspection, cleanup and compliance.',
    intro: [
      'Safety and environmental careers exist because every workplace, building and water system has rules designed to keep people alive and healthy. These professionals inspect, test, clean up and teach — and they are often the people who stop an incident before it happens.',
      'Many roles require specific federal or state training, such as OSHA HAZWOPER for hazardous waste work or state operator certification for water treatment. That training is a real barrier to entry, which helps keep demand and pay steady for those who earn it.'
    ],
    payFactors: ['Required credentials (HAZWOPER, CSP, state inspector or operator licenses)', 'Government versus private-sector employment', 'Hazard level and emergency-response duties', 'Industry (construction, energy, chemical and federal contracting)'],
    tips: 'Pair a recognized safety certificate with clear writing skills — reports and documentation are a big part of these jobs.'
  },
  {
    slug: 'transportation-and-logistics', short: 'Transportation & Logistics',
    name: 'Transportation & Logistics',
    noun: 'transportation and logistics',
    blurb: 'Move freight from factories to front doors — on the road, in the warehouse and behind the dashboard.',
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
    blurb: 'Keep organizations organized — money, people, projects, customers and contracts.',
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
    tips: 'Build something you can show — a home lab, a website, a write-up of a fixed problem. Proof of skill beats a list of buzzwords.'
  },
  {
    slug: 'public-safety', short: 'Public Safety',
    name: 'Public Safety & Security',
    noun: 'public safety',
    blurb: 'Respond, protect and serve — in communities, buildings and emergencies.',
    intro: [
      'Public safety and security careers attract people who want work that matters and are comfortable making decisions under pressure. Police officers and firefighters serve communities through government agencies, while security officers protect people and property for businesses of every kind.',
      'Hiring processes are thorough: expect written exams, physical fitness tests, background investigations and academy training. Pay and benefits — including pensions in many public agencies — tend to rise steadily with rank and years of service.'
    ],
    payFactors: ['Agency size and local government budgets', 'Rank, seniority and specialty assignments', 'Overtime, shift differentials and court time', 'State licensing and armed-guard credentials for security work'],
    tips: 'Keep your record clean and start a fitness routine now — background and physical tests are pass/fail gates.'
  }
];

export const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
