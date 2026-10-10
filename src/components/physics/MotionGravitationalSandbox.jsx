import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Play, Pause, RotateCcw, Compass, ArrowUpRight, Gauge, Activity } from 'lucide-react';

export function MotionGravitationalSandbox({ initialPreset }) {
  const [motionType, setMotionType] = useState('PROJECTILE'); // 'PROJECTILE' | 'FREEFALL'
  const [planet, setPlanet] = useState('EARTH'); // 'EARTH' | 'MOON' | 'JUPITER'
  const [velocity, setVelocity] = useState(25); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [strobeEnabled, setStrobeEnabled] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // Telemetry graph history
  const [telemetry, setTelemetry] = useState([]);

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const ballRef = useRef(null);
  const velArrowRef = useRef(null);
  const accArrowRef = useRef(null);
  const dispArrowRef = useRef(null);
  const strobeGroupRef = useRef(null);
  const trajectoryLineRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Planet Gravity mapping (m/s2)
  const gravityMap = {
    EARTH: 9.8,
    MOON: 1.62,
    JUPITER: 24.79,
  };

  const g = gravityMap[planet];
  const radAngle = (angle * Math.PI) / 180;
  const v0x = motionType === 'FREEFALL' ? 0 : velocity * Math.cos(radAngle);
  const v0y = motionType === 'FREEFALL' ? 0 : velocity * Math.sin(radAngle);

  // Theoretical Physics Calculations
  const timeOfFlight = motionType === 'FREEFALL' ? Math.sqrt((2 * 50) / g) : (2 * v0y) / g;
  const maxH = motionType === 'FREEFALL' ? 50 : (v0y * v0y) / (2 * g);
  const range = motionType === 'FREEFALL' ? 0 : (velocity * velocity * Math.sin(2 * radAngle)) / g;

  // React to preset props if provided
  useEffect(() => {
    if (!initialPreset) return;
    if (initialPreset.type === 'PROJECTILE') {
      setMotionType('PROJECTILE');
      if (initialPreset.velocity) setVelocity(initialPreset.velocity);
      if (initialPreset.angle) setAngle(initialPreset.angle);
    } else if (initialPreset.type === 'FREEFALL') {
      setMotionType('FREEFALL');
    }
  }, [initialPreset]);

  // Setup Three.js 3D Motion Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 700;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(25, 20, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f3ff, 1.5);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(200, 50, 0x00f3ff, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Projectile Object (Sphere)
    const ballGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00a8ff,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0, 0);
    scene.add(ball);
    ballRef.current = ball;

    // Vector Arrows (Velocity = Green, Acceleration = Red/Amber, Displacement = Cyan)
    const velArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      5,
      0x10b981,
      1.5,
      1
    );
    scene.add(velArrow);
    velArrowRef.current = velArrow;

    const accArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 0),
      5,
      0xef4444,
      1.5,
      1
    );
    scene.add(accArrow);
    accArrowRef.current = accArrow;

    const dispArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      5,
      0x00f3ff,
      1.5,
      1
    );
    scene.add(dispArrow);
    dispArrowRef.current = dispArrow;

    // Group for Strobe Trail Dots
    const strobeGroup = new THREE.Group();
    scene.add(strobeGroup);
    strobeGroupRef.current = strobeGroup;

    // Trajectory Curve Line
    const trajectoryGeo = new THREE.BufferGeometry();
    const trajectoryMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 1,
      gapSize: 0.5,
      linewidth: 2,
    });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Trajectory Curve when Angle / Velocity / Planet change
  useEffect(() => {
    if (!trajectoryLineRef.current) return;

    const points = [];
    const steps = 60;
    const maxT = timeOfFlight || 5;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxT;
      if (motionType === 'FREEFALL') {
        const y = Math.max(0, 50 - 0.5 * g * t * t);
        points.push(new THREE.Vector3(0, y, 0));
      } else {
        const x = v0x * t;
        const y = Math.max(0, v0y * t - 0.5 * g * t * t);
        points.push(new THREE.Vector3(x, y, 0));
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    trajectoryLineRef.current.geometry.dispose();
    trajectoryLineRef.current.geometry = geo;
    trajectoryLineRef.current.computeLineDistances();
  }, [motionType, velocity, angle, planet, g, timeOfFlight]);

  // Simulation Step Timer Logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevT) => {
          const nextT = prevT + 0.05;
          if (nextT > timeOfFlight) {
            setIsRunning(false);
            return timeOfFlight;
          }
          return nextT;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeOfFlight]);

  // Position Ball & Vector Arrows based on Current Time `t`
  useEffect(() => {
    let x = 0;
    let y = 0;
    let vy = 0;

    if (motionType === 'FREEFALL') {
      y = Math.max(0, 50 - 0.5 * g * time * time);
      vy = -g * time;
    } else {
      x = v0x * time;
      y = Math.max(0, v0y * time - 0.5 * g * time * time);
      vy = v0y - g * time;
    }

    const vx = motionType === 'FREEFALL' ? 0 : v0x;
    const currentSpeed = Math.sqrt(vx * vx + vy * vy);

    if (ballRef.current) {
      ballRef.current.position.set(x, y, 0);
    }

    // Update Strobe Markers
    if (strobeGroupRef.current && strobeEnabled && isRunning && Math.round(time * 20) % 2 === 0) {
      const dotGeo = new THREE.SphereGeometry(0.3, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, 0);
      strobeGroupRef.current.add(dot);
    }

    // Velocity Vector (Green)
    if (velArrowRef.current) {
      velArrowRef.current.position.set(x, y, 0);
      const dir = new THREE.Vector3(vx, vy, 0).normalize();
      if (currentSpeed > 0.01) {
        velArrowRef.current.setDirection(dir);
        velArrowRef.current.setLength(Math.min(12, currentSpeed * 0.3));
      }
    }

    // Acceleration Vector (Red)
    if (accArrowRef.current) {
      accArrowRef.current.position.set(x, y, 0);
      accArrowRef.current.setDirection(new THREE.Vector3(0, -1, 0));
      accArrowRef.current.setLength(Math.min(10, g * 0.3));
    }

    // Displacement Vector (Cyan)
    if (dispArrowRef.current) {
      dispArrowRef.current.position.set(0, 0, 0);
      const dispDir = new THREE.Vector3(x, y, 0).normalize();
      const dispMag = Math.sqrt(x * x + y * y);
      if (dispMag > 0.1) {
        dispArrowRef.current.setDirection(dispDir);
        dispArrowRef.current.setLength(dispMag);
      }
    }

    // Push to Live Telemetry Graphs
    if (isRunning) {
      setTelemetry((prev) => [
        ...prev.slice(-30),
        {
          t: time.toFixed(2),
          s: y.toFixed(1),
          v: currentSpeed.toFixed(1),
          a: g.toFixed(1),
        },
      ]);
    }
  }, [time, motionType, g, v0x, v0y, strobeEnabled, isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setTelemetry([]);
    if (strobeGroupRef.current) {
      while (strobeGroupRef.current.children.length > 0) {
        strobeGroupRef.current.remove(strobeGroupRef.current.children[0]);
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Control Top Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">

        {/* Motion Type Switcher */}
        <div>
          <label className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
            PHYSICS MOTION MODE
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMotionType('PROJECTILE');
                handleReset();
              }}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all ${
                motionType === 'PROJECTILE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              PROJECTILE
            </button>
            <button
              onClick={() => {
                setMotionType('FREEFALL');
                handleReset();
              }}
              className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all ${
                motionType === 'FREEFALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              FREE FALL
            </button>
          </div>
        </div>

        {/* Interplanetary Gravity Switcher */}
        <div>
          <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
            INTERPLANETARY GRAVITY (g)
          </label>
          <div className="flex gap-1.5">
            {['EARTH', 'MOON', 'JUPITER'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPlanet(p);
                  handleReset();
                }}
                className={`flex-1 py-1.5 px-1 rounded text-[10px] font-bold transition-all ${
                  planet === p
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {p} ({gravityMap[p]}m/s²)
              </button>
            ))}
          </div>
        </div>

        {/* Velocity & Angle Controls */}
        <div className="space-y-2">
          {motionType === 'PROJECTILE' && (
            <>
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-300">VELOCITY (v₀): {velocity} m/s</span>
                <span className="text-cyan-400">ANGLE (θ): {angle}°</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={velocity}
                  onChange={(e) => {
                    setVelocity(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-1/2 accent-cyan-400 cursor-pointer"
                />
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={angle}
                  onChange={(e) => {
                    setAngle(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-1/2 accent-cyan-400 cursor-pointer"
                />
              </div>
            </>
          )}
          {motionType === 'FREEFALL' && (
            <div className="text-xs text-slate-400 pt-2">
              Dropping object from initial height $H_0 = 50\text{m}$ under $g = {g}\text{m/s}^2$.
            </div>
          )}
        </div>

        {/* Play / Strobe Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'PAUSE' : 'LAUNCH'}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setStrobeEnabled(!strobeEnabled)}
            className={`px-2 py-2 rounded-lg border text-[10px] font-bold ${
              strobeEnabled
                ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            STROBE
          </button>
        </div>

      </div>

      {/* Main 3D Canvas + Live Telemetry Dual Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3D Canvas Viewport */}
        <div className="lg:col-span-2 relative w-full h-[460px] bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Vector Overlay Key */}
          <div className="absolute top-3 left-3 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-[10px] space-y-1 backdrop-blur-md">
            <div className="text-cyan-400 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> 3D VECTOR OVERLAYS
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2.5 h-1 bg-emerald-400 inline-block" /> Velocity Vector (v)
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <span className="w-2.5 h-1 bg-rose-400 inline-block" /> Gravity Acceleration (g)
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="w-2.5 h-1 bg-cyan-300 inline-block" /> Displacement Vector (s)
            </div>
          </div>

          {/* Floating Readouts */}
          <div className="absolute bottom-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-xs font-mono-tech space-y-1 text-right backdrop-blur-md">
            <div className="text-slate-400 text-[10px]">THEORETICAL MAXIMUMS</div>
            <div className="text-cyan-300 font-bold">H-MAX: {maxH.toFixed(2)} m</div>
            {motionType === 'PROJECTILE' && (
              <div className="text-emerald-400 font-bold">RANGE: {range.toFixed(2)} m</div>
            )}
            <div className="text-amber-400 font-bold">FLIGHT TIME: {timeOfFlight.toFixed(2)} s</div>
          </div>
        </div>

        {/* Live Graph Telemetry Panel */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-4 font-mono-tech">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 animate-pulse" /> LIVE TELEMETRY GRAPHS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              t = {time.toFixed(2)}s
            </span>
          </div>

          {/* Mini Real-Time SVG Plotters for s-t, v-t, a-t */}
          <div className="space-y-3">

            {/* s-t Position-Time */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-cyan-400 font-bold flex justify-between">
                <span>s-t (DISPLACEMENT - TIME)</span>
                <span>{telemetry.length > 0 ? telemetry[telemetry.length - 1].s : 0} m</span>
              </div>
              <div className="h-14 w-full mt-2 flex items-end gap-1 border-b border-cyan-500/20 pb-1">
                {telemetry.map((pt, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-cyan-400 rounded-t"
                    style={{ height: `${Math.min(100, (Number(pt.s) / (maxH || 1)) * 100)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* v-t Velocity-Time */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-emerald-400 font-bold flex justify-between">
                <span>v-t (VELOCITY - TIME)</span>
                <span>{telemetry.length > 0 ? telemetry[telemetry.length - 1].v : 0} m/s</span>
              </div>
              <div className="h-14 w-full mt-2 flex items-end gap-1 border-b border-emerald-500/20 pb-1">
                {telemetry.map((pt, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-emerald-400 rounded-t"
                    style={{ height: `${Math.min(100, (Number(pt.v) / (velocity || 30)) * 100)}%` }}
                  />
                ))}
              </div>
            </div>

            {/* a-t Acceleration-Time */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-rose-400 font-bold flex justify-between">
                <span>a-t (ACCELERATION - TIME)</span>
                <span>{g} m/s²</span>
              </div>
              <div className="h-14 w-full mt-2 flex items-end gap-1 border-b border-rose-500/20 pb-1">
                {telemetry.map((pt, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-rose-400/80 rounded-t"
                    style={{ height: `${Math.min(100, (Number(pt.a) / 25) * 100)}%` }}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="p-3 rounded bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
            NCERT Kinematics Formulae applied:
            <div className="text-[10px] text-slate-400 mt-1">
              s = v₀t - ½gt² | v = v₀ - gt | R = (v² sin 2θ) / g
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
