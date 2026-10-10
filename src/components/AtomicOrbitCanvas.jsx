import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function AtomicOrbitCanvas({ element }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !element) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070f);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const orangeLight = new THREE.PointLight(0xff6b00, 1.5, 50);
    orangeLight.position.set(5, 5, 5);
    scene.add(orangeLight);

    // 3. Central Nucleus (Protons & Neutrons Cluster)
    const nucleusGroup = new THREE.Group();
    const protonCount = element.protons || element.number;
    const neutronCount = element.neutrons || Math.round(element.mass - element.number);
    const totalParticles = Math.min(protonCount + neutronCount, 60); // Cap particles visually for clean performance

    const protonGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00a8ff,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    const neutronGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff3300,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    for (let i = 0; i < totalParticles; i++) {
      const isProton = i % 2 === 0;
      const mesh = new THREE.Mesh(isProton ? protonGeo : neutronGeo, isProton ? protonMat : neutronMat);

      const phi = Math.acos(-1 + (2 * i) / totalParticles);
      const theta = Math.sqrt(totalParticles * Math.PI) * phi;
      const r = 0.8 + Math.random() * 0.4;

      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      nucleusGroup.add(mesh);
    }
    scene.add(nucleusGroup);

    // Nucleus outer aura glow sphere
    const auraGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    scene.add(auraMesh);

    // 4. Electron Concentric Shells & Orbiting Electrons
    const electronGroup = new THREE.Group();
    scene.add(electronGroup);

    const shells = element.shells || [2, 8, 18, 32, 18, 8, 2];
    const electronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00f3ff,
      emissiveIntensity: 1,
    });

    const orbitingElectrons = [];

    shells.forEach((electronCountInShell, shellIdx) => {
      const radius = 3.5 + shellIdx * 2.2;

      // Draw Orbit Ring Circle
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);

      const ringColors = [0x00f3ff, 0xff6b00, 0xa855f7, 0xec4899, 0x10b981, 0xeab308, 0xef4444];
      const ringMat = new THREE.LineBasicMaterial({
        color: ringColors[shellIdx % ringColors.length],
        transparent: true,
        opacity: 0.4,
      });

      const ringLine = new THREE.LineLoop(ringGeo, ringMat);
      // Tilt orbit rings slightly for dynamic 3D depth
      ringLine.rotation.x = (shellIdx * 0.15);
      ringLine.rotation.z = (shellIdx * 0.1);
      electronGroup.add(ringLine);

      // Create Electrons along this shell orbit
      for (let e = 0; e < electronCountInShell; e++) {
        const electronMesh = new THREE.Mesh(electronGeo, electronMat);
        const initialAngle = (e / electronCountInShell) * Math.PI * 2;

        electronGroup.add(electronMesh);

        orbitingElectrons.push({
          mesh: electronMesh,
          radius: radius,
          angle: initialAngle,
          speed: (0.015 + (7 - shellIdx) * 0.003) * (shellIdx % 2 === 0 ? 1 : -1),
          tiltX: shellIdx * 0.15,
          tiltZ: shellIdx * 0.1,
        });
      }
    });

    // 5. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate central nucleus slowly
      nucleusGroup.rotation.x += 0.005;
      nucleusGroup.rotation.y += 0.008;
      auraMesh.rotation.y -= 0.003;

      // Update position of orbiting electrons
      orbitingElectrons.forEach((item) => {
        item.angle += item.speed;
        const x = Math.cos(item.angle) * item.radius;
        const z = Math.sin(item.angle) * item.radius;

        // Apply tilt transformation
        const pos = new THREE.Vector3(x, 0, z);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), item.tiltX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), item.tiltZ);

        item.mesh.position.copy(pos);
      });

      // Slowly tilt electron group
      electronGroup.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [element]);

  return (
    <div className="relative w-full h-[450px] bg-slate-950/90 rounded-xl border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-4 text-[10px] font-mono-tech text-cyan-400/70 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/20 pointer-events-none">
        3D REALTIME ATOMIC ORBIT SIMULATION // THREE.JS ENGINE
      </div>
    </div>
  );
}
