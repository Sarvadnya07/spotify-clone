import React, { useState, useMemo, memo } from 'react';
import Navbar from '../components/layout/Navbar';
import { songsData, assets } from '../assets/assets';
import SongItem from '../features/music/SongItem';
import { aiDjService } from '../services/AiDjService';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Elite Search Component
 * - Real-time filtering with high-fidelity "Glass Card" results.
 * - Optimized for performance and clean typography.
 */
const Search = () => {
  const [query, setQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!query) return songsData.slice(0, 8);
    // Elite Move: Use AI Semantic Search for "vibe" queries
    return aiDjService.semanticSearch(query, songsData);
  }, [query]);

  const categories = [
    { name: 'Podcasts', color: 'from-orange-500 to-red-500' },
    { name: 'Made For You', color: 'from-blue-500 to-indigo-500' },
    { name: 'Charts', color: 'from-purple-500 to-pink-500' },
    { name: 'New Releases', color: 'from-green-500 to-teal-500' },
    { name: 'Discover', color: 'from-yellow-500 to-orange-500' },
    { name: 'Live Events', color: 'from-red-500 to-pink-500' }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
      <Navbar />
      
      <div className="flex-grow overflow-y-auto px-6 md:px-10 pt-10 pb-40 custom-scrollbar">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-8 text-white text-glow">Search</h1>
          <div className="relative group max-w-2xl">
            <input 
              type="text" 
              placeholder="What do you want to listen to?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-12 text-white font-bold placeholder:text-gray-500 focus:outline-none focus:bg-white/10 focus:border-primary transition-all shadow-lg focus:shadow-primary/20"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity">
               <img className="w-5" src={assets.search_icon} alt="" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!query ? (
            <motion.section
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-black mb-6 tracking-tight uppercase text-text-muted opacity-60">Browse all</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {categories.map((cat, i) => (
                  <div 
                    key={cat.name}
                    className={`aspect-square rounded-lg bg-gradient-to-br ${cat.color} p-6 cursor-pointer relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl`}
                  >
                    <span className="text-2xl font-black tracking-tighter text-white relative z-10">{cat.name}</span>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rotate-[25deg] group-hover:rotate-[15deg] transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
            >
              {filteredSongs.map((song, i) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <SongItem {...song} />
                </motion.div>
              ))}
              {filteredSongs.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-text-muted font-black uppercase tracking-[0.4em] text-xs">No results found</p>
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
