import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Terminal,
  Cpu,
  BookOpen,
  CalendarCheck
} from 'lucide-react';
import { soundFX } from '../utils/sound';

// Graph 1: Subjective / Academic Progress Data
const ACADEMIC_PROGRESS_DATA = [
  { subject: 'Physics', coverage: 85, progress: 78, difficulty: 8.5 },
  { subject: 'AI / ML', coverage: 90, progress: 82, difficulty: 7.8 },
  { subject: 'Astrophysics', coverage: 70, progress: 65, difficulty: 9.0 },
  { subject: 'Engineering', coverage: 80, progress: 74, difficulty: 7.2 },
  { subject: 'Mathematics', coverage: 95, progress: 91, difficulty: 8.8 },
  { subject: 'Computer Sci', coverage: 88, progress: 85, difficulty: 7.5 },
];

// Graph 2: Daily Habits & Discipline Analytics Data
const DISCIPLINE_HABITS_DATA = [
  { day: 'MON', wakeUpTime: 6.0, routineCompletion: 85, studyConsistency: 90, disciplineIndex: 88 },
  { day: 'TUE', wakeUpTime: 6.2, routineCompletion: 92, studyConsistency: 94, disciplineIndex: 93 },
  { day: 'WED', wakeUpTime: 6.5, routineCompletion: 78, studyConsistency: 80, disciplineIndex: 79 },
  { day: 'THU', wakeUpTime: 6.0, routineCompletion: 95, studyConsistency: 96, disciplineIndex: 95 },
  { day: 'FRI', wakeUpTime: 6.1, routineCompletion: 88, studyConsistency: 91, disciplineIndex: 90 },
  { day: 'SAT', wakeUpTime: 5.8, routineCompletion: 98, studyConsistency: 98, disciplineIndex: 98 },
  { day: 'SUN', wakeUpTime: 6.5, routineCompletion: 82, studyConsistency: 85, disciplineIndex: 84 },
];

const AI_RECOMMENDATIONS = [
  "RECOMMENDATION 01: Academic syllabus coverage is strongest in Mathematics (95%) and AI / ML (90%). Focus extra revision density on Astrophysics.",
  "RECOMMENDATION 02: Discipline analytics peak on Saturday (98% index) following a 05:48 AM wake-up cycle. Maintain morning circadian rhythm.",
  "RECOMMENDATION 03: Routine completion correlates +0.92 with overall focus scores. Recommended 25-min Pomodoro focus window active.",
  "RECOMMENDATION 04: Cognitive retention across all dynamic subjects remains above baseline targets across Kurukshetra Observatory nodes.",
];

