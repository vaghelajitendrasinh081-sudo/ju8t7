import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Radio, Terminal, Cpu, Clock, Activity, ChevronRight, Zap, FileText, LayoutGrid, User, Edit3, Menu, X, Trophy, LogIn, LogOut, FlaskConical } from 'lucide-react';
import { soundFX } from '../utils/sound';

export function HUDNavbar({
  activeTab,
  setActiveTab,
  soundMuted,
  setSoundMuted,
  profile,
  onOpenProfileModal,
  googleUser,
  onLoginClick,
  onLogoutClick
}) {
  const [timeStr, setTimeStr] = useState('');
  const [latency, setLatency] = useState(18);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    updateTime();
    const timer = setInterval(updateTime, 100);

    const latTimer = setInterval(() => {
      setLatency(14 + Math.floor(Math.random() * 8));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(latTimer);
    };
  }, []);

  const toggleAudio = () => {
    const nextMute = !soundMuted;
    setSoundMuted(nextMute);
    soundFX.enabled = !nextMute;
    if (!nextMute) soundFX.playClick();
  };

  const handleNavClick = (tabId) => {
    soundFX.playClick();
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (tabId === 'HERO') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 font-mono-tech">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Header */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('HERO')}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-cyan-950/60 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="font-orbitron font-extrabold text-cyan-400 text-lg">S</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-lg tracking-widest text-white flex items-center gap-2">
              SUDARSHAN
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <div className="text-[10px] text-cyan-400/70 tracking-tight flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Kurukshetra Observatory
            </div>
          </div>
        </div>

        {/* Console Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/60 p-1 rounded border border-cyan-500/20">
          {[
            { id: 'HERO', label: '/overview', icon: Shield },
            { id: 'PLANNER', label: '/tasks & schedule', icon: LayoutGrid },
            { id: 'SYLLABUS', label: '/syllabus & goals', icon: FileText },
            { id: 'PRACTICALS', label: '/practicals & lab', icon: FlaskConical },
            { id: 'ANALYTICS', label: '/ai-analytics', icon: Activity },
            { id: 'LEADERBOARD', label: '/leaderboard', icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onMouseEnter={() => soundFX.playHover()}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded text-xs tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live HUD Telemetry, Google Auth & Profile Controls */}
        <div className="flex items-center space-x-3">

          {/* Google Auth Sign In / Logout Button */}
          {googleUser ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-2 py-1 rounded">
              {googleUser.picture ? (
                <img
                  src={googleUser.picture}
                  alt={googleUser.name}
                  className="w-6 h-6 rounded-full border border-emerald-400"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                  {googleUser.name ? googleUser.name[0] : 'G'}
                </div>
              )}
              <span className="hidden sm:inline text-[10px] font-bold text-slate-200 truncate max-w-[80px]">
                {googleUser.name || googleUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onLogoutClick();
                }}
                className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                title="Logout from Google"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFX.playClick();
                onLoginClick();
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.2)] text-xs font-bold transition-all"
              title="Sign in with Google to sync progress"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">SIGN IN</span>
            </button>
          )}

          {/* User Profile Trigger Button */}
          <button
            onClick={onOpenProfileModal}
            onMouseEnter={() => soundFX.playHover()}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-900/90 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400 transition-all text-xs"
            title="Configure User & Companion Profile"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-slate-950 font-bold text-[10px]">
              {profile?.userName ? profile.userName[0].toUpperCase() : <User className="w-3.5 h-3.5 text-slate-950" />}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-bold text-slate-200 truncate max-w-[100px]">
                {profile?.userName || 'SETUP PROFILE'}
              </span>
              <span className="text-[9px] text-cyan-400/80 truncate max-w-[100px]">
                {profile?.courseTitle || 'COGNITIVE HUD'}
              </span>
            </div>
            <Edit3 className="w-3 h-3 text-cyan-400/70 ml-0.5" />
          </button>

          <div className="hidden lg:flex items-center space-x-3 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>LAT: <strong className="text-cyan-300 font-mono-tech">{latency}ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>CORE: <strong className="text-purple-300 font-mono-tech">99.4%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-mono-tech">{timeStr || '12:00:00'}</span>
            </div>
          </div>

          <button
            onClick={toggleAudio}
            onMouseEnter={() => soundFX.playHover()}
            title={soundMuted ? "Enable Audio FX" : "Mute Audio FX"}
            className={`p-2 rounded transition-all duration-200 ${
              soundMuted
                ? 'text-slate-500 bg-slate-900 border border-slate-800'
                : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
            }`}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle Navigation Drawer"
            className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-400 flex items-center justify-center active:scale-95 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Animated Mobile Navigation Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[998] md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-[#05070f]/85 backdrop-blur-xl transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => {
              soundFX.playClick();
              setMobileMenuOpen(false);
            }}
          />

          <div className="relative z-[999] w-4/5 max-w-xs bg-[#0a0e1a]/95 backdrop-blur-2xl border-l border-cyan-500/40 h-full p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="font-orbitron font-bold text-white text-base">NAVIGATION</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Google Auth Section */}
              <div className="mb-4 pb-4 border-b border-cyan-500/20">
                {googleUser ? (
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      {googleUser.picture && (
                        <img src={googleUser.picture} alt="" className="w-7 h-7 rounded-full" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">{googleUser.name}</div>
                        <div className="text-[10px] text-emerald-400">{googleUser.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogoutClick();
                        setMobileMenuOpen(false);
                      }}
                      className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-xs font-bold"
                    >
                      LOGOUT
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLoginClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-cyan-400" />
                    SIGN IN WITH GOOGLE
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {[
                  { id: 'HERO', label: '/overview', icon: Shield },
                  { id: 'PLANNER', label: '/tasks & schedule', icon: LayoutGrid },
                  { id: 'SYLLABUS', label: '/syllabus & goals', icon: FileText },
                  { id: 'PRACTICALS', label: '/practicals & lab', icon: FlaskConical },
                  { id: 'ANALYTICS', label: '/ai-analytics', icon: Activity },
                  { id: 'LEADERBOARD', label: '/leaderboard', icon: Trophy },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-lg text-sm font-mono-tech tracking-wider flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer Telemetry */}
            <div className="pt-6 border-t border-cyan-500/20 text-xs font-mono-tech text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>LATENCY:</span>
                <span className="text-cyan-300 font-bold">{latency}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>SYSTEM CORE:</span>
                <span className="text-purple-300 font-bold">99.4%</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
