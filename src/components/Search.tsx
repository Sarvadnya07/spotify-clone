import React, { useState, useMemo } from 'react';
import { Song, Album } from '../types';
import SongItem from './SongItem';
import AlbumItem from './AlbumItem';
import { motion, AnimatePresence } from 'framer-motion';
import { songsData, albumsData } from '../assets/assets';
import Navbar from './Navbar';
import ContextMenu from './common/ContextMenu';
import { useContextMenu } from '../hooks/useContextMenu';
import usePlayerStore from '../store/usePlayerStore';
import { useToastStore } from '../store/useToastStore';
import { aiDjService } from '../services/AiDjService';

type Category = 'All' | 'Songs' | 'Albums' | 'AI Discovery';

/**
 * Modern Glass Search Component
 * - Integrated AI Discovery mode for natural language search.
 * - Glassmorphic panels and spring animations.
 */
const Search = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const { visible, x, y, data, showMenu, closeMenu } = useContextMenu();
  const { playWithId, likedSongs, toggleLike, addToQueue } = usePlayerStore();
  const { addToast } = useToastStore();

  const isAiMode = category === 'AI Discovery';

  const filteredSongs = useMemo(() => {
    if (!query) return [];
    if (isAiMode) return aiDjService.semanticSearch(query, songsData);
    return songsData.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) || 
      s.desc.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, isAiMode]);

  const filteredAlbums = useMemo(() => {
    if (!query || isAiMode) return [];
    return albumsData.filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) || 
      a.desc.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, isAiMode]);

  const handleShare = (song: Song) => {
    navigator.clipboard.writeText(window.location.href);
    addToast(`Link to ${song.name} copied!`, 'success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <Navbar />
      
      <div className="flex-grow overflow-y-auto px-6 pt-6 hide-scrollbar">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="relative max-w-xl flex-grow group">
            <input 
              type="text"
              placeholder={isAiMode ? "Describe a vibe (e.g. 'Chill beats for focus')" : "What do you want to listen to?"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className={`w-full glass-panel bg-white/5 hover:bg-white/10 focus:bg-white/10 border rounded-2xl py-4 px-14 text-white placeholder-gray-500 outline-none transition-all focus:ring-2 font-bold tracking-tight ${isAiMode ? 'border-[#1db954]/40 focus:ring-[#1db954]/40' : 'border-white/10 focus:ring-white/10'}`}
            />
            <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-xl transition-colors ${isAiMode ? 'text-[#1db954]' : 'text-gray-400 group-focus-within:text-[#1db954]'}`}>
              {isAiMode ? '🎙️' : '🔍'}
            </span>
            {isAiMode && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-0.5">
                <div className="w-1 h-3 bg-[#1db954] animate-pulse" />
                <div className="w-1 h-5 bg-[#1db954] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-3 bg-[#1db954] animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {(['All', 'Songs', 'Albums', 'AI Discovery'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 border ${
                  category === cat 
                    ? 'bg-[#1db954] text-black border-[#1db954] shadow-[0_0_20px_rgba(29,185,84,0.3)]' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat === 'AI Discovery' ? '✨ AI DJ' : cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {!query && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className={`w-24 h-24 rounded-3xl glass-panel flex items-center justify-center mb-6 shadow-2xl transition-colors duration-500 ${isAiMode ? 'bg-[#1db95411] border-[#1db95422]' : ''}`}>
                <span className="text-4xl">{isAiMode ? '🤖' : '🔭'}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-3">
                {isAiMode ? 'Meet your Semantic DJ' : 'Explore the Galaxy'}
              </h2>
              <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
                {isAiMode 
                  ? "Describe a mood, activity, or vibe. I'll analyze the intent and find the perfect match."
                  : "Find your favorite tracks, curated albums, and rising artists across the glass platform."}
              </p>
            </motion.div>
          )}

          {query && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 mb-32"
            >
              {filteredSongs.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-black text-[#1db954] uppercase tracking-[0.4em] mb-6 px-1">
                    {isAiMode ? 'AI MATCHES' : 'Top Tracks'}
                  </h2>
                  <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar">
                    {filteredSongs.map((song, i) => (
                      <motion.div 
                        key={song.id}
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onContextMenu={(e) => showMenu(e, song)}
                      >
                        <SongItem {...song} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {filteredAlbums.length > 0 && !isAiMode && (
                <section>
                  <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 px-1">Featured Collections</h2>
                  <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar">
                    {filteredAlbums.map((album, i) => (
                      <motion.div 
                        key={album.id}
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <AlbumItem {...album} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {filteredSongs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <span className="text-3xl opacity-40">∅</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-2">No matches found</h2>
                  <p className="text-gray-500 font-medium">Try adjusting your filters or refining your search term.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContextMenu 
        visible={visible}
        x={x}
        y={y}
        onClose={closeMenu}
        options={[
          { label: 'Play Now', icon: '▶', onClick: () => playWithId(data?.id) },
          { label: likedSongs.includes(data?.id) ? 'Remove from Liked' : 'Add to Liked', icon: '❤️', onClick: () => toggleLike(data?.id) },
          { label: 'Add to Queue', icon: '➕', onClick: () => { addToQueue(data?.id); addToast("Added to Queue", 'success'); } },
          { label: 'Share', icon: '🔗', onClick: () => handleShare(data) },
        ]}
      />
    </motion.div>
  );
};

export default Search;
