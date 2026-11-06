import React, { useState } from 'react';
import { Terminal, Search, Menu, X, Shield, Activity, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Flagship', href: '#flagship' },
    { name: 'Matrix', href: '#matrix' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-cyber-card border border-crimson/40 flex items-center justify-center text-crimson group-hover:border-crimson group-hover:shadow-[0_0_15px_rgba(255,30,39,0.5)] transition-all">
            <Terminal className="w-5 h-5 text-crimson transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold text-sm sm:text-base tracking-widest text-white flex items-center gap-1.5">
              SAHIR<span className="text-crimson">//</span>SYS
            </span>
            <span className="font-mono text-[10px] text-cyber-muted tracking-tight">
              AUTONOMOUS ARCHITECT
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-xs font-mono uppercase tracking-wider text-cyber-light hover:text-crimson transition-colors relative py-1 group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-crimson transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right Section: Status Indicator & Search Button */}
        <div className="flex items-center gap-3">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-border/80 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson"></span>
            </span>
            <span className="text-white text-[11px] font-semibold tracking-wider">● ONLINE</span>
          </div>

          {/* Search Palette Toggle Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-[#161616] border border-cyber-border hover:border-crimson/50 text-cyber-light transition-all text-xs font-mono"
            title="Command Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-crimson" />
            <span className="hidden sm:inline text-cyber-muted text-[11px]">SEARCH</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] bg-black text-cyber-muted border border-cyber-border rounded">⌘K</kbd>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-cyber-card border border-cyber-border text-white hover:text-crimson"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-card border-b border-cyber-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2 px-3 rounded text-sm font-mono tracking-wide text-cyber-light hover:bg-[#1A1A1A] hover:text-crimson transition-all"
            >
              &gt; {link.name}
            </button>
          ))}
          <div className="pt-2 border-t border-cyber-border/60 flex items-center justify-between text-xs font-mono text-cyber-muted px-3">
            <span>SYS_STATUS: NOMINAL</span>
            <span className="text-crimson">LATENCY: 0.04ms</span>
          </div>
        </div>
      )}
    </nav>
  );
}
