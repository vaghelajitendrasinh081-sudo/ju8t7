import React, { useState } from 'react';
import { MotionGravitationalSandbox } from './MotionGravitationalSandbox';
import { RayOpticsBench } from './RayOpticsBench';
import { ElectromagnetMotorChamber } from './ElectromagnetMotorChamber';
import { Compass, Eye, Zap, BookOpen, Sparkles, Activity } from 'lucide-react';

export function PhysicsLabModule() {
  const [activeTab, setActiveTab] = useState('MOTION'); // 'MOTION' | 'OPTICS' | 'ELECTROMAGNET'
  const [activePreset, setActivePreset] = useState(null);

  const presets = [
    {
      id: 'GLASS_SLAB',
      title: 'Glass Slab Refraction & Lateral Shift',
      classTag: 'Class 10 NCERT',
      tab: 'OPTICS',
      presetData: { mode: 'PRISM' },
      summary: 'NCERT Class 10 Ch 10: Light rays bend towards the normal entering glass and shift laterally exiting back to air.',
    },
    {
      id: 'OHM_LAW',
      title: "Ohm's Law & DC Circuit Field",
      classTag: 'Class 10 NCERT',
      tab: 'ELECTROMAGNET',
      presetData: { mode: 'DC_MOTOR' },
      summary: "NCERT Class 10 Ch 12: Potential difference V is directly proportional to current I (V = IR) powering electromagnetic induction.",
    },
    {
      id: 'PROJECTILE_45',
      title: 'Projectile Motion (45° Maximum Range)',
      classTag: 'Class 11 NCERT',
      tab: 'MOTION',
      presetData: { type: 'PROJECTILE', angle: 45, velocity: 30 },
      summary: 'NCERT Class 11 Ch 4: Trajectory equation y = x tanθ - (g x²)/(2 v0² cos²θ). Range R is maximized at θ = 45°.',
    },
    {
      id: 'FREEFALL_JUPITER',
      title: 'Gravitational Free Fall on Jupiter',
      classTag: 'Class 11 NCERT',
      tab: 'MOTION',
      presetData: { type: 'FREEFALL' },
      summary: 'NCERT Class 11 Ch 8: Gravitational acceleration on Jupiter g = 24.79 m/s², accelerating objects nearly 2.5x faster than Earth.',
    },
    {
      id: 'HUMAN_MYOPIA',
      title: 'Human Eye Myopia & Concave Correction',
      classTag: 'Class 10 NCERT',
      tab: 'OPTICS',
      presetData: { mode: 'BENCH', type: 'CONCAVE_LENS' },
      summary: 'NCERT Class 10 Ch 11: Nearsightedness causes images to form in front of the retina, corrected by a diverging concave lens.',
    },
  ];

  const handleApplyPreset = (preset) => {
    setActiveTab(preset.tab);
    setActivePreset(preset.presetData);
  };

  return (
    <div className="space-y-6 font-mono-tech">

      {/* NCERT Presets Quick Row */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          NCERT CLASS 10 &amp; 11 PHYSICS EXPERIMENTAL PRESETS
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-left shrink-0 w-64 transition-all group"
            >
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-cyan-400">{p.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {p.classTag}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {p.summary}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Physics Laboratory Sub-Navigation */}
      <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => setActiveTab('MOTION')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'MOTION'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-cyan-300'
          }`}
        >
          <Compass className="w-4 h-4" /> 3D MOTION &amp; GRAVITATIONAL SANDBOX
        </button>

        <button
          onClick={() => setActiveTab('OPTICS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'OPTICS'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-purple-300'
          }`}
        >
          <Eye className="w-4 h-4" /> 3D RAY OPTICS BENCH
        </button>

        <button
          onClick={() => setActiveTab('ELECTROMAGNET')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ELECTROMAGNET'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-amber-300'
          }`}
        >
          <Zap className="w-4 h-4" /> ELECTROMAGNET &amp; 3D MOTOR CHAMBER
        </button>
      </div>

      {/* Conditionally Render Active Physics Module */}
      {activeTab === 'MOTION' && <MotionGravitationalSandbox initialPreset={activePreset} />}
      {activeTab === 'OPTICS' && <RayOpticsBench initialPreset={activePreset} />}
      {activeTab === 'ELECTROMAGNET' && <ElectromagnetMotorChamber initialPreset={activePreset} />}

    </div>
  );
}
