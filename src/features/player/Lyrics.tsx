import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';

/**
 * Modern Glass Lyrics Component
 * - Full-screen immersive glass panel.
 * - Dynamic typography that scales and glows based on sync.
 * - Integrated with the global animated background.
 */
const Lyrics = () => {
  const { track, time, showLyrics, toggleLyrics } = usePlayerStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lyricsData = useMemo(() => [
    { time: 0, text: "♪ (Atmospheric Opening) ♪" },
    { time: 5, text: `Experience ${track.name}` },
    { time: 10, text: "Lost in the rhythm of the glass" },
    { time: 15, text: "Transparent layers, moments that pass" },
    { time: 20, text: "Deep blurs and vibrant light" },
    { time: 25, text: "Dancing through the digital night" },
    { time: 30, text: "Outfit fonts and sleek design" },
    { time: 35, text: "Where every pixel is aligned" },
    { time: 40, text: "From the sidebar to the hub" },
    { time: 45, text: "In this futuristic audio club" },
    { time: 50, text: "Zustand state and React hooks" },
    { time: 55, text: "Even better than it looks" },
    { time: 60, text: "♪ (Bridge) ♪" },
    { time: 70, text: "The future of music is here..." },
    { time: 90, text: "♪ (Closing) ♪" },
  ], [track.id]);

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
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="fixed inset-0 z-[70] flex flex-col bg-black/60"
        >
          {/* Animated Glow Layer */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1db954] rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center px-10 py-8 relative z-10">
            <div className="flex items-center gap-6">
              <img className="w-16 h-16 rounded-2xl shadow-2xl border border-white/10" src={track.image} alt={track.name} />
              <div>
                <h1 className="font-black text-2xl tracking-tight">{track.name}</h1>
                <p className="text-white/50 font-medium">{track.desc}</p>
              </div>
            </div>
            <button 
              onClick={toggleLyrics}
              className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-white/20"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          {/* Lyrics Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto px-10 md:px-32 py-20 hide-scrollbar scroll-smooth relative z-10"
          >
            {lyricsData.map((line, index) => {
              const nextTime = lyricsData[index + 1]?.time || Infinity;
              const isActive = currentSeconds >= line.time && currentSeconds < nextTime;
              
              return (
                <motion.p
                  key={index}
                  animate={{ 
                    opacity: isActive ? 1 : 0.2,
                    scale: isActive ? 1.05 : 0.95,
                    x: isActive ? 20 : 0,
                    filter: isActive ? 'blur(0px)' : 'blur(2px)'
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-7xl font-black mb-12 tracking-tighter leading-tight cursor-default select-none drop-shadow-2xl"
                >
                  {line.text}
                </motion.p>
              );
            })}
            <div className="h-[40vh]" /> {/* Bottom padding for scroll */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lyrics;
