import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';
import { assets } from '../../assets/assets';

interface MiniplayerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modern Glass Miniplayer
 * - Compact, high-fidelity floating player.
 * - Provides core playback controls in a minimal footprint.
 * - Features the "Modern Glass" aesthetic with deep blurs.
 */
const Miniplayer: React.FC<MiniplayerProps> = ({ isOpen, onClose }) => {
  const { track, playStatus, play, pause, playNext, playPrevious } = usePlayerStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-72"
        >
          <div className="glass-panel p-4 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1db95422] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
              >
                <span className="text-gray-400 text-xs">✕</span>
              </button>

              {/* Album Art */}
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl mb-6 relative">
                <img className="w-full h-full object-cover" src={track.image} alt={track.name} />
                {!playStatus && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <img className="w-12 opacity-80" src={assets.play_icon} alt="Play" />
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="mb-6 px-4">
                <h3 className="font-black text-lg text-white truncate leading-tight">{track.name}</h3>
                <p className="text-[11px] font-bold text-[#1db954] tracking-widest uppercase mt-1">
                  {track.desc.split('•')[0].trim()}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 mb-2">
                <img 
                  onClick={playPrevious}
                  className="w-4 cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 transition active:scale-90" 
                  src={assets.prev_icon} 
                  alt="P" 
                />
                
                <div 
                  onClick={playStatus ? pause : play}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition shadow-lg"
                >
                  <img className="w-5" src={playStatus ? assets.pause_icon : assets.play_icon} alt="P" />
                </div>

                <img 
                  onClick={playNext}
                  className="w-4 cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 transition active:scale-90" 
                  src={assets.next_icon} 
                  alt="N" 
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Miniplayer;
