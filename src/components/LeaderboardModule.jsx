import React, { useState, useEffect } from 'react';
import { Trophy, Award, UserPlus, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { calculateLevelFromHours } from '../utils/gamification';
import { soundFX } from '../utils/sound';

const DEFAULT_OPERATIVES = [
  {
    id: 'op-1',
    userName: 'Arjun Varma',
    companionName: 'GARUDA AI',
    courseTitle: 'Class 11 CBSE PCM',
    totalStudyHours: 84.5,
    syllabusPercent: 88,
    isCurrent: false
  },
  {
    id: 'op-2',
    userName: 'Ananya Sharma',
    companionName: 'SARA AI',
    courseTitle: 'Class 12 JEE Advanced',
    totalStudyHours: 72.0,
    syllabusPercent: 92,
    isCurrent: false
  },
  {
    id: 'op-3',
    userName: 'Vikram Singh',
    companionName: 'CHAKRA AI',
    courseTitle: 'Class 10 CBSE Board',
    totalStudyHours: 61.5,
    syllabusPercent: 78,
    isCurrent: false
  },
  {
    id: 'op-4',
    userName: 'Karan Mehta',
    companionName: 'AGNI AI',
    courseTitle: 'Class 11 NEET Prep',
    totalStudyHours: 49.0,
    syllabusPercent: 65,
    isCurrent: false
  },
  {
    id: 'op-5',
    userName: 'Priya Nair',
    companionName: 'VAJRA AI',
    courseTitle: 'Class 12 Commerce',
    totalStudyHours: 38.5,
    syllabusPercent: 54,
    isCurrent: false
  }
];

export function LeaderboardModule({ currentProfile = {}, currentHours = 0 }) {
  const [operatives, setOperatives] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_leaderboard_operatives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading operatives from localStorage:', e);
    }
    return DEFAULT_OPERATIVES;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newOperativeName, setNewOperativeName] = useState('');
  const [newCompanionName, setNewCompanionName] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('Class 11th CBSE');
  const [newInitialHours, setNewInitialHours] = useState('10');

  // Compute overall syllabus percentage from LocalStorage if available
  const currentSyllabusPercent = React.useMemo(() => {
    try {
      const savedGoals = localStorage.getItem('sudarshan_goals');
      if (savedGoals) {
        const goals = JSON.parse(savedGoals);
        if (Array.isArray(goals) && goals.length > 0) {
          const totalChaps = goals.reduce((acc, g) => acc + (g.chapters ? g.chapters.length : 0), 0);
          const compChaps = goals.reduce((acc, g) => acc + (g.chapters ? g.chapters.filter((c) => c.completed).length : 0), 0);
          return totalChaps > 0 ? Math.round((compChaps / totalChaps) * 100) : 0;
        }
      }
    } catch (e) {
      console.error('Error calculating current syllabus percent:', e);
    }
    return 45; // Default fallback
  }, []);

  // Sync current user active profile into the leaderboard
  useEffect(() => {
    if (!currentProfile?.userName) return;

    setOperatives((prev) => {
      const activeName = currentProfile.userName.trim();
      const existingIdx = prev.findIndex((op) => op.userName.toLowerCase() === activeName.toLowerCase() || op.isCurrent);

      const updatedUserEntry = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `op-current-${Date.now()}`,
        userName: currentProfile.userName,
        companionName: currentProfile.companionName || 'KURUKSHETRA AI',
        courseTitle: currentProfile.courseTitle || 'Class 10th / 11th',
        totalStudyHours: currentHours,
        syllabusPercent: currentSyllabusPercent,
        isCurrent: true
      };

      let updatedList;
      if (existingIdx >= 0) {
        updatedList = [...prev];
        updatedList[existingIdx] = updatedUserEntry;
      } else {
        updatedList = [updatedUserEntry, ...prev];
      }

      try {
        localStorage.setItem('sudarshan_leaderboard_operatives', JSON.stringify(updatedList));
      } catch (e) {
        console.error('Error saving leaderboard operatives:', e);
      }

      return updatedList;
    });
  }, [currentProfile, currentHours, currentSyllabusPercent]);

  const saveOperativesList = (newList) => {
    setOperatives(newList);
    try {
      localStorage.setItem('sudarshan_leaderboard_operatives', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving operatives:', e);
    }
  };

  const handleRegisterOperative = (e) => {
    e.preventDefault();
    if (!newOperativeName.trim()) return;
    soundFX.playSuccess();

    const hoursNum = parseFloat(newInitialHours) || 0;
    const newEntry = {
      id: `op-${Date.now()}`,
      userName: newOperativeName.trim(),
      companionName: newCompanionName.trim() || 'COGNITIVE AI',
      courseTitle: newCourseTitle.trim() || 'Class 11th CBSE',
      totalStudyHours: hoursNum,
      syllabusPercent: Math.min(100, Math.round(hoursNum * 0.8)),
      isCurrent: false
    };

    const updated = [newEntry, ...operatives];
    saveOperativesList(updated);

    setNewOperativeName('');
    setNewCompanionName('');
    setShowAddModal(false);
  };

  // Sort operatives descending by calculated Level, then Total Study Hours
  const sortedOperatives = React.useMemo(() => {
    return [...operatives].sort((a, b) => {
      const lvlA = calculateLevelFromHours(a.totalStudyHours).level;
      const lvlB = calculateLevelFromHours(b.totalStudyHours).level;
      if (lvlB !== lvlA) return lvlB - lvlA;
      return b.totalStudyHours - a.totalStudyHours;
    });
  }, [operatives]);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-bold">
            <Trophy className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>RANK #1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>RANK #2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-bold">
            <Award className="w-4 h-4 text-purple-400" />
            <span>RANK #3</span>
          </div>
        );
      default:
        return (
          <span className="font-mono-tech font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div id="leaderboard-console" className="max-w-7xl mx-auto px-4 py-8 font-space">

      {/* Header Banner */}
      <div className="hud-glass p-6 rounded-xl border border-cyan-500/30 mb-6 hud-bracket flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono-tech text-xs tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>MODULE 04 // OPERATIVE STANDINGS &amp; COGNITIVE LEADERBOARD</span>
          </div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            OPERATIVE STANDINGS
            <span className="text-xs font-mono-tech font-normal px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              GLOBAL RANKINGS
            </span>
          </h2>
        </div>

        {/* Action Button: Register Profile */}
        <button
          onClick={() => {
            soundFX.playClick();
            setShowAddModal(true);
          }}
          onMouseEnter={() => soundFX.playHover()}
          className="px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>+ REGISTER NEW OPERATIVE</span>
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 font-mono-tech">
        {sortedOperatives.slice(0, 3).map((op, idx) => {
          const rank = idx + 1;
          const lvlInfo = calculateLevelFromHours(op.totalStudyHours);

          let borderGlow = 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] bg-amber-950/20';
          let titleColor = 'text-amber-300';
          if (rank === 2) {
            borderGlow = 'border-cyan-500/50 shadow-[0_0_25px_rgba(0,240,255,0.2)] bg-cyan-950/20';
            titleColor = 'text-cyan-300';
          } else if (rank === 3) {
            borderGlow = 'border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)] bg-purple-950/20';
            titleColor = 'text-purple-300';
          }

          return (
            <div
              key={op.id}
              className={`hud-glass p-5 rounded-xl border ${borderGlow} flex flex-col justify-between relative overflow-hidden hud-bracket`}
            >
              <div className="flex items-center justify-between mb-3">
                {getRankBadge(rank)}
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                  LVL {lvlInfo.level} // {lvlInfo.title}
                </span>
              </div>

              <div>
                <h3 className={`font-orbitron font-bold text-lg ${titleColor} flex items-center gap-2 mb-1`}>
                  {op.userName}
                  {op.isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono-tech">
                      [YOU]
                    </span>
                  )}
                </h3>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ally: <strong className="text-slate-200">{op.companionName}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span>{op.courseTitle}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">STUDY HOURS</span>
                  <div className="font-orbitron font-bold text-white text-sm">
                    {op.totalStudyHours.toFixed(1)} hrs
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">SYLLABUS PROGRESS</span>
                  <div className="font-orbitron font-bold text-cyan-300 text-sm">
                    {op.syllabusPercent}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Leaderboard Glassmorphic Table (Desktop) */}
      <div className="hidden md:block hud-glass rounded-xl border border-cyan-500/30 overflow-hidden font-mono-tech mb-8">
        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 font-bold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            LIVE OPERATIVE STANDINGS (SORTED BY LEVEL &amp; STUDY TIME)
          </span>
          <span>TOTAL REGISTERED OPERATIVES: {sortedOperatives.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-950/80 text-cyan-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">RANK</th>
                <th className="py-3.5 px-4 font-bold">OPERATIVE NAME</th>
                <th className="py-3.5 px-4 font-bold">COMPANION / ALLY</th>
                <th className="py-3.5 px-4 font-bold">GRADE / STANDARD</th>
                <th className="py-3.5 px-4 font-bold text-center">LEVEL BADGE</th>
                <th className="py-3.5 px-4 font-bold text-right">STUDY HOURS</th>
                <th className="py-3.5 px-4 font-bold text-right">SYLLABUS %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedOperatives.map((op, idx) => {
                const rank = idx + 1;
                const lvlInfo = calculateLevelFromHours(op.totalStudyHours);

                return (
                  <tr
                    key={op.id}
                    className={`transition-colors ${
                      op.isCurrent
                        ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400 font-medium'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRankBadge(rank)}
                    </td>
                    <td className="py-3.5 px-4 font-space font-semibold text-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{op.userName}</span>
                        {op.isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono-tech">
                            [YOU]
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {op.companionName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {op.courseTitle}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/80 border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        LVL {lvlInfo.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-100 whitespace-nowrap">
                      {op.totalStudyHours.toFixed(1)} hrs
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-cyan-300 whitespace-nowrap">
                      {op.syllabusPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stacked Cyber Cards View for Mobile Screens (<768px) */}
      <div className="md:hidden space-y-3 font-mono-tech mb-8">
        <div className="text-xs text-slate-400 font-bold mb-2 flex items-center justify-between">
          <span>OPERATIVE LIST (MOBILE VIEW)</span>
          <span>{sortedOperatives.length} OPERATIVES</span>
        </div>

        {sortedOperatives.map((op, idx) => {
          const rank = idx + 1;
          const lvlInfo = calculateLevelFromHours(op.totalStudyHours);

          return (
            <div
              key={op.id}
              className={`hud-glass p-4 rounded-xl border transition-all ${
                op.isCurrent
                  ? 'border-cyan-400/80 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'border-slate-800 bg-slate-950/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {getRankBadge(rank)}
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-950 border border-purple-500/40 text-purple-300">
                  LVL {lvlInfo.level}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-space font-semibold text-slate-100 text-sm flex items-center gap-1.5">
                    {op.userName}
                    {op.isCurrent && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                        YOU
                      </span>
                    )}
                  </h4>
                  <div className="text-xs text-slate-400">{op.courseTitle} // {op.companionName}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">HOURS LOGGED</span>
                  <div className="font-bold text-slate-100">{op.totalStudyHours.toFixed(1)} hrs</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px]">SYLLABUS</span>
                  <div className="font-bold text-cyan-300">{op.syllabusPercent}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Register New Operative Profile */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass p-6 rounded-2xl border border-cyan-400/50 max-w-md w-full hud-bracket">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              REGISTER NEW OPERATIVE
            </h3>

            <form onSubmit={handleRegisterOperative} className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-300 mb-1">OPERATIVE NAME</label>
                <input
                  type="text"
                  value={newOperativeName}
                  onChange={(e) => setNewOperativeName(e.target.value)}
                  placeholder="e.g. Rohan Gupta"
                  required
                  className="w-full px-3 py-2.5 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">COMPANION / ALLY NAME</label>
                <input
                  type="text"
                  value={newCompanionName}
                  onChange={(e) => setNewCompanionName(e.target.value)}
                  placeholder="e.g. TRISHUL AI"
                  className="w-full px-3 py-2.5 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">GRADE / STANDARD</label>
                  <input
                    type="text"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="Class 11th CBSE"
                    className="w-full px-3 py-2.5 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">INITIAL STUDY HOURS</label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="0.5"
                    value={newInitialHours}
                    onChange={(e) => setNewInitialHours(e.target.value)}
                    className="w-full px-3 py-2.5 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-cyan-500 text-slate-950 font-orbitron font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  INITIALIZE OPERATIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
