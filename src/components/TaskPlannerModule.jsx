import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Filter,
  CheckCircle2,
  Hourglass,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Zap,
  FolderPlus
} from 'lucide-react';
import { soundFX } from '../utils/sound';

const INITIAL_TASKS = [
  {
    id: 'tsk-1',
    title: 'Quantum Computing: Wavefunction Collapse & Matrix Operators',
    category: 'Physics',
    status: 'ONLINE', // 'ONLINE' (In progress), 'PENDING', 'COMPLETED'
    priority: 'HIGH',
    timeBlock: '09:00 - 10:30',
    date: '2025-03-28',
    estMinutes: 90,
  },
  {
    id: 'tsk-2',
    title: 'Neural Architecture Search: Transformer Attention Optimization',
    category: 'AI / ML',
    status: 'PENDING',
    priority: 'HIGH',
    timeBlock: '11:00 - 12:30',
    date: '2025-03-28',
    estMinutes: 90,
  },
  {
    id: 'tsk-3',
    title: 'Astrophysics Module: Dark Matter Density Profile Calculations',
    category: 'Astrophysics',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    timeBlock: '14:00 - 15:30',
    date: '2025-03-28',
    estMinutes: 90,
  },
  {
    id: 'tsk-4',
    title: 'Cybernetics: Neural Interface Signal Processing & Noise Reduction',
    category: 'Engineering',
    status: 'PENDING',
    priority: 'MEDIUM',
    timeBlock: '16:00 - 17:30',
    date: '2025-03-28',
    estMinutes: 90,
  },
  {
    id: 'tsk-5',
    title: 'Advanced Linear Algebra: Spectral Theorem & Singular Value Decomposition',
    category: 'Mathematics',
    status: 'COMPLETED',
    priority: 'LOW',
    timeBlock: '18:00 - 19:00',
    date: '2025-03-28',
    estMinutes: 60,
  },
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

export function TaskPlannerModule({
  categories = [],
  onAddCategory,
  onDeleteCategory
}) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading tasks from localStorage:', e);
    }
    return [];
  });

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('sudarshan_tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage:', e);
    }
  };
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('TASKS'); // 'TASKS' or 'TIMELINE'

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0] || 'Physics');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newTimeBlock, setNewTimeBlock] = useState('10:00 - 11:00');

  // Custom Category Modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customCatInput, setCustomCatInput] = useState('');

  const filterCategories = ['ALL', ...categories];

  const toggleTaskStatus = (id) => {
    soundFX.playClick();
    const updated = tasks.map((task) => {
      if (task.id === id) {
        let nextStatus;
        if (task.status === 'PENDING') nextStatus = 'ONLINE';
        else if (task.status === 'ONLINE') {
          nextStatus = 'COMPLETED';
          soundFX.playSuccess();
        } else nextStatus = 'PENDING';
        return { ...task, status: nextStatus };
      }
      return task;
    });
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    soundFX.playClick();
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    soundFX.playSuccess();
    const newTask = {
      id: `tsk-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      status: 'PENDING',
      priority: newPriority,
      timeBlock: newTimeBlock,
      date: new Date().toISOString().split('T')[0],
      estMinutes: 60,
    };
    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleSaveCustomCategory = (e) => {
    e.preventDefault();
    if (!customCatInput.trim()) return;
    soundFX.playSuccess();
    if (onAddCategory) {
      onAddCategory(customCatInput.trim());
    }
    setNewCategory(customCatInput.trim());
    setCustomCatInput('');
    setShowCategoryModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const catMatch = filterCategory === 'ALL' || t.category === filterCategory;
    const statMatch = filterStatus === 'ALL' || t.status === filterStatus;
    return catMatch && statMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.3)] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            [ONLINE]
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            [COMPLETED]
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-amber-500/20 text-amber-300 border border-amber-400/50">
            <Hourglass className="w-3 h-3 text-amber-400" />
            [PENDING]
          </span>
        );
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'HIGH') return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (p === 'MEDIUM') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  };

  return (
    <div id="planner-console" className="max-w-7xl mx-auto px-4 py-8 font-space">

      {/* Console Header Bar */}
      <div className="hud-glass p-6 rounded-xl border border-cyan-500/30 mb-6 hud-bracket flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono-tech text-xs tracking-wider mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>MODULE 01 // TASK MATRIX &amp; TIME BLOCKING</span>
          </div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
            CYBERNETIC PLANNER
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-900/80 p-1 rounded-lg border border-cyan-500/20 flex text-xs font-mono-tech">
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('TASKS');
              }}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'TASKS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TASK LIST
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('TIMELINE');
              }}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'TIMELINE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TIME BLOCKING
            </button>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowCategoryModal(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="px-3.5 py-2 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 transition-all"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span>+ ADD CUSTOM CATEGORY</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowAddModal(true);
            }}
            onMouseEnter={() => soundFX.playHover()}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW TASK</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="hud-glass p-4 rounded-xl border border-cyan-500/20 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">CATEGORY:</span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {filterCategories.map((cat) => (
              <div
                key={cat}
                className={`inline-flex items-center rounded border transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setFilterCategory(cat);
                  }}
                  className="px-2.5 py-1 text-xs"
                >
                  {cat}
                </button>
                {cat !== 'ALL' && onDeleteCategory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playClick();
                      if (filterCategory === cat) setFilterCategory('ALL');
                      onDeleteCategory(cat);
                    }}
                    className="pr-2 pl-0.5 py-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title={`Delete category '${cat}'`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">STATUS:</span>
          {['ALL', 'ONLINE', 'PENDING', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                soundFX.playClick();
                setFilterStatus(st);
              }}
              className={`px-2.5 py-1 rounded transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              [{st}]
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Task List */}
      {viewMode === 'TASKS' && (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.length === 0 ? (
            <div className="hud-glass p-8 rounded-xl text-center text-slate-400 font-mono-tech border border-cyan-500/20">
              [NO TASKS MATCHING CURRENT TELEMETRY FILTERS]
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'COMPLETED';
              const isOnline = task.status === 'ONLINE';

              return (
                <div
                  key={task.id}
                  className={`hud-glass p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 hud-glass-hover ${
                    isOnline
                      ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-cyan-950/20'
                      : isCompleted
                      ? 'border-emerald-500/30 opacity-75'
                      : 'border-cyan-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Glowing Cyber Checkbox */}
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      onMouseEnter={() => soundFX.playHover()}
                      className="mt-0.5 min-w-[44px] min-h-[44px] p-2 rounded text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center active:scale-95"
                      title="Click to toggle task status (PENDING -> ONLINE -> COMPLETED)"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-6 h-6 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      ) : isOnline ? (
                        <CheckSquare className="w-6 h-6 text-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getStatusBadge(task.status)}
                        <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {task.category}
                        </span>
                        <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority} PRIORITY
                        </span>
                      </div>

                      <h3 className={`font-space font-medium text-base ${isCompleted ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right Telemetry info & Delete */}
                  <div className="flex items-center gap-4 text-xs font-mono-tech text-slate-400 self-end md:self-center">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{task.timeBlock}</span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      onMouseEnter={() => soundFX.playHover()}
                      className="min-w-[44px] min-h-[44px] p-2.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-95"
                      title="Delete task telemetry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View Mode: Time Blocking Calendar Layout */}
      {viewMode === 'TIMELINE' && (
        <div className="hud-glass p-6 rounded-xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
            <h3 className="font-orbitron text-lg font-bold text-cyan-300 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              24-HOUR CYBERNETIC TIME BLOCKS
            </h3>
            <span className="text-xs font-mono-tech text-slate-400">
              DATE: {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <div className="space-y-3 font-mono-tech">
            {TIME_SLOTS.map((slot) => {
              const matchedTask = tasks.find((t) => t.timeBlock.startsWith(slot));
              return (
                <div key={slot} className="flex items-stretch gap-4">
                  <div className="w-16 text-right text-xs text-cyan-400/80 pt-2 font-bold border-r border-cyan-500/20 pr-3">
                    {slot}
                  </div>
                  <div className="flex-1 min-h-[48px] rounded border border-slate-800/80 bg-slate-900/30 p-2 flex items-center">
                    {matchedTask ? (
                      <div className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/40 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="font-space text-slate-200 font-medium">{matchedTask.title}</span>
                          <span className="text-[10px] text-cyan-400">({matchedTask.category})</span>
                        </div>
                        {getStatusBadge(matchedTask.status)}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-600 italic">// FREE TIME ORBITAL SLOT</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass p-6 rounded-2xl border border-cyan-400/50 max-w-md w-full hud-bracket">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-cyan-400" />
              ADD CUSTOM CATEGORY / SUBJECT
            </h3>

            <form onSubmit={handleSaveCustomCategory} className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-300 mb-1">SUBJECT / CATEGORY NAME</label>
                <input
                  type="text"
                  value={customCatInput}
                  onChange={(e) => setCustomCatInput(e.target.value)}
                  placeholder="e.g. Biology, History, Computer Science..."
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 text-slate-950 font-orbitron font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  SAVE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="hud-glass p-6 rounded-2xl border border-cyan-400/50 max-w-md w-full hud-bracket">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              SCHEDULE CYBERNETIC TASK
            </h3>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-300 mb-1">TASK TITLE / OBJECTIVE</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Quantum Electrodynamics Derivations..."
                  required
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">PRIORITY</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">TIME BLOCK</label>
                <input
                  type="text"
                  value={newTimeBlock}
                  onChange={(e) => setNewTimeBlock(e.target.value)}
                  placeholder="10:00 - 11:30"
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-cyan-500/30 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-cyan-500 text-slate-950 font-orbitron font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  INITIALIZE TASK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
