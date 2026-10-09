import React from 'react';
import { SudarshanChakraCanvas } from './SudarshanChakraCanvas';
import { Play, UploadCloud, Target, Cpu, Activity } from 'lucide-react';
import { soundFX } from '../utils/sound';

export function HeroSection({ onLaunchConsole, onImportSyllabus }) {
  return (
    <section className="relative min-h-screen pt-20 pb-16 flex flex-col items-center justify-center overflow-hidden bg-slate-950">

      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Central 3D Sudarshan Chakra Canvas Container */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto px-2">
        <div className="w-full max-w-5xl h-[340px] sm:h-[480px] md:h-[650px]">
          <SudarshanChakraCanvas isInteractive={true} />
        </div>
      </div>

      {/* Grid Scanlines Overlay */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center mt-12 flex flex-col items-center">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono-tech tracking-wider mb-4 sm:mb-6 shadow-[0_0_15px_rgba(0,240,255,0.15)] backdrop-blur-md max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
          <span className="truncate">CELESTIAL COGNITIVE ORBIT // QUANTUM ENGINE ACTIVE</span>
        </div>

        {/* Brand Title: SUDARSHAN */}
        <div className="relative group my-2 w-full max-w-full text-center overflow-hidden">
          <h1 className="font-orbitron text-[clamp(1.75rem,8.5vw,6rem)] font-black tracking-[0.08em] sm:tracking-[0.18em] md:tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 drop-shadow-[0_0_35px_rgba(0,240,255,0.6)] uppercase w-full max-w-full text-center">
            SUDARSHAN
          </h1>
          <div className="absolute inset-0 font-orbitron text-[clamp(1.75rem,8.5vw,6rem)] font-black tracking-[0.08em] sm:tracking-[0.18em] md:tracking-[0.25em] text-cyan-400/20 blur-sm pointer-events-none select-none uppercase w-full max-w-full text-center">
            SUDARSHAN
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-2xl text-slate-300 font-space font-light max-w-2xl tracking-wide leading-relaxed drop-shadow px-2">
          Precision Goal Tracking &amp; Intelligent Study Analytics
        </p>

        {/* Sub-description */}
        <p className="mt-2 text-[11px] sm:text-xs md:text-sm text-cyan-400/80 font-mono-tech max-w-xl px-2">
          [NEXT-GEN HUD CONSOLE FOR HIGH-STAKES ACADEMIC & COGNITIVE MASTERY]
        </p>

        {/* Glassmorphism Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl">
          <button
            onClick={() => {
              soundFX.playClick();
              onLaunchConsole();
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:shadow-[0_0_45px_rgba(0,240,255,0.8)] hover:scale-105 transition-all duration-300 border border-cyan-300 group"
          >
            <Play className="w-4 h-4 fill-slate-950 group-hover:translate-x-1 transition-transform" />
            <span>LAUNCH CONSOLE</span>
          </button>

          <button
            onClick={() => {
              soundFX.playScan();
              onImportSyllabus();
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-900/80 text-cyan-300 font-orbitron font-semibold text-sm tracking-wider flex items-center justify-center gap-2.5 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-300 backdrop-blur-md"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>IMPORT SYLLABUS</span>
          </button>
        </div>

        {/* Feature Telemetry Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full text-left font-mono-tech">
          <div className="hud-glass p-3.5 sm:p-4 rounded-lg border border-cyan-500/20 hud-bracket">
            <div className="flex items-center justify-between text-cyan-400 mb-2">
              <span className="text-xs text-slate-400">// MODULE 01</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-orbitron text-sm font-bold text-white mb-1">CYBERNETIC PLANNER</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive task matrix with time-blocking schedule &amp; real-time status telemetry.
            </p>
          </div>

          <div className="hud-glass p-3.5 sm:p-4 rounded-lg border border-purple-500/20 hud-bracket">
            <div className="flex items-center justify-between text-purple-400 mb-2">
              <span className="text-xs text-slate-400">// MODULE 02</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="font-orbitron text-sm font-bold text-white mb-1">SYLLABUS IMPORTER</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted PDF parser extracting key topics, deadline matrix &amp; adaptive target goals.
            </p>
          </div>

          <div className="hud-glass p-3.5 sm:p-4 rounded-lg border border-amber-500/20 hud-bracket">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs text-slate-400">// MODULE 03</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-orbitron text-sm font-bold text-white mb-1">AI PERFORMANCE HUD</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live efficiency area graphs, focus duration analytics, and real-time AI recommendations.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
