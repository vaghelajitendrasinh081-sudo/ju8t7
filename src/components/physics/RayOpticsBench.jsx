import React, { useState, useEffect } from 'react';
import { Eye, Layers, Sparkles, Sliders, Info, Zap } from 'lucide-react';

export function RayOpticsBench({ initialPreset }) {
  const [opticsMode, setOpticsMode] = useState('BENCH'); // 'BENCH' | 'PRISM' | 'HUMAN_EYE'

  // Optics Bench State
  const [opticType, setOpticType] = useState('CONVEX_LENS'); // 'CONVEX_LENS' | 'CONCAVE_LENS' | 'CONCAVE_MIRROR' | 'CONVEX_MIRROR'
  const [focalLength, setFocalLength] = useState(20); // cm
  const [objectDistance, setObjectDistance] = useState(35); // cm (u = -35)
  const [objectHeight, setObjectHeight] = useState(8); // cm

  // Prism State
  const [prismAngle, setPrismAngle] = useState(60); // degrees (A)
  const [incidentAngle, setIncidentAngle] = useState(45); // degrees (i)
  const [refractiveIndex, setRefractiveIndex] = useState(1.52); // Glass refractive index

  // Human Eye Defect State
  const [eyeDefect, setEyeDefect] = useState('MYOPIA'); // 'MYOPIA' | 'HYPERMETROPIA' | 'NORMAL'
  const [lensCorrected, setLensCorrected] = useState(true);

  // Apply preset if passed
  useEffect(() => {
    if (!initialPreset) return;
    if (initialPreset.mode === 'PRISM') {
      setOpticsMode('PRISM');
    } else if (initialPreset.mode === 'BENCH') {
      setOpticsMode('BENCH');
      if (initialPreset.type) setOpticType(initialPreset.type);
    }
  }, [initialPreset]);

  // Math calculations for Optical Bench
  // Sign convention: u is negative (-objectDistance), f is + for Convex Lens / Convex Mirror, - for Concave
  const u = -Math.abs(objectDistance);
  let f = focalLength;
  if (opticType === 'CONCAVE_LENS' || opticType === 'CONCAVE_MIRROR') {
    f = -Math.abs(focalLength);
  }

  // Lens Formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  // Mirror Formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u => v = (f * u) / (u - f)
  const isMirror = opticType.includes('MIRROR');
  let v = 0;
  if (isMirror) {
    v = u !== f ? (f * u) / (u - f) : 999;
  } else {
    v = u + f !== 0 ? (f * u) / (u + f) : 999;
  }

  const magnification = isMirror ? -v / u : v / u;
  const imageHeight = objectHeight * magnification;
  const isReal = v > 0;

  // Prism Deviation Math
  const devAngle = (refractiveIndex - 1) * prismAngle;

  const VIBGYOR = [
    { color: '#7e22ce', name: 'Violet (λ=400nm, n=1.532)' },
    { color: '#4338ca', name: 'Indigo (λ=445nm, n=1.528)' },
    { color: '#2563eb', name: 'Blue (λ=475nm, n=1.524)' },
    { color: '#16a34a', name: 'Green (λ=510nm, n=1.520)' },
    { color: '#ca8a04', name: 'Yellow (λ=570nm, n=1.517)' },
    { color: '#ea580c', name: 'Orange (λ=590nm, n=1.514)' },
    { color: '#dc2626', name: 'Red (λ=650nm, n=1.510)' },
  ];

  return (
    <div className="space-y-6 font-mono-tech">

      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => setOpticsMode('BENCH')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            opticsMode === 'BENCH'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" /> 3D LENS &amp; MIRROR BENCH
        </button>

        <button
          onClick={() => setOpticsMode('PRISM')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            opticsMode === 'PRISM'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> PRISM VIBGYOR DISPERSION
        </button>

        <button
          onClick={() => setOpticsMode('HUMAN_EYE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            opticsMode === 'HUMAN_EYE'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" /> HUMAN EYE DEFECT CORRECTOR
        </button>
      </div>

      {/* MODE 1: 3D OPTICS BENCH */}
      {opticsMode === 'BENCH' && (
        <div className="space-y-6">

          {/* Controls Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">
            <div>
              <label className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                OPTICAL ELEMENT
              </label>
              <select
                value={opticType}
                onChange={(e) => setOpticType(e.target.value)}
                className="w-full bg-slate-950 text-cyan-300 border border-cyan-500/40 rounded p-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="CONVEX_LENS">CONVEX LENS (Converging)</option>
                <option value="CONCAVE_LENS">CONCAVE LENS (Diverging)</option>
                <option value="CONCAVE_MIRROR">CONCAVE MIRROR (Converging)</option>
                <option value="CONVEX_MIRROR">CONVEX MIRROR (Diverging)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                <span>FOCAL LENGTH (|f|): {focalLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                <span>OBJECT DISTANCE (|u|): {objectDistance} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={objectDistance}
                onChange={(e) => setObjectDistance(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                <span>OBJECT HEIGHT (h₀): {objectHeight} cm</span>
              </div>
              <input
                type="range"
                min="4"
                max="16"
                value={objectHeight}
                onChange={(e) => setObjectHeight(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Interactive Ray Tracing SVG Bench Canvas */}
          <div className="relative w-full h-[400px] bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)] flex items-center justify-center">

            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Grid background lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Principal Axis */}
              <line x1="0" y1="200" x2="800" y2="200" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Lens / Mirror Center Axis at x = 400 */}
              <line x1="400" y1="20" x2="400" y2="380" stroke="#00f3ff" strokeWidth="2" />

              {/* Lens Shape */}
              {opticType === 'CONVEX_LENS' && (
                <path d="M 400 60 Q 425 200 400 340 Q 375 200 400 60 Z" fill="rgba(0, 240, 255, 0.2)" stroke="#00f3ff" strokeWidth="2" />
              )}
              {opticType === 'CONCAVE_LENS' && (
                <path d="M 380 60 Q 400 200 380 340 L 420 340 Q 400 200 420 60 Z" fill="rgba(0, 240, 255, 0.2)" stroke="#00f3ff" strokeWidth="2" />
              )}

              {/* Focal Points F1 & F2 */}
              <circle cx={400 - focalLength * 4} cy="200" r="4" fill="#f59e0b" />
              <text x={400 - focalLength * 4 - 8} y="220" fill="#f59e0b" fontSize="10" fontWeight="bold">F1</text>

              <circle cx={400 + focalLength * 4} cy="200" r="4" fill="#f59e0b" />
              <text x={400 + focalLength * 4 - 8} y="220" fill="#f59e0b" fontSize="10" fontWeight="bold">F2</text>

              {/* Object Arrow at x = 400 - objectDistance * 4 */}
              <line
                x1={400 - objectDistance * 4}
                y1="200"
                x2={400 - objectDistance * 4}
                y2={200 - objectHeight * 8}
                stroke="#10b981"
                strokeWidth="4"
              />
              <polygon
                points={`${400 - objectDistance * 4},${200 - objectHeight * 8 - 8} ${400 - objectDistance * 4 - 5},${200 - objectHeight * 8} ${400 - objectDistance * 4 + 5},${200 - objectHeight * 8}`}
                fill="#10b981"
              />
              <text x={400 - objectDistance * 4 - 20} y={200 - objectHeight * 8 - 12} fill="#10b981" fontSize="11" fontWeight="bold">OBJECT</text>

              {/* Image Arrow at x = 400 + v * 4 */}
              {Math.abs(v) < 100 && (
                <>
                  <line
                    x1={400 + v * 4}
                    y1="200"
                    x2={400 + v * 4}
                    y2={200 + imageHeight * 8}
                    stroke="#ec4899"
                    strokeWidth="4"
                    strokeDasharray={isReal ? 'none' : '4 4'}
                  />
                  <polygon
                    points={`${400 + v * 4},${200 + imageHeight * 8 + (imageHeight > 0 ? 8 : -8)} ${400 + v * 4 - 5},${200 + imageHeight * 8} ${400 + v * 4 + 5},${200 + imageHeight * 8}`}
                    fill="#ec4899"
                  />
                  <text x={400 + v * 4 - 15} y={200 + imageHeight * 8 + 20} fill="#ec4899" fontSize="11" fontWeight="bold">
                    IMAGE ({isReal ? 'REAL' : 'VIRTUAL'})
                  </text>
                </>
              )}

              {/* Ray 1: Parallel to Axis -> through Focus */}
              <line
                x1={400 - objectDistance * 4}
                y1={200 - objectHeight * 8}
                x2="400"
                y2={200 - objectHeight * 8}
                stroke="#00f3ff"
                strokeWidth="1.5"
              />
              <line
                x1="400"
                y1={200 - objectHeight * 8}
                x2={400 + v * 4}
                y2={200 + imageHeight * 8}
                stroke="#00f3ff"
                strokeWidth="1.5"
              />

              {/* Ray 2: Central Ray through Optical Center */}
              <line
                x1={400 - objectDistance * 4}
                y1={200 - objectHeight * 8}
                x2={400 + v * 4}
                y2={200 + imageHeight * 8}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </svg>

            {/* Readout Telemetry Overlay */}
            <div className="absolute top-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs font-mono-tech space-y-1">
              <div className="text-cyan-400 font-bold border-b border-cyan-500/20 pb-1">
                LENS MATH FORMULA
              </div>
              <div className="text-slate-300 font-bold">
                1/f = 1/v - 1/u
              </div>
              <div className="text-emerald-400 font-bold">Image Distance (v): {v.toFixed(2)} cm</div>
              <div className="text-purple-300 font-bold">Magnification (m): {magnification.toFixed(2)}x</div>
              <div className="text-amber-400 font-bold">Nature: {isReal ? 'Real & Inverted' : 'Virtual & Erect'}</div>
            </div>

          </div>

        </div>
      )}

      {/* MODE 2: PRISM DISPERSION */}
      {opticsMode === 'PRISM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-xl border border-purple-500/30">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-purple-300 mb-1">
                <span>PRISM ANGLE (A): {prismAngle}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="75"
                value={prismAngle}
                onChange={(e) => setPrismAngle(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-purple-300 mb-1">
                <span>INCIDENT ANGLE (i): {incidentAngle}°</span>
              </div>
              <input
                type="range"
                min="30"
                max="70"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold text-purple-300 mb-1">
                <span>CROWN GLASS REFRACTIVE INDEX (n): {refractiveIndex}</span>
              </div>
              <input
                type="range"
                min="1.3"
                max="1.8"
                step="0.01"
                value={refractiveIndex}
                onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="relative w-full h-[400px] bg-slate-950 rounded-xl border border-purple-500/30 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Glass Prism Triangle */}
              <polygon points="400,80 250,320 550,320" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="2.5" />

              {/* White Light Incident Ray */}
              <line x1="50" y1="260" x2="310" y2="230" stroke="#ffffff" strokeWidth="3" />
              <text x="120" y="240" fill="#ffffff" fontSize="12" fontWeight="bold">WHITE INCIDENT LIGHT</text>

              {/* VIBGYOR Splitting Rays inside & exiting prism */}
              {VIBGYOR.map((ray, idx) => {
                const spreadY = (idx - 3) * 6;
                return (
                  <g key={ray.name}>
                    {/* Internal refract */}
                    <line x1="310" y1="230" x2="480" y2={230 + spreadY} stroke={ray.color} strokeWidth="1.5" />
                    {/* Emergent dispersion */}
                    <line x1="480" y1={230 + spreadY} x2="750" y2={230 + spreadY * 3.5 + devAngle * 2} stroke={ray.color} strokeWidth="2" />
                  </g>
                );
              })}
            </svg>

            <div className="absolute top-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-purple-500/30 text-xs font-mono-tech space-y-1">
              <div className="text-purple-300 font-bold">ANGLE OF DEVIATION (δ):</div>
              <div className="text-white text-lg font-bold">{(devAngle).toFixed(2)}°</div>
              <div className="text-[10px] text-slate-400 mt-1">
                NCERT Rule: Violet deviates maximum due to shortest wavelength λ!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: HUMAN EYE DEFECT CORRECTOR */}
      {opticsMode === 'HUMAN_EYE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30">
            <div>
              <label className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                EYE VISION DEFECT
              </label>
              <select
                value={eyeDefect}
                onChange={(e) => setEyeDefect(e.target.value)}
                className="w-full bg-slate-950 text-emerald-300 border border-emerald-500/40 rounded p-1.5 text-xs font-bold focus:outline-none"
              >
                <option value="MYOPIA">MYOPIA (Near-Sightedness)</option>
                <option value="HYPERMETROPIA">HYPERMETROPIA (Far-Sightedness)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLensCorrected(!lensCorrected)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  lensCorrected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400'
                }`}
              >
                {lensCorrected ? 'CORRECTIVE LENS APPLIED (ON)' : 'UNCORRECTED DEFECT (OFF)'}
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-emerald-500/20 text-[10px] text-slate-300">
              {eyeDefect === 'MYOPIA'
                ? 'MYOPIA: Parallel rays focus BEFORE the retina. Corrected with CONCAVE (Diverging) Lens.'
                : 'HYPERMETROPIA: Rays focus BEHIND the retina. Corrected with CONVEX (Converging) Lens.'}
            </div>
          </div>

          <div className="relative w-full h-[400px] bg-slate-950 rounded-xl border border-emerald-500/30 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Eyeball Silhouette */}
              <circle cx="550" cy="200" r="120" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="2" />

              {/* Retina (Back Wall of Eyeball) */}
              <path d="M 650 120 A 120 120 0 0 1 650 280" fill="none" stroke="#ec4899" strokeWidth="4" />
              <text x="660" y="200" fill="#ec4899" fontSize="11" fontWeight="bold">RETINA</text>

              {/* Eye Natural Lens */}
              <path d="M 450 160 Q 470 200 450 240 Q 430 200 450 160 Z" fill="rgba(0, 240, 255, 0.2)" stroke="#00f3ff" strokeWidth="2" />

              {/* Corrective Spectacle Lens if Enabled */}
              {lensCorrected && eyeDefect === 'MYOPIA' && (
                <path d="M 280 150 Q 295 200 280 250 L 290 250 Q 305 200 290 150 Z" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" />
              )}
              {lensCorrected && eyeDefect === 'HYPERMETROPIA' && (
                <path d="M 280 150 Q 305 200 280 250 Q 260 200 280 150 Z" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" />
              )}

              {/* Incident Parallel Rays */}
              <line x1="50" y1="160" x2="440" y2="160" stroke="#00f3ff" strokeWidth="1.5" />
              <line x1="50" y1="240" x2="440" y2="240" stroke="#00f3ff" strokeWidth="1.5" />

              {/* Focused Rays inside eye */}
              {/* Target focus position: 650 is Retina. Uncorrected Myopia = 580, Hypermetropia = 710, Corrected = 650 */}
              {(() => {
                let focusX = 650;
                if (!lensCorrected) {
                  focusX = eyeDefect === 'MYOPIA' ? 570 : 710;
                }
                return (
                  <>
                    <line x1="450" y1="160" x2={focusX} y2="200" stroke="#10b981" strokeWidth="2" />
                    <line x1="450" y1="240" x2={focusX} y2="200" stroke="#10b981" strokeWidth="2" />
                    <circle cx={focusX} cy="200" r="5" fill={focusX === 650 ? '#10b981' : '#ef4444'} />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

    </div>
  );
}
