import React, { useState, useEffect } from 'react';
import { User, Shield, GraduationCap, Bot, X, Check, Edit3, LogIn, LogOut } from 'lucide-react';

export function UserProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  googleUser,
  onLoginClick,
  onLogoutClick
}) {
  const [userName, setUserName] = useState('');
  const [companionName, setCompanionName] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName || '');
      setCompanionName(profile.companionName || '');
      setCourseTitle(profile.courseTitle || '');
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      userName: userName.trim(),
      companionName: companionName.trim(),
      courseTitle: courseTitle.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden font-mono-tech">
        {/* Futuristic Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-slate-100 text-lg tracking-wide uppercase">
                OPERATOR PROFILE MATRIX
              </h3>
              <p className="text-xs text-cyan-400/70">
                CONFIG // USER & COGNITIVE COMPANION DATA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Google Auth Banner in Modal */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
            {googleUser ? (
              <div className="flex items-center gap-3">
                {googleUser.picture && (
                  <img src={googleUser.picture} alt="" className="w-9 h-9 rounded-full border border-emerald-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    GOOGLE AUTHENTICATED
                  </div>
                  <div className="text-xs text-slate-200">{googleUser.email}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-amber-400">GUEST MODE</div>
                <div className="text-[11px] text-slate-400">Sign in with Gmail to sync progress across devices</div>
              </div>
            )}

            {googleUser ? (
              <button
                type="button"
                onClick={onLogoutClick}
                className="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> LOGOUT
              </button>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="px-3 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" /> SIGN IN
              </button>
            )}
          </div>

          {/* User Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-cyan-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> OPERATOR IDENTIFIER (USER NAME)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Arjun Sharma / Operative 01"
              className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-sm"
              required
            />
          </div>

          {/* AI Companion / Friend Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-purple-400 flex items-center gap-2">
              <Bot className="w-3.5 h-3.5" /> COGNITIVE COMPANION / FRIEND ALIAS
            </label>
            <input
              type="text"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="e.g. JARVIS / Mitra / Arya"
              className="w-full bg-slate-950/80 border border-purple-500/30 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 text-sm"
              required
            />
          </div>

          {/* Grade / Standard / Course Title */}
          <div className="space-y-1.5">
            <label className="text-xs text-emerald-400 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5" /> GRADE / STANDARD / COURSE TITLE
            </label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. B.Tech Computer Science / Grade 12 CBSE / UPSC Prep"
              className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 text-sm"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> SAVE PROFILE MATRIX
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
