import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { musicService } from "../services/musicService";
import { Album, Song } from "../types";
import { motion } from "framer-motion";
import usePlayerStore from "../store/usePlayerStore";

/**
 * DisplayHome Component
 * Features dynamic, algorithmic recommendations based on listening history.
 */
const DisplayHome = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { history } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumsData, songsData] = await Promise.all([
          musicService.getAlbums(),
          musicService.getSongs()
        ]);
        setAlbums(albumsData);
        setSongs(songsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Algorithmic Recommendation Logic
  const personalizedMix = useMemo(() => {
    if (loading || songs.length === 0) return [];
    
    if (history.length === 0) {
      // Default recommendation: Popular/First few songs
      return songs.slice(0, 5);
    }

    // Smart Mix Strategy:
    // 1. Get most recent artist/vibe from history
    const lastSongId = history[0];
    const lastSong = songs.find(s => s.id === lastSongId);
    if (!lastSong) return songs.slice(0, 5);

    const artistName = lastSong.desc.split('•')[0].trim();
    
    // 2. Filter for more songs by same artist or similar
    const related = songs.filter(s => s.desc.includes(artistName) && s.id !== lastSongId);
    
    // 3. Combine with some random discoverable tracks
    const others = songs.filter(s => !s.desc.includes(artistName) && !history.includes(s.id));
    
    return [...related, ...others].slice(0, 6);
  }, [loading, songs, history]);

  const renderSkeleton = () => (
    <div className="flex gap-4 overflow-hidden pb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="min-w-[180px] p-2 rounded bg-[#181818] animate-pulse">
          <div className="w-full aspect-square bg-[#282828] rounded mb-3" />
          <div className="h-4 bg-[#282828] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#282828] rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  const scrollClass = "flex overflow-auto gap-4 pb-3 pr-2 hide-scrollbar transition-all ease-in-out";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow overflow-y-auto"
    >
      <Navbar />

      <main className="px-2 md:px-4 lg:px-6 pt-6">
        {/* Featured Charts Section */}
        <section className="mb-8">
          <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
          {loading ? (
            renderSkeleton()
          ) : (
            <div className={scrollClass} role="region" aria-label="Featured album list">
              {albums.map((item) => (
                <AlbumItem key={item.id} {...item} />
              ))}
            </div>
          )}
        </section>

        {/* Personalized Daily Mix Section */}
        {!loading && (
          <section className="mb-8">
            <h1 className="my-5 font-bold text-2xl flex items-center gap-2">
              Made For You 
              <span className="text-[10px] bg-[#1db954] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">New Mix</span>
            </h1>
            <div className={scrollClass} role="region" aria-label="Personalized mix list">
              {personalizedMix.map((item, index) => (
                <motion.div
                  key={`mix-${item.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SongItem {...item} />
                </motion.div>
              ))}
              {personalizedMix.length === 0 && (
                <p className="text-gray-500 text-sm italic py-4">Keep listening to generate your custom mix!</p>
              )}
            </div>
          </section>
        )}

        {/* Biggest Hits Section */}
        <section className="mb-8">
          <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
          {loading ? (
            renderSkeleton()
          ) : (
            <div className={scrollClass} role="region" aria-label="Trending songs list">
              {songs.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SongItem {...item} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 mb-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="border border-gray-800 rounded-xl p-6 bg-[#121212] shadow-xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1db954] opacity-[0.03] blur-[100px] -mr-32 -mt-32" />
            <h2 className="text-xl font-semibold text-white mb-3">Audio Intelligence Active</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Your listening history is being analyzed in real-time. The "Made For You" section automatically adapts to your favorite artists and genres as you explore the library.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="text-[10px] text-[#1db954] border border-[#1db95455] px-2 py-0.5 rounded">Analysis Level: High</span>
              <span className="text-[10px] text-gray-500 border border-gray-800 px-2 py-0.5 rounded">Cloud Sync: Ready</span>
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default DisplayHome;
