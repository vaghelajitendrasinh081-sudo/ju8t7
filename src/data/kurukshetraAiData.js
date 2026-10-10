export const NCERT_TOPICS = [
  // Class 10 Topics
  {
    id: 'c10-light-reflection',
    classLevel: '10',
    subject: 'Physics',
    chapter: 'Light - Reflection and Refraction',
    topicName: 'Snell\'s Law & Total Internal Reflection',
    coreKeywords: ['refractive index', 'angle of incidence', 'angle of refraction', 'constant ratio', 'sine', 'speed of light', 'denser medium'],
    requiredSteps: [
      'Define refractive index as ratio of speed of light in vacuum to medium.',
      'State Snell\'s Law formula: n1 * sin(i) = n2 * sin(r).',
      'Explain bending towards normal when entering optically denser medium.'
    ],
    commonFlaws: ['Confusing incidence angle with angle to surface.', 'Swapping numerator and denominator in Snell\'s ratio.']
  },
  {
    id: 'c10-electricity-ohm',
    classLevel: '10',
    subject: 'Physics',
    chapter: 'Electricity',
    topicName: 'Ohm\'s Law & Resistance Factors',
    coreKeywords: ['potential difference', 'current', 'proportional', 'resistance', 'length', 'area of cross-section', 'resistivity', 'temperature'],
    requiredSteps: [
      'State Ohm\'s Law: V = I * R at constant temperature.',
      'Explain resistance factors: R is directly proportional to length (L) and inversely to area (A).',
      'Define resistivity (rho) as intrinsic material property.'
    ],
    commonFlaws: ['Forgetting constant temperature condition.', 'Thinking resistivity changes with dimensions.']
  },
  {
    id: 'c10-chem-acid-base',
    classLevel: '10',
    subject: 'Chemistry',
    chapter: 'Acids, Bases and Salts',
    topicName: 'pH Scale & Neutralization Reaction',
    coreKeywords: ['hydrogen ion', 'H+ concentration', 'neutralization', 'salt', 'water', 'exothermic', 'hydronium'],
    requiredSteps: [
      'Explain pH scale from 0 to 14 measuring H+ ion concentration.',
      'Write balanced neutralization reaction: Acid + Base -> Salt + Water.',
      'Identify exothermic nature of strong acid-base neutralization.'
    ],
    commonFlaws: ['Assuming pH 7 is alkaline.', 'Forgetting water formation in neutralization equations.']
  },

  // Class 11 Topics
  {
    id: 'c11-kinematics-projectile',
    classLevel: '11',
    subject: 'Physics',
    chapter: 'Motion in a Plane',
    topicName: 'Projectile Motion & Trajectory Parabola',
    coreKeywords: ['horizontal velocity', 'vertical acceleration', 'gravity', 'parabolic path', 'time of flight', 'maximum height', 'horizontal range'],
    requiredSteps: [
      'Resolve initial velocity into u*cos(theta) horizontal and u*sin(theta) vertical components.',
      'State horizontal component remains constant while vertical undergoes uniform acceleration g.',
      'Derive parabolic equation y = x*tan(theta) - (g*x^2)/(2*u^2*cos^2(theta)).'
    ],
    commonFlaws: ['Assuming horizontal velocity changes during flight.', 'Omitting direction vectors.']
  },
  {
    id: 'c11-laws-motion',
    classLevel: '11',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    topicName: 'Conservation of Linear Momentum',
    coreKeywords: ['isolated system', 'external force', 'total momentum', 'initial momentum', 'final momentum', 'impulse', 'newton third law'],
    requiredSteps: [
      'State condition: Net external force sum(F_ext) = 0.',
      'Apply Newton\'s 3rd law: Action and reaction forces are equal and opposite.',
      'Derive total initial momentum equals total final momentum m1*u1 + m2*u2 = m1*v1 + m2*v2.'
    ],
    commonFlaws: ['Applying conservation when external friction is present.', 'Confusing scalar mass with vector momentum.']
  },
  {
    id: 'c11-chem-bonding',
    classLevel: '11',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    topicName: 'VSEPR Theory & Hybridization',
    coreKeywords: ['valence shell', 'electron pair repulsion', 'lone pair', 'bond pair', 'sp3', 'sp2', 'geometry', 'molecular shape'],
    requiredSteps: [
      'State VSEPR principle: Electron pairs around central atom arrange to minimize repulsion.',
      'Distinguish electron geometry vs molecular shape based on lone pairs.',
      'Explain hybridization (e.g., methane sp3 tetrahedral angle 109.5 deg).'
    ],
    commonFlaws: ['Ignoring lone pair repulsion strength > bond pair repulsion.', 'Confusing geometry with shape.']
  }
];

