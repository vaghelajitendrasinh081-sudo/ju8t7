import React, { useState } from 'react';
import { Cpu, Terminal, ExternalLink, GitBranch, Sparkles, Filter, ChevronRight, X, Shield, Activity } from 'lucide-react';

export default function SystemsMatrix({ matrix }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedModule, setSelectedModule] = useState(null);

  const filterOptions = ['ALL', 'AI/ML SYSTEMS', 'QUANTITATIVE', 'DEEP TECH', 'CRYPTOGRAPHY', 'FINANCIAL ARCHITECTURE'];

  const filteredItems = activeFilter === 'ALL'
    ? matrix
    : matrix.filter(item => item.tag === activeFilter);

  return (
    <section id="matrix" className="py-24 relative z-10 border-t border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-crimson/30 text-crimson text-xs font-mono tracking-widest uppercase mb-4">
              <span>// 03 // ARCHITECTURAL REPOSITORIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              The Systems <span className="text-crimson">Matrix</span>
            </h2>
            <p className="mt-4 text-cyber-muted max-w-2xl text-base sm:text-lg">
              Hardware-accelerated solvers, multi-model consensus systems, and dynamical systems models.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeFilter === f
                    ? 'bg-crimson text-white border-crimson shadow-[0_0_15px_rgba(255,30,39,0.4)]'
                    : 'bg-cyber-card text-cyber-muted border-cyber-border hover:border-crimson/40 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((mod) => (
            <div
              key={mod.id}
              className="p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-crimson/60 transition-all flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(255,30,39,0.2)] relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-crimson font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-crimson/10 border border-crimson/30">
                    {mod.tag}
                  </span>
                  <span className="font-mono text-[10px] text-cyber-muted">
                    {mod.status}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-xl text-white group-hover:text-crimson transition-colors">
                  {mod.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-cyber-muted leading-relaxed">
                  {mod.abstract}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/70">
                {/* Benchmark Metric */}
                <div className="p-2.5 rounded-lg bg-black/80 border border-cyber-border/80 mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyber-muted uppercase">BENCHMARK</span>
                  <span className="font-mono text-xs font-semibold text-cyber-light">{mod.metrics}</span>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mod.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-cyber-muted border border-cyber-border">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedModule(mod)}
                    className="text-xs font-mono text-crimson hover:text-crimson-bright flex items-center gap-1 font-semibold group/btn"
                  >
                    <span>ANALYZE SPEC</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  <a
                    href={mod.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md bg-black hover:bg-[#1A1A1A] border border-cyber-border hover:border-crimson/50 text-cyber-muted hover:text-white transition-colors"
                    title="View Source Repository"
                  >
                    <GitBranch className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Dive Specification Modal */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-2xl bg-cyber-card border border-crimson p-6 sm:p-8 shadow-[0_0_50px_rgba(255,30,39,0.35)] animate-in fade-in zoom-in-95 duration-200">

              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-black text-cyber-muted hover:text-white border border-cyber-border hover:border-crimson"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-crimson/20 text-crimson border border-crimson/40">
                  {selectedModule.tag}
                </span>
                <span className="font-mono text-xs text-cyber-muted">
                  {selectedModule.status}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-sans text-white mb-4">
                {selectedModule.title}
              </h3>

              <div className="p-4 rounded-xl bg-black border border-cyber-border mb-6">
                <span className="text-[10px] font-mono text-crimson uppercase tracking-wider block mb-1">
                  ARCHITECTURAL SUMMARY
                </span>
                <p className="text-sm text-cyber-light font-mono leading-relaxed">
                  {selectedModule.abstract}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-cyber-muted uppercase tracking-wider block mb-2">
                    TECHNOLOGY COMPILATION
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedModule.tech.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-md text-xs font-mono bg-black text-white border border-cyber-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#141414] border border-cyber-border flex items-center justify-between">
                  <span className="text-xs font-mono text-cyber-muted">PERFORMANCE BENCHMARK:</span>
                  <span className="text-xs font-mono text-crimson font-bold">{selectedModule.metrics}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-cyber-border flex justify-end gap-3">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2 rounded-lg text-xs font-mono bg-black border border-cyber-border text-cyber-muted hover:text-white"
                >
                  CLOSE
                </button>
                <a
                  href={selectedModule.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-crimson hover:bg-crimson-bright text-white shadow-[0_0_15px_rgba(255,30,39,0.5)] flex items-center gap-1.5"
                >
                  <span>ACCESS CODEBASE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
