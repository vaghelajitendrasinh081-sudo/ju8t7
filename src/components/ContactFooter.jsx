import React, { useState } from 'react';
import { Mail, GitBranch, Terminal, ArrowUpRight, Check, Send, Globe, MessageSquare } from 'lucide-react';

// Custom SVG Icons for GitHub, X/Twitter, LinkedIn for sharp cyberpunk styling
function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterXIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45 1.45 1.45 0 0 0-1.45 1.45 1.45 1.45 0 0 0 1.45 1.45m1.37 9.74v-8.37H5.09v8.37h2.74z" />
    </svg>
  );
}

export default function ContactFooter({ contact }) {
  const [copied, setCopied] = useState(false);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sentNotice, setSentNotice] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitDispatch = (e) => {
    e.preventDefault();
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setDispatchModalOpen(false);
      setFormState({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <footer id="contact" className="py-24 relative z-10 border-t border-cyber-border bg-black/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Large Hero Headline Section */}
        <div className="p-8 sm:p-14 rounded-3xl bg-cyber-card border border-cyber-border relative overflow-hidden mb-16 text-center group hover:border-crimson/50 transition-all">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-crimson/15 blur-3xl rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-crimson/30 text-crimson text-xs font-mono tracking-widest uppercase mb-6">
            <span>// TRANSMISSION PROTOCOL // DIRECT DISPATCH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-sans max-w-4xl mx-auto leading-tight">
            Let's Architect Something <span className="text-crimson drop-shadow-[0_0_25px_rgba(255,30,39,0.6)]">Extraordinary.</span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-cyber-muted max-w-2xl mx-auto">
            Available for mission-critical systems architecture, autonomous agent infrastructure, quantitative engines, and high-stakes computational consultancy.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {/* Primary Email Button (mailto:) */}
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-crimson hover:bg-crimson-bright text-white font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,30,39,0.5)] hover:shadow-[0_0_40px_rgba(255,30,39,0.8)] hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>TRANSMIT VIA EMAIL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Quick Dispatch Modal Trigger */}
            <button
              onClick={() => setDispatchModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-black hover:bg-[#121212] border border-cyber-border hover:border-crimson text-cyber-light font-mono font-bold text-sm tracking-wider uppercase transition-all"
            >
              <Terminal className="w-4 h-4 text-crimson" />
              <span>TERMINAL DISPATCH FORM</span>
            </button>

            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="p-4 rounded-xl bg-black border border-cyber-border hover:border-crimson text-cyber-muted hover:text-white transition-all text-xs font-mono"
              title="Copy Email Address"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <span className="text-cyber-muted hover:text-crimson">COPY ADDR</span>}
            </button>
          </div>

          {/* Social Links Row */}
          <div className="mt-12 pt-8 border-t border-cyber-border/80 flex flex-wrap items-center justify-center gap-6">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black border border-cyber-border hover:border-crimson text-cyber-muted hover:text-white font-mono text-xs transition-colors"
            >
              <GithubIcon className="w-4 h-4 text-crimson" />
              <span>GITHUB</span>
            </a>

            <a
              href={contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black border border-cyber-border hover:border-crimson text-cyber-muted hover:text-white font-mono text-xs transition-colors"
            >
              <TwitterXIcon className="w-4 h-4 text-crimson" />
              <span>X / TWITTER</span>
            </a>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black border border-cyber-border hover:border-crimson text-cyber-muted hover:text-white font-mono text-xs transition-colors"
            >
              <LinkedinIcon className="w-4 h-4 text-crimson" />
              <span>LINKEDIN</span>
            </a>
          </div>

        </div>

        {/* Bottom Technical Bar & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cyber-muted">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-crimson" />
            <span>SAHIR — SYSTEMS ARCHITECT PORTFOLIO // ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4">
            <span>UPTIME: 100.00%</span>
            <span>SYSTEM ENCRYPTION: SECP256K1</span>
            <span className="text-white">© {new Date().getFullYear()} SAHIR</span>
          </div>
        </div>

      </div>

      {/* Terminal Dispatch Form Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-cyber-card border border-crimson p-6 sm:p-8 shadow-[0_0_50px_rgba(255,30,39,0.35)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyber-border mb-6">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-crimson" />
                <span className="font-mono text-sm font-bold text-white">SECURE DISPATCH TRANSMISSION</span>
              </div>
              <button
                onClick={() => setDispatchModalOpen(false)}
                className="text-cyber-muted hover:text-white font-mono text-xs"
              >
                [ESC / CLOSE]
              </button>
            </div>

            {sentNotice ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-crimson/20 border border-crimson mx-auto flex items-center justify-center text-crimson">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-mono text-base font-bold text-white">TRANSMISSION DISPATCHED</h4>
                <p className="font-mono text-xs text-cyber-muted">
                  Payload encrypted and routed to Sahir's primary ingress channel.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-cyber-muted mb-1 uppercase tracking-wider">
                    OPERATIVE IDENTIFIER / NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Satoshi or Citadel Engineering"
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-cyber-border focus:border-crimson text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyber-muted mb-1 uppercase tracking-wider">
                    RETURN TRANSMISSION / EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="architect@domain.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-cyber-border focus:border-crimson text-white text-xs font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyber-muted mb-1 uppercase tracking-wider">
                    MISSION BRIEF / ARCHITECTURAL INQUIRY
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Detail the computational challenge, latency requirements, or advisory engagement..."
                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-cyber-border focus:border-crimson text-white text-xs font-mono outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-xs font-mono bg-black border border-cyber-border text-cyber-muted hover:text-white"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-crimson hover:bg-crimson-bright text-white shadow-[0_0_15px_rgba(255,30,39,0.5)] flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>TRANSMIT DISPATCH</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
