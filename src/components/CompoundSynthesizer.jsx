import React, { useState } from 'react';
import { ELEMENTS_DATA } from '../data/elementsData';
import { PREMADE_COMPOUNDS } from '../data/compoundsData';
import { resolveCompoundFromAtoms } from '../utils/compoundResolver';
import { soundFX } from '../utils/sound';
import {
  Beaker,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Layers,
  Zap
} from 'lucide-react';

export function CompoundSynthesizer() {
  const [selectedAtoms, setSelectedAtoms] = useState({}); // { 'H': 2, 'O': 1 }
  const [activePreset, setActivePreset] = useState(null);
  const [synthesisResult, setSynthesisResult] = useState(null);

  // Add atom quantity
  const handleAddAtom = (symbol) => {
    soundFX.playClick();
    setSelectedAtoms((prev) => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1,
    }));
    setActivePreset(null);
    setSynthesisResult(null);
  };

  // Remove / decrement atom quantity
  const handleRemoveAtom = (symbol) => {
    soundFX.playClick();
    setSelectedAtoms((prev) => {
      const next = { ...prev };
      if (next[symbol] > 1) {
        next[symbol] -= 1;
      } else {
        delete next[symbol];
      }
      return next;
    });
    setActivePreset(null);
    setSynthesisResult(null);
  };

  // Clear builder
  const handleClear = () => {
    soundFX.playClick();
    setSelectedAtoms({});
    setActivePreset(null);
    setSynthesisResult(null);
  };

  // Apply Pre-Made Preset
  const handleApplyPreset = (preset) => {
    soundFX.playClick();
    setSelectedAtoms(preset.elements);
    setActivePreset(preset.id);
    setSynthesisResult({
      success: true,
      compound: preset,
    });
  };

  // Synthesize / Check Combination with Dynamic Valency Resolver
  const handleSynthesize = () => {
    soundFX.playClick();
    const symbols = Object.keys(selectedAtoms);
    if (symbols.length === 0) return;

    const res = resolveCompoundFromAtoms(selectedAtoms);
    if (res && res.success) {
      soundFX.playSuccess();
      setSynthesisResult({
        success: true,
        compound: res.compound,
      });
    } else {
      setSynthesisResult({
        success: false,
        message: res ? res.message : 'STABLE BOND UNABLE TO FORM — Inert or non-reactive combination under standard temperature and pressure conditions.',
      });
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] font-mono-tech space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Beaker className="w-4 h-4 text-cyan-400" />
            DYNAMIC ELEMENT FUSION &amp; SYNTHESIS LAB
          </div>
          <h2 className="font-orbitron font-extrabold text-xl text-white mt-1">
            COMPOUND CREATION MATRIX
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select element ratios to dynamically synthesize chemical bonds or choose Class 10th &amp; 11th NCERT presets.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET BUILDER
        </button>
      </div>

      {/* Pre-Made Class 10 & 11 Presets Section */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          NCERT CLASS 10 &amp; 11 PRE-MADE COMPOUND PRESETS:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PREMADE_COMPOUNDS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300'
                }`}
              >
                <span className="font-orbitron font-extrabold text-cyan-400">{p.formula}</span>
                <span className="text-[10px] text-slate-400">({p.name})</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded ${p.grade === 'Class 10' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                  {p.grade}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Element Picker & Formula Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column: Quick Element Adders */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            SELECT ATOMS TO ADD:
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {ELEMENTS_DATA.slice(0, 36).map((el) => (
              <button
                key={el.number}
                onClick={() => handleAddAtom(el.symbol)}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all"
              >
                <div className="text-[10px] text-slate-400">#{el.number}</div>
                <div className="font-orbitron font-bold text-sm text-cyan-300">{el.symbol}</div>
                <div className="text-[9px] text-slate-400 truncate">{el.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Formula Workbench */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
          <div className="text-xs font-bold text-purple-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            CURRENT MOLECULAR RECIPE:
          </div>

          {Object.keys(selectedAtoms).length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No atoms selected yet. Click elements above or select a preset to start building!
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(selectedAtoms).map(([symbol, count]) => (
                  <div
                    key={symbol}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400 text-slate-100"
                  >
                    <span className="font-orbitron font-bold text-cyan-300 text-sm">{symbol}</span>
                    <span className="text-xs font-bold text-purple-300">× {count}</span>
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={() => handleAddAtom(symbol)}
                        className="p-0.5 hover:bg-cyan-500/30 rounded text-cyan-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveAtom(symbol)}
                        className="p-0.5 hover:bg-rose-500/30 rounded text-rose-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSynthesize}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-orbitron font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> SYNTHESIZE COMPOUND &amp; CALCULATE BOND
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Synthesis Result HUD */}
      {synthesisResult && (
        <div className="animate-fadeIn">
          {synthesisResult.success ? (
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle className="w-5 h-5" />
                  STABLE MOLECULAR BOND SYNTHESIZED SUCCESSFULLY
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  {synthesisResult.compound.grade} NCERT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-emerald-500/20 pt-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">BALANCED COMPOUND FORMULA &amp; NAME</div>
                  <div className="font-orbitron font-extrabold text-xl text-cyan-300 mt-0.5">
                    {synthesisResult.compound.formula}
                  </div>
                  <div className="text-slate-200 font-bold">{synthesisResult.compound.name}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">MOLECULAR MASS</div>
                  <div className="text-amber-300 font-bold text-sm mt-1">
                    {synthesisResult.compound.weight} g/mol (u)
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">PRIMARY BOND TYPE</div>
                  <div className="text-purple-300 font-bold text-sm mt-1">
                    {synthesisResult.compound.bondType}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 block mb-1">NCERT CONCEPT TELEMETRY:</strong>
                {synthesisResult.compound.ncertNote}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-400 uppercase tracking-wider">
                  UNSTABLE COMBINATION DETECTED
                </div>
                <div className="text-slate-300 mt-0.5">{synthesisResult.message}</div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
