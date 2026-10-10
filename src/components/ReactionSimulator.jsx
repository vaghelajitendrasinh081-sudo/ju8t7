import React, { useState } from 'react';
import { REACTIONS_DATA } from '../data/reactionsData';
import { PREMADE_COMPOUNDS } from '../data/compoundsData';
import { ELEMENTS_DATA } from '../data/elementsData';
import { soundFX } from '../utils/sound';
import {
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
  Beaker,
  BookOpen,
  ArrowRight,
  Activity
} from 'lucide-react';

export function ReactionSimulator() {
  const [reactant1, setReactant1] = useState('');
  const [reactant2, setReactant2] = useState('');
  const [activeReaction, setActiveReaction] = useState(null);

  // Available Reactants list from compounds and key elements
  const availableReactants = [
    { id: 'NaOH', label: 'NaOH (Sodium Hydroxide)', formula: 'NaOH' },
    { id: 'HCl', label: 'HCl (Hydrochloric Acid)', formula: 'HCl' },
    { id: 'Fe', label: 'Fe (Iron Metal)', formula: 'Fe' },
    { id: 'CuSO4', label: 'CuSO₄ (Copper Sulfate)', formula: 'CuSO4' },
    { id: 'Pb(NO3)2', label: 'Pb(NO₃)₂ (Lead Nitrate)', formula: 'Pb(NO3)2' },
    { id: 'KI', label: 'KI (Potassium Iodide)', formula: 'KI' },
    { id: 'CaCO3', label: 'CaCO₃ (Calcium Carbonate)', formula: 'CaCO3' },
    { id: 'CaO', label: 'CaO (Quicklime)', formula: 'CaO' },
    { id: 'H2O', label: 'H₂O (Water)', formula: 'H2O' },
    { id: 'CH3COOH', label: 'CH₃COOH (Acetic Acid)', formula: 'CH3COOH' },
    { id: 'C2H5OH', label: 'C₂H₅OH (Ethanol)', formula: 'C2H5OH' },
    { id: 'CH4', label: 'CH₄ (Methane)', formula: 'CH4' },
    { id: 'O2', label: 'O₂ (Oxygen Gas)', formula: 'O2' },
    { id: 'Zn', label: 'Zn (Zinc Metal)', formula: 'Zn' },
    { id: 'H2SO4', label: 'H₂SO₄ (Sulfuric Acid)', formula: 'H2SO4' },
    { id: 'NaCl', label: 'NaCl (Sodium Chloride / Brine)', formula: 'NaCl' },
  ];

  const handleSelectPreset = (reaction) => {
    soundFX.playClick();
    setReactant1(reaction.reactants[0] || '');
    setReactant2(reaction.reactants[1] || '');
    setActiveReaction(reaction);
    soundFX.playSuccess();
  };

  const handleTriggerReaction = () => {
    soundFX.playClick();
    if (!reactant1) return;

    // Match selected reactants against reaction database
    const match = REACTIONS_DATA.find((r) => {
      if (r.reactants.length === 1) {
        return r.reactants[0] === reactant1 && (!reactant2 || reactant2 === 'NONE');
      }
      return (
        (r.reactants[0] === reactant1 && r.reactants[1] === reactant2) ||
        (r.reactants[0] === reactant2 && r.reactants[1] === reactant1)
      );
    });

    if (match) {
      soundFX.playSuccess();
      setActiveReaction(match);
    } else {
      setActiveReaction({
        error: true,
        message: 'NO REACTION OBSERVED — Reactants are unreactive or require missing catalyst/energy conditions under standard laboratory settings.',
      });
    }
  };

  const handleReset = () => {
    soundFX.playClick();
    setReactant1('');
    setReactant2('');
    setActiveReaction(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] font-mono-tech space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce-short" />
            REACTION SIMULATOR &amp; BALANCED EQUATION ENGINE
          </div>
          <h2 className="font-orbitron font-extrabold text-xl text-white mt-1">
            CHEMICAL REACTION CHAMBER
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select reactants or choose pre-configured NCERT Class 10 &amp; 11 reactions to simulate thermal energy profiles.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET CHAMBER
        </button>
      </div>

      {/* Quick Pre-configured NCERT Reactions Menu */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          NCERT CLASS 10 &amp; 11 FUNDAMENTAL REACTION PRESETS:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {REACTIONS_DATA.map((r) => {
            const isSelected = activeReaction && activeReaction.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectPreset(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                <span>{r.title}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${r.thermo === 'EXOTHERMIC' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-300'}`}>
                  {r.thermo}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reactants Selectors & Reaction Trigger */}
      <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
        <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          SELECT REACTANTS:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Reactant 1 Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">PRIMARY REACTANT / COMPOUND A:</label>
            <select
              value={reactant1}
              onChange={(e) => setReactant1(e.target.value)}
              className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="" disabled className="text-slate-500">-- SELECT REACTANT A --</option>
              {availableReactants.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-cyan-300">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reactant 2 Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">SECONDARY REACTANT / COMPOUND B (OPTIONAL):</label>
            <select
              value={reactant2}
              onChange={(e) => setReactant2(e.target.value)}
              className="w-full bg-slate-900 border border-purple-500/30 rounded-lg p-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              <option value="" className="text-slate-500">-- NONE (SINGLE COMPOUND DECOMPOSITION) --</option>
              {availableReactants.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-purple-300">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        <button
          onClick={handleTriggerReaction}
          disabled={!reactant1}
          className={`w-full py-2.5 rounded-lg font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            reactant1
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Flame className="w-4 h-4" /> EXECUTE REACTION SIMULATION
        </button>
      </div>

      {/* Reaction Telemetry HUD Output */}
      {activeReaction && (
        <div className="animate-fadeIn">
          {activeReaction.error ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-400 uppercase tracking-wider">
                  INERT MIXTURE DETECTED
                </div>
                <div className="text-slate-300 mt-0.5">{activeReaction.message}</div>
              </div>
            </div>
          ) : (
            <div
              className={`relative p-6 rounded-xl bg-slate-950 border overflow-hidden space-y-4 ${
                activeReaction.thermo === 'EXOTHERMIC'
                  ? 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                  : 'border-cyan-500/60 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
              }`}
            >
              {/* Sci-Fi Energy Particle Haze Glow Background */}
              <div
                className={`absolute inset-0 pointer-events-none opacity-20 ${
                  activeReaction.thermo === 'EXOTHERMIC'
                    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-orange-600 to-transparent'
                    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-blue-600 to-transparent'
                }`}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="font-orbitron font-extrabold text-base text-white">
                    {activeReaction.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    {activeReaction.type}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-bold border ${
                      activeReaction.thermo === 'EXOTHERMIC'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}
                  >
                    {activeReaction.thermo} ENERGY PROFILE
                  </span>
                </div>
              </div>

              {/* Balanced Chemical Equation Display */}
              <div className="relative z-10 p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  BALANCED CHEMICAL EQUATION WITH STATE SYMBOLS:
                </div>
                <div className="font-orbitron font-extrabold text-lg text-cyan-300 tracking-wide">
                  {activeReaction.equation}
                </div>
              </div>

              {/* NCERT Concept Note */}
              <div className="relative z-10 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400 block mb-1">NCERT REACTION TELEMETRY:</strong>
                {activeReaction.ncertNote}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
