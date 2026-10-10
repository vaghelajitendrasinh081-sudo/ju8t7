export const REACTIONS_DATA = [
  // 1. Amphoteric Metal + Strong Base (Zn + NaOH)
  {
    id: 'amphoteric_zn_naoh',
    title: 'Amphoteric Reaction (Zn + 2NaOH)',
    type: 'Complex Salt Formation / Redox',
    thermo: 'EXOTHERMIC',
    equation: 'Zn(s) + 2NaOH(aq) → Na₂ZnO₂(aq) + H₂(g)↑',
    reactants: ['Zn', 'NaOH'],
    products: ['Na2ZnO2', 'H2'],
    ncertNote: 'NCERT Class 10 Ch 2 Activity 2.4: Active amphoteric metals like Zinc react with strong alkalies (Sodium Hydroxide) upon heating to form Sodium Zincate salt and evolve Hydrogen gas.',
  },

  // 2. Amphoteric Metal + Strong Base (Al + NaOH)
  {
    id: 'amphoteric_al_naoh',
    title: 'Amphoteric Reaction (2Al + 2NaOH + 6H₂O)',
    type: 'Complex Salt Formation / Redox',
    thermo: 'EXOTHERMIC',
    equation: '2Al(s) + 2NaOH(aq) + 6H₂O(l) → 2Na[Al(OH)₄](aq) + 3H₂(g)↑',
    reactants: ['Al', 'NaOH'],
    products: ['Na[Al(OH)4]', 'H2'],
    ncertNote: 'NCERT Class 10 Ch 3 & Class 11 Ch 11: Aluminium metal dissolves in aqueous Sodium Hydroxide to form Sodium Tetrahydroxoaluminate(III) and liberate Hydrogen gas.',
  },

  // 3. Acid-Base Neutralization
  {
    id: 'neutralization_naoh_hcl',
    title: 'Acid-Base Neutralization (NaOH + HCl)',
    type: 'Neutralization',
    thermo: 'EXOTHERMIC',
    equation: 'NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l) + Heat',
    reactants: ['NaOH', 'HCl'],
    products: ['NaCl', 'H2O'],
    ncertNote: 'NCERT Class 10 Ch 2: Hydroxide ions (OH⁻) from the base react with Hydrogen ions (H⁺) from the acid to form water and common salt, accompanied by heat evolution.',
  },

  // 4. Single Displacement (Fe + CuSO4)
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

  // 5. Precipitation (Pb(NO3)2 + KI)
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

  // 6. Thermal Decomposition
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

  // 7. Combination / Slaking of Lime
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

  // 8. Carbonate + Acid Reaction
  {
    id: 'carbonate_acid_caco3_hcl',
    title: 'Metal Carbonate + Acid (CaCO₃ + 2HCl)',
    type: 'Acid-Carbonate / Gas Evolution',
    thermo: 'EXOTHERMIC',
    equation: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑',
    reactants: ['CaCO3', 'HCl'],
    products: ['CaCl2', 'H2O', 'CO2'],
    ncertNote: 'NCERT Class 10 Ch 2 Activity 2.5: Metal carbonates react with acids to produce salt, water, and Carbon Dioxide gas that turns lime water milky.',
  },

  // 9. Esterification
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

  // 10. Hydrocarbon Combustion
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

  // 11. Acid + Metal Reaction
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

  // 12. Chlor-Alkali Electrolysis
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
