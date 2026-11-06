import React from 'react';
import { GitBranch, Layers, Activity, Code, Server, CheckCircle2 } from 'lucide-react';

export default function StatsBanner({ metrics }) {
  const statIcons = [GitBranch, Layers, Activity, Code];

  return (
    <section className="relative z-20 border-y border-cyber-border bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            return (
              <div
                key={metric.label}
                className="relative p-4 rounded-xl bg-cyber-card/80 border border-cyber-border hover:border-crimson/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono tracking-wider text-cyber-muted uppercase">
                    {metric.label}
                  </span>
                  <Icon className="w-4 h-4 text-cyber-muted group-hover:text-crimson transition-colors" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight group-hover:text-crimson transition-colors">
                  {metric.value}
                </div>
                <p className="mt-1 text-xs text-cyber-muted font-sans">
                  {metric.detail}
                </p>
                {/* Glow border underline */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-crimson/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
