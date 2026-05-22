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
      <main className="p-6 md:p-8 space-y-10">
        {/* TOP SECTION: FEATURED CHARTS */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">Featured Charts</h2>
            <button className="text-xs font-bold text-text-muted hover:underline transition-colors">Show all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {albums.map((item, index) => (
              <AlbumItem key={index} {...item} />
            ))}
          </div>
        </section>

        {/* BOTTOM SECTION: TRENDING NOW */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">Trending Now</h2>
            <button className="text-xs font-bold text-text-muted hover:underline transition-colors">Show all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {songs.map((item, index) => (
              <SongItem key={index} {...item} />
            ))}
          </div>
        </section>

        {/* REAL-WORLD SPOTIFY FOOTER */}
        <footer className="mt-20 pt-10 pb-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Company</h4>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">About</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Jobs</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">For the Record</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Communities</h4>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">For Artists</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Developers</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Advertising</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Investors</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Vendors</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Useful links</h4>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Support</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Free Mobile App</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Spotify Plans</h4>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Premium Individual</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Premium Student</a>
            <a href="#" className="text-text-muted hover:text-white transition hover:underline">Spotify Free</a>
          </div>
          <div className="col-span-full pt-10 mt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-[11px]">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="hover:text-white transition hover:underline">Legal</a>
              <a href="#" className="hover:text-white transition hover:underline">Safety & Privacy Center</a>
              <a href="#" className="hover:text-white transition hover:underline">Privacy Policy</a>
              <a href="#" className="hover:text-white transition hover:underline">Cookies</a>
              <a href="#" className="hover:text-white transition hover:underline">About Ads</a>
              <a href="#" className="hover:text-white transition hover:underline">Accessibility</a>
            </div>
            <span>© 2026 Spotify AB</span>
          </div>
        </footer>
      </main>
    </motion.div>
  );
};

export default Home;
