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

const Search = () => {
  const [query, setQuery] = useState('');
  const { visible, x, y, data, showMenu, closeMenu } = useContextMenu();
  const { playWithId, likedSongs, toggleLike } = usePlayerStore();

  const filteredSongs = useMemo(() => {
    if (!query) return [];
    return songsData.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) || 
      s.desc.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredAlbums = useMemo(() => {
    if (!query) return [];
    return albumsData.filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) || 
      a.desc.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <Navbar />
      
      <div className="flex-grow overflow-y-auto px-6 pt-6">
        <div className="relative mb-8 max-w-xl">
          <input 
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#333] border-none rounded-full py-3 px-12 text-white placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-white/20"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>

        <AnimatePresence mode="popLayout">
          {!query && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-64 text-gray-400"
            >
              <h2 className="text-2xl font-bold mb-2">Search for something</h2>
              <p>Find your favorite songs, albums, and artists.</p>
            </motion.div>
          )}

          {query && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10 mb-20"
            >
              {filteredSongs.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Songs</h2>
                  <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                    {filteredSongs.map((song, i) => (
                      <motion.div 
                        key={song.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onContextMenu={(e) => showMenu(e, song)}
                      >
                        <SongItem {...song} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {filteredAlbums.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Albums</h2>
                  <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                    {filteredAlbums.map((album, i) => (
                      <motion.div 
                        key={album.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <AlbumItem {...album} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {filteredSongs.length === 0 && filteredAlbums.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <h2 className="text-2xl font-bold mb-2">No results found for "{query}"</h2>
                  <p>Please check your spelling or try another search term.</p>
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
          { label: 'Add to Queue', icon: '➕', onClick: () => console.log('Added to queue') },
          { label: 'Share', icon: '🔗', onClick: () => navigator.clipboard.writeText(window.location.href) },
        ]}
      />
    </motion.div>
  );
};

export default Search;