export const EXAM_QUIZZES = {
  '10': [
    {
      id: 'q10-1',
      subject: 'Physics',
      chapter: 'Light - Reflection and Refraction',
      question: 'A convex lens forms a real, inverted image of a needle at a distance of 50 cm from it. Where is the needle placed if the image size equals object size? Calculate power of the lens.',
      options: [
        'Object at 50 cm, Power = +4 D',
        'Object at 25 cm, Power = +2 D',
        'Object at 100 cm, Power = +1 D',
        'Object at 50 cm, Power = -4 D'
      ],
      correctIndex: 0,
      boardExplanation: 'For a real, equal-sized image formed by a convex lens, object is placed at 2F1 (u = -50 cm, v = +50 cm). Focal length f = +25 cm = 0.25 m. Power P = 1/f = 1/0.25 = +4 D.',
      ncertMarkingScheme: '1 mark for object position (u=-50cm), 1 mark for focal length calculation (f=25cm), 1 mark for Lens Power formula & correct SI unit (+4 D).'
    },
    {
      id: 'q10-2',
      subject: 'Chemistry',
      chapter: 'Acids, Bases and Salts',
      question: 'Plaster of Paris should be stored in a moisture-proof container. Why? Write the balanced chemical equation for its reaction with water.',
      options: [
        'It absorbs moisture and sets into hard Gypsum (CaSO4.2H2O)',
        'It reacts with humidity to form explosive Hydrogen gas',
        'It dissolves in water to form Slaked Lime Ca(OH)2',
        'It decomposes into Calcium Oxide and Sulfur Dioxide gas'
      ],
      correctIndex: 0,
      boardExplanation: 'Plaster of Paris (CaSO4.1/2H2O) absorbs atmospheric moisture and hydrates into hard solid Gypsum (CaSO4.2H2O). Equation: CaSO4.1/2H2O + 1.5 H2O -> CaSO4.2H2O.',
      ncertMarkingScheme: '1 mark for stating Gypsum formation, 1 mark for balanced chemical equation.'
    },
    {
      id: 'q10-3',
      subject: 'Physics',
      chapter: 'Electricity',
      question: 'An electric iron consumes energy at a rate of 840 W when heating is at maximum rate and 360 W when heating is at minimum. Voltage is 220 V. Calculate current at maximum rate.',
      options: [
        '3.82 A',
        '1.64 A',
        '5.20 A',
        '2.50 A'
      ],
      correctIndex: 0,
      boardExplanation: 'Power P = V * I. At max rate: 840 = 220 * I => I = 840 / 220 = 3.82 A.',
      ncertMarkingScheme: '1 mark for P=V*I formula, 1 mark for correct current value with units.'
    }
  ],

  '11': [
    {
      id: 'q11-1',
      subject: 'Physics',
      chapter: 'Motion in a Plane',
      question: 'A projectile is launched from ground level at an angle theta to the horizontal with initial speed u. At what point in its trajectory is its velocity perpendicular to initial velocity vector u?',
      options: [
        'When time t = u / (g * sin(theta))',
        'When time t = u / (g * cos(theta))',
        'At maximum height t = u*sin(theta)/g',
        'Velocity is never perpendicular to initial velocity if theta < 45 deg'
      ],
      correctIndex: 0,
      boardExplanation: 'Initial velocity vector u_vec = u*cos(theta)*i + u*sin(theta)*j. Velocity at time t v_vec = u*cos(theta)*i + (u*sin(theta) - g*t)*j. Setting dot product u_vec . v_vec = 0 yields t = u / (g * sin(theta)).',
      ncertMarkingScheme: 'Vector dot product condition u.v = 0 applied correctly. Valid for launch angles theta > 45 deg.'
    },
    {
      id: 'q11-2',
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      question: 'According to VSEPR theory and hybridization concepts, predict the geometry, hybridization, and number of lone pairs on Xenon in Xenon Difluoride (XeF2).',
      options: [
        'Linear geometry, sp3d hybridization, 3 lone pairs on Xe',
        'Trigonal bipyramidal geometry, sp3d hybridization, 0 lone pairs',
        'Bent shape, sp3 hybridization, 2 lone pairs on Xe',
        'Square planar geometry, sp3d2 hybridization, 2 lone pairs'
      ],
      correctIndex: 0,
      boardExplanation: 'Xe has 8 valence electrons. In XeF2, Xe forms 2 single sigma bonds with F and has 3 lone pairs (total 5 electron pairs = sp3d hybridization). Equatorial lone pairs minimize repulsion, yielding Linear molecular shape (180 deg F-Xe-F angle).',
      ncertMarkingScheme: 'Correct electron count (5 pairs), sp3d hybridization, and equatorial lone pair positioning.'
    },
    {
      id: 'q11-3',
      subject: 'Physics',
      chapter: 'Laws of Motion',
      question: 'A block of mass 2 kg rests on an inclined plane making 30 deg with horizontal. Coefficient of static friction mu_s = 0.8. Find force of friction acting on the block.',
      options: [
        '9.8 N',
        '13.58 N',
        '19.6 N',
        '4.9 N'
      ],
      correctIndex: 0,
      boardExplanation: 'Down-plane component of weight W_parallel = m*g*sin(30) = 2 * 9.8 * 0.5 = 9.8 N. Max static friction f_max = mu_s * m * g * cos(30) = 0.8 * 2 * 9.8 * 0.866 = 13.58 N. Since W_parallel < f_max, block remains stationary and static friction equals down-plane force = 9.8 N.',
      ncertMarkingScheme: 'Distinction between actual static friction (self-adjusting) and max limiting friction.'
    }
  ]
};

