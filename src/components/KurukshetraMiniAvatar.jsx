import React from 'react';
import { Sparkles, Brain, Bot, Flame, Shield, Compass } from 'lucide-react';
import { soundFX } from '../utils/sound';

export function KurukshetraMiniAvatar({ onClick }) {
  return (
    <div
      onClick={() => {
        soundFX.playClick();
        if (onClick) onClick();
      }}
      className="group relative cursor-pointer hud-glass p-4 rounded-xl border border-cyan-500/40 hover:border-amber-400/80 bg-slate-950/90 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_35px_rgba(245,158,11,0.3)] transition-all duration-300 overflow-hidden font-mono-tech mt-4"
    >
      {/* Background Cybernetic Holographic Glow Effects */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-500 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all duration-500 pointer-events-none" />

      {/* Main Container Layout */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left: Avatar Visual Symbol & Identity */}
        <div className="flex items-center gap-3.5">

          {/* Cybernetic Lord Krishna Divine Holographic Icon Frame */}
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-amber-950 p-0.5 border border-cyan-400/60 group-hover:border-amber-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center flex-shrink-0">

            {/* Spinning Sudarshan Chakra Outer HUD Ring */}
            <svg className="absolute inset-0 w-full h-full text-cyan-400/40 group-hover:text-amber-400/60 animate-spin-slow" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" fill="none" />
            </svg>

            {/* Cybernetic Peacock Feather / Chakra Core Icon Motif */}
            <div className="relative z-10 flex items-center justify-center text-cyan-300 group-hover:text-amber-300 transition-colors">
              <div className="relative">
                {/* Peacock Feather Cyan-Orange Glow Haze */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-500 opacity-80 blur-xs group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                </div>
              </div>
            </div>

            {/* Corner Bracket Accents */}
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-cyan-400" />
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-amber-400" />
          </div>

          {/* Identity Text */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-amber-400 tracking-wider">
                KURUKSHETRA AI SUITE
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                DIVINE MINI-HUD
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              Feynman Recall Engine &amp; Dynamic Board / Competitive Exam Simulator
            </p>

            <div className="flex items-center gap-3 text-[10px] text-cyan-400/90 mt-1 font-mono-tech">
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-cyan-400" />
                TEACH THE AI (GAP DETECTION)
              </span>
              <span className="text-slate-600">//</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Compass className="w-3 h-3 text-amber-400" />
                CLASS 10 &amp; 11 EXAM QUIZZER
              </span>
            </div>
          </div>
        </div>

        {/* Right: Expand Modal Action CTA */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-amber-500/20 group-hover:from-cyan-500 group-hover:to-amber-500 text-cyan-300 group-hover:text-slate-950 border border-cyan-400/40 group-hover:border-amber-300 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
            <span>LAUNCH KURUKSHETRA SUITE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
