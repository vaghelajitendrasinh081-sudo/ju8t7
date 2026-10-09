import React from 'react';
import { Trophy, Clock, Sparkles, X, ChevronRight } from 'lucide-react';
import { calculateLevelFromHours } from '../utils/gamification';

export function GamificationModule({ totalHours, levelUpData, onDismissLevelUpModal }) {
  const levelInfo = calculateLevelFromHours(totalHours);

  return (
    <>
      {/* Level Badge HUD Card */}
      <div className={`hud-glass p-5 rounded-xl border font-mono-tech relative overflow-hidden mb-6 transition-all duration-500 ${
        levelInfo.progressPercent >= 97 && !levelInfo.isMax
          ? 'border-slate-400/80 shadow-[0_0_30px_rgba(148,163,184,0.35)] bg-slate-900/90'
          : 'border-cyan-500/30'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Badge Icon & Level Info */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-950 to-purple-950 border border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Trophy className="w-7 h-7 text-cyan-400" />
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 font-orbitron text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
                Lvl {levelInfo.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold">
                  PROGRESSED COGNITIVE LEVEL
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  GAMIFIED HUD
                </span>
              </div>
              <h3 className="font-orbitron text-lg font-bold text-white tracking-wide">
                LEVEL {levelInfo.level} — <span className="text-cyan-400">{levelInfo.title}</span>
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Total Tracked Study: <strong className="text-slate-200">{levelInfo.totalHours.toFixed(1)} hrs</strong></span>
              </p>
            </div>
          </div>

          {/* XP Progress Bar to Next Level */}
          <div className="w-full sm:w-64 space-y-1.5 bg-slate-950/80 p-3 rounded-lg border border-cyan-500/20">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">XP TO LEVEL {levelInfo.level + 1}:</span>
              <span className="text-cyan-300 font-bold">{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-cyan-500/30 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              {levelInfo.isMax ? 'MAX LEVEL REACHED' : `${(levelInfo.nextLevelHoursReq - levelInfo.totalHours).toFixed(1)} hrs needed for next tier`}
            </div>
          </div>

        </div>
      </div>

      {/* Celebratory Sci-Fi Audio-Visual Badge Level-Up Modal Overlay */}
      {levelUpData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
          {/* Sci-Fi Glow & Particle Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />

          <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-400 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.4)] text-center space-y-5 overflow-hidden">
            {/* Top Close Button */}
            <button
              onClick={onDismissLevelUpModal}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Badge Container */}
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-emerald-400 p-1 animate-bounce shadow-[0_0_30px_rgba(0,240,255,0.6)]">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                <span className="font-orbitron font-extrabold text-white text-lg">
                  LVL {levelUpData.level}
                </span>
              </div>
            </div>

            {/* Banner Text */}
            <div className="space-y-1">
              <div className="text-xs font-mono-tech text-cyan-400 tracking-widest font-bold uppercase animate-pulse">
                ⚡ LEVEL UP UNLOCKED ⚡
              </div>
              <h2 className="font-orbitron font-black text-2xl text-white tracking-wider">
                {levelUpData.title}
              </h2>
              <p className="text-xs text-slate-300 font-mono-tech">
                Congratulations! You have reached <strong className="text-cyan-300">Level {levelUpData.level}</strong> with <strong className="text-purple-300">{levelUpData.totalHours.toFixed(1)} study hours</strong> completed!
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onDismissLevelUpModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-orbitron font-bold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>CLAIM LEVEL BADGE</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
