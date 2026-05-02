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
import { useToastStore } from "../store/useToastStore";
import { Album, Song } from "../types";
import { motion } from "framer-motion";
import { getAverageColor } from "../utils/colorExtractor";
import ContextMenu from "./common/ContextMenu";
import { useContextMenu } from "../hooks/useContextMenu";

/**
 * Modern Glass DisplayAlbum
 * - Features a dynamic, blurred glass header.
 * - Staggered track animations.
 * - Integrated with the new design system (rounded-3xl, Outfit font).
 */
const DisplayAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicColor, setDynamicColor] = useState("#1db954");
  
  const { playWithId, likedSongs, toggleLike, playlists, addSongToPlaylist, addToQueue } = usePlayerStore();
  const { addToast } = useToastStore();
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

  const handleShare = (song?: Song) => {
    navigator.clipboard.writeText(window.location.href);
    addToast(song ? `Link to ${song.name} copied!` : "Album link copied!", 'success');
  };

  const handleToggleLike = (songId: number) => {
    toggleLike(songId);
    const isNowLiked = !likedSongs.includes(songId);
    addToast(isNowLiked ? "Added to Liked Songs" : "Removed from Liked Songs", 'info');
  };

  const handleAddToPlaylist = (songId: number, playlistId: string, playlistName: string) => {
    addSongToPlaylist(songId, playlistId);
    addToast(`Added to ${playlistName}`, 'success');
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-black/40 backdrop-blur-3xl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(29,185,84,0.3)]" />
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
      className="h-full flex flex-col relative"
    >
      <Navbar />
      
      <div 
        ref={scrollContainer}
        className="flex-grow overflow-y-auto px-6 pt-10 hide-scrollbar"
      >
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end gap-10 mb-12 relative z-10">
          <motion.div
            layoutId={`album-image-${id}`}
            className="w-56 h-56 lg:w-72 lg:h-72 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 group"
          >
            <img 
              src={album.image} 
              alt={album.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          </motion.div>
          
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#1db954] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Album</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Verified Collection</span>
            </div>
            
            <motion.h1 
              layoutId={`album-name-${id}`}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-gradient"
            >
              {album.name}
            </motion.h1>

            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 text-white">
                <img className="w-6 h-6 rounded-full" src={assets.spotify_logo} alt="S" />
                <span className="font-bold">Spotify</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-white/60">1.2M Likes</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 font-bold">{songs.length} Tracks</span>
            </div>
          </div>
        </div>

        {/* Dynamic Background Glow */}
        <div 
          className="absolute top-0 left-0 w-full h-[500px] pointer-events-none opacity-20 blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: dynamicColor }}
        />

        {/* Track List Header */}
        <div className="grid grid-cols-[30px_1fr_1fr_100px] gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 mb-4 sticky top-0 bg-[#121212]/40 backdrop-blur-xl z-20 rounded-t-2xl">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <div className="flex justify-end pr-4">
            <img className="w-4 opacity-40" src={assets.clock_icon} alt="Time" />
          </div>
        </div>

        {/* Song List */}
        <div className="flex flex-col mb-32 relative z-10 gap-1">
          {songs.map((song, index) => {
            const isLiked = likedSongs.includes(song.id);
            return (
              <motion.div
                key={song.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onContextMenu={(e) => showMenu(e, song)}
                className="grid grid-cols-[30px_1fr_1fr_100px] gap-4 px-6 py-4 items-center rounded-2xl group hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <span className="text-xs font-black text-gray-500 group-hover:text-[#1db954]" onClick={() => handleSongClick(song.id)}>{index + 1}</span>
                <div className="flex items-center gap-4 min-w-0" onClick={() => handleSongClick(song.id)}>
                  <img className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform" src={song.image} alt={song.name} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-bold truncate group-hover:text-[#1db954] transition-colors">{song.name}</span>
                    <span className="text-[11px] text-gray-500 font-medium group-hover:text-white/60 transition-colors">{song.desc}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-medium truncate flex-grow group-hover:text-white/40 transition-colors">{album.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleLike(song.id); }}
                    className={`transition-all duration-300 transform ${isLiked ? 'text-[#1db954] scale-110' : 'text-gray-500 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="flex justify-end pr-4">
                  <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">{song.duration}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ContextMenu 
        visible={visible}
        x={x}
        y={y}
        onClose={closeMenu}
        options={[
          { label: 'Play Now', icon: '▶', onClick: () => playWithId(data?.id) },
          { label: likedSongs.includes(data?.id) ? 'Remove from Liked' : 'Add to Liked', icon: '❤️', onClick: () => handleToggleLike(data?.id) },
          { label: 'Add to Queue', icon: '➕', onClick: () => { addToQueue(data?.id); addToast("Added to Queue", 'success'); } },
          ...playlists.map(p => ({
            label: `Add to ${p.name}`,
            icon: '📂',
            onClick: () => handleAddToPlaylist(data?.id, p.id, p.name)
          })),
          { label: 'Share', icon: '🔗', onClick: () => handleShare(data) },
        ]}
      />
    </motion.div>
  );
};

export default memo(DisplayAlbum);
