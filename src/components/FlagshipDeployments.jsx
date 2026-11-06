import React, { useState } from 'react';
import { Layers, Activity, GitFork, Star, ArrowUpRight, Cpu, Zap, Database, Shield, Radio, Terminal, Box } from 'lucide-react';

export default function FlagshipDeployments({ flagship }) {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const activeLayer = flagship.layers[activeLayerIndex];

  return (
    <section id="flagship" className="py-24 relative z-10 border-t border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-crimson/30 text-crimson text-xs font-mono tracking-widest uppercase mb-4">
            <span>// 02 // TIER-0 ARCHITECTURES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Flagship <span className="text-crimson">Deployments</span>
          </h2>
          <p className="mt-4 text-cyber-muted max-w-3xl text-base sm:text-lg">
            Production-grade autonomous frameworks, high-throughput financial engines, and resilient distributed applications.
          </p>
        </div>

        {/* PRIMARY HERO CARD: SAAI — 7-Layer Autonomous AI Ecosystem */}
        <div className="p-6 sm:p-10 rounded-3xl bg-cyber-card border border-crimson/50 shadow-[0_0_35px_rgba(255,30,39,0.18)] relative overflow-hidden mb-16">

          {/* Header Row of SAAI Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-cyber-border">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-crimson/20 text-crimson border border-crimson/40">
                  {flagship.badge}
                </span>
                <span className="text-xs font-mono text-cyber-muted">NODE CLUSTER v4.9</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                {flagship.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-cyber-muted max-w-3xl">
                {flagship.description}
              </p>
            </div>

            {/* Repo Stats / Metrics Pill Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-black border border-cyber-border text-center">
                <span className="font-mono text-xs text-cyber-muted block">STARS</span>
                <span className="font-mono font-bold text-white text-lg text-crimson">{flagship.stats.stars}</span>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyber-border text-center">
                <span className="font-mono text-xs text-cyber-muted block">FORKS</span>
                <span className="font-mono font-bold text-white text-lg">{flagship.stats.forks}</span>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyber-border text-center">
                <span className="font-mono text-xs text-cyber-muted block">OPERATORS</span>
                <span className="font-mono font-bold text-white text-lg">{flagship.stats.subscribers}</span>
              </div>
              <div className="p-3 rounded-xl bg-black border border-cyber-border text-center">
                <span className="font-mono text-xs text-cyber-muted block">P99 LATENCY</span>
                <span className="font-mono font-bold text-white text-lg text-crimson">{flagship.stats.latency}</span>
              </div>
            </div>
          </div>

          {/* Interactive 7-Layer Tab Bar */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-cyber-light flex items-center gap-2">
                <Layers className="w-4 h-4 text-crimson" />
                STACK DEPTH EXPLORER (SELECT LAYER 00 TO 06)
              </h4>
              <span className="font-mono text-xs text-crimson">
                {activeLayer.id} ACTIVE
              </span>
            </div>

            {/* Layer Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {flagship.layers.map((layer, idx) => {
                const isActive = idx === activeLayerIndex;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayerIndex(idx)}
                    className={`p-3 rounded-xl font-mono text-left transition-all border ${
                      isActive
                        ? 'bg-crimson text-white border-crimson shadow-[0_0_20px_rgba(255,30,39,0.5)] scale-[1.02]'
                        : 'bg-black text-cyber-muted border-cyber-border hover:border-crimson/50 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{layer.id}</span>
                    <span className="text-[11px] truncate block opacity-90">
                      {layer.name.split(':')[1]?.trim() || layer.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Layer Detail Display Box */}
            <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-black border border-cyber-border relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyber-border">
                <div>
                  <span className="font-mono text-xs text-crimson tracking-wider uppercase font-bold block mb-1">
                    LAYER TELEMETRY & SPECIFICATION
                  </span>
                  <h5 className="font-sans font-bold text-xl sm:text-2xl text-white">
                    {activeLayer.name}
                  </h5>
                  <p className="text-sm text-cyber-muted mt-1">
                    {activeLayer.role}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#141414] border border-crimson/40 self-start md:self-auto">
                  <span className="font-mono text-[10px] text-cyber-muted block">BENCHMARK METRIC</span>
                  <span className="font-mono font-bold text-crimson text-sm sm:text-base">
                    {activeLayer.metric}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8">
                  <p className="text-xs sm:text-sm text-cyber-light font-mono leading-relaxed">
                    {activeLayer.overview}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <span className="font-mono text-[10px] text-cyber-muted uppercase tracking-wider block mb-2">
                    COMPILED TECH STACK
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeLayer.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded bg-[#181818] border border-cyber-border text-xs font-mono text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* SUB-GRID: Major Projects (Flash_Lab, Biller, Quantitative Models) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-mono text-sm tracking-wider uppercase text-cyber-light flex items-center gap-2">
              <Box className="w-4 h-4 text-crimson" />
              SPECIALIZED SUBSYSTEMS & PRODUCTION RIGS
            </h3>
            <span className="font-mono text-xs text-cyber-muted">3 RIGS DEPLOYED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flagship.subProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-crimson/50 transition-all flex flex-col justify-between group hover:shadow-[0_0_25px_rgba(255,30,39,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-black text-crimson border border-crimson/30">
                      {proj.category}
                    </span>
                    <span className="font-mono text-[10px] text-cyber-muted">
                      {proj.tag}
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-xl text-white group-hover:text-crimson transition-colors">
                    {proj.title}
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-cyber-muted leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cyber-border/70 space-y-3">
                  {/* Metrics */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {proj.metrics.map((m) => (
                      <div key={m} className="flex items-center justify-between text-[11px] font-mono text-cyber-light">
                        <span className="text-cyber-muted">METRIC</span>
                        <span className="text-white font-semibold">{m}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.stack.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-black text-cyber-muted border border-cyber-border">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
