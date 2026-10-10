import React, { useState } from 'react';
import { ELEMENTS_DATA } from '../data/elementsData';
import { AtomicOrbitCanvas } from './AtomicOrbitCanvas';
import { CompoundSynthesizer } from './CompoundSynthesizer';
import { ReactionSimulator } from './ReactionSimulator';
import { PhysicsLabModule } from './physics/PhysicsLabModule';
import {
  FlaskConical,
  Atom,
  Lock,
  Search,
  X,
  ChevronDown,
  Layers,
  Cpu,
  Activity,
  Zap,
  Beaker,
  Sparkles,
  Flame
} from 'lucide-react';
import { soundFX } from '../utils/sound';

export function CyberPracticalsModule() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeSubject, setActiveSubject] = useState('CHEMISTRY');
  const [chemistryTab, setChemistryTab] = useState('COMPOUNDS'); // 'COMPOUNDS' | 'REACTIONS'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Category Color Map for Neon Glow Aesthetics
  const categoryGlowMap = {
    'Alkali Metal': {
      bg: 'bg-amber-950/40 hover:bg-amber-900/60',
      border: 'border-amber-500/40 hover:border-amber-400',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    'Alkaline Earth Metal': {
      bg: 'bg-yellow-950/40 hover:bg-yellow-900/60',
      border: 'border-yellow-500/40 hover:border-yellow-400',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_12px_rgba(234,179,8,0.25)]',
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    },
    'Transition Metal': {
      bg: 'bg-pink-950/40 hover:bg-pink-900/60',
      border: 'border-pink-500/40 hover:border-pink-400',
      text: 'text-pink-400',
      glow: 'shadow-[0_0_12px_rgba(236,72,153,0.25)]',
      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    },
    'Post-Transition Metal': {
      bg: 'bg-emerald-950/40 hover:bg-emerald-900/60',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    'Metalloid': {
      bg: 'bg-teal-950/40 hover:bg-teal-900/60',
      border: 'border-teal-500/40 hover:border-teal-400',
      text: 'text-teal-300',
      glow: 'shadow-[0_0_12px_rgba(20,184,166,0.25)]',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    },
    'Nonmetal': {
      bg: 'bg-cyan-950/40 hover:bg-cyan-900/60',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_12px_rgba(0,240,255,0.25)]',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    'Halogen': {
      bg: 'bg-blue-950/40 hover:bg-blue-900/60',
      border: 'border-blue-500/40 hover:border-blue-400',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    'Noble Gas': {
      bg: 'bg-purple-950/40 hover:bg-purple-900/60',
      border: 'border-purple-500/40 hover:border-purple-400',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.25)]',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    'Lanthanide': {
      bg: 'bg-indigo-950/40 hover:bg-indigo-900/60',
      border: 'border-indigo-500/40 hover:border-indigo-400',
      text: 'text-indigo-400',
      glow: 'shadow-[0_0_12px_rgba(99,102,241,0.25)]',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    'Actinide': {
      bg: 'bg-rose-950/40 hover:bg-rose-900/60',
      border: 'border-rose-500/40 hover:border-rose-400',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
  };

  const getStyle = (cat) => categoryGlowMap[cat] || categoryGlowMap['Nonmetal'];

  // Filter Elements
  const filteredElements = ELEMENTS_DATA.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(el.number).includes(searchQuery);
    const matchesCategory = categoryFilter === 'ALL' || el.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'ALL',
    'Nonmetal',
    'Noble Gas',
    'Alkali Metal',
    'Alkaline Earth Metal',
    'Metalloid',
    'Halogen',
    'Transition Metal',
    'Post-Transition Metal',
    'Lanthanide',
    'Actinide',
  ];

  const handleElementClick = (el) => {
    soundFX.playClick();
    setSelectedElement(el);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-mono-tech space-y-8" id="practicals-console">

      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 animate-spin" />
              SUDARSHAN // LABORATORY SIMULATOR
            </div>
            <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl text-white mt-1 tracking-wide">
              CYBER-PRACTICALS &amp; VIRTUAL LAB
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Interactive 3D atomic orbital configurations, 118-element periodic table, compound creation matrix, and chemical reaction engine.
            </p>
          </div>

          {/* Quick Dropdown Direct Selector for 118 Elements */}
          <div className="w-full md:w-auto flex items-center gap-2 bg-slate-950 border border-cyan-500/40 rounded-xl p-2.5">
            <Atom className="w-5 h-5 text-cyan-400 shrink-0" />
            <select
              value={selectedElement ? selectedElement.number : ''}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                const el = ELEMENTS_DATA.find((item) => item.number === num);
                if (el) handleElementClick(el);
              }}
              className="bg-transparent text-xs text-slate-100 font-bold focus:outline-none cursor-pointer w-full md:w-64"
            >
              <option value="" disabled className="bg-slate-900 text-slate-400">
                -- QUICK 3D ATOM SELECTOR (1-118) --
              </option>
              {ELEMENTS_DATA.map((el) => (
                <option key={el.number} value={el.number} className="bg-slate-900 text-cyan-300">
                  #{el.number} {el.symbol} - {el.name} ({el.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* 3 Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Subject 1: Chemistry (Active) */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveSubject('CHEMISTRY');
          }}
          className={`relative p-5 rounded-xl border transition-all cursor-pointer ${
            activeSubject === 'CHEMISTRY'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900/60 border-cyan-500/20 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              LAB ONLINE
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-lg text-white mt-4">
            CYBER CHEMISTRY
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            118 Neon Elements, 3D Atomic Orbitals, Compound Synthesizer &amp; Reaction Engine.
          </p>
        </div>

        {/* Subject 2: Physics (Active) */}
        <div
          onClick={() => {
            soundFX.playClick();
            setActiveSubject('PHYSICS');
          }}
          className={`relative p-5 rounded-xl border transition-all cursor-pointer ${
            activeSubject === 'PHYSICS'
              ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
              : 'bg-slate-900/60 border-purple-500/20 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              LAB ONLINE
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-lg text-white mt-4">
            3D PHYSICS LABORATORY
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Motion Visualizer, Interplanetary Gravity, Ray Optics Bench, &amp; Electromagnet Motor.
          </p>
        </div>

        {/* Subject 3: Mathematics (Locked) */}
        <div className="relative p-5 rounded-xl bg-slate-950/60 border border-slate-800 opacity-70 cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> OFFLINE
            </span>
          </div>
          <h3 className="font-orbitron font-bold text-lg text-slate-400 mt-4">
            3D MATHEMATICS
          </h3>
          <p className="text-xs text-rose-400/90 mt-1 font-bold">
            COMMENCING SOON // VECTOR SIMULATOR OFFLINE
          </p>
        </div>

      </div>

      {/* Chemistry Lab Sub-Tabs (Compound Matrix vs Reaction Simulator) */}
      <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => {
            soundFX.playClick();
            setChemistryTab('COMPOUNDS');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            chemistryTab === 'COMPOUNDS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-cyan-300'
          }`}
        >
          <Beaker className="w-4 h-4" /> COMPOUND CREATION MATRIX
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setChemistryTab('REACTIONS');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            chemistryTab === 'REACTIONS'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-300'
          }`}
        >
          <Flame className="w-4 h-4" /> REACTION SIMULATOR ENGINE
        </button>
      </div>

      {/* 3D Atomic Orbit Viewer Modal / Inline Section */}
      {selectedElement && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-400 shadow-[0_0_40px_rgba(0,240,255,0.2)] animate-fadeIn space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-orbitron font-bold text-xl">
                {selectedElement.symbol}
              </div>
              <div>
                <h2 className="font-orbitron font-extrabold text-xl text-white flex items-center gap-2">
                  #{selectedElement.number} {selectedElement.name.toUpperCase()}
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStyle(selectedElement.category).badge}`}>
                    {selectedElement.category}
                  </span>
                </h2>
                <div className="text-xs text-cyan-400/80">
                  ATOMIC MASS: {selectedElement.mass} u // CONFIG: {selectedElement.configuration}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedElement(null)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> CLOSE 3D VIEW
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

            {/* 3D Canvas Column */}
            <div className="lg:col-span-2">
              <AtomicOrbitCanvas element={selectedElement} />
            </div>

            {/* Side Telemetry HUD Panel */}
            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4">
              <div className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-2 border-b border-cyan-500/20 pb-2">
                <Cpu className="w-4 h-4" /> ATOMIC TELEMETRY HUD
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">PROTONS (p+)</div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">{selectedElement.protons}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">NEUTRONS (n⁰)</div>
                  <div className="text-amber-400 font-bold text-sm mt-0.5">{selectedElement.neutrons}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">TOTAL ELECTRONS</div>
                  <div className="text-purple-300 font-bold text-sm mt-0.5">{selectedElement.number}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">PERIOD / GROUP</div>
                  <div className="text-emerald-300 font-bold text-sm mt-0.5">P{selectedElement.period} / G{selectedElement.group}</div>
                </div>
              </div>

              {/* Shell Breakdown */}
              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> ELECTRON SHELL DISTRIBUTION (K, L, M, N...)
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedElement.shells.map((val, idx) => {
                    const labels = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                    return (
                      <span key={idx} className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
                        {labels[idx] || `S${idx+1}`}: {val}e⁻
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Electronic Config String */}
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] font-bold text-purple-400">ORBITAL CONFIGURATION</div>
                <div className="text-xs text-slate-200 font-mono mt-1 tracking-wide">
                  {selectedElement.configuration}
                </div>
              </div>

              {/* Chemical Reaction Preparedness Slot */}
              <div className="p-3 rounded bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-400/80 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>COMPOUND REACTION MODULE // READY FOR COMBINATION</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Conditionally Render Physics or Chemistry Modules */}
      {activeSubject === 'PHYSICS' && <PhysicsLabModule />}

      {activeSubject === 'CHEMISTRY' && (
        <>
          {/* Chemistry Lab Sub-Tabs */}
          <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
            <button
              onClick={() => {
                soundFX.playClick();
                setChemistryTab('COMPOUNDS');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                chemistryTab === 'COMPOUNDS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-cyan-300'
              }`}
            >
              <Beaker className="w-4 h-4" /> COMPOUND CREATION MATRIX
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setChemistryTab('REACTIONS');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                chemistryTab === 'REACTIONS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-300'
              }`}
            >
              <Flame className="w-4 h-4" /> REACTION SIMULATOR ENGINE
            </button>
          </div>

          {chemistryTab === 'COMPOUNDS' && <CompoundSynthesizer />}
          {chemistryTab === 'REACTIONS' && <ReactionSimulator />}
        </>
      )}

      {/* Neon Cyberpunk Periodic Table Hub */}
      <div className="space-y-4">

        {/* Controls Bar: Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-cyan-500/20">

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Symbol (e.g. Fe, Au), Name, or Atomic Number..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-cyan-500/30 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFX.playClick();
                  setCategoryFilter(cat);
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-cyan-300 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 118 Elements Neon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
          {filteredElements.map((el) => {
            const style = getStyle(el.category);
            return (
              <div
                key={el.number}
                onClick={() => handleElementClick(el)}
                onMouseEnter={() => soundFX.playHover()}
                className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${style.bg} ${style.border} ${style.glow} hover:scale-105 active:scale-95`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>#{el.number}</span>
                  <span className="text-[8px] opacity-75">{el.mass}</span>
                </div>

                <div className="text-center py-1">
                  <div className={`font-orbitron font-extrabold text-xl ${style.text}`}>
                    {el.symbol}
                  </div>
                  <div className="text-[10px] font-bold text-slate-200 truncate mt-0.5">
                    {el.name}
                  </div>
                </div>

                <div className="text-[8px] text-center text-slate-400/80 truncate">
                  {el.category}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
