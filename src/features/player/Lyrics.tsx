import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';

/**
 * Enterprise Lyrics Component
 * - Solid premium deep slate canvas mimicking Spotify Desktop's lyric viewport.
 * - Flat high-contrast typography, zero sci-fi glowing blurs or movement offsets.
 * - Smooth scroll alignment.
 */
const Lyrics = () => {
  const { track, time, showLyrics, toggleLyrics } = usePlayerStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lyricsData = useMemo(() => [
    { time: 0, text: "♪ (Atmospheric Opening) ♪" },
    { time: 5, text: `Experience ${track.name}` },
    { time: 10, text: "Lost in the rhythm of the music" },
    { time: 15, text: "Transparent layers, moments that pass" },
    { time: 20, text: "Deep notes and beautiful sound" },
    { time: 25, text: "Dancing through the digital night" },
    { time: 30, text: "Sleek fonts and standard design" },
    { time: 35, text: "Where every detail is aligned" },
    { time: 40, text: "From the sidebar to the player" },
    { time: 45, text: "In this realistic enterprise app" },
    { time: 50, text: "Zustand state and React hooks" },
    { time: 55, text: "Simple, beautiful, and authentic" },
    { time: 60, text: "♪ (Bridge) ♪" },
    { time: 70, text: "The future of music is here..." },
    { time: 90, text: "♪ (Closing) ♪" },
  ], [track.id, track.name]);

  const currentSeconds = time.currentTime.minute * 60 + time.currentTime.second;

  useEffect(() => {
    if (!showLyrics || !scrollContainerRef.current) return;
    
    const activeLine = lyricsData.findIndex((l, i) => {
      const nextTime = lyricsData[i + 1]?.time || Infinity;
      return currentSeconds >= l.time && currentSeconds < nextTime;
    });

    if (activeLine !== -1) {
      const lineElement = scrollContainerRef.current.children[activeLine] as HTMLElement;
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSeconds, showLyrics, lyricsData]);

  return (
    <AnimatePresence>
      {showLyrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[#242424]"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-10 py-6 relative z-10 border-b border-white/5">
            <div className="flex items-center gap-4">
              <img className="w-14 h-14 rounded shadow-md object-cover" src={track.image} alt={track.name} />
              <div>
                <h1 className="font-bold text-lg text-white tracking-tight">{track.name}</h1>
                <p className="text-xs text-[#b3b3b3] mt-0.5">{track.desc}</p>
              </div>
            </div>
            <button 
              onClick={toggleLyrics}
              className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white shadow"
            >
              <span className="text-base font-bold">✕</span>
            </button>
          </div>
 
          {/* Lyrics Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto px-10 md:px-24 py-16 custom-scrollbar scroll-smooth relative z-10"
          >
            {lyricsData.map((line, index) => {
              const nextTime = lyricsData[index + 1]?.time || Infinity;
              const isActive = currentSeconds >= line.time && currentSeconds < nextTime;
              
              return (
                <motion.p
                  key={index}
                  animate={{ 
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={{ duration: 0.25 }}
                  className={`text-xl md:text-3xl font-bold mb-6 tracking-tight leading-snug cursor-default select-none transition-colors duration-200 ${isActive ? 'text-white' : 'text-[#ffffff]/60'}`}
                >
                  {line.text}
                </motion.p>
              );
            })}
            <div className="h-[30vh]" /> {/* Bottom padding for scroll */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lyrics;
