import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/layout/Navbar";
import AlbumItem from "../features/music/AlbumItem";
import SongItem from "../features/music/SongItem";
import { musicService } from "../services/musicService";
import { Album, Song } from "../core/types";
import { motion } from "framer-motion";
import usePlayerStore from "../store/usePlayerStore";

/**
 * High-Efficiency DisplayHome
 * - Optimized with layout containment (content-visibility).
 * - Surgical state subscriptions.
 * - Hardware-accelerated transitions.
 */
const Home = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use specific selectors to prevent re-renders when other state (like volume) changes
  const history = usePlayerStore(state => state.history);
  const mood = usePlayerStore(state => state.currentWeather?.mood);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [a, s] = await Promise.all([
          musicService.getAlbums(),
          musicService.getSongs()
        ]);
        if (active) {
          setAlbums(a || []);
          setSongs(s || []);
        }
      } catch (e) {
        console.error("Home Init Error:", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, []);

  const personalizedMix = useMemo(() => {
    if (!songs || songs.length === 0) return [];
    if (!history || history.length === 0) return songs.slice(0, 6);
    const last = history[0] as any;
    const lastSong = songs.find(s => s.id === last?.songId);
    if (!lastSong) return songs.slice(0, 6);
    const artist = lastSong.desc.split('•')[0].trim();
    const related = songs.filter(s => s.desc.includes(artist) && s.id !== lastSong.id);
    const others = songs.filter(s => !s.desc.includes(artist));
    return [...related, ...others].slice(0, 6);
  }, [songs, history]);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-[#121212]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const sectionStyle = { contentVisibility: 'auto', containIntrinsicSize: '0 320px' } as React.CSSProperties;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow h-full overflow-y-auto bg-[#121212] custom-scrollbar gpu"
    >
      <Navbar />

      <main className="px-8 pt-8 pb-32 space-y-12">
        <section style={sectionStyle}>
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Made For You</h2>
            {mood && <p className="text-[11px] font-bold text-[#a7a7a7] uppercase tracking-widest">Synced with {mood}</p>}
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
            {personalizedMix.map(item => <SongItem key={`mix-${item.id}`} {...item} />)}
          </div>
        </section>

        <section style={sectionStyle}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Featured Charts</h2>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar contain-layout">
            {albums.map(item => <AlbumItem key={item.id} {...item} />)}
          </div>
        </section>

        <section style={sectionStyle}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Trending Now</h2>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar contain-layout">
            {songs.map(item => <SongItem key={item.id} {...item} />)}
          </div>
        </section>

        <section className="mt-16 py-12 border-t border-white/5" style={sectionStyle}>
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">System Observability</h3>
            <p className="text-[#a7a7a7] text-sm leading-relaxed mb-8">
              Engineered for extreme performance using layout containment, granular state subscriptions, and hardware-accelerated painting.
            </p>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#a7a7a7] uppercase tracking-widest mb-1">Rendering</span>
                <span className="text-xs font-bold text-white">Direct-to-GPU</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#a7a7a7] uppercase tracking-widest mb-1">State Bus</span>
                <span className="text-xs font-bold text-white">Surgical Subscriptions</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default Home;
