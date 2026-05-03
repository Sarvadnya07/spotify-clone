import React, { memo, useMemo } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { albumsData, assets, songsData } from '../assets/assets';
import usePlayerStore from '../store/usePlayerStore';
import { motion } from 'framer-motion';

/**
 * Production-Grade Album View
 * - Professional hero section with clean typography.
 * - High-performance tracklisting grid.
 */
const DisplayAlbum = () => {
    const { id } = useParams();
    const albumId = Number(id);
    const albumData = albumsData.find((album) => album.id === albumId);
    const { playWithId } = usePlayerStore();

    const albumSongs = useMemo(() => songsData.slice(0, 8), []);

    if (!albumData) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col bg-[#121212] overflow-hidden"
        >
            <Navbar />
            
            <div className="flex-grow overflow-y-auto custom-scrollbar pb-40">
                {/* HERO HEADER */}
                <div className="px-8 pt-10 pb-10 flex flex-col md:flex-row items-end gap-8 relative overflow-hidden bg-gradient-to-b from-white/[0.05] to-transparent">
                    <img 
                        className="w-52 md:w-60 rounded-md shadow-2xl border border-white/5" 
                        src={albumData.image} 
                        alt={albumData.name} 
                    />
                    
                    <div className="flex flex-col gap-3 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a7a7a7]">Playlist</span>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">{albumData.name}</h2>
                        <p className="text-sm font-medium text-[#a7a7a7] max-w-2xl mt-2 leading-relaxed">{albumData.desc}</p>
                        
                        <div className="flex items-center gap-6 mt-8">
                            <button 
                                onClick={() => albumSongs[0] && playWithId(albumSongs[0].id)}
                                className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent ml-1" />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <img className="w-5 h-5" src={assets.spotify_logo} alt="Spotify" />
                                <span className="text-sm font-bold text-white tracking-tight">Spotify Elite</span>
                                <span className="text-[#a7a7a7] text-sm">• {albumSongs.length} tracks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRACKLIST GRID */}
                <div className="px-8 mt-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-3 border-b border-white/5 text-[#a7a7a7] text-[11px] font-bold uppercase tracking-widest mb-4">
                        <div className="flex items-center gap-4">
                            <span className="w-4 text-center">#</span>
                            <span>Title</span>
                        </div>
                        <span className="hidden sm:block">Album</span>
                        <span className="hidden md:block">Added</span>
                        <div className="flex justify-end pr-4">
                            <img className="w-4 opacity-40" src={assets.clock_icon} alt="Time" />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        {albumSongs.map((item, index) => (
                            <div 
                                key={item.id}
                                onClick={() => playWithId(item.id)}
                                className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-2.5 rounded-md hover:bg-white/5 cursor-pointer group transition-colors"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <span className="w-4 text-center text-xs font-medium text-[#a7a7a7] group-hover:text-white">{index + 1}</span>
                                    <img className="w-10 h-10 rounded shadow-md" src={item.image} alt={item.name} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-white truncate group-hover:text-[#1db954] transition-colors">{item.name}</span>
                                        <span className="text-[11px] text-[#a7a7a7] font-medium truncate">{item.desc}</span>
                                    </div>
                                </div>
                                <span className="hidden sm:flex items-center text-xs font-medium text-[#a7a7a7] truncate">{albumData.name}</span>
                                <span className="hidden md:flex items-center text-xs font-medium text-[#a7a7a7] truncate">5d ago</span>
                                <div className="flex items-center justify-end pr-4">
                                    <span className="text-[11px] font-medium text-[#a7a7a7] tabular-nums">{item.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(DisplayAlbum);
