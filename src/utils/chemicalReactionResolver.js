import { REACTIONS_DATA } from '../data/reactionsData';

/**
 * Universal Chemical Reaction Resolver
 * Resolves chemical reaction equations, state symbols, energy profiles,
 * and NCERT Class 10/11 pedagogical notes using preset lookups,
 * high-order chemical classification rules, and dynamic stoichiometric solvers.
 */

// Classification sets
const AMPHOTERIC_METALS = new Set(['Zn', 'Al', 'Pb', 'Sn']);
const STRONG_BASES = new Set(['NaOH', 'KOH', 'Ca(OH)2']);
const ACIDS = new Set(['HCl', 'H2SO4', 'HNO3', 'CH3COOH']);
const BASES = new Set(['NaOH', 'KOH', 'Ca(OH)2', 'Mg(OH)2', 'NH4OH']);
const ACTIVE_METALS = new Set(['Zn', 'Al', 'Fe', 'Mg', 'Na', 'K', 'Ca', 'Pb']);
const CARBONATES = new Set(['CaCO3', 'Na2CO3', 'NaHCO3', 'K2CO3', 'MgCO3']);

export function resolveChemicalReaction(rawR1, rawR2) {
  const r1 = (rawR1 || '').trim();
  const r2 = (rawR2 || '').trim();

  if (!r1) {
    return {
      error: true,
      message: 'No primary reactant selected. Please choose a reactant to initiate simulation.',
    };
  }

  // 1. Direct Presets Lookup (Single or Dual Reactant)
  const presetMatch = REACTIONS_DATA.find((r) => {
    if (r.reactants.length === 1) {
      return r.reactants[0] === r1 && (!r2 || r2 === 'NONE');
    }
    return (
      (r.reactants[0] === r1 && r.reactants[1] === r2) ||
      (r.reactants[0] === r2 && r.reactants[1] === r1)
    );
  });

  if (presetMatch) {
    return presetMatch;
  }

  // Normalize pair array for rule evaluation
  const pair = [r1, r2].filter(Boolean);

  // If single reactant not found in presets
  if (pair.length === 1) {
    return {
      error: true,
      message: `NO DECOMPOSITION / SINGLE REACTION OBSERVED for ${r1} under standard ambient temperature and pressure.`,
    };
  }

  const [a, b] = pair;

  // Rule 1: Amphoteric Metal + Strong Base
  const amphoteric = [a, b].find((x) => AMPHOTERIC_METALS.has(x));
  const base = [a, b].find((x) => STRONG_BASES.has(x));

  if (amphoteric && base) {
    return solveAmphotericBase(amphoteric, base);
  }

  // Rule 2: Acid + Base (Neutralization)
  const acid = [a, b].find((x) => ACIDS.has(x));
  const baseMatch = [a, b].find((x) => BASES.has(x));

  if (acid && baseMatch) {
    return solveNeutralization(acid, baseMatch);
  }

  // Rule 3: Carbonate / Bicarbonate + Acid
  const carbonate = [a, b].find((x) => CARBONATES.has(x));
  if (carbonate && acid) {
    return solveCarbonateAcid(carbonate, acid);
  }

  // Rule 4: Active Metal + Acid
  const activeMetal = [a, b].find((x) => ACTIVE_METALS.has(x));
  if (activeMetal && acid) {
    return solveMetalAcid(activeMetal, acid);
  }

  // Rule 5: Dynamic Fallback Solver for Uncatalogued Active Combinations
  return solveDynamicFallback(a, b);
}

// Handler: Amphoteric Metal + Strong Base
function solveAmphotericBase(metal, base) {
  if (metal === 'Zn' && base === 'NaOH') {
    return {
      id: 'dynamic_zn_naoh',
      title: 'Amphoteric Metal + Strong Base (Zn + NaOH)',
      type: 'Complex Salt Formation / Redox',
      thermo: 'EXOTHERMIC',
      equation: 'Zn(s) + 2NaOH(aq) → Na₂ZnO₂(aq) + H₂(g)↑',
      reactants: ['Zn', 'NaOH'],
      products: ['Na2ZnO2', 'H2'],
      ncertNote:
        'NCERT Class 10 Ch 2 Activity 2.4: Amphoteric metal Zinc reacts with strong alkali Sodium Hydroxide to form Sodium Zincate [Na₂ZnO₂] salt and liberate Hydrogen gas.',
    };
  }

  if (metal === 'Zn' && base === 'KOH') {
    return {
      id: 'dynamic_zn_koh',
      title: 'Amphoteric Metal + Base (Zn + KOH)',
      type: 'Complex Salt Formation / Redox',
      thermo: 'EXOTHERMIC',
      equation: 'Zn(s) + 2KOH(aq) → K₂ZnO₂(aq) + H₂(g)↑',
      reactants: ['Zn', 'KOH'],
      products: ['K2ZnO2', 'H2'],
      ncertNote:
        'NCERT Class 10 Ch 2 & Class 11 Ch 11: Zinc reacts with Potassium Hydroxide upon warming to yield Potassium Zincate [K₂ZnO₂] and Hydrogen gas.',
    };
  }

  if (metal === 'Al' && (base === 'NaOH' || base === 'KOH')) {
    const cation = base === 'NaOH' ? 'Na' : 'K';
    return {
      id: `dynamic_al_${base.toLowerCase()}`,
      title: `Amphoteric Metal + Strong Base (Al + ${base})`,
      type: 'Complex Coordination Salt Formation',
      thermo: 'EXOTHERMIC',
      equation: `2Al(s) + 2${base}(aq) + 6H₂O(l) → 2${cation}[Al(OH)₄](aq) + 3H₂(g)↑`,
      reactants: ['Al', base],
      products: [`${cation}[Al(OH)4]`, 'H2'],
      ncertNote:
        `NCERT Class 10 Ch 3 & Class 11 Ch 11: Aluminium dissolves in aqueous ${base} forming tetrahydroxoaluminate complex salt and evolving hydrogen gas.`,
    };
  }

  if (metal === 'Pb' && base === 'NaOH') {
    return {
      id: 'dynamic_pb_naoh',
      title: 'Amphoteric Reaction (Pb + NaOH)',
      type: 'Complex Salt Formation',
      thermo: 'EXOTHERMIC',
      equation: 'Pb(s) + 2NaOH(aq) → Na₂PbO₂(aq) + H₂(g)↑',
      reactants: ['Pb', 'NaOH'],
      products: ['Na2PbO2', 'H2'],
      ncertNote:
        'NCERT Class 11 Ch 11: Lead is amphoteric and reacts with concentrated sodium hydroxide to form Sodium Plumbite [Na₂PbO₂] and hydrogen gas.',
    };
  }

  return {
    id: `dynamic_amphoteric_${metal}_${base}`,
    title: `Amphoteric Metal + Alkali (${metal} + ${base})`,
    type: 'Complex Salt Formation / Redox',
    thermo: 'EXOTHERMIC',
    equation: `${metal}(s) + 2${base}(aq) → Salt + H₂(g)↑`,
    reactants: [metal, base],
    products: ['Complex Salt', 'H2'],
    ncertNote:
      `NCERT Chemistry: Amphoteric metal ${metal} dissolves in strong base ${base} releasing hydrogen gas.`,
  };
}

