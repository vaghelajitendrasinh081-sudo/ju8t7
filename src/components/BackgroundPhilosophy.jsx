import React, { useState } from 'react';
import { Cpu, ShieldCheck, Terminal, GraduationCap, Code2, Sparkles, Check, ChevronRight } from 'lucide-react';

export default function BackgroundPhilosophy({ bio, ethos }) {
  const [activeEthos, setActiveEthos] = useState(ethos[0].id);

  const iconMap = {
    Cpu: Cpu,
    ShieldCheck: ShieldCheck,
    Terminal: Terminal,
  };

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-crimson/30 text-crimson text-xs font-mono tracking-widest uppercase mb-4">
            <span>// 01 // ARCHITECTURAL DNA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Background & <span className="text-crimson">Philosophy</span>
          </h2>
          <p className="mt-4 text-cyber-muted max-w-3xl text-base sm:text-lg">
            Engineering sovereign computational agents, zero-allocation low-latency engines, and deterministic verification protocols.
          </p>
        </div>

        {/* 2-Column Grid: Detailed Bio & Sovereign Ethos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Bio & Core Competencies */}
          <div className="lg:col-span-6 space-y-8">

            {/* Primary Bio Card */}
            <div className="p-8 rounded-2xl bg-cyber-card border border-cyber-border relative overflow-hidden group hover:border-crimson/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-black border border-crimson/40 text-crimson">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-white text-lg">Autonomous AI Systems Architect</h3>
                  <span className="font-mono text-xs text-crimson">SOVEREIGN TECH ENGINEER</span>
                </div>
              </div>

              <div className="space-y-4 text-cyber-muted text-sm sm:text-base leading-relaxed">
                <p>
                  {bio.statement}
                </p>
                <div className="p-4 rounded-xl bg-black/60 border border-cyber-border flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-crimson shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-cyber-light font-mono leading-relaxed">
                    <strong className="text-white block font-sans">Academic Pedigree:</strong>
                    {bio.formal}
                  </p>
                </div>
              </div>
            </div>

            {/* Competency Matrix */}
            <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-cyber-muted">
                // SYSTEM COMPETENCY MATRIX
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bio.competencies.map((comp) => (
                  <div key={comp.category} className="p-3.5 rounded-xl bg-black/50 border border-cyber-border/70 hover:border-crimson/30 transition-colors">
                    <span className="font-mono text-xs font-bold text-white block mb-2 text-crimson">
                      {comp.category}
                    </span>
                    <ul className="space-y-1.5">
                      {comp.skills.map((skill) => (
                        <li key={skill} className="text-xs text-cyber-muted font-mono flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-crimson" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sovereign Ethos Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-mono text-sm tracking-wider uppercase text-cyber-light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                SOVEREIGN ETHOS (FIRST PRINCIPLES)
              </h3>
              <span className="font-mono text-xs text-cyber-muted">3 PILLARS</span>
            </div>

            <div className="space-y-4">
              {ethos.map((item) => {
                const IconComponent = iconMap[item.icon] || Cpu;
                const isSelected = activeEthos === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveEthos(item.id)}
                    className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 relative border ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#120505] to-[#0D0D0D] border-crimson shadow-[0_0_25px_rgba(255,30,39,0.25)]'
                        : 'bg-cyber-card border-cyber-border hover:border-crimson/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg border transition-colors ${
                          isSelected ? 'bg-crimson text-white border-crimson' : 'bg-black text-crimson border-crimson/40'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[11px] text-crimson tracking-widest uppercase block">
                            {item.code}
                          </span>
                          <h4 className="font-sans font-bold text-lg text-white">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-cyber-muted">
                        {isSelected ? 'ACTIVE FOCUS' : 'INSPECT'}
                      </span>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-cyber-muted leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Highlights list */}
                    <div className="mt-4 pt-4 border-t border-cyber-border/70 flex flex-wrap gap-2">
                      {item.highlights.map((high) => (
                        <span
                          key={high}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-black text-cyber-light border border-cyber-border/60 flex items-center gap-1.5"
                        >
                          <Check className="w-3 h-3 text-crimson" />
                          <span>{high}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
