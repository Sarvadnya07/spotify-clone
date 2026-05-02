import React, { useRef, useEffect } from 'react';
import { useVisualizer } from '../hooks/useVisualizer';
import usePlayerStore from '../store/usePlayerStore';
import { weatherService } from '../services/WeatherService';

/**
 * ReactiveBackground Component
 * - Manages the heavy visual atmosphere in a separate component to prevent root-level re-renders.
 * - Uses direct DOM manipulation for the frequency-reactive glow to achieve 60FPS.
 */
const ReactiveBackground: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const intensity = useVisualizer();
  const { currentWeather } = usePlayerStore();

  // Weather Theme Logic (Memoized via component lifecycle)
  const weatherTheme = React.useMemo(() => {
    if (!currentWeather) return { primary: '#1db954', secondary: '#1ed760', blur: 'rgba(29, 185, 84, 0.1)' };
    return weatherService.getWeatherTheme(currentWeather.condition);
  }, [currentWeather]);

  // Direct DOM Update for the Glow - ZERO REACT RE-RENDERS for the main tree
  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.style.opacity = (intensity > 0.05 ? 1 : 0.5).toString();
      glowRef.current.style.transform = `scale(${1 + intensity * 0.2})`;
      glowRef.current.style.filter = `blur(${30 + intensity * 20}px)`;
    }
  }, [intensity]);

  return (
    <>
      {/* Base Weather Gradient - Static except when weather changes */}
      <div 
        className="fixed inset-0 bg-gradient-animate z-[-2] pointer-events-none"
        style={{ 
          '--weather-primary': weatherTheme.primary,
          '--weather-secondary': weatherTheme.secondary,
        } as any}
      />

      {/* Reactive Glow Layer - Isolated updates */}
      <div 
        ref={glowRef}
        className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-300 ease-out"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${weatherTheme.blur} 0%, transparent 70%)`,
          willChange: 'transform, opacity, filter'
        }}
      />
    </>
  );
};

export default React.memo(ReactiveBackground);
