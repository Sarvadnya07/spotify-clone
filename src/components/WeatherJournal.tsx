import React from 'react';
import { motion } from 'framer-motion';
import usePlayerStore from '../store/usePlayerStore';
import { songsData } from '../assets/assets';
import Navbar from './Navbar';

/**
 * WeatherJournal Component - High Fidelity Timeline
 * - Professional history view paired with environmental metadata.
 * - Features the "Glass Card" aesthetic and time-relative status indicators.
 * - Optimized for a smooth scrolling experience.
 */
const WeatherJournal = () => {
  const { history } = usePlayerStore();

  const weatherIcons: Record<string, string> = {
    'Clear': '☀️',
    'Rain': '🌧️',
    'Clouds': '☁️',
    'Snow': '❄️',
    'Storm': '🌩️',
    'Night': '🌙'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-gradient-to-b from-black/40 to-transparent"
    >
      <Navbar />
      
      <div className="flex-grow overflow-y-auto px-8 pt-10 hide-scrollbar">
        <header className="mb-14 relative">
          <div className="absolute -left-10 top-0 w-1 h-32 bg-gradient-to-b from-[#1db954] to-transparent" />
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-gradient">Weather Journal</h1>
          <p className="text-gray-400 font-medium text-lg max-w-xl leading-relaxed">
            Every song tells a story. Your timeline captures the atmospheric context of your musical journey.
          </p>
        </header>

        <div className="relative border-l border-white/5 pl-10 ml-2 space-y-8 mb-40">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center py-20">
              <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
                <span className="text-4xl opacity-20">📖</span>
              </div>
              <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">History Empty</p>
            </div>
          ) : (
            history.map((item, index) => {
              if (!item || typeof item !== 'object' || item.songId === undefined) return null;
              
              const song = songsData.find(s => s.id === item.songId);
              if (!song) return null;

              return (
                <motion.div
                  key={`${item.timestamp}-${item.songId}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  className="group relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-900 group-hover:bg-[#1db954] group-hover:scale-150 transition-all duration-500 shadow-[0_0_15px_rgba(29,185,84,0)] group-hover:shadow-[0_0_15px_rgba(29,185,84,0.5)]" />

                  <div className="flex items-center gap-8 p-5 rounded-3xl glass-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Track Artwork */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                      <img src={song.image} alt={song.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-black text-lg truncate group-hover:text-[#1db954] transition-colors">{song.name}</span>
                        {index === 0 && <span className="text-[8px] bg-[#1db954] text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Now Playing</span>}
                      </div>
                      <span className="text-gray-500 text-xs font-bold truncate tracking-wide">{song.desc}</span>
                    </div>

                    {/* Atmospheric Meta */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {item.weather && (
                        <div className="flex items-center gap-2.5 bg-white/[0.04] px-4 py-1.5 rounded-2xl border border-white/5 shadow-inner">
                          <span className="text-lg">{weatherIcons[item.weather.condition]}</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">{item.weather.condition}</span>
                            <span className="text-[11px] font-bold text-white leading-none">{item.weather.temp}°C</span>
                          </div>
                        </div>
                      )}
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherJournal;
