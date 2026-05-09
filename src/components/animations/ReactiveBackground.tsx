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
  const glowRef = useRef<HTMLDivElement>(null);
  const intensity = useVisualizer();
  const { currentWeather, accentColor } = usePlayerStore();

  // High-Fidelity Theming: Blending Weather and Album Art
  const theme = React.useMemo(() => {
    const base = currentWeather 
      ? weatherService.getWeatherTheme(currentWeather.condition)
      : { primary: '#1db954', secondary: '#1ed760', blur: 'rgba(29, 185, 84, 0.1)' };

    return {
      primary: accentColor || base.primary,
      secondary: base.secondary,
      glow: `${accentColor}33` || base.blur // Use 20% opacity for glow
    };
  }, [currentWeather, accentColor]);

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
        className="fixed inset-0 bg-gradient-animate z-[-2] pointer-events-none transition-all duration-1000"
        style={{ 
          '--weather-primary': theme.primary,
          '--weather-secondary': theme.secondary,
        } as any}
      />

      {/* Reactive Glow Layer - Isolated updates */}
      <div 
        ref={glowRef}
        className="fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-300 ease-out"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${theme.glow} 0%, transparent 70%)`,
          willChange: 'transform, opacity, filter'
        }}
      />
    </>
  );
};

export default React.memo(ReactiveBackground);
