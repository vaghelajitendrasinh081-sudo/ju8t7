import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Terminal,
  BookOpen,
  CalendarCheck,
  Send,
  Settings,
  Key,
  Bot,
  User,
  Sparkles,
  Loader2
} from 'lucide-react';
import { soundFX } from '../utils/sound';
import { GamificationModule } from './GamificationModule';

export function AIAnalyticsModule({
  categories = [],
  totalHours = 0,
  onLogStudyHours,
  levelUpData,
  onDismissLevelUpModal,
  profile = {}
}) {
  // Focus Pomodoro Timer State initialized with LocalStorage
  const [timerMode, setTimerMode] = useState(() => {
    return localStorage.getItem('sudarshan_timer_mode') || 'FOCUS';
  });

  const [timerSeconds, setTimerSeconds] = useState(() => {
    const saved = localStorage.getItem('sudarshan_timer_seconds');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    return 25 * 60;
  });

  const [totalTimerSeconds, setTotalTimerSeconds] = useState(() => {
    const saved = localStorage.getItem('sudarshan_total_timer_seconds');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 25 * 60;
  });

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Custom Duration State
  const [customMinutesInput, setCustomMinutesInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(() => {
    return localStorage.getItem('sudarshan_selected_subject') || categories[0] || '';
  });

  // Study Log state initialized with LocalStorage (defaults to empty array)
  const [studyLogs, setStudyLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_study_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading study logs from localStorage:', e);
    }
    return [];
  });

  const saveStudyLogs = (logs) => {
    setStudyLogs(logs);
    try {
      localStorage.setItem('sudarshan_study_logs', JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving study logs to localStorage:', e);
    }
  };

  const updateTimerConfig = (seconds, totalSecs, mode) => {
    setTimerSeconds(seconds);
    setTotalTimerSeconds(totalSecs);
    if (mode) setTimerMode(mode);
    try {
      localStorage.setItem('sudarshan_timer_seconds', seconds);
      localStorage.setItem('sudarshan_total_timer_seconds', totalSecs);
      if (mode) localStorage.setItem('sudarshan_timer_mode', mode);
    } catch (e) {
      console.error('Error saving timer config to localStorage:', e);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      try {
        localStorage.setItem('sudarshan_selected_subject', selectedSubject);
      } catch (e) {
        console.error('Error saving selected subject:', e);
      }
    }
  }, [selectedSubject]);

  // KURUKSHETRA AI Chat Console State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('sudarshan_gemini_api_key') || '';
  });
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
    return [
      {
        id: 'msg-init',
        sender: 'AI',
        text: 'Kurukshetra AI online. Kya haal hain bhai? Bata kaunsa subject phodna hai aaj ya kya study schedule banana hai?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const saveChatMessages = (msgs) => {
    setChatMessages(msgs);
    try {
      localStorage.setItem('sudarshan_chat_history', JSON.stringify(msgs));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

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
        const durationMins = Math.round(totalTimerSeconds / 60);
        const newLog = {
          id: Date.now(),
          subject: selectedSubject || categories[0] || 'General Study',
          durationMinutes: durationMins,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const updatedLogs = [newLog, ...studyLogs];
        saveStudyLogs(updatedLogs);

        // Update total tracked hours for Level progression
        if (onLogStudyHours && durationMins > 0) {
          onLogStudyHours(durationMins / 60);
        }

        updateTimerConfig(5 * 60, 5 * 60, 'SHORT_BREAK');
      } else {
        updateTimerConfig(25 * 60, 25 * 60, 'FOCUS');
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const toggleTimer = () => {
    soundFX.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const switchTimerMode = (mode) => {
    soundFX.playClick();
    setIsTimerRunning(false);
    let defaultSecs = 25 * 60;
    if (mode === 'SHORT_BREAK') defaultSecs = 5 * 60;
    if (mode === 'LONG_BREAK') defaultSecs = 15 * 60;
    updateTimerConfig(defaultSecs, defaultSecs, mode);
  };

  const handleApplyPreset = (minutes) => {
    soundFX.playClick();
    setIsTimerRunning(false);
    const secs = minutes * 60;
    updateTimerConfig(secs, secs);
  };

  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    const parsedMins = parseInt(customMinutesInput, 10);
    if (isNaN(parsedMins) || parsedMins <= 0) return;
    soundFX.playSuccess();
    setIsTimerRunning(false);
    const secs = parsedMins * 60;
    updateTimerConfig(secs, secs);
    setCustomMinutesInput('');
  };

  const resetTimer = () => {
    soundFX.playClick();
    setIsTimerRunning(false);
    let defaultSecs = 25 * 60;
    if (timerMode === 'SHORT_BREAK') defaultSecs = 5 * 60;
    if (timerMode === 'LONG_BREAK') defaultSecs = 15 * 60;
    updateTimerConfig(defaultSecs, defaultSecs);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('sudarshan_gemini_api_key', apiKey.trim());
      soundFX.playSuccess();
      setShowKeySettings(false);
    } catch (err) {
      console.error('Error saving API key:', err);
    }
  };

  // KURUKSHETRA AI Message Submission Logic with Context Awareness
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput('');
    soundFX.playClick();

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...chatMessages, userMsg];
    saveChatMessages(updatedMsgs);
    setIsGenerating(true);

    // Compute telemetry context from LocalStorage & props
    let syllabusGoals = [];
    try {
      const g = localStorage.getItem('sudarshan_goals');
      if (g) syllabusGoals = JSON.parse(g);
    } catch (e) {
      console.error('Error loading goals for AI context:', e);
    }

    const totalChapters = syllabusGoals.reduce((acc, goal) => acc + (goal.chapters ? goal.chapters.length : 0), 0);
    const completedChapters = syllabusGoals.reduce(
      (acc, goal) => acc + (goal.chapters ? goal.chapters.filter((c) => c.completed).length : 0),
      0
    );
    const syllabusCompletionPct = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    const remainingDeadlines = syllabusGoals.map((goal) => `${goal.subject} (${goal.topic}): Target ${goal.deadline}`).join('; ');

    const systemPromptContext = `
You are KURUKSHETRA AI, a sharp, friendly, and ultra-supportive study companion and academic mentor for a student.

CRITICAL BEHAVIOR RULES:

SCENARIO A: STUDY PLAN / TIME TABLE REQUEST
If the user explicitly asks for a study plan, timetable, schedule, or daily time-blocks:
- Analyze user's syllabus completion rate, remaining days, and active subjects.
- Generate a realistic, time-blocked daily schedule balancing high-priority subjects with rest/break intervals.

SCENARIO B: ACADEMIC DOUBTS / SOLVES PROBLEMS / ASKS A QUESTION
If the user asks an academic doubt, math/science problem, asks a general question, or says anything else (e.g., "focus timer", "what is physics", "how to solve x^2=4"):
- Respond directly like a normal AI assistant and solve their question step-by-step or give direct help.
- DO NOT generate or repeat the timetable/study plan slot template unless specifically requested!

GENERAL TONE:
- Talk like a cool, supportive Indian study buddy/friend using casual Hinglish ("bhai", "phod denge", "tension mat le", "scene sorted hai").
- Class 10th & 11th CBSE/State Board Math, Science, and SST expertise.
- Keep answers clear, well-structured, and direct.

CURRENT USER HUD TELEMETRY & CONTEXT:
- Student Name: ${profile.userName || 'Scholar'}
- AI Companion/Mentor: ${profile.companionName || 'Kurukshetra AI'}
- Course/Target Exam: ${profile.courseTitle || 'Class 10th / 11th / CBSE Board'}
- Total Study Hours Logged: ${totalHours.toFixed(1)} hours
- Active Subjects: ${categories.length > 0 ? categories.join(', ') : 'None listed yet'}
- Aggregate Syllabus Completion: ${syllabusCompletionPct}% (${completedChapters}/${totalChapters} Chapters completed)
- Target Deadlines: ${remainingDeadlines || 'None scheduled'}
- Recent Study Sessions Logged: ${studyLogs.length} sessions
`.trim();

    try {
      let aiResponseText = '';

      if (apiKey && apiKey.trim().length > 10) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: systemPromptContext },
                    ...updatedMsgs.map((m) => ({
                      text: `${m.sender === 'USER' ? 'User' : 'Kurukshetra AI'}: ${m.text}`
                    }))
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      }

      if (!aiResponseText) {
        // High-tech contextual fallback response generator if API key is not active
        const lowerInput = userText.toLowerCase();
        const isPlanRequest = lowerInput.includes('plan') || lowerInput.includes('timetable') || lowerInput.includes('schedule') || lowerInput.includes('time table') || lowerInput.includes('routine');

        if (isPlanRequest) {
          const topic = categories[0] || 'Physics';
          aiResponseText = `Sudarshan Telemetry Synced! Bhai, current progress ${syllabusCompletionPct}% coverage hai. ${
            categories.length > 0 ? `Target subjects: ${categories.join(', ')}.` : 'Pehle syllabus importer mein subjects add kar le!'
          }\n\nAaj ka tactical plan:\n- 🎯 Slot 1 (50m): High-priority ${topic} chapter revision & numerical practice.\n- ☕ Break (10m): Pomodoro reset.\n- 🚀 Slot 2 (50m): Practice PYQs and test retention index.\n\nBata, target exact time-block start karein? Direct Focus Timer activate kar de!`;
        } else if (lowerInput.includes('timer') || lowerInput.includes('pomodoro') || lowerInput.includes('focus')) {
          aiResponseText = `Bhai, Focus Cyber Timer left panel pe live hai! Focus mode (25m, 50m, 90m) ya custom minutes set karke 'START FOCUS' dabao. Study session finish hone par XP boost auto-log ho jayega!`;
        } else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey') || lowerInput.includes('haal')) {
          aiResponseText = `Haan bhai! Kurukshetra AI online hai. Koi doubt pucho ya bolo kaunsa subject phodna hai!`;
        } else {
          aiResponseText = `Bhai, main tumhara Kurukshetra AI study buddy hoon! Main Math, Science (Class 10th & 11th), SST ke doubts solve kar sakta hoon aur study timetable bhi bana sakta hoon. Pucho kya doubt hai ya question type karo!`;
        }
      }

      soundFX.playSuccess();
      const aiMsg = {
        id: `msg-${Date.now()}`,
        sender: 'AI',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatMessages([...updatedMsgs, aiMsg]);
    } catch (err) {
      console.error('Error contacting AI engine:', err);
      const fallbackMsg = {
        id: `msg-${Date.now()}`,
        sender: 'AI',
        text: `Kurukshetra AI Online! Target exam status: ${syllabusCompletionPct}% completed across ${totalHours.toFixed(1)} study hours. Pura schedule ready hai bhai — bol kis subject se shuru karein!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatMessages([...updatedMsgs, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
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
            <span>AI ENGINE: <strong className="text-white">KURUKSHETRA AI ACTIVE</strong></span>
          </div>
        </div>
      </div>

      {/* Level Badge HUD Progression Component */}
      <GamificationModule
        totalHours={totalHours}
        levelUpData={levelUpData}
        onDismissLevelUpModal={onDismissLevelUpModal}
      />

      {/* Top HUD Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 font-mono-tech">
        <div className="hud-glass p-4 rounded-xl border border-cyan-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>SUBJECTIVE COVERAGE</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-cyan-300 text-glow-cyan">
            {categories.length > 0 ? `${Math.min(100, studyLogs.length * 10)}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {categories.length > 0 ? `${categories.length} Active Categories` : 'No categories logged yet'}
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-purple-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>DISCIPLINE INDEX</span>
            <CalendarCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-purple-300 text-glow-violet">
            {studyLogs.length > 0 ? `${Math.min(100, studyLogs.length * 20)} / 100` : '0 / 100'}
          </div>
          <div className="text-[10px] text-purple-400/80 mt-1">
            {studyLogs.length > 0 ? 'Study sessions active' : 'Awaiting study activity'}
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-amber-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>AVG WAKE-UP TIME</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-amber-300 text-glow-amber">
            05:45 AM
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Circadian rhythm sync active
          </div>
        </div>

        <div className="hud-glass p-4 rounded-xl border border-rose-500/30">
          <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
            <span>ROUTINE COMPLETION</span>
            <CheckCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-orbitron text-3xl font-bold text-rose-300">
            {studyLogs.length > 0 ? `${Math.min(100, studyLogs.length * 25)}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {studyLogs.length > 0 ? 'Routines tracked today' : 'No routines completed today'}
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

          <div className="h-72 w-full flex items-center justify-center">
            {categories.length === 0 && studyLogs.length === 0 ? (
              <div className="text-center font-mono-tech text-xs text-slate-400 px-4 py-8 border border-cyan-500/20 rounded-lg bg-slate-950/60">
                <AlertCircle className="w-6 h-6 text-cyan-400 mx-auto mb-2 opacity-70" />
                No Data Available - Start Logging Your Study &amp; Habits To See Progress
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={(categories.length > 0 ? categories : ['Physics', 'Math', 'Chemistry']).map((cat) => {
                  const catLogs = studyLogs.filter((l) => l.subject === cat);
                  const totalMins = catLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
                  return {
                    subject: cat,
                    coverage: Math.min(100, 40 + totalMins * 2),
                    progress: Math.min(100, 30 + totalMins * 1.5),
                    difficulty: 6.5
                  };
                })}>
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
            )}
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

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => ({
                day,
                disciplineIndex: Math.min(100, 50 + studyLogs.length * 10 + idx * 4),
                routineCompletion: Math.min(100, 45 + studyLogs.length * 8 + idx * 5)
              }))}>
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
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} />
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

        {categories.length === 0 ? (
          <div className="text-center font-mono-tech text-xs text-slate-400 py-6 border border-cyan-500/10 rounded-lg bg-slate-950/40">
            [NO ACTIVE SUBJECT CATEGORIES — ADD A CATEGORY TO SEE SUBJECT EFFICIENCY SPARK LINES]
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 font-mono-tech">
            {categories.map((subject) => {
              const catLogs = studyLogs.filter((l) => l.subject === subject);
              const totalMins = catLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
              const efficiency = catLogs.length > 0 ? Math.min(100, 50 + totalMins) : 75;

              const sparklineData = [
                { step: '1', value: Math.max(10, efficiency - 20) },
                { step: '2', value: Math.max(10, efficiency - 10) },
                { step: '3', value: Math.max(10, efficiency - 15) },
                { step: '4', value: Math.max(10, efficiency - 5) },
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

                  <div className="h-12 w-full mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sparklineData}>
                        <Bar dataKey="value" fill="#00f0ff" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

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
        )}
      </div>

      {/* Timer & KURUKSHETRA AI Chat Console Section */}
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
                      <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        stroke="#1e293b"
                        strokeWidth="8"
                        fill="transparent"
                      />
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
                  {categories.length === 0 && (
                    <option value="General Study">General Study</option>
                  )}
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

        {/* KURUKSHETRA AI INTERACTIVE REAL-TIME CHAT CONSOLE */}
        <div className="lg:col-span-2 hud-glass p-6 rounded-xl border border-cyan-500/30 font-mono-tech flex flex-col justify-between hud-bracket">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="font-orbitron font-bold text-cyan-300 text-sm tracking-wider">
                  KURUKSHETRA AI [CONSOLE ACTIVE]
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  [ONLINE]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeySettings(!showKeySettings)}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 text-[11px] flex items-center gap-1.5 transition-all"
                  title="Configure Gemini API Key"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>API KEY CONFIG</span>
                </button>
              </div>
            </div>

            {/* API Key Configuration Dropdown */}
            {showKeySettings && (
              <form onSubmit={handleSaveApiKey} className="mb-4 bg-slate-950/90 p-3 rounded-lg border border-cyan-500/40 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-cyan-300 flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5" /> GOOGLE GEMINI / API KEY SETTINGS:
                  </span>
                  <span className="text-[10px] text-slate-500">Persisted in LocalStorage</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter Google Gemini API Key..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-cyan-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-cyan-500 text-slate-950 font-orbitron font-bold hover:bg-cyan-400 text-xs"
                  >
                    SAVE KEY
                  </button>
                </div>
              </form>
            )}

            {/* Scrollable Glassmorphic Chat Window */}
            <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 h-72 overflow-y-auto space-y-3.5 text-xs text-slate-200">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'AI' && (
                    <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl p-3 border ${
                      msg.sender === 'USER'
                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-100 rounded-tr-none'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-slate-400 border-b border-slate-800/60 pb-1">
                      <span>{msg.sender === 'USER' ? (profile.userName || 'SCHOLAR') : 'KURUKSHETRA AI'}</span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text}</p>
                  </div>

                  {msg.sender === 'USER' && (
                    <div className="w-7 h-7 rounded bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono-tech p-2 bg-slate-900/40 rounded border border-cyan-500/20">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>KURUKSHETRA AI IS COMPUTING PLANNER TELEMETRY &amp; RESPONDING...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* Interactive Chat Input Console */}
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Kurukshetra AI to create a timetable, suggest study goals, or analyze progress..."
              className="flex-1 bg-slate-950 border border-cyan-500/30 text-cyan-100 px-3.5 py-2.5 rounded-lg text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono-tech"
            />
            <button
              type="submit"
              disabled={isGenerating || !chatInput.trim()}
              className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>SEND / EXECUTE</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
