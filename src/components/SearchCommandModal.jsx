import React, { useState, useEffect } from 'react';
import { Search, X, Terminal, ArrowRight, Layers, Cpu, Shield, ExternalLink } from 'lucide-react';

export default function SearchCommandModal({ isOpen, onClose, portfolioData }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // will trigger toggle in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten searchable targets
  const allTargets = [
    { type: 'SECTION', title: 'About & Philosophy', href: '#about', desc: 'Background, BCA pedigree & Sovereign Ethos' },
    { type: 'SECTION', title: 'Flagship Deployments', href: '#flagship', desc: 'SAAI 7-Layer Autonomous AI Ecosystem' },
    { type: 'SECTION', title: 'The Systems Matrix', href: '#matrix', desc: 'Hardware solvers, neural forecasters & crypto search' },
    { type: 'SECTION', title: 'Contact & Dispatch', href: '#contact', desc: 'Direct encrypted transmissions & inquiry' },
    ...portfolioData.flagship.layers.map(l => ({
      type: 'FLAGSHIP LAYER',
      title: l.name,
      href: '#flagship',
      desc: l.role
    })),
    ...portfolioData.flagship.subProjects.map(p => ({
      type: 'PROJECT RIG',
      title: p.title,
      href: '#flagship',
      desc: p.description
    })),
    ...portfolioData.matrix.map(m => ({
      type: 'SYSTEM MODULE',
      title: m.title,
      href: '#matrix',
      desc: m.abstract
    })),
    ...portfolioData.ethos.map(e => ({
      type: 'SOVEREIGN ETHOS',
      title: e.title,
      href: '#about',
      desc: e.description
    }))
  ];

  const results = query.trim() === ''
    ? allTargets.slice(0, 7)
    : allTargets.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.desc.toLowerCase().includes(query.toLowerCase()) ||
        t.type.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  const handleSelect = (href) => {
    onClose();
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-cyber-card border border-crimson/60 shadow-[0_0_50px_rgba(255,30,39,0.3)] overflow-hidden">

        {/* Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-cyber-border bg-black/90">
          <Search className="w-5 h-5 text-crimson" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, module, or layer (e.g. SAAI, CUDA, Parliament)..."
            className="w-full bg-transparent text-sm sm:text-base font-mono text-white placeholder-cyber-muted outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-cyber-muted hover:text-white hover:bg-[#1A1A1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length > 0 ? (
            results.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item.href)}
                className="w-full text-left p-3 rounded-xl hover:bg-black/80 hover:border-crimson/40 border border-transparent transition-all flex items-start justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-crimson/15 text-crimson border border-crimson/30">
                      {item.type}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-semibold text-white group-hover:text-crimson transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-cyber-muted line-clamp-1 font-sans">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cyber-muted group-hover:text-crimson group-hover:translate-x-1 transition-all mt-1 shrink-0 ml-2" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-cyber-muted font-mono text-xs">
              NO MATCHING COMMANDS FOUND FOR "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black border-t border-cyber-border flex items-center justify-between text-[11px] font-mono text-cyber-muted">
          <span>NAVIGATION: [ESC] TO CLOSE</span>
          <span className="text-crimson">SAHIR COMMAND PALETTE</span>
        </div>

      </div>
    </div>
  );
}