export const FLASH_QUIZ_QUESTIONS = [
  {
    id: 'fq-1',
    subject: 'Physics',
    chapter: 'Light / Optics',
    question: 'What is the SI unit of power of a lens?',
    options: ['Dioptre (D)', 'Watt (W)', 'Joule (J)', 'Metre-inverse (m^-1)'],
    correctIndex: 0,
    explanation: 'Dioptre (D) is the SI unit of lens power, where Power P = 1 / f (in metres).'
  },
  {
    id: 'fq-2',
    subject: 'Chemistry',
    chapter: 'Acids and Bases',
    question: 'What happens to pH when milk turns into curd?',
    options: ['pH decreases (becomes more acidic)', 'pH increases (becomes alkaline)', 'pH remains exactly 7.0', 'pH fluctuates randomly'],
    correctIndex: 0,
    explanation: 'Lactic acid formation during curdling increases H+ concentration, thereby decreasing pH.'
  },
  {
    id: 'fq-3',
    subject: 'Physics',
    chapter: 'Electricity',
    question: 'If length of a uniform wire is doubled, its resistance becomes:',
    options: ['Doubled', 'Halved', 'Quadrupled', 'Unchanged'],
    correctIndex: 0,
    explanation: 'Resistance R is directly proportional to wire length L (R = rho * L / A).'
  }
];
