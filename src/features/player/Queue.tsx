import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';
import { assets, songsData } from '../../assets/assets';

/**
 * Enterprise Queue Component
 * - Styled as a flat, elegant matching panel overlapping the Display content area.
 * - Formatted standard playlist sequence list matching official Spotify Desktop.
 * - Clean casing, minimalist fonts, zero all-caps techno headers.
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
          className="fixed inset-x-2 bottom-24 top-2 bg-[#121212] z-[55] rounded-lg flex flex-col p-6 overflow-hidden border border-white/5 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight">Play Queue</h1>
              <p className="text-xs text-[#b3b3b3] mt-0.5">Manage your upcoming listening sequence</p>
            </div>
            <button 
              onClick={toggleQueue}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {/* Now Playing Section */}
            <section className="mb-8">
              <h2 className="text-sm font-bold text-white mb-3">Now playing</h2>
              <div className="flex items-center gap-4 p-3 bg-[#181818] rounded-md border border-white/5">
                <img className="w-12 h-12 rounded object-cover shadow-md" src={track.image} alt={track.name} />
                <div className="flex flex-col min-w-0">
                  <span className="text-white text-sm font-medium truncate">{track.name}</span>
                  <span className="text-xs text-[#b3b3b3] mt-0.5 truncate">{track.desc}</span>
                </div>
                <div className="ml-auto flex items-end gap-0.5 pr-2 h-4">
                  <div className="w-[3px] bg-[#1ed760] rounded-full animate-[bounce_1.2s_ease-in-out_infinite]" />
                  <div className="w-[3px] bg-[#1ed760] rounded-full animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
                  <div className="w-[3px] bg-[#1ed760] rounded-full animate-[bounce_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </section>

            {/* Up Next Section */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#b3b3b3]">Next in line</h2>
                {queue.length > 0 && (
                  <button 
                    onClick={clearQueue}
                    className="text-xs font-bold text-[#b3b3b3] hover:text-white transition-colors"
                  >
                    Clear queue
                  </button>
                )}
              </div>

              {queueTracks.length === 0 ? (
                <div className="py-16 text-center bg-[#181818]/40 rounded-lg border border-dashed border-white/5">
                  <p className="text-[#b3b3b3] text-sm italic font-normal">The queue is empty. Add songs from your library or search.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {queueTracks.map((song, index) => (
                    <motion.div
                      key={`${song?.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                      className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-grow min-w-0" onClick={() => playWithId(song!.id)}>
                        <span className="text-xs text-[#b3b3b3] w-4 text-right flex-shrink-0 group-hover:text-white transition-colors">{index + 1}</span>
                        <img className="w-10 h-10 rounded object-cover shadow flex-shrink-0" src={song?.image} alt={song?.name} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-white text-sm font-medium truncate group-hover:text-[#1ed760] transition-colors">{song?.name}</span>
                          <span className="text-xs text-[#b3b3b3] truncate mt-0.5">{song?.desc}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromQueue(song!.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#b3b3b3] hover:text-white transition-opacity"
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
