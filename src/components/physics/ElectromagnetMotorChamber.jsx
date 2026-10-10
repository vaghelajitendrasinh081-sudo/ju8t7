import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Zap, Magnet, RotateCw, Activity, Compass } from 'lucide-react';

export function ElectromagnetMotorChamber({ initialPreset }) {
  const [emMode, setEmMode] = useState('FIELD_LINES'); // 'FIELD_LINES' | 'DC_MOTOR'
  const [fieldType, setFieldType] = useState('BAR_MAGNET'); // 'BAR_MAGNET' | 'SOLENOID'
  const [currentI, setCurrentI] = useState(5); // Amperes
  const [magneticB, setMagneticB] = useState(1.2); // Tesla
  const [motorSpeed, setMotorSpeed] = useState(1.0); // Speed factor

  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Apply preset if present
  useEffect(() => {
    if (!initialPreset) return;
    if (initialPreset.mode === 'DC_MOTOR') {
      setEmMode('DC_MOTOR');
    } else if (initialPreset.mode === 'OHM') {
      setEmMode('DC_MOTOR');
    }
  }, [initialPreset]);

  // Three.js Scene setup for 3D Magnetic Field Lines or 3D DC Motor
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 700;
    const height = mountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a14);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 100);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    // Group containers
    const fieldLinesGroup = new THREE.Group();
    const motorGroup = new THREE.Group();
    scene.add(fieldLinesGroup);
    scene.add(motorGroup);

    // MODE A: BAR MAGNET or SOLENOID 3D FIELD LINES
    if (emMode === 'FIELD_LINES') {
      if (fieldType === 'BAR_MAGNET') {
        // Magnet Cylinder/Box
        const magnetGeo = new THREE.BoxGeometry(10, 2.5, 2.5);
        const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
        const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });

        const northHalf = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 2.5), northMat);
        northHalf.position.x = 2.5;

        const southHalf = new THREE.Mesh(new THREE.BoxGeometry(5, 2.5, 2.5), southMat);
        southHalf.position.x = -2.5;

        fieldLinesGroup.add(northHalf);
        fieldLinesGroup.add(southHalf);

        // Magnetic Field Lines (Dipole geometry arcs)
        for (let i = 1; i <= 12; i++) {
          const r = i * 1.5;
          const curve = new THREE.EllipseCurve(
            0, 0,             // ax, aY
            2.5 + r, r * 0.8, // xRadius, yRadius
            0, Math.PI,       // aStartAngle, aEndAngle
            false, 0          // aClockwise, aRotation
          );

          const points = curve.getPoints(50);
          const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map((p) => new THREE.Vector3(p.x, p.y, 0))
          );
          const material = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.6 });

          const lineTop = new THREE.Line(geometry, material);
          fieldLinesGroup.add(lineTop);

          const lineBottom = lineTop.clone();
          lineBottom.rotation.x = Math.PI;
          fieldLinesGroup.add(lineBottom);

          // Rotate around Z axis for 3D field line bundle
          const lineTopZ = lineTop.clone();
          lineTopZ.rotation.z = Math.PI / 2;
          fieldLinesGroup.add(lineTopZ);
        }
      } else {
        // SOLENOID COIL
        const coilPoints = [];
        const turns = 15;
        for (let t = 0; t <= turns * Math.PI * 2; t += 0.1) {
          const x = (t / (turns * Math.PI * 2)) * 16 - 8;
          const y = Math.sin(t) * 2;
          const z = Math.cos(t) * 2;
          coilPoints.push(new THREE.Vector3(x, y, z));
        }

        const coilGeo = new THREE.BufferGeometry().setFromPoints(coilPoints);
        const coilMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 });
        const coilLine = new THREE.Line(coilGeo, coilMat);
        fieldLinesGroup.add(coilLine);

        // Internal magnetic flux arrows
        for (let x = -7; x <= 7; x += 2) {
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(x, 0, 0),
            1.5,
            0x00f3ff,
            0.5,
            0.3
          );
          fieldLinesGroup.add(arrow);
        }
      }
    }

    // MODE B: 3D DC MOTOR ARMATURE
    let armatureMesh = null;
    let forceArrowUp = null;
    let forceArrowDown = null;

    if (emMode === 'DC_MOTOR') {
      // Stator Stator Pole N (Red) and S (Blue)
      const poleN = new THREE.Mesh(new THREE.BoxGeometry(3, 8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      poleN.position.set(-10, 0, 0);
      motorGroup.add(poleN);

      const poleS = new THREE.Mesh(new THREE.BoxGeometry(3, 8, 8), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
      poleS.position.set(10, 0, 0);
      motorGroup.add(poleS);

      // Armature Rectangular Coil Frame
      const armatureGeo = new THREE.BoxGeometry(10, 0.5, 6);
      const armatureMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
      armatureMesh = new THREE.Mesh(armatureGeo, armatureMat);
      motorGroup.add(armatureMesh);

      // Fleming's Hand Rule Vectors (Force F = Green, Field B = Cyan, Current I = Amber)
      forceArrowUp = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 3),
        4,
        0x10b981,
        1,
        0.5
      );
      armatureMesh.add(forceArrowUp);

      forceArrowDown = new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, -3),
        4,
        0x10b981,
        1,
        0.5
      );
      armatureMesh.add(forceArrowDown);
    }

    // Animation Loop
    let angle = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      if (emMode === 'DC_MOTOR' && armatureMesh) {
        angle += 0.03 * motorSpeed * currentI * magneticB;
        armatureMesh.rotation.x = angle;
      } else if (emMode === 'FIELD_LINES') {
        fieldLinesGroup.rotation.y += 0.003;
      }

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
  }, [emMode, fieldType, currentI, magneticB, motorSpeed]);

  // Torque Math
  const area = 0.05; // m^2
  const torque = currentI * magneticB * area;

  return (
    <div className="space-y-6 font-mono-tech">

      {/* Mode Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => setEmMode('FIELD_LINES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            emMode === 'FIELD_LINES'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Magnet className="w-4 h-4" /> 3D MAGNETIC FIELD LINES
        </button>

        <button
          onClick={() => setEmMode('DC_MOTOR')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            emMode === 'DC_MOTOR'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <RotateCw className="w-4 h-4" /> 3D DC MOTOR &amp; FLEMING'S RULE
        </button>
      </div>

      {/* Control Top Bar */}
      {emMode === 'FIELD_LINES' && (
        <div className="flex items-center gap-3 bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">
          <label className="text-xs text-cyan-400 font-bold">FIELD SOURCE:</label>
          <button
            onClick={() => setFieldType('BAR_MAGNET')}
            className={`px-3 py-1.5 rounded text-xs font-bold ${
              fieldType === 'BAR_MAGNET'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            BAR MAGNET (N - S Dipole)
          </button>

          <button
            onClick={() => setFieldType('SOLENOID')}
            className={`px-3 py-1.5 rounded text-xs font-bold ${
              fieldType === 'SOLENOID'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            CURRENT SOLENOID COIL
          </button>
        </div>
      )}

      {emMode === 'DC_MOTOR' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-xl border border-amber-500/30">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-amber-300 mb-1">
              <span>ARMATURE CURRENT (I): {currentI} A</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={currentI}
              onChange={(e) => setCurrentI(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold text-cyan-300 mb-1">
              <span>MAGNETIC FLUX (B): {magneticB} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={magneticB}
              onChange={(e) => setMagneticB(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold text-emerald-300 mb-1">
              <span>ROTATION SPEED MULTIPLIER: {motorSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.2"
              value={motorSpeed}
              onChange={(e) => setMotorSpeed(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[450px] bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {emMode === 'DC_MOTOR' && (
          <div className="absolute top-3 left-3 p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 text-[10px] space-y-1 backdrop-blur-md">
            <div className="text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> FLEMING'S LEFT HAND RULE
            </div>
            <div className="text-emerald-400 font-bold">Thumb = Magnetic Force (F = I L x B)</div>
            <div className="text-cyan-400 font-bold">First Finger = Magnetic Field (B)</div>
            <div className="text-amber-300 font-bold">Second Finger = Current Direction (I)</div>
          </div>
        )}

        {emMode === 'DC_MOTOR' && (
          <div className="absolute bottom-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 text-xs font-mono-tech space-y-1 text-right backdrop-blur-md">
            <div className="text-amber-400 font-bold">MOTOR TORQUE MATH</div>
            <div className="text-slate-300 font-bold">Torque τ = N · I · A · B · sin(θ)</div>
            <div className="text-emerald-400 font-bold text-sm">CALCULATED TORQUE: {torque.toFixed(3)} N·m</div>
          </div>
        )}
      </div>

    </div>
  );
}
