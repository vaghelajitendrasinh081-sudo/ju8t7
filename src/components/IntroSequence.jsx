import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/sound';

export function IntroSequence({ onComplete }) {
  const brandText = 'SUDARSHAN';
  const [visibleCount, setVisibleCount] = useState(0);
  const [showBlast, setShowBlast] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Phase 1: Letter-by-letter reveal
    if (visibleCount < brandText.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
        soundFX.playHover();
      }, 150);
      return () => clearTimeout(timer);
    } else if (visibleCount === brandText.length && !showBlast) {
      // Phase 2: Trigger energy particle blast once full text appears
      const blastTimer = setTimeout(() => {
        setShowBlast(true);
        soundFX.playSuccess();
      }, 300);
      return () => clearTimeout(blastTimer);
    } else if (showBlast && !isFadingOut) {
      // Phase 3: Transition and fade out seamlessly to main dashboard
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1200);
      return () => clearTimeout(fadeTimer);
    } else if (isFadingOut) {
      const endTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(endTimer);
    }
  }, [visibleCount, showBlast, isFadingOut, onComplete, brandText.length]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Dark Space Glow */}
      <div className="absolute inset-0 bg-radial-at-c from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Blue Energy Particle Burst Radiating Outwards */}
      {showBlast && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Central Radial Energy Beam Burst */}
          <div className="w-[500px] h-[500px] rounded-full bg-cyan-400/30 blur-[90px] animate-ping" />
          <div className="w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" />

          {/* Radiating Beams */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-64 bg-gradient-to-t from-cyan-400 to-transparent opacity-80 animate-pulse"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-120px)`,
                transition: 'transform 0.5s ease-out',
              }}
            />
          ))}
        </div>
      )}

      {/* Main Brand Name "SUDARSHAN" Letter-by-Letter Display */}
      <div className="relative z-10 flex items-center justify-center space-x-2 md:space-x-4">
        {brandText.split('').map((letter, idx) => {
          const isVisible = idx < visibleCount;

          return (
            <span
              key={idx}
              className={`font-orbitron text-5xl sm:text-7xl md:text-9xl font-black tracking-widest transition-all duration-500 transform ${
                isVisible
                  ? 'opacity-100 scale-100 translate-y-0 text-cyan-200 drop-shadow-[0_0_30px_rgba(0,240,255,0.9)]'
                  : 'opacity-0 scale-50 translate-y-4 text-slate-800'
              }`}
              style={{
                textShadow: isVisible
                  ? '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 80px #3b82f6'
                  : 'none',
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Subtitle Telemetry Indicator */}
      <div
        className={`mt-8 text-xs font-mono-tech text-cyan-400 tracking-widest transition-opacity duration-500 ${
          visibleCount === brandText.length ? 'opacity-100' : 'opacity-0'
        }`}
      >
        [INITIALIZING CELESTIAL COGNITIVE HUD // KURUKSHETRA OBSERVATORY]
      </div>
    </div>
  );
}
