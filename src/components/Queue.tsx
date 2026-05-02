import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../store/usePlayerStore';
import { songsData } from '../assets/assets';

/**
 * Modern Glass Queue Component
 * - Integrated glass panel with deep blur.
 * - Refined spacing and typography using 'Outfit' font.
 * - Smooth slide-in animations consistent with the new UI.
 */
const Queue = () => {
  const { queue, showQueue, toggleQueue, clearQueue, track, removeFromQueue, playWithId } = usePlayerStore();

  const queueTracks = queue.map(id => songsData.find(s => s.id === id)).filter(Boolean);

  return (
    <AnimatePresence>
      {showQueue && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-x-2 bottom-24 top-20 glass-panel z-[55] rounded-3xl flex flex-col p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black tracking-tighter">Queue</h1>
              <p className="text-gray-500 text-sm font-medium">Manage your upcoming tracks</p>
            </div>
            <button 
              onClick={toggleQueue}
              className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-4 hide-scrollbar">
            {/* Now Playing Section */}
            <section className="mb-12">
              <h2 className="text-[10px] font-black text-[#1db954] uppercase tracking-[0.3em] mb-6">Currently Playing</h2>
              <div className="flex items-center gap-6 p-4 glass-card rounded-2xl border border-[#1db95422]">
                <img className="w-16 h-16 rounded-xl shadow-2xl" src={track.image} alt={track.name} />
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-lg font-bold truncate">{track.name}</span>
                  <span className="text-sm text-gray-400 font-medium">{track.desc}</span>
                </div>
                <div className="ml-auto flex gap-2 pr-4">
                  <div className="w-1 h-4 bg-[#1db954] animate-pulse" />
                  <div className="w-1 h-6 bg-[#1db954] animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-3 bg-[#1db954] animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </section>

            {/* Up Next Section */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Next in Line</h2>
                {queue.length > 0 && (
                  <button 
                    onClick={clearQueue}
                    className="text-xs font-black text-gray-400 hover:text-red-400 transition-colors tracking-widest"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {queueTracks.length === 0 ? (
                <div className="py-20 text-center glass-card rounded-3xl border-dashed border-white/5">
                  <p className="text-gray-500 font-medium italic">The queue is empty. Explore and add more music!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {queueTracks.map((song, index) => (
                    <motion.div
                      key={`${song?.id}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-5 flex-grow min-w-0" onClick={() => playWithId(song!.id)}>
                        <img className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform" src={song?.image} alt={song?.name} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-white font-bold truncate group-hover:text-[#1db954] transition">{song?.name}</span>
                          <span className="text-xs text-gray-500 font-medium truncate">{song?.desc}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromQueue(song!.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-white transition-opacity"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(Queue);
