import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function SudarshanChakraCanvas({ isInteractive = true, activeMode = 'DEFAULT' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Parent group for Chakra rotation & parallax
    const chakraGroup = new THREE.Group();
    scene.add(chakraGroup);

    // 1. Central Core Orb
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    chakraGroup.add(coreMesh);

    // Inner glowing solid sphere for core intensity
    const innerGlowGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.6,
    });
    const innerGlowMesh = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    chakraGroup.add(innerGlowMesh);

    // 2. Main Outer Chakra Ring with Spikes / Laser Blades (The Sudarshan Chakra Spoke Ring)
    const ringGroup = new THREE.Group();
    chakraGroup.add(ringGroup);

    // Outer Torus Ring
    const torusGeo = new THREE.TorusGeometry(5.2, 0.15, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    ringGroup.add(torusMesh);

    // Inner Torus Ring
    const innerTorusGeo = new THREE.TorusGeometry(3.6, 0.08, 16, 80);
    const innerTorusMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
    });
    const innerTorusMesh = new THREE.Mesh(innerTorusGeo, innerTorusMat);
    ringGroup.add(innerTorusMesh);

    // 108 Sacred Energy Blades / Spikes around the perimeter
    const bladeCount = 36;
    const bladesGroup = new THREE.Group();
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const bladeGeo = new THREE.ConeGeometry(0.35, 2.2, 4);
      bladeGeo.rotateX(Math.PI / 2); // Point outward

      const isGoldBlade = i % 3 === 0;
      const bladeMat = new THREE.MeshBasicMaterial({
        color: isGoldBlade ? 0xf59e0b : 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });

      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = Math.cos(angle) * 5.4;
      blade.position.y = Math.sin(angle) * 5.4;
      blade.rotation.z = angle + Math.PI / 2;

      bladesGroup.add(blade);
    }
    ringGroup.add(bladesGroup);

    // 3. Concentric Sanskrit / Runics Orbital Glyphs Ring
    const glyphRingGeo = new THREE.RingGeometry(6.5, 6.7, 64);
    const glyphRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });
    const glyphRingMesh = new THREE.Mesh(glyphRingGeo, glyphRingMat);
    chakraGroup.add(glyphRingMesh);

    // Outer Thin Orbit Ring
    const outerOrbitGeo = new THREE.TorusGeometry(8.5, 0.04, 12, 120);
    const outerOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.4,
    });
    const outerOrbitMesh = new THREE.Mesh(outerOrbitGeo, outerOrbitMat);
    chakraGroup.add(outerOrbitMesh);

    // 4. Particle Starfield / Energy Aura Dust
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f0ff);
    const cViolet = new THREE.Color(0xa855f7);
    const cGold = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi);

      const colorChoice = Math.random();
      const col = colorChoice < 0.5 ? cCyan : colorChoice < 0.8 ? cViolet : cGold;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      if (!isInteractive) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.8;
      targetY = (y / rect.height) * 0.8;
    };

    const containerEl = containerRef.current;
    containerEl.addEventListener('mousemove', handleMouseMove);

    // Handle Resize & Dynamic Scale for Mobile Viewports
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Adjust camera distance for smaller viewports so Chakra fits neatly behind content
      if (width < 640) {
        camera.position.z = 24;
      } else if (width < 768) {
        camera.position.z = 20;
      } else {
        camera.position.z = 18;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      chakraGroup.rotation.x = mouseY + Math.sin(elapsedTime * 0.5) * 0.15 + 0.3; // slightly tilted HUD perspective
      chakraGroup.rotation.y = mouseX + Math.cos(elapsedTime * 0.3) * 0.15;

      // Rotation speeds for different energy rings
      ringGroup.rotation.z = -elapsedTime * 0.8;
      glyphRingMesh.rotation.z = elapsedTime * 0.3;
      outerOrbitMesh.rotation.z = -elapsedTime * 0.15;
      outerOrbitMesh.rotation.x = Math.sin(elapsedTime * 0.4) * 0.3;

      coreMesh.rotation.x = elapsedTime * 0.5;
      coreMesh.rotation.y = elapsedTime * 0.7;

      particleSystem.rotation.y = elapsedTime * 0.05;

      // Dynamic scale pulse
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.03;
      coreMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement && containerEl.contains(renderer.domElement)) {
          containerEl.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, [isInteractive]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-crosshair" />
    </div>
  );
}