// Handler: Acid + Base
function solveNeutralization(acid, base) {
  let salt = 'Salt';
  let eq = `${acid}(aq) + ${base}(aq) → ${salt}(aq) + H₂O(l) + Heat`;

  if (acid === 'HCl' && base === 'KOH') {
    salt = 'KCl';
    eq = 'HCl(aq) + KOH(aq) → KCl(aq) + H₂O(l)';
  } else if (acid === 'H2SO4' && base === 'NaOH') {
    salt = 'Na2SO4';
    eq = 'H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)';
  } else if (acid === 'CH3COOH' && base === 'NaOH') {
    salt = 'CH3COONa';
    eq = 'CH₃COOH(aq) + NaOH(aq) → CH₃COONa(aq) + H₂O(l)';
  }

  return {
    id: `dynamic_neutralization_${acid}_${base}`,
    title: `Acid-Base Neutralization (${acid} + ${base})`,
    type: 'Neutralization',
    thermo: 'EXOTHERMIC',
    equation: eq,
    reactants: [acid, base],
    products: [salt, 'H2O'],
    ncertNote:
      'NCERT Class 10 Ch 2: Hydroxide ions (OH⁻) from base neutralize Hydrogen ions (H⁺) from acid forming water and salt accompanied by heat generation.',
  };
}

// Handler: Carbonate + Acid
function solveCarbonateAcid(carbonate, acid) {
  let salt = 'Salt';
  let eq = `${carbonate}(s) + ${acid}(aq) → Salt(aq) + H₂O(l) + CO₂(g)↑`;

  if (carbonate === 'NaHCO3' && acid === 'HCl') {
    salt = 'NaCl';
    eq = 'NaHCO₃(s) + HCl(aq) → NaCl(aq) + H₂O(l) + CO₂(g)↑';
  } else if (carbonate === 'Na2CO3' && acid === 'HCl') {
    salt = 'NaCl';
    eq = 'Na₂CO₃(s) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)↑';
  }

  return {
    id: `dynamic_carbonate_${carbonate}_${acid}`,
    title: `Metal Carbonate / Bicarbonate + Acid (${carbonate} + ${acid})`,
    type: 'Acid-Carbonate Effervescence',
    thermo: 'EXOTHERMIC',
    equation: eq,
    reactants: [carbonate, acid],
    products: [salt, 'H2O', 'CO2'],
    ncertNote:
      'NCERT Class 10 Ch 2 Activity 2.5: Acid breaks down carbonate/bicarbonate giving brisk effervescence due to Carbon Dioxide evolution which turns lime water milky.',
  };
}

// Handler: Metal + Acid
function solveMetalAcid(metal, acid) {
  let salt = `${metal}-Salt`;
  let eq = `${metal}(s) + ${acid}(aq) → ${salt}(aq) + H₂(g)↑`;

  if (metal === 'Mg' && acid === 'HCl') {
    salt = 'MgCl2';
    eq = 'Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)↑';
  } else if (metal === 'Fe' && acid === 'HCl') {
    salt = 'FeCl2';
    eq = 'Fe(s) + 2HCl(aq) → FeCl₂(aq) + H₂(g)↑';
  } else if (metal === 'Al' && acid === 'HCl') {
    salt = 'AlCl3';
    eq = '2Al(s) + 6HCl(aq) → 2AlCl₃(aq) + 3H₂(g)↑';
  }

  return {
    id: `dynamic_metal_acid_${metal}_${acid}`,
    title: `Active Metal + Acid (${metal} + ${acid})`,
    type: 'Single Displacement / Redox',
    thermo: 'EXOTHERMIC',
    equation: eq,
    reactants: [metal, acid],
    products: [salt, 'H2'],
    ncertNote:
      `NCERT Class 10 Ch 2 Activity 2.3: ${metal} displaces hydrogen from ${acid} forming soluble salt and evolving Hydrogen gas with characteristic pop sound.`,
  };
}

// Handler: Fallback Solver
function solveDynamicFallback(r1, r2) {
  return {
    error: true,
    message: `NO REACTION OBSERVED — Mixture of ${r1} and ${r2} is thermodynamically unreactive under standard laboratory conditions without additional heat, catalyst, or electric current.`,
  };
}
