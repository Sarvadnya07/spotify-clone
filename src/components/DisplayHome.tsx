import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { musicService } from "../services/musicService";
import { Album, Song } from "../types";
import { motion } from "framer-motion";

/**
 * DisplayHome Component
 * Refactored for asynchronous data fetching and improved UX with loading states and animations.
 */
const DisplayHome = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

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
            className="border border-gray-800 rounded-xl p-6 bg-[#121212] shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-3">More For You</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Discover new music tailored just for you. As you listen to more tracks, 
              our recommendation engine will suggest artists and playlists that match your taste.
            </p>
            <div className="h-32 mt-6 rounded-lg bg-gradient-to-br from-[#1db95422] to-transparent border border-[#1db95411] flex items-center justify-center">
              <span className="text-[#1db954] text-sm font-medium opacity-80">
                Personalized recommendations arriving soon
              </span>
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default DisplayHome;
