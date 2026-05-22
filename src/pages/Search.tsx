import React, { useMemo, memo } from 'react';
import Navbar from '../components/layout/Navbar';
import { songsData, assets } from '../assets/assets';
import SongItem from '../features/music/SongItem';
import { aiDjService } from '../services/AiDjService';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../store/usePlayerStore';

/**
 * Enterprise Search Component
 * - Clean input styling matching official Spotify app.
 * - Standardized browse categories with official solid branding colors.
 * - Elegant mixed-casing typography.
 */
const Search = () => {
  const query = usePlayerStore(state => state.searchQuery);
  const setQuery = usePlayerStore(state => state.setSearchQuery);

  const filteredSongs = useMemo(() => {
    if (!query) return songsData.slice(0, 8);
    return aiDjService.semanticSearch(query, songsData);
  }, [query]);

  const categories = [
    { name: 'Podcasts', color: 'bg-[#27856a]' },
    { name: 'Made For You', color: 'bg-[#1e3264]' },
    { name: 'Charts', color: 'bg-[#8d67ab]' },
    { name: 'New Releases', color: 'bg-[#e8115b]' },
    { name: 'Discover', color: 'bg-[#5179a1]' },
    { name: 'Live Events', color: 'bg-[#bc4620]' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#121212] to-[#121212] overflow-hidden">
      
      <div className="flex-grow overflow-y-auto px-6 md:px-8 pt-6 pb-32 custom-scrollbar">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">Search</h1>
        </div>

        <AnimatePresence mode="wait">
          {!query ? (
            <motion.section
              key="categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 tracking-tight text-white">Browse all</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {categories.map((cat, i) => (
                  <div 
                    key={cat.name}
                    className={`aspect-square rounded-lg ${cat.color} p-4 cursor-pointer relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md`}
                  >
                    <span className="text-xl font-bold tracking-tight text-white relative z-10 break-words block max-w-[120px]">{cat.name}</span>
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rotate-[25deg] group-hover:rotate-[15deg] transition-transform duration-500 rounded-md" />
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 tracking-tight text-white">Top search results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredSongs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  >
                    <SongItem {...song} />
                  </motion.div>
                ))}
              </div>
              {filteredSongs.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-[#b3b3b3] text-sm">No songs found matching your search query.</p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(Search);
