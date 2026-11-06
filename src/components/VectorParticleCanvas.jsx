import React, { useEffect, useRef } from 'react';

/**
 * Dynamic background vector particle system:
 * Floating white & crimson geometric triangles/arrows moving continuously in the canvas background,
 * subtle connections, rotations, and smooth collision/wrapping.
 */
export default function VectorParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle definition
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    let particles = [];

    class VectorParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : (Math.random() < 0.5 ? -20 : width + 20);
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 5; // 5 - 13px
        this.vx = (Math.random() - 0.48) * 0.7; // slight drift
        this.vy = (Math.random() - 0.52) * 0.7;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.015;
        this.type = Math.random() > 0.4 ? 'triangle' : 'arrow'; // geometric shapes
        this.isCrimson = Math.random() < 0.22; // 22% crimson accent particles
        this.alpha = Math.random() * 0.4 + 0.15;
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.vRot;
        this.pulse += 0.02;

        // Wrap around bounds seamlessly
        const pad = 40;
        if (this.x < -pad) this.x = width + pad;
        if (this.x > width + pad) this.x = -pad;
        if (this.y < -pad) this.y = height + pad;
        if (this.y > height + pad) this.y = -pad;
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        const currentAlpha = Math.max(0.08, this.alpha + Math.sin(this.pulse) * 0.08);

        if (this.isCrimson) {
          context.strokeStyle = `rgba(255, 30, 39, ${currentAlpha * 1.2})`;
          context.fillStyle = `rgba(255, 30, 39, ${currentAlpha * 0.15})`;
          context.shadowColor = '#FF1E27';
          context.shadowBlur = 8;
        } else {
          context.strokeStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          context.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.1})`;
          context.shadowColor = 'transparent';
        }

        context.lineWidth = 1.2;

        if (this.type === 'triangle') {
          // Equilateral triangle
          const r = this.size;
          context.beginPath();
          context.moveTo(0, -r);
          context.lineTo((r * Math.sqrt(3)) / 2, r / 2);
          context.lineTo((-r * Math.sqrt(3)) / 2, r / 2);
          context.closePath();
          context.fill();
          context.stroke();
        } else {
          // Geometric cyber arrow/chevron
          const s = this.size * 0.9;
          context.beginPath();
          context.moveTo(-s, -s * 0.6);
          context.lineTo(0, s * 0.8);
          context.lineTo(s, -s * 0.6);
          context.lineTo(0, -s * 0.1);
          context.closePath();
          context.fill();
          context.stroke();
        }

        context.restore();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new VectorParticle());
      }
    }

    initParticles();

    // Subtle line connections between nearby geometric particles
    const drawConnections = () => {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            const isRedLink = particles[i].isCrimson || particles[j].isCrimson;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isRedLink
              ? `rgba(255, 30, 39, ${alpha * 1.5})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render cyber faint background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Render connections
      drawConnections();

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
}
