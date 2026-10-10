export const REACTIONS_DATA = [
  // 1. Neutralization
  {
    id: 'neutralization_naoh_hcl',
    title: 'Acid-Base Neutralization (NaOH + HCl)',
    type: 'Neutralization',
    thermo: 'EXOTHERMIC',
    equation: 'NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l) + Heat',
    reactants: ['NaOH', 'HCl'],
    products: ['NaCl', 'H₂O'],
    ncertNote: 'NCERT Class 10 Ch 2: Hydroxide ions (OH⁻) from the base react with Hydrogen ions (H⁺) from the acid to form water and common salt, accompanied by heat evolution.',
  },

  // 2. Displacement Reaction
  {
    id: 'displacement_fe_cuso4',
    title: 'Single Displacement (Fe + CuSO₄)',
    type: 'Displacement / Redox',
    thermo: 'EXOTHERMIC',
    equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓',
    reactants: ['Fe', 'CuSO4'],
    products: ['FeSO4', 'Cu'],
    ncertNote: 'NCERT Class 10 Ch 1: Iron nail dipped in blue Copper Sulfate solution turns light green (Ferrous Sulfate) as Iron displaces reddish-brown Copper owing to higher reactivity.',
  },

  // 3. Double Displacement / Precipitation
  {
    id: 'precipitation_pb_no3_ki',
    title: 'Precipitation Reaction (Pb(NO₃)₂ + KI)',
    type: 'Double Displacement / Precipitation',
    thermo: 'ENDOTHERMIC',
    equation: 'Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq)',
    reactants: ['Pb(NO3)2', 'KI'],
    products: ['PbI2', 'KNO3'],
    ncertNote: 'NCERT Class 10 Ch 1 Activity 1.2: Mixing colorless solutions of Lead Nitrate and Potassium Iodide yields a vibrant yellow precipitate of Lead Iodide.',
  },

  // 4. Thermal Decomposition
  {
    id: 'decomposition_caco3',
    title: 'Thermal Decomposition of Limestone',
    type: 'Thermal Decomposition',
    thermo: 'ENDOTHERMIC',
    equation: 'CaCO₃(s) + Heat → CaO(s) + CO₂(g)↑',
    reactants: ['CaCO3'],
    products: ['CaO', 'CO2'],
    ncertNote: 'NCERT Class 10 Ch 1: Heating Calcium Carbonate breaks it down into Quicklime (CaO) and Carbon Dioxide gas. Used extensively in cement manufacturing.',
  },

  // 5. Combination / Slaking of Lime
  {
    id: 'combination_cao_h2o',
    title: 'Slaking of Quicklime (CaO + H₂O)',
    type: 'Combination / Exothermic',
    thermo: 'EXOTHERMIC',
    equation: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Enormous Heat',
    reactants: ['CaO', 'H2O'],
    products: ['Ca(OH)2'],
    ncertNote: 'NCERT Class 10 Ch 1: Quicklime combines vigorously with water to form Slaked Lime [Ca(OH)₂] releasing substantial heat with a hissing noise.',
  },

  // 6. Esterification
  {
    id: 'esterification_ethanoic_ethanol',
    title: 'Esterification (CH₃COOH + C₂H₅OH)',
    type: 'Esterification',
    thermo: 'ENDOTHERMIC',
    equation: 'CH₃COOH(l) + C₂H₅OH(l) ⇌ CH₃COOC₂H₅(l) + H₂O(l)',
    reactants: ['CH3COOH', 'C2H5OH'],
    products: ['CH3COOC2H5', 'H2O'],
    ncertNote: 'NCERT Class 10 Ch 4: Ethanoic acid reacts with Ethanol in presence of conc. H₂SO₄ catalyst to produce Ethyl Ethanoate, a sweet fruity-smelling ester.',
  },

  // 7. Hydrocarbon Combustion
  {
    id: 'combustion_ch4',
    title: 'Methane Combustion (CH₄ + O₂)',
    type: 'Combustion / Redox',
    thermo: 'EXOTHERMIC',
    equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g) + Energy',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    ncertNote: 'NCERT Class 10 Ch 4 & Class 11 Ch 13: Complete combustion of saturated hydrocarbons in excess oxygen yields carbon dioxide, water vapor, and luminous heat energy.',
  },

  // 8. Acid + Metal Reaction
  {
    id: 'acid_metal_zn_h2so4',
    title: 'Acid-Metal Reaction (Zn + H₂SO₄)',
    type: 'Single Displacement / Redox',
    thermo: 'EXOTHERMIC',
    equation: 'Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)↑',
    reactants: ['Zn', 'H2SO4'],
    products: ['ZnSO4', 'H2'],
    ncertNote: 'NCERT Class 10 Ch 2 Activity 2.3: Granulated Zinc reacts with dilute Sulfuric Acid to evolve Hydrogen gas, which burns with a characteristic pop sound.',
  },

  // 9. Chlor-Alkali Electrolysis
  {
    id: 'chlor_alkali_nacl_h2o',
    title: 'Chlor-Alkali Electrolysis (NaCl + H₂O)',
    type: 'Electrolytic Decomposition',
    thermo: 'ENDOTHERMIC',
    equation: '2NaCl(aq) + 2H₂O(l) + Elec → 2NaOH(aq) + Cl₂(g)↑ + H₂(g)↑',
    reactants: ['NaCl', 'H2O'],
    products: ['NaOH', 'Cl2', 'H2'],
    ncertNote: 'NCERT Class 10 Ch 2: Passing electricity through brine yields Caustic Soda (NaOH) at cathode, Chlorine gas at anode, and Hydrogen gas at cathode.',
  },
];
