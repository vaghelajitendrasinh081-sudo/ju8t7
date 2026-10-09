import React, { useEffect, useRef } from 'react';

export function ParticleCursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const maxParticles = 120;

    // Handle canvas resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle constructor / object generator
    const createParticle = (x, y) => {
      // Small variation in angle and speed for gentle floating
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.3; // Gentle float outwards
      const size = Math.random() * 3 + 2; // Initial particle radius (2px to 5px)
      const maxLife = Math.random() * 30 + 30; // ~0.5s to 1.0s at 60fps (30-60 frames)

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        initialSize: size,
        life: 0,
        maxLife,
        color: '#00f3ff' // Sci-fi neon cyan/blue
      };
    };

    // Track mouse and touch movement
    const addParticlesAt = (x, y) => {
      for (let i = 0; i < 3; i++) {
        if (particles.length < maxParticles) {
          const offsetX = (Math.random() - 0.5) * 6;
          const offsetY = (Math.random() - 0.5) * 6;
          particles.push(createParticle(x + offsetX, y + offsetY));
        }
      }
    };

    const handleMouseMove = (e) => {
      addParticlesAt(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          addParticlesAt(e.touches[i].clientX, e.touches[i].clientY);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop running at 60fps
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;

        // Calculate progress (0.0 to 1.0)
        const progress = p.life / p.maxLife;

        if (progress >= 1.0) {
          particles.splice(i, 1);
          continue;
        }

        // Physics: Shrink in size & Fade out opacity
        const currentRadius = Math.max(0, p.initialSize * (1 - progress));
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // Glowing effect using canvas shadow
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 8;

        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
}

export default ParticleCursorTrail;
