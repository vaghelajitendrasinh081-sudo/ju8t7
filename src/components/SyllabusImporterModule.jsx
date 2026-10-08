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
  FolderPlus
} from 'lucide-react';
import { soundFX } from '../utils/sound';

const INITIAL_GOALS = [
  {
    id: 'goal-1',
    subject: 'Physics',
    topic: 'Relativistic Wave Equations (Dirac Equation & Antimatter)',
    targetProgress: 75,
    deadline: '2025-04-15',
    priority: 'HIGH',
    modulesCount: 8,
    completedModules: 6,
  },
  {
    id: 'goal-2',
    subject: 'AI / ML',
    topic: 'Convex Optimization, Lagrangian Duality & KKT Conditions',
    targetProgress: 40,
    deadline: '2025-04-20',
    priority: 'HIGH',
    modulesCount: 10,
    completedModules: 4,
  },
  {
    id: 'goal-3',
    subject: 'Astrophysics',
    topic: 'Hohmann Transfer Orbits & Gravitational Slingshot Maneuvers',
    targetProgress: 90,
    deadline: '2025-04-05',
    priority: 'MEDIUM',
    modulesCount: 5,
    completedModules: 4.5,
  },
  {
    id: 'goal-4',
    subject: 'Engineering',
    topic: 'Raft Consensus Protocol & Byzantine Fault Tolerance',
    targetProgress: 25,
    deadline: '2025-05-01',
    priority: 'MEDIUM',
    modulesCount: 12,
    completedModules: 3,
  },
];

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
  const [newGoalDeadline, setNewGoalDeadline] = useState('2025-05-15');
  const [newGoalPriority, setNewGoalPriority] = useState('HIGH');

  // New subject modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

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
          // Extract and append a new goal automatically
          const extractedSubject = categories[Math.floor(Math.random() * categories.length)] || 'Physics';
          const extractedGoal = {
            id: `goal-${Date.now()}`,
            subject: extractedSubject,
            topic: 'Neural Signal Decoders & BCI Telemetry Algorithms',
            targetProgress: 10,
            deadline: '2025-05-15',
            priority: 'HIGH',
            modulesCount: 6,
            completedModules: 0.6,
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

  const updateGoalProgress = (id, delta) => {
    soundFX.playClick();
    const updated = goals.map((g) => {
      if (g.id === id) {
        const nextVal = Math.min(100, Math.max(0, g.targetProgress + delta));
        return { ...g, targetProgress: nextVal };
      }
      return g;
    });
    saveGoals(updated);
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
    const newGoal = {
      id: `goal-${Date.now()}`,
      subject: newGoalSubject,
      topic: newGoalTopic.trim(),
      targetProgress: 20,
      deadline: newGoalDeadline,
      priority: newGoalPriority,
      modulesCount: 5,
      completedModules: 1,
    };
    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setNewGoalTopic('');
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
          {/* Scanline Animation Effect during Upload */}
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

      {/* Interactive Goal Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono-tech text-xs text-slate-400 border-b border-purple-500/20 pb-2">
          <span className="flex items-center gap-2 text-purple-300">
            <Target className="w-4 h-4" />
            EXTRACTED STUDY GOALS &amp; PROGRESS MATRIX
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

              return (
                <div
                  key={goal.id}
                  className="hud-glass p-5 rounded-xl border border-purple-500/20 hud-glass-hover transition-all duration-300 flex flex-col justify-between"
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
                    <h3 className="font-space font-medium text-base text-slate-100 mb-3">
                      {goal.topic}
                    </h3>

                    {/* Target Progress Bar */}
                    <div className="space-y-1 mb-4 font-mono-tech text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">TARGET PROGRESS:</span>
                        <span className="text-cyan-300 font-bold">{goal.targetProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-cyan-500/30 p-0.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${goal.targetProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls & Deadline Picker */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono-tech text-xs text-slate-400">
                    {/* Deadline Picker */}
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

                    {/* Progress Adjusters & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                        <button
                          onClick={() => updateGoalProgress(goal.id, -10)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        >
                          -10%
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, 10)}
                          className="px-2 py-0.5 text-cyan-400 hover:text-cyan-300 rounded hover:bg-cyan-950"
                        >
                          +10%
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">TOPIC / SYLLABUS MODULE</label>
                <input
                  type="text"
                  value={newGoalTopic}
                  onChange={(e) => setNewGoalTopic(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithm Design..."
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-purple-500/30 text-slate-100 focus:outline-none focus:border-purple-400"
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
