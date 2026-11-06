import React from 'react';
import { ArrowUpRight, Terminal, Shield, Zap, Sparkles, Cpu, Layers } from 'lucide-react';

export default function HeroSection({ hero, onOpenDispatch }) {
  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center overflow-hidden">
      {/* Giant Typography Outline Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-15 overflow-hidden whitespace-nowrap"
        aria-hidden="true"
      >
        <span className="text-[18vw] font-black tracking-tighter text-outline-crimson block font-mono">
          PORTFOLIO
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headline, Summary & CTAs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-card border border-crimson/30 text-crimson text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
              <span>CLASSIFIED ARCHITECTURE // NODE-001</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white font-sans leading-none">
                Hello, I'm <span className="text-crimson drop-shadow-[0_0_20px_rgba(255,30,39,0.7)]">SAHIR.</span>
              </h1>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-crimson font-mono font-bold text-lg sm:text-xl">&gt;</span>
                <p className="font-mono text-sm sm:text-lg font-semibold tracking-wider text-cyber-light">
                  {hero.role}
                </p>
              </div>
            </div>

            {/* Technical summary paragraphs */}
            <p className="text-base sm:text-lg text-cyber-muted font-normal max-w-2xl leading-relaxed">
              {hero.summary}
            </p>

            {/* Micro Feature Bullet Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-cyber-muted">
              <div className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border">
                <span className="text-crimson font-bold block mb-1">ZERO-ALLOC</span>
                <span>Rust & C++ memory-safe primitives</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border">
                <span className="text-crimson font-bold block mb-1">MULTI-LLM</span>
                <span>Adversarial consensus topologies</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border col-span-2 sm:col-span-1">
                <span className="text-crimson font-bold block mb-1">HFT TRADING</span>
                <span>Sub-millisecond flash execution</span>
              </div>
            </div>

            {/* Two Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Solid Red Button: INITIATE DISPATCH */}
              <button
                onClick={onOpenDispatch}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-crimson hover:bg-crimson-bright text-white font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:shadow-[0_0_35px_rgba(255,30,39,0.8)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>INITIATE DISPATCH</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Outlined Button: EXPLORE ARCHITECTURE */}
              <a
                href="#flagship"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-cyber-card hover:bg-black text-white font-mono font-bold text-sm tracking-wider uppercase border border-crimson/50 hover:border-crimson hover:shadow-[0_0_20px_rgba(255,30,39,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Layers className="w-4 h-4 text-crimson" />
                <span>EXPLORE ARCHITECTURE</span>
              </a>
            </div>

          </div>

          {/* Right Column: High-Tech Profile Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square max-w-full">

              {/* Outer Cyber Accent Rings */}
              <div className="absolute -inset-4 rounded-3xl border border-crimson/20 border-dashed animate-spin [animation-duration:40s] pointer-events-none" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-crimson/30 via-transparent to-crimson/40 blur-xl opacity-60" />

              {/* Card Container */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden bg-cyber-card border border-red-600/40 shadow-[0_0_25px_rgba(255,30,39,0.3)] group">

                {/* Anime Monochrome Profile Image */}
                <img
                  src="/avatar.png"
                  alt="Sahir — Systems Architect"
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Crimson Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-crimson/10 mix-blend-color-burn pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/20 via-transparent to-transparent pointer-events-none" />

                {/* Cyber Corner Decals */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-crimson" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-crimson" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-crimson" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-crimson" />

                {/* Floating Status Overlay Card: Autonomous Core */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between px-3 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-crimson/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />
                    <span className="font-mono text-xs font-bold text-white tracking-wider">Autonomous Core</span>
                  </div>
                  <span className="font-mono text-[10px] text-crimson font-semibold">STABLE 0.04ms</span>
                </div>

                {/* Floating Status Overlay Card: SaaS Lab Takeover */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/85 backdrop-blur-md border border-crimson/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-crimson" />
                      <span className="font-mono text-xs font-bold text-white tracking-wider">SaaS Lab Takeover</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-crimson/20 text-crimson border border-crimson/40">
                      ACTIVE RUNTIME
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-crimson to-crimson-bright h-full w-[84%] animate-pulse" />
                  </div>
                </div>

              </div>

              {/* Decorative Tech Tag Below Image */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black border border-crimson/60 shadow-[0_0_15px_rgba(255,30,39,0.4)] text-[10px] font-mono text-cyber-light whitespace-nowrap">
                OPERATIVE DESIGNATION: <span className="text-crimson font-bold">SAHIR_0x7F</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
