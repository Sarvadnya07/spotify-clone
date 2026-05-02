import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { musicService } from "../services/musicService";
import { Album, Song } from "../types";
import { motion } from "framer-motion";
import usePlayerStore from "../store/usePlayerStore";

/**
 * DisplayHome Component - Elite UX
 * Features dynamic, weather-aware algorithmic recommendations.
 */
const DisplayHome = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { history, currentWeather } = usePlayerStore();

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
      return songs.slice(0, 5);
    }

    const lastItem = history[0];
    if (typeof lastItem !== 'object') return songs.slice(0, 5);
    
    const lastSong = songs.find(s => s.id === lastItem.songId);
    if (!lastSong) return songs.slice(0, 5);

    const artistName = lastSong.desc.split('•')[0].trim();
    const related = songs.filter(s => s.desc.includes(artistName) && s.id !== lastItem.songId);
    const others = songs.filter(s => !s.desc.includes(artistName) && !history.some(h => (h as any).songId === s.id));
    
    return [...related, ...others].slice(0, 6);
  }, [loading, songs, history]);

  const renderSkeleton = () => (
    <div className="flex gap-4 overflow-hidden pb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="min-w-[180px] p-2 rounded-2xl bg-white/[0.03] animate-pulse">
          <div className="w-full aspect-square bg-white/[0.05] rounded-xl mb-4" />
          <div className="h-4 bg-white/[0.05] rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/[0.05] rounded w-1/2" />
        </div>
      ))}
    </div>
  );

  const SectionHeader = ({ title, badge, sub }: any) => (
    <div className="flex flex-col gap-1 mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black tracking-tighter text-white">{title}</h2>
        {badge && (
          <span className="text-[9px] bg-[#1db954] text-black px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-lg shadow-[#1db95422]">
            {badge}
          </span>
        )}
      </div>
      {sub && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{sub}</p>}
    </div>
  );

  const scrollClass = "flex overflow-auto gap-6 pb-6 pr-4 hide-scrollbar transition-all ease-in-out";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow h-full overflow-y-auto bg-gradient-to-b from-white/[0.02] to-transparent"
    >
      <Navbar />

      <main className="px-6 md:px-8 lg:px-10 pt-10">
        
        {/* Personalized Daily Mix Section */}
        {!loading && (
          <section className="mb-14">
            <SectionHeader 
              title="Made For You" 
              badge="New Mix" 
              sub={currentWeather ? `Synced with ${currentWeather.mood}` : "Based on your history"}
            />
            <div className={scrollClass} role="region" aria-label="Personalized mix list">
              {personalizedMix.map((item, index) => (
                <motion.div
                  key={`mix-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
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

        {/* Featured Charts Section */}
        <section className="mb-14">
          <SectionHeader title="Featured Charts" sub="Global Trends" />
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

        {/* Biggest Hits Section */}
        <section className="mb-14">
          <SectionHeader title="Today's biggest hits" sub="Popular Now" />
          {loading ? (
            renderSkeleton()
          ) : (
            <div className={scrollClass} role="region" aria-label="Trending songs list">
              {songs.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SongItem {...item} />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Dynamic Intelligence Footer */}
        <section className="mt-20 mb-32">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] p-10 glass-panel border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1db95411] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1db954] opacity-[0.05] blur-[120px] -mr-32 -mt-32" />
            
            <div className="max-w-2xl relative z-10">
              <h2 className="text-4xl font-black tracking-tighter text-white mb-4">Elite Audio Intelligence</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Your experience is being personalized in real-time. We analyze your environment, history, and current vibes to curate the perfect soundtrack for your life.
              </p>
              <div className="flex gap-4">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-[#1db954] uppercase tracking-widest">Environment Sync: Active</span>
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Mood: Analysis Level High</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default DisplayHome;
