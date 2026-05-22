import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';
import { assets } from '../../assets/assets';

interface MiniplayerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Enterprise Sleek Miniplayer
 * - Compact, professional floating player.
 * - Solid dark layout mimicking Spotify's minimal deck style.
 * - Corrected high-contrast control states.
 */
const Miniplayer: React.FC<MiniplayerProps> = ({ isOpen, onClose }) => {
  const { track, playStatus, play, pause, playNext, playPrevious } = usePlayerStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="fixed bottom-6 right-6 z-[200] w-64"
        >
          <div className="bg-[#181818] p-4 rounded-lg shadow-2xl border border-white/5 relative overflow-hidden group">
            
            <div className="flex flex-col items-center text-center relative z-10">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-[#b3b3b3] hover:text-white transition"
              >
                <span className="text-[10px]">✕</span>
              </button>

              {/* Album Art */}
              <div className="w-40 h-40 rounded shadow-md mb-4 relative overflow-hidden mt-2">
                <img className="w-full h-full object-cover" src={track.image} alt={track.name} />
                {!playStatus && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <img className="w-8 opacity-70 invert" src={assets.play_icon} alt="Play" />
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="mb-4 px-2 w-full">
                <h3 className="font-bold text-sm text-white truncate leading-tight">{track.name}</h3>
                <p className="text-[11px] text-[#b3b3b3] truncate mt-1">
                  {track.desc.split('•')[0].trim()}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-5 mb-1">
                <img 
                  onClick={playPrevious}
                  className="w-3.5 h-3.5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 active:scale-95 transition-all" 
                  src={assets.prev_icon} 
                  alt="Prev" 
                />
                
                <div 
                  onClick={playStatus ? pause : play}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <img className="w-3.5 h-3.5 brightness-0 ml-[1px]" src={playStatus ? assets.pause_icon : assets.play_icon} alt="Play/Pause" />
                </div>

                <img 
                  onClick={playNext}
                  className="w-3.5 h-3.5 cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 active:scale-95 transition-all" 
                  src={assets.next_icon} 
                  alt="Next" 
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
