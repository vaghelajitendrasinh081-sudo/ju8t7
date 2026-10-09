import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Calendar,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Cpu,
  BarChart2,
  Zap,
  AlertTriangle,
  FolderPlus,
  CheckSquare,
  Square,
  BookOpen,
  PieChart
} from 'lucide-react';
import { soundFX } from '../utils/sound';

export function SyllabusImporterModule({
  categories = [],
  onAddCategory,
  onDeleteCategory
}) {
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading goals from localStorage:', e);
    }
    return [];
  });

  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    try {
      localStorage.setItem('sudarshan_goals', JSON.stringify(newGoals));
    } catch (e) {
      console.error('Error saving goals to localStorage:', e);
    }
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Edit deadline state
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editDeadline, setEditDeadline] = useState('');

  // New goal modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalSubject, setNewGoalSubject] = useState(categories[0] || 'Physics');
  const [newGoalTopic, setNewGoalTopic] = useState('');
  const [newGoalChaptersStr, setNewGoalChaptersStr] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('2025-05-15');
  const [newGoalPriority, setNewGoalPriority] = useState('HIGH');

  // New subject modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  // Chapter input state per goal
  const [newChapterInputs, setNewChapterInputs] = useState({});

  // Calculations for overall syllabus stats
  const totalChaptersCount = goals.reduce((acc, g) => acc + (g.chapters ? g.chapters.length : 0), 0);
  const completedChaptersCount = goals.reduce(
    (acc, g) => acc + (g.chapters ? g.chapters.filter((c) => c.completed).length : 0),
    0
  );
  const overallSyllabusPercent =
    totalChaptersCount > 0
      ? Math.round((completedChaptersCount / totalChaptersCount) * 100)
      : 0;

  const handleSimulatedFileUpload = (file) => {
    soundFX.playScan();
    setIsUploading(true);
    setUploadedFileName(file ? file.name : 'Quantum_Physics_Syllabus_2025.pdf');
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          soundFX.playSuccess();
          const extractedSubject = categories[Math.floor(Math.random() * categories.length)] || 'Physics';
          const extractedGoal = {
            id: `goal-${Date.now()}`,
            subject: extractedSubject,
            topic: 'Neural Signal Decoders & BCI Telemetry',
            targetProgress: 0,
            deadline: '2025-05-15',
            priority: 'HIGH',
            chapters: [
              { id: `chap-${Date.now()}-1`, title: 'Chapter 1: Signal Digitization & Filtering', completed: true },
              { id: `chap-${Date.now()}-2`, title: 'Chapter 2: Neural Spike Sorting Algorithms', completed: false },
              { id: `chap-${Date.now()}-3`, title: 'Chapter 3: BCI Latency Minimization', completed: false }
            ]
          };
          setGoals((g) => {
            const updated = [extractedGoal, ...g];
            try {
              localStorage.setItem('sudarshan_goals', JSON.stringify(updated));
            } catch (e) {
              console.error('Error saving goals to localStorage:', e);
            }
            return updated;
          });
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulatedFileUpload(e.dataTransfer.files[0]);
    }
  };

  const toggleChapter = (goalId, chapterId) => {
    soundFX.playClick();
    const updated = goals.map((g) => {
      if (g.id === goalId && g.chapters) {
        const updatedChapters = g.chapters.map((c) =>
          c.id === chapterId ? { ...c, completed: !c.completed } : c
        );
        const comp = updatedChapters.filter((c) => c.completed).length;
        const total = updatedChapters.length;
        const newPct = total > 0 ? Math.round((comp / total) * 100) : 0;
        return { ...g, chapters: updatedChapters, targetProgress: newPct };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleAddChapterToGoal = (goalId) => {
    const title = newChapterInputs[goalId]?.trim();
    if (!title) return;
    soundFX.playSuccess();
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const chapters = g.chapters || [];
        const newChap = { id: `chap-${Date.now()}`, title, completed: false };
        const updatedChapters = [...chapters, newChap];
        const comp = updatedChapters.filter((c) => c.completed).length;
        const total = updatedChapters.length;
        const newPct = total > 0 ? Math.round((comp / total) * 100) : 0;
        return { ...g, chapters: updatedChapters, targetProgress: newPct };
      }
      return g;
    });
    saveGoals(updated);
    setNewChapterInputs((prev) => ({ ...prev, [goalId]: '' }));
  };

  const handleDeleteGoal = (id) => {
    soundFX.playClick();
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
  };

  const handleSaveDeadline = (id) => {
    soundFX.playSuccess();
    const updated = goals.map((g) => (g.id === id ? { ...g, deadline: editDeadline } : g));
    saveGoals(updated);
    setEditingGoalId(null);
  };

  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalTopic.trim()) return;
    soundFX.playSuccess();

    const rawChapters = newGoalChaptersStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const chapters = rawChapters.map((title, idx) => ({
      id: `chap-${Date.now()}-${idx}`,
      title,
      completed: false
    }));

    const newGoal = {
      id: `goal-${Date.now()}`,
      subject: newGoalSubject || (categories[0] || 'General'),
      topic: newGoalTopic.trim(),
      targetProgress: 0,
      deadline: newGoalDeadline,
      priority: newGoalPriority,
      chapters: chapters.length > 0 ? chapters : [
        { id: `chap-${Date.now()}-0`, title: 'Chapter 1: Foundations', completed: false }
      ]
    };

    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setNewGoalTopic('');
    setNewGoalChaptersStr('');
    setShowGoalModal(false);
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!customCatInput.trim()) return;
    soundFX.playSuccess();
    if (onAddCategory) {
      onAddCategory(customCatInput.trim());
    }
    setNewGoalSubject(customCatInput.trim());
    setCustomCatInput('');
    setShowCatModal(false);
  };

  return (
    <div id="syllabus-console" className="max-w-7xl mx-auto px-4 py-8 font-space">

      {/* Module Title Banner */}
      <div className="hud-glass p-6 rounded-xl border border-purple-500/30 mb-6 hud-bracket flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono-tech text-xs tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>MODULE 02 // SYLLABUS PARSER &amp; GOAL BREAKDOWN</span>
          </div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
            SYLLABUS &amp; GOAL IMPORTER
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowCatModal(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="px-3.5 py-1.5 rounded bg-purple-950/80 border border-purple-500/40 hover:border-purple-400 text-purple-300 flex items-center gap-2 font-orbitron font-bold text-xs"
          >
            <FolderPlus className="w-4 h-4 text-purple-400" />
            <span>+ NEW SUBJECT</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowGoalModal(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="px-3.5 py-1.5 rounded bg-purple-500 text-slate-950 font-orbitron font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ADD GOAL</span>
          </button>

          <div className="px-3 py-1.5 rounded bg-slate-900 border border-purple-500/30 flex items-center gap-2 text-slate-400">
            <Target className="w-4 h-4 text-purple-400" />
            <span>ACTIVE GOALS: <strong className="text-purple-300">{goals.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Aggregate Overall Syllabus Completion Stats Telemetry Bar */}
      <div className="hud-glass p-5 rounded-xl border border-purple-500/30 mb-6 font-mono-tech flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-purple-400/80 uppercase tracking-widest font-bold">
              OVERALL SYLLABUS COMPLETION TELEMETRY
            </span>
            <div className="text-xl font-orbitron font-extrabold text-white flex items-center gap-2">
              <span>{overallSyllabusPercent}% COMPLETED</span>
              <span className="text-xs text-slate-400 font-mono-tech font-normal">
                ({completedChaptersCount} / {totalChaptersCount} Chapters Checked)
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-1.5">
          <div className="flex justify-between text-xs text-purple-300 font-bold">
            <span>AGGREGATE PROGRESS</span>
            <span>{overallSyllabusPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-purple-500/40 p-0.5">
            <div
              className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${overallSyllabusPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="mb-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`hud-glass p-8 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden ${
            isDragOver
              ? 'border-purple-400 bg-purple-950/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
              : 'border-purple-500/30 hover:border-purple-400/60 hover:bg-slate-900/50'
          }`}
          onClick={() => !isUploading && handleSimulatedFileUpload(null)}
        >
          {isUploading && (
            <div className="absolute inset-0 bg-purple-500/10 pointer-events-none flex flex-col justify-end">
              <div
                className="bg-purple-500/30 h-1 w-full shadow-[0_0_15px_#a855f7] transition-all duration-200"
                style={{ bottom: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-400/40 flex items-center justify-center mb-4 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="font-orbitron font-bold text-lg text-white mb-1">
            IMPORT SYLLABUS PDF OR TOPIC LIST
          </h3>
          <p className="text-xs text-slate-400 font-mono-tech max-w-md mb-4">
            Drag and drop your syllabus file (.pdf, .docx, .txt) to automatically extract core topics, deadline schedules, and cognitive target goals.
          </p>

          {isUploading ? (
            <div className="w-full max-w-xs space-y-2 font-mono-tech">
              <div className="flex justify-between text-xs text-purple-300">
                <span>PARSING {uploadedFileName}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-purple-500/20 text-purple-300 text-xs font-mono-tech border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>SIMULATE AI SYLLABUS SCAN</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Goal Breakdown Cards with Chapter Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono-tech text-xs text-slate-400 border-b border-purple-500/20 pb-2">
          <span className="flex items-center gap-2 text-purple-300">
            <Target className="w-4 h-4" />
            EXTRACTED STUDY GOALS &amp; CHAPTER BREAKDOWN
          </span>
          <span>SYNC STATUS: [ONLINE]</span>
        </div>

        {/* Active Categories Pill Manager */}
        <div className="hud-glass p-3 rounded-lg border border-purple-500/20 mb-4 flex flex-wrap items-center gap-2 font-mono-tech text-xs">
          <span className="text-slate-400 font-bold mr-1">ACTIVE SUBJECTS:</span>
          {categories.length === 0 ? (
            <span className="text-slate-500 italic">// NO CUSTOM SUBJECTS YET — CLICK "+ NEW SUBJECT" TO ADD</span>
          ) : (
            categories.map((cat) => (
              <div
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold"
              >
                <span>{cat}</span>
                {onDeleteCategory && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onDeleteCategory(cat);
                    }}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                    title={`Delete subject '${cat}'`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {goals.length === 0 ? (
          <div className="hud-glass p-8 rounded-xl text-center text-slate-400 font-mono-tech border border-purple-500/20">
            [NO SYLLABUS GOALS INITIALIZED — DRAG &amp; DROP A SYLLABUS FILE OR CLICK "ADD GOAL"]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const isEditingThis = editingGoalId === goal.id;
              const chapters = goal.chapters || [];
              const compChapters = chapters.filter((c) => c.completed).length;
              const subjectPct = chapters.length > 0 ? Math.round((compChapters / chapters.length) * 100) : (goal.targetProgress || 0);

              return (
                <div
                  key={goal.id}
                  className="hud-glass p-5 rounded-xl border border-purple-500/20 hud-glass-hover transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top Metadata */}
                    <div className="flex items-center justify-between mb-2 font-mono-tech">
                      <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
                        {goal.subject}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          goal.priority === 'HIGH'
                            ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                            : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                        }`}
                      >
                        {goal.priority} PRIORITY
                      </span>
                    </div>

                    {/* Goal Topic Title */}
                    <h3 className="font-space font-medium text-base text-slate-100 mb-2">
                      {goal.topic}
                    </h3>

                    {/* Subject Real-time Completion Percentage Bar */}
                    <div className="space-y-1 mb-4 font-mono-tech text-xs bg-slate-950/60 p-3 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          SUBJECT COMPLETION:
                        </span>
                        <span className="text-cyan-300 font-bold">{subjectPct}% ({compChapters}/{chapters.length} Chapters)</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-cyan-500/30">
                        <div
                          className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${subjectPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Chapter-Wise Checklist Section */}
                    <div className="space-y-2 mb-3">
                      <div className="text-xs font-mono-tech text-slate-400 font-bold tracking-wider flex items-center justify-between">
                        <span>CHAPTERS / TOPICS:</span>
                        <span className="text-[10px] text-purple-400/80">CHECK TO UPDATE %</span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {chapters.map((chap) => (
                          <div
                            key={chap.id}
                            onClick={() => toggleChapter(goal.id, chap.id)}
                            className={`flex items-center gap-2.5 min-h-[44px] px-3 py-2 rounded text-xs font-mono-tech cursor-pointer transition-colors border active:scale-98 ${
                              chap.completed
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 line-through'
                                : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-purple-500/40'
                            }`}
                          >
                            {chap.completed ? (
                              <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{chap.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* Add New Chapter Input */}
                      <div className="flex items-center gap-1.5 pt-2">
                        <input
                          type="text"
                          value={newChapterInputs[goal.id] || ''}
                          onChange={(e) =>
                            setNewChapterInputs({ ...newChapterInputs, [goal.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddChapterToGoal(goal.id);
                            }
                          }}
                          placeholder="Add new chapter/topic..."
                          className="flex-1 bg-slate-950 border border-purple-500/30 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-600 font-mono-tech focus:outline-none focus:border-purple-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddChapterToGoal(goal.id)}
                          className="px-2.5 py-1 bg-purple-950 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-mono-tech font-bold rounded"
                        >
                          + ADD
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls & Deadline Picker */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono-tech text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {isEditingThis ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="date"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="bg-slate-900 border border-purple-500/40 text-purple-200 px-2 py-0.5 rounded text-[11px]"
                          />
                          <button
                            onClick={() => handleSaveDeadline(goal.id)}
                            className="px-2 py-0.5 rounded bg-purple-500 text-slate-950 font-bold"
                          >
                            SAVE
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingGoalId(goal.id);
                            setEditDeadline(goal.deadline);
                          }}
                          className="cursor-pointer hover:text-purple-300 underline decoration-purple-500/40"
                          title="Click to edit deadline"
                        >
                          TARGET: {goal.deadline}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="min-w-[44px] min-h-[44px] p-2.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center active:scale-95"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Custom Subject */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass p-6 rounded-2xl border border-purple-400/50 max-w-md w-full hud-bracket">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-400" />
              CREATE NEW SUBJECT / CATEGORY
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-300 mb-1">SUBJECT NAME</label>
                <input
                  type="text"
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  placeholder="e.g. Biology, History, Computer Science..."
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-purple-500 text-slate-950 font-orbitron font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  SAVE SUBJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Goal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass p-6 rounded-2xl border border-purple-400/50 max-w-md w-full hud-bracket">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              ADD NEW STUDY GOAL
            </h3>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-300 mb-1">SUBJECT</label>
                <select
                  value={newGoalSubject}
                  onChange={(e) => setNewGoalSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {categories.length === 0 && (
                    <option value="General">General</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">SUBJECT TOPIC / GOAL TITLE</label>
                <input
                  type="text"
                  value={newGoalTopic}
                  onChange={(e) => setNewGoalTopic(e.target.value)}
                  placeholder="e.g. Quantum Electrodynamics..."
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">CHAPTERS (ONE PER LINE)</label>
                <textarea
                  value={newGoalChaptersStr}
                  onChange={(e) => setNewGoalChaptersStr(e.target.value)}
                  placeholder={`Chapter 1: Wave Functions\nChapter 2: Schrödinger Equation\nChapter 3: Quantum Tunneling`}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400 font-mono-tech text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">TARGET DEADLINE</label>
                  <input
                    type="date"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">PRIORITY</label>
                  <select
                    value={newGoalPriority}
                    onChange={(e) => setNewGoalPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-purple-500 text-slate-950 font-orbitron font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  INITIALIZE GOAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
