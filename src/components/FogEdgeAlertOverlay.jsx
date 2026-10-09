import React from 'react';
import { calculateLevelFromHours } from '../utils/gamification';

export function FogEdgeAlertOverlay({ totalHours = 0 }) {
  const levelInfo = calculateLevelFromHours(totalHours);
  const isNearLevelUp = !levelInfo.isMax && levelInfo.progressPercent >= 97;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 ease-in-out ${
        isNearLevelUp ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Viewport Outer Edge Grey Fog / Smoke Mist Vignette Overlay */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px 40px rgba(148, 163, 184, 0.25), inset 0 0 180px 80px rgba(100, 116, 139, 0.15)',
          background: 'radial-gradient(circle, transparent 60%, rgba(148, 163, 184, 0.12) 100%)'
        }}
      />

      {/* Animated Animated Smoke Haze keyframe pulse along viewport borders */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(203,213,225,0.08),_transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(148,163,184,0.08),_transparent_70%)] animate-pulse delay-700" />
    </div>
  );
}

export default FogEdgeAlertOverlay;
