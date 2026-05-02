import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../store/usePlayerStore';
import { weatherService } from '../services/WeatherService';

/**
 * WeatherHub Component - Elite UI
 * - Features a high-fidelity environment dashboard.
 * - Dynamic atmospheric glows and "Music Vibe" intelligence.
 * - Optimized for the "Modern Glass" aesthetic.
 */
const WeatherHub = () => {
  const { currentWeather } = usePlayerStore();

  if (!currentWeather) return null;

  const weatherIcons: Record<string, string> = {
    'Clear': '☀️',
    'Rain': '🌧️',
    'Clouds': '☁️',
    'Snow': '❄️',
    'Storm': '🌩️',
    'Night': '🌙'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 flex flex-col gap-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase mb-1">Intelligence</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1db954] animate-pulse" />
              <span className="text-xs font-bold text-white truncate max-w-[120px]">{currentWeather.city}</span>
            </div>
          </div>
          <div className="text-xl glass-panel w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-white/10">
            {weatherIcons[currentWeather.condition]}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1db95411] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col relative z-10">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-black text-white">{currentWeather.temp}°</span>
              <span className="text-[10px] font-bold text-gray-500 mb-1.5 uppercase">Celsius</span>
            </div>
            <p className="text-xs font-bold text-[#1db954] tracking-tight leading-none uppercase">
              {currentWeather.mood}
            </p>
          </div>
          
          {/* Reactive Progress Indicator */}
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1db954] animate-pulse" 
                  style={{ 
                    width: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.3 + (i * 0.1)
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherHub;
