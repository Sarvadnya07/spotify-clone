import React, { useRef, useEffect } from 'react';
import { useVisualizer } from '../../hooks/useVisualizer';
import usePlayerStore from '../../store/usePlayerStore';
import { weatherService } from '../../features/weather/WeatherService';

/**
 * ReactiveBackground Component
 * - Manages the heavy visual atmosphere in a separate component to prevent root-level re-renders.
 * - Uses direct DOM manipulation for the frequency-reactive glow to achieve 60FPS.
 */
const ReactiveBackground: React.FC = () => {
  const { accentColor } = usePlayerStore();

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
      {/* Subtle Studio Spotlight Effect */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-1000"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${accentColor || '#1db954'}33 0%, transparent 80%)`,
        }}
      />
    </div>
  );
};

export default React.memo(ReactiveBackground);
