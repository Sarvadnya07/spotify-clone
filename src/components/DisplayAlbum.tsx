import React, {
  useEffect,
  useState,
  useCallback,
  memo,
  useRef
} from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { musicService } from "../services/musicService";
import usePlayerStore from "../store/usePlayerStore";
import { Album, Song } from "../types";
import { motion } from "framer-motion";
import { getAverageColor } from "../utils/colorExtractor";
import ContextMenu from "./common/ContextMenu";
import { useContextMenu } from "../hooks/useContextMenu";

const DisplayAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicColor, setDynamicColor] = useState("#121212");
  
  const { playWithId, likedSongs, toggleLike } = usePlayerStore();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { visible, x, y, data, showMenu, closeMenu } = useContextMenu();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [albumData, songsData] = await Promise.all([
          musicService.getAlbumById(Number(id)),
          musicService.getSongs()
        ]);
        if (albumData) {
          setAlbum(albumData);
          setSongs(songsData);
          const color = await getAverageColor(albumData.image);
          setDynamicColor(color);
        }
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumDetails();
  }, [id]);

  const handleSongClick = useCallback((id: number) => {
    playWithId(id);
  }, [playWithId]);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1db954]" />
        </div>
      </div>
    );
  }

  if (!album) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <Navbar />
      <div 
        ref={scrollContainer}
        className="flex-grow overflow-y-auto px-6 pt-10 transition-colors duration-1000"
        style={{ 
          background: `linear-gradient(${dynamicColor}, #121212 400px, #121212)` 
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10">
          <motion.img
            layoutId={`album-image-${id}`}
            src={album.image}
            alt={album.name}
            className="w-48 h-48 lg:w-60 lg:h-60 rounded shadow-2xl object-cover"
          />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider">Playlist</span>
            <motion.h1 
              layoutId={`album-name-${id}`}
              className="text-4xl md:text-7xl font-black mb-2"
            >
              {album.name}
            </motion.h1>
            <div className="flex items-center gap-2 text-sm font-medium">
              <img className="w-6" src={assets.spotify_logo} alt="Spotify" />
              <span>Spotify</span>
              <span className="opacity-60">• 1,323,154 likes • {songs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-white/10 mb-4 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <img className="w-4 ml-auto" src={assets.clock_icon} alt="Duration" />
        </div>

        {/* Song List */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col mb-20"
        >
          {songs.map((song, index) => {
            const isLiked = likedSongs.includes(song.id);
            return (
              <motion.div
                key={song.id}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                onContextMenu={(e) => showMenu(e, song)}
                className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-3 items-center text-gray-400 rounded-md group cursor-pointer transition-colors"
              >
                <span className="text-sm group-hover:text-white" onClick={() => handleSongClick(song.id)}>{index + 1}</span>
                <div className="flex items-center gap-3" onClick={() => handleSongClick(song.id)}>
                  <img className="w-10 h-10 rounded" src={song.image} alt={song.name} />
                  <div className="flex flex-col">
                    <span className="text-white font-medium truncate max-w-[200px]">{song.name}</span>
                    <span className="text-xs group-hover:text-white transition-colors">{song.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 hidden md:flex">
                  <span className="text-sm group-hover:text-white transition-colors flex-grow truncate">{album.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${isLiked ? 'opacity-100 text-[#1db954]' : 'text-gray-400 hover:text-white'}`}
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </button>
                </div>
                <span className="text-sm ml-auto">{song.duration}</span>
              </motion.div>
            );
          })}
        </motion.div>
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
          { label: 'Delete', icon: '🗑', onClick: () => console.log('Delete'), variant: 'danger' },
        ]}
      />
    </motion.div>
  );
};

export default memo(DisplayAlbum);
