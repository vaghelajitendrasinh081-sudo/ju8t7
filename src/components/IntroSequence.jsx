import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/sound';

export function IntroSequence({ onComplete }) {
  const brandText = 'SUDARSHAN';
  const [visibleCount, setVisibleCount] = useState(0);
  const [ringPhase, setRingPhase] = useState('ANCIENT_EXPAND'); // ANCIENT_EXPAND -> CYAN_TRANSITION -> FADE_OUT
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Phase 1: Ancient Arcane Spell Ring Expands & Spins
    soundFX.playHover();

    const titleTimer = setTimeout(() => {
      // Start revealing brand letters
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev < brandText.length) {
            soundFX.playHover();
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 120);
    }, 400);

    // Transition ancient orange ring to cyan 3D chakra glow
    const transitionTimer = setTimeout(() => {
      setRingPhase('CYAN_TRANSITION');
      soundFX.playSuccess();
    }, 2200);

    // Fade out intro sequence overlay
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3400);

    // Complete intro sequence
    const endTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(transitionTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Dark Space Glow */}
      <div className="absolute inset-0 bg-radial-at-c from-amber-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Floating Fiery Spark Particle Embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-ping ${
              ringPhase === 'CYAN_TRANSITION' ? 'bg-cyan-400' : 'bg-amber-500'
            }`}
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              opacity: 0.6,
              animationDuration: `${1.5 + (i % 3)}s`,
              animationDelay: `${(i * 0.1).toFixed(1)}s`,
              boxShadow: ringPhase === 'CYAN_TRANSITION' ? '0 0 10px #00f0ff' : '0 0 10px #f97316'
            }}
          />
        ))}
      </div>

      {/* ANCIENT ARCANE MYSTIC SPELL RING (Doctor Strange / Mystic Chakra Aesthetic) */}
      <div className="relative flex items-center justify-center pointer-events-none my-6">

        {/* Outer Glowing Radial Arcane Halo */}
        <div
          className={`absolute rounded-full transition-all duration-1000 ${
            ringPhase === 'CYAN_TRANSITION'
              ? 'w-[450px] h-[450px] md:w-[650px] md:h-[650px] bg-cyan-500/20 blur-[80px]'
              : 'w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-amber-500/30 blur-[90px] animate-pulse'
          }`}
        />

        {/* Doctor Strange Style Arcane Spell Rings SVG Container */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px]">
          <svg className="w-full h-full transform transition-transform duration-1000 scale-100" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="fierySpellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4500" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="cyanSpellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Ring 1: Outer Runed Circle (Slow Clockwise Spin) */}
            <g className="animate-[spin_20s_linear_infinite] transform-origin-center">
              <circle
                cx="200"
                cy="200"
                r="185"
                fill="none"
                stroke={ringPhase === 'CYAN_TRANSITION' ? 'url(#cyanSpellGradient)' : 'url(#fierySpellGradient)'}
                strokeWidth="2.5"
                strokeDasharray="12 6 4 6"
                className="transition-all duration-1000"
              />
              <circle
                cx="200"
                cy="200"
                r="175"
                fill="none"
                stroke={ringPhase === 'CYAN_TRANSITION' ? '#00f0ff' : '#f59e0b'}
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Arcane Mystic Runes / Hash Marks */}
              {[...Array(12)].map((_, i) => (
                <text
                  key={i}
                  x="200"
                  y="24"
                  transform={`rotate(${i * 30} 200 200)`}
                  fill={ringPhase === 'CYAN_TRANSITION' ? '#00f0ff' : '#fbbf24'}
                  fontSize="10"
                  fontFamily="Share Tech Mono"
                  textAnchor="middle"
                  className="tracking-widest opacity-90"
                >
                  ᚱᛗᛏᛞ
                </text>
              ))}
            </g>

            {/* Ring 2: Intersecting Geometric Squares / Octagram (Counter-Clockwise Spin) */}
            <g className="animate-[spin_12s_linear_infinite_reverse] transform-origin-center">
              <rect
                x="50"
                y="50"
                width="300"
                height="300"
                fill="none"
                stroke={ringPhase === 'CYAN_TRANSITION' ? '#00f0ff' : '#f97316'}
                strokeWidth="1.5"
                opacity="0.85"
              />
              <rect
                x="50"
                y="50"
                width="300"
                height="300"
                transform="rotate(45 200 200)"
                fill="none"
                stroke={ringPhase === 'CYAN_TRANSITION' ? '#3b82f6' : '#ef4444'}
                strokeWidth="1.5"
                opacity="0.85"
              />
            </g>

            {/* Ring 3: Inner Concentric Star Chakra (Fast Clockwise Spin) */}
            <g className="animate-[spin_8s_linear_infinite] transform-origin-center">
              <circle
                cx="200"
                cy="200"
                r="110"
                fill="none"
                stroke={ringPhase === 'CYAN_TRANSITION' ? '#a855f7' : '#f59e0b'}
                strokeWidth="2"
                strokeDasharray="20 10"
              />
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="90"
                  x2="200"
                  y2="310"
                  transform={`rotate(${i * 22.5} 200 200)`}
                  stroke={ringPhase === 'CYAN_TRANSITION' ? '#00f0ff' : '#fbbf24'}
                  strokeWidth="1"
                  opacity="0.6"
                />
              ))}
            </g>

            {/* Central Core Arcane Circle */}
            <circle
              cx="200"
              cy="200"
              r="60"
              fill="none"
              stroke={ringPhase === 'CYAN_TRANSITION' ? '#00f0ff' : '#f59e0b'}
              strokeWidth="2"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Brand Name Overlay Center aligned with Ancient Ring */}
        <div className="absolute z-20 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3">
            {brandText.split('').map((letter, idx) => {
              const isVisible = idx < visibleCount;

              return (
                <span
                  key={idx}
                  className={`font-orbitron text-3xl sm:text-5xl md:text-7xl font-black tracking-widest transition-all duration-500 transform ${
                    isVisible
                      ? 'opacity-100 scale-100 translate-y-0 text-white'
                      : 'opacity-0 scale-50 translate-y-4'
                  }`}
                  style={{
                    textShadow: ringPhase === 'CYAN_TRANSITION'
                      ? '0 0 15px #00f0ff, 0 0 30px #00f0ff, 0 0 60px #3b82f6'
                      : '0 0 15px #f97316, 0 0 30px #f59e0b, 0 0 60px #ef4444',
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          {/* Subtitle Telemetry Indicator */}
          <div
            className={`mt-4 text-[10px] sm:text-xs font-mono-tech tracking-widest transition-all duration-500 ${
              visibleCount === brandText.length ? 'opacity-100' : 'opacity-0'
            } ${ringPhase === 'CYAN_TRANSITION' ? 'text-cyan-400' : 'text-amber-400'}`}
          >
            {ringPhase === 'CYAN_TRANSITION'
              ? '[CELESTIAL CHAKRA SYNC COMPLETE // LAUNCHING HUD]'
              : '[AWAKENING ANCIENT SUDARSHAN ARCANE MATRIX]'}
          </div>
        </div>

      </div>
    </div>
  );
}