export function AIAnalyticsModule({
  categories = ['Physics', 'AI / ML', 'Astrophysics', 'Engineering', 'Mathematics']
}) {
  // Focus Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('FOCUS'); // 'FOCUS', 'SHORT_BREAK', or 'LONG_BREAK'

  // Custom Duration State
  const [customMinutesInput, setCustomMinutesInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(categories[0] || 'Physics');

  // Study Log state
  const [studyLogs, setStudyLogs] = useState([
    { id: 1, subject: 'Physics', durationMinutes: 25, timestamp: '10:15 AM' },
    { id: 2, subject: 'Mathematics', durationMinutes: 50, timestamp: '11:45 AM' },
  ]);

  // AI Typewriter Terminal state
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // Pomodoro Timer Effect
  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      soundFX.playSuccess();
      setIsTimerRunning(false);
      if (timerMode === 'FOCUS') {
        // Log completed study session
        const durationMins = Math.round(totalTimerSeconds / 60);
        const newLog = {
          id: Date.now(),
          subject: selectedSubject || categories[0] || 'General Study',
          durationMinutes: durationMins,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setStudyLogs((prev) => [newLog, ...prev]);

        setTimerMode('SHORT_BREAK');
        setTimerSeconds(5 * 60);
        setTotalTimerSeconds(5 * 60);
      } else {
        setTimerMode('FOCUS');
        setTimerSeconds(25 * 60);
        setTotalTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds, timerMode]);

  // AI Typewriter Recommendation Effect
  useEffect(() => {
    const currentFullText = AI_RECOMMENDATIONS[recommendationIndex];
    if (charIndex < currentFullText.length) {
      const typeTimer = setTimeout(() => {
        setTypedText((prev) => prev + currentFullText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(typeTimer);
    } else {
      const cycleTimer = setTimeout(() => {
        setRecommendationIndex((prev) => (prev + 1) % AI_RECOMMENDATIONS.length);
        setTypedText('');
        setCharIndex(0);
      }, 5000);
      return () => clearTimeout(cycleTimer);
    }
  }, [charIndex, recommendationIndex]);

  const toggleTimer = () => {
    soundFX.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const switchTimerMode = (mode) => {
    soundFX.playClick();
    setIsTimerRunning(false);
    setTimerMode(mode);
    let defaultSecs = 25 * 60;
    if (mode === 'SHORT_BREAK') defaultSecs = 5 * 60;
    if (mode === 'LONG_BREAK') defaultSecs = 15 * 60;
    setTimerSeconds(defaultSecs);
    setTotalTimerSeconds(defaultSecs);
  };

  const handleApplyPreset = (minutes) => {
    soundFX.playClick();
    setIsTimerRunning(false);
    const secs = minutes * 60;
    setTimerSeconds(secs);
    setTotalTimerSeconds(secs);
  };

  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    const parsedMins = parseInt(customMinutesInput, 10);
    if (isNaN(parsedMins) || parsedMins <= 0) return;
    soundFX.playSuccess();
    setIsTimerRunning(false);
    const secs = parsedMins * 60;
    setTimerSeconds(secs);
    setTotalTimerSeconds(secs);
    setCustomMinutesInput('');
  };

  const resetTimer = () => {
    soundFX.playClick();
    setIsTimerRunning(false);
    let defaultSecs = 25 * 60;
    if (timerMode === 'SHORT_BREAK') defaultSecs = 5 * 60;
    if (timerMode === 'LONG_BREAK') defaultSecs = 15 * 60;
    setTimerSeconds(defaultSecs);
    setTotalTimerSeconds(defaultSecs);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div id="analytics-console" className="max-w-7xl mx-auto px-4 py-8 font-space">

      {/* Module Title Banner */}
      <div className="hud-glass p-6 rounded-xl border border-amber-500/30 mb-6 hud-bracket flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono-tech text-xs tracking-wider mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>MODULE 03 // COGNITIVE PERFORMANCE &amp; DUAL AI TELEMETRY</span>
          </div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
            AI ANALYTICS &amp; DISCIPLINE HUD
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <div className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI ENGINE: <strong className="text-white">QUANTUM-7 ONLINE</strong></span>
          </div>
        </div>
      </div>

      {/* Top HUD Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 font-mono-tech">
        <div className="hud-glass p-4 rounded-xl border border-cyan-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>SYLLABUS COVERAGE</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-cyan-300 text-glow-cyan">
            84.6%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            ▲ +6.4% across imported subjects
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-purple-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>DISCIPLINE INDEX</span>
            <CalendarCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-purple-300 text-glow-violet">
            91 / 100
          </div>
          <div className="text-[10px] text-purple-400/80 mt-1">
            Consistent routine &amp; study blocks
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-amber-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>AVG WAKE-UP TIME</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-amber-300 text-glow-amber">
            06:08 AM
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Optimal circadian focus window
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-rose-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>ROUTINE COMPLETION</span>
            <CheckCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-rose-300">
            89.2%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">
            ▲ +3.1% habit consistency
          </div>
        </div>
      </div>

      {/* Dual AI Analytics Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* GRAPH 1: Subjective / Academic Progress */}
        <div className="hud-glass p-6 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
            <div>
              <h3 className="font-orbitron text-base md:text-lg font-bold text-cyan-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                GRAPH 1: ACADEMIC PROGRESS &amp; COVERAGE
              </h3>
              <p className="text-xs font-mono-tech text-slate-400">
                Syllabus coverage %, completion progress %, and subject difficulty rating
              </p>
            </div>
            <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              ACADEMIC
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ACADEMIC_PROGRESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11, fill: '#f59e0b' }} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#00f0ff',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'Share Tech Mono',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Share Tech Mono' }} />
                <Bar yAxisId="left" dataKey="coverage" name="Coverage (%)" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="progress" name="Progress (%)" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="difficulty" name="Difficulty (1-10)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: Daily Habits & Discipline Analytics */}
        <div className="hud-glass p-6 rounded-xl border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-purple-500/20 pb-3">
            <div>
              <h3 className="font-orbitron text-base md:text-lg font-bold text-purple-300 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-purple-400" />
                GRAPH 2: DAILY HABITS &amp; DISCIPLINE ANALYTICS
              </h3>
              <p className="text-xs font-mono-tech text-slate-400">
                Tracking routine completion %, study session consistency %, and overall discipline
              </p>
            </div>
            <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
              DISCIPLINE
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DISCIPLINE_HABITS_DATA}>
                <defs>
                  <linearGradient id="purpleDiscipline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="emeraldRoutine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#a855f7',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'Share Tech Mono',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Share Tech Mono' }} />
                <Area
                  type="monotone"
                  dataKey="disciplineIndex"
                  name="Discipline Index Score"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#purpleDiscipline)"
                />
                <Area
                  type="monotone"
                  dataKey="routineCompletion"
                  name="Routine Completion (%)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#emeraldRoutine)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Mini Subject-Efficiency Graphs Bar */}
      <div className="hud-glass p-6 rounded-xl border border-cyan-500/20 mb-6">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 font-mono-tech text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>MINI SUBJECT-EFFICIENCY TELEMETRY (SPARKLINE / MINI-BARS)</span>
          </div>
          <span className="text-slate-400">ACTIVE SUBJECT NODES: {categories.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 font-mono-tech">
          {categories.map((subject, idx) => {
            // Generate deterministic or mapped efficiency percentage
            const presetEfficiencies = {
              'Physics': 88,
              'AI / ML': 92,
              'Astrophysics': 81,
              'Engineering': 74,
              'Mathematics': 95
            };
            const efficiency = presetEfficiencies[subject] || (75 + ((idx * 7) % 20));

            // Generate sparkline trend points for mini chart
            const sparklineData = [
              { step: '1', value: Math.max(50, efficiency - 12) },
              { step: '2', value: Math.max(50, efficiency - 5) },
              { step: '3', value: Math.max(50, efficiency - 8) },
              { step: '4', value: Math.max(50, efficiency + 4) },
              { step: '5', value: efficiency }
            ];

            return (
              <div
                key={subject}
                className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 truncate pr-1" title={subject}>
                    {subject}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {efficiency}%
                  </span>
                </div>

                {/* Sparkline Mini-Bar Chart */}
                <div className="h-12 w-full mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sparklineData}>
                      <Bar dataKey="value" fill="#00f0ff" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-cyan-500/20">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${efficiency}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timer & AI Recommendation Terminal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Focus Session Pomodoro Console */}
        <div className="hud-glass p-6 rounded-xl border border-amber-500/30 flex flex-col justify-between hud-bracket">
          <div>
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-3">
              <h3 className="font-orbitron font-bold text-amber-300 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                FOCUS CYBER TIMER
              </h3>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                [{timerMode.replace('_', ' ')}]
              </span>
            </div>

            {/* Mode Toggles */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-lg border border-amber-500/20 mb-4 text-[11px] font-mono-tech">
              <button
                onClick={() => switchTimerMode('FOCUS')}
                className={`py-1 rounded transition-all text-center ${
                  timerMode === 'FOCUS'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FOCUS
              </button>
              <button
                onClick={() => switchTimerMode('SHORT_BREAK')}
                className={`py-1 rounded transition-all text-center ${
                  timerMode === 'SHORT_BREAK'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SHORT BREAK
              </button>
              <button
                onClick={() => switchTimerMode('LONG_BREAK')}
                className={`py-1 rounded transition-all text-center ${
                  timerMode === 'LONG_BREAK'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LONG BREAK
              </button>
            </div>

            {/* Display Ring & Timer (SVG Circular HUD) */}
            <div className="relative my-3 flex items-center justify-center">
              {(() => {
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                const progressRatio = totalTimerSeconds > 0 ? timerSeconds / totalTimerSeconds : 0;
                const strokeDashoffset = circumference * (1 - progressRatio);
                return (
                  <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      {/* Background Ring */}
                      <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="#1e293b"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Progress Ring */}
                      <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="#f59e0b"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500 ease-linear shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-orbitron text-3xl font-black text-amber-300 text-glow-amber tracking-widest">
                        {formatTimer(timerSeconds)}
                      </span>
                      <span className="text-[10px] font-mono-tech text-slate-400 mt-1 tracking-wider">
                        {isTimerRunning ? 'NEURAL SYNC ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Presets & Custom Duration Form */}
            <div className="space-y-3 font-mono-tech text-xs border-t border-slate-800/80 pt-3 mb-4">
              <div className="flex items-center justify-between text-slate-400">
                <span>PRESET DURATION:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleApplyPreset(25)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  >
                    25m
                  </button>
                  <button
                    onClick={() => handleApplyPreset(50)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  >
                    50m
                  </button>
                  <button
                    onClick={() => handleApplyPreset(90)}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  >
                    90m
                  </button>
                </div>
              </div>

              {/* Custom Minutes Input & Subject Selector */}
              <form onSubmit={handleApplyCustomTime} className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-900 border border-amber-500/30 text-slate-200 px-2 py-1 rounded text-xs flex-1 focus:outline-none focus:border-amber-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="480"
                  placeholder="Custom Mins"
                  value={customMinutesInput}
                  onChange={(e) => setCustomMinutesInput(e.target.value)}
                  className="w-24 bg-slate-900 border border-amber-500/30 text-amber-200 px-2 py-1 rounded text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  SET
                </button>
              </form>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 font-mono-tech text-xs">
            <button
              onClick={toggleTimer}
              className={`px-6 py-2.5 rounded-lg font-orbitron font-bold flex items-center gap-2 transition-all ${
                isTimerRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                  : 'bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'PAUSE' : 'START FOCUS'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Study Session Logs */}
          {studyLogs.length > 0 && (
            <div className="mt-4 border-t border-slate-800 pt-3 font-mono-tech text-[11px]">
              <div className="text-slate-400 mb-1.5 flex items-center justify-between">
                <span>LOGGED STUDY SESSIONS:</span>
                <span className="text-amber-400 font-bold">{studyLogs.length} Completed</span>
              </div>
              <div className="max-h-20 overflow-y-auto space-y-1">
                {studyLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                    <span className="text-amber-300 font-bold">{log.subject}</span>
                    <span className="text-slate-400">{log.durationMinutes}m logged @ {log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Automated Recommendations Terminal Window */}
        <div className="lg:col-span-2 hud-glass p-6 rounded-xl border border-cyan-500/30 font-mono-tech flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3 text-xs">
              <div className="flex items-center gap-2 text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>AUTOMATED AI RECOMMENDATION CONSOLE</span>
              </div>
              <span className="text-slate-500 text-[10px]">[KURUKSHETRA AI ACTIVE]</span>
            </div>

            <div className="bg-slate-950 p-4 rounded border border-slate-800 text-xs text-cyan-300 min-h-[100px] flex items-center">
              <span>&gt;&nbsp;{typedText}</span>
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>SYNCED WITH ACADEMIC &amp; DISCIPLINE HUD TELEMETRY</span>
            <span className="text-cyan-400/80">KURUKSHETRA OBSERVATORY // v1.0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
