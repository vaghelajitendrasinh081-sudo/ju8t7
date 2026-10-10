import { ELEMENTS_DATA } from '../data/elementsData';
import { PREMADE_COMPOUNDS } from '../data/compoundsData';

/**
 * Common Element Valency & Standard Ionic/Covalent Oxidation Charges
 */
const ELEMENT_VALENCY_MAP = {
  H: { valency: 1, charge: 1, type: 'nonmetal', name: 'Hydrogen' },
  He: { valency: 0, charge: 0, type: 'noble', name: 'Helium' },
  Li: { valency: 1, charge: 1, type: 'metal', name: 'Lithium' },
  Be: { valency: 2, charge: 2, type: 'metal', name: 'Beryllium' },
  B: { valency: 3, charge: 3, type: 'metalloid', name: 'Boron' },
  C: { valency: 4, charge: 4, type: 'nonmetal', name: 'Carbon' },
  N: { valency: 3, charge: -3, type: 'nonmetal', name: 'Nitrogen' },
  O: { valency: 2, charge: -2, type: 'nonmetal', name: 'Oxygen' },
  F: { valency: 1, charge: -1, type: 'nonmetal', name: 'Fluorine' },
  Ne: { valency: 0, charge: 0, type: 'noble', name: 'Neon' },
  Na: { valency: 1, charge: 1, type: 'metal', name: 'Sodium' },
  Mg: { valency: 2, charge: 2, type: 'metal', name: 'Magnesium' },
  Al: { valency: 3, charge: 3, type: 'metal', name: 'Aluminium' },
  Si: { valency: 4, charge: 4, type: 'metalloid', name: 'Silicon' },
  P: { valency: 3, charge: -3, type: 'nonmetal', name: 'Phosphorus' },
  S: { valency: 2, charge: -2, type: 'nonmetal', name: 'Sulfur' },
  Cl: { valency: 1, charge: -1, type: 'nonmetal', name: 'Chlorine' },
  Ar: { valency: 0, charge: 0, type: 'noble', name: 'Argon' },
  K: { valency: 1, charge: 1, type: 'metal', name: 'Potassium' },
  Ca: { valency: 2, charge: 2, type: 'metal', name: 'Calcium' },
  Fe: { valency: 2, charge: 2, type: 'metal', name: 'Iron' },
  Cu: { valency: 2, charge: 2, type: 'metal', name: 'Copper' },
  Zn: { valency: 2, charge: 2, type: 'metal', name: 'Zinc' },
  Br: { valency: 1, charge: -1, type: 'nonmetal', name: 'Bromine' },
  Kr: { valency: 0, charge: 0, type: 'noble', name: 'Krypton' },
  Ag: { valency: 1, charge: 1, type: 'metal', name: 'Silver' },
  I: { valency: 1, charge: -1, type: 'nonmetal', name: 'Iodine' },
  Xe: { valency: 0, charge: 0, type: 'noble', name: 'Xenon' },
  Ba: { valency: 2, charge: 2, type: 'metal', name: 'Barium' },
  Pb: { valency: 2, charge: 2, type: 'metal', name: 'Lead' }
};

/**
 * Format count as unicode subscript
 */
function toSubscript(num) {
  if (num <= 1) return '';
  const subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return String(num).split('').map((ch) => subscripts[ch] || ch).join('');
}

/**
 * Dynamically resolves selected atoms into a synthesized compound, validating valency rules.
 */
export function resolveCompoundFromAtoms(selectedAtoms) {
  if (!selectedAtoms || Object.keys(selectedAtoms).length === 0) return null;

  const entries = Object.entries(selectedAtoms).filter(([_, count]) => count > 0);
  if (entries.length === 0) return null;

  const symbols = entries.map(([sym]) => sym);

  // 1. Check for Noble Gases (Inert, unreactive)
  const hasNobleGas = symbols.some((sym) => {
    const el = ELEMENTS_DATA.find((e) => e.symbol === sym);
    return (el && el.category === 'Noble Gas') || ELEMENT_VALENCY_MAP[sym]?.type === 'noble';
  });

  if (hasNobleGas) {
    const nobleSymbol = symbols.find((sym) => ELEMENT_VALENCY_MAP[sym]?.type === 'noble' || ELEMENTS_DATA.find((e) => e.symbol === sym && e.category === 'Noble Gas'));
    return {
      success: false,
      message: `STABLE BOND UNABLE TO FORM — Noble Gas [${nobleSymbol}] possesses a completely filled valence electron shell and remains chemically inert under standard laboratory conditions.`
    };
  }

  // 2. Check if selection matches any Premade NCERT Preset (exact match)
  const exactPreset = PREMADE_COMPOUNDS.find((c) => {
    const cKeys = Object.keys(c.elements);
    if (cKeys.length !== entries.length) return false;
    return cKeys.every((k) => c.elements[k] === selectedAtoms[k]);
  });

  if (exactPreset) {
    return {
      success: true,
      compound: exactPreset
    };
  }

  // 3. Dynamic Stoichiometry & Valency Check
  let totalMass = 0;
  let metals = [];
  let nonmetals = [];

  for (const [sym, count] of entries) {
    const elData = ELEMENTS_DATA.find((e) => e.symbol === sym);
    const mass = elData ? elData.mass : 1.0;
    totalMass += mass * count;

    const valInfo = ELEMENT_VALENCY_MAP[sym] || {
      valency: 1,
      charge: 1,
      type: elData && elData.category.includes('Metal') ? 'metal' : 'nonmetal',
      name: elData ? elData.name : sym
    };

    if (valInfo.type === 'metal' || (elData && elData.category.includes('Metal'))) {
      metals.push({ symbol: sym, count, valency: valInfo.valency, charge: Math.abs(valInfo.charge), name: valInfo.name });
    } else {
      nonmetals.push({ symbol: sym, count, valency: valInfo.valency, charge: Math.abs(valInfo.charge), name: valInfo.name });
    }
  }

  // Determine Bond Classification
  let bondType = 'Covalent';
  if (metals.length > 0 && nonmetals.length > 0) {
    bondType = 'Ionic (Electrovalent)';
  } else if (metals.length > 0 && nonmetals.length === 0) {
    bondType = 'Metallic Bond / Intermetallic Lattice';
  } else {
    bondType = 'Covalent (Shared Electron Pair)';
  }

  // Validate Valency / Charge Balance
  let isValidBond = false;

  if (entries.length === 1) {
    // Single element molecule (e.g. O2, N2, H2, Cl2)
    const [sym, count] = entries[0];
    if (count === 2 && ['H', 'O', 'N', 'F', 'Cl', 'Br', 'I'].includes(sym)) {
      isValidBond = true;
    } else if (count === 8 && sym === 'S') {
      isValidBond = true;
    } else if (count === 4 && sym === 'P') {
      isValidBond = true;
    }
  } else if (metals.length > 0 && nonmetals.length > 0) {
    // Binary or polyatomic ionic compound: Check total positive charge vs total negative charge
    const posCharge = metals.reduce((acc, m) => acc + m.count * m.charge, 0);
    const negCharge = nonmetals.reduce((acc, n) => acc + n.count * n.charge, 0);

    if (posCharge === negCharge || Math.abs(posCharge - negCharge) === 0) {
      isValidBond = true;
    } else {
      // Check if ratio of valencies matches inverse ratio of counts
      const totalMetalValency = metals.reduce((acc, m) => acc + m.count * m.valency, 0);
      const totalNonmetalValency = nonmetals.reduce((acc, n) => acc + n.count * n.valency, 0);
      isValidBond = totalMetalValency === totalNonmetalValency;
    }
  } else if (nonmetals.length > 1) {
    // Covalent compound (e.g. H2O, NH3, CH4, CO2, SO2, PCl3)
    const centralAtom = nonmetals.reduce((max, curr) => (curr.valency > max.valency ? curr : max), nonmetals[0]);
    const surroundingAtoms = nonmetals.filter((a) => a !== centralAtom);
    const requiredValency = centralAtom.count * centralAtom.valency;
    const providedValency = surroundingAtoms.reduce((acc, a) => acc + a.count * a.valency, 0);

    isValidBond = requiredValency === providedValency || Math.abs(requiredValency - providedValency) === 0;
  }

  if (!isValidBond) {
    const formulaSummary = entries.map(([sym, count]) => `${sym}${count}`).join('');
    return {
      success: false,
      message: `STABLE BOND UNABLE TO FORM — The stoichiometric combination ${formulaSummary} does not satisfy standard valency or electron octet sharing rules under ambient conditions.`
    };
  }

  // Construct Chemical Formula String
  // Put metals first, then nonmetals
  const orderedEntries = [
    ...metals.map((m) => [m.symbol, m.count]),
    ...nonmetals.map((n) => [n.symbol, n.count])
  ];

  if (orderedEntries.length === 0) {
    orderedEntries.push(...entries);
  }

  const formulaStr = orderedEntries.map(([sym, count]) => `${sym}${toSubscript(count)}`).join('');

  // Generate Compound IUPAC & Common Name
  let compoundName = '';
  if (metals.length === 1 && nonmetals.length === 1) {
    const mName = metals[0].name;
    let nName = nonmetals[0].name;
    if (nName === 'Chlorine') nName = 'Chloride';
    else if (nName === 'Oxygen') nName = 'Oxide';
    else if (nName === 'Fluorine') nName = 'Fluoride';
    else if (nName === 'Bromine') nName = 'Bromide';
    else if (nName === 'Iodine') nName = 'Iodide';
    else if (nName === 'Sulfur') nName = 'Sulfide';
    else if (nName === 'Nitrogen') nName = 'Nitride';

    compoundName = `${mName} ${nName}`;
  } else if (entries.length === 1 && entries[0][1] === 2) {
    compoundName = `Diatomic ${ELEMENT_VALENCY_MAP[entries[0][0]]?.name || entries[0][0]}`;
  } else {
    const names = orderedEntries.map(([sym]) => ELEMENT_VALENCY_MAP[sym]?.name || sym);
    compoundName = `${names.join('-')} Compound`;
  }

  // Grade classification
  const grade = totalMass > 100 || entries.length > 2 ? 'Class 11' : 'Class 10';

  // NCERT Concept Note
  const ncertNote = `NCERT ${grade} Chemistry: Dynamic compound ${formulaStr} (${compoundName}) with molecular weight ${totalMass.toFixed(2)} g/mol. Formed via ${bondType.toLowerCase()} bonding satisfying valency balance.`;

  return {
    success: true,
    compound: {
      id: `dynamic_${formulaStr}`,
      formula: formulaStr,
      name: compoundName,
      grade,
      weight: parseFloat(totalMass.toFixed(3)),
      bondType,
      elements: selectedAtoms,
      ncertNote
    }
  };
}
