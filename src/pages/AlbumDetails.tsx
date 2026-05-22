import React, { memo, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import { useParams } from 'react-router-dom';
import { albumsData, assets, songsData } from '../assets/assets';
import usePlayerStore from '../store/usePlayerStore';
import { motion } from 'framer-motion';

/**
 * Production-Grade Album View
 * - Professional hero section with clean typography.
 * - High-performance tracklisting grid.
 */
const AlbumDetails = () => {
    const { id } = useParams();
    const albumId = Number(id);
    const albumData = albumsData.find((album) => album.id === albumId);
    const { playWithId, track: currentTrack, playStatus } = usePlayerStore();

    const albumSongs = useMemo(() => songsData.slice(0, 8), []);

    if (!albumData) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col bg-transparent overflow-hidden"
        >
            <Navbar />
            
            <div className="flex-grow overflow-y-auto custom-scrollbar pb-32">
                {/* HERO HEADER */}
                <div 
                  className="px-6 md:px-8 pt-6 pb-6 flex flex-col md:flex-row items-end gap-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to bottom, ${albumData.bgColor || '#535353'}88 0%, #121212 100%)`
                  }}
                >
                    <img 
                        className="w-48 md:w-56 rounded shadow-2xl border border-white/5" 
                        src={albumData.image} 
                        alt={albumData.name} 
                    />
                    
                    <div className="flex flex-col gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">Album</span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none">{albumData.name}</h2>
                        <p className="text-xs md:text-sm font-normal text-text-muted max-w-2xl mt-1 leading-relaxed">{albumData.desc}</p>
                        
                        <div className="flex items-center gap-6 mt-6">
                            <button 
                                onClick={() => albumSongs[0] && playWithId(albumSongs[0].id)}
                                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                <img className="w-4 brightness-0 ml-0.5" src={assets.play_icon} alt="Play" />
                            </button>
                            
                            <div className="flex items-center gap-2 text-xs font-semibold text-white">
                                <img className="w-4 h-4" src={assets.spotify_logo} alt="Spotify" />
                                <span className="hover:underline cursor-pointer">Spotify</span>
                                <span className="text-text-muted font-normal">• {albumSongs.length} songs</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TRACKLIST GRID */}
                <div className="px-6 md:px-8 mt-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-2 border-b border-white/5 text-text-muted text-xs font-medium mb-3">
                        <div className="flex items-center gap-4">
                            <span className="w-4 text-center">#</span>
                            <span>Title</span>
                        </div>
                        <span className="hidden sm:block">Album</span>
                        <span className="hidden md:block">Date added</span>
                        <div className="flex justify-end pr-4">
                            <img className="w-4 opacity-70" src={assets.clock_icon} alt="Time" />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        {albumSongs.map((item, index) => {
                            const isActive = currentTrack.id === item.id;
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => playWithId(item.id)}
                                    className="grid grid-cols-3 sm:grid-cols-4 gap-4 px-4 py-2 rounded-md hover:bg-white/[0.05] cursor-pointer group transition-all duration-150 border border-transparent will-change-transform active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <span className={`w-4 flex items-center justify-center text-xs font-medium ${isActive ? 'text-primary' : 'text-text-muted'} tabular-nums`}>
                                            {isActive && playStatus ? (
                                                <div className="flex items-end justify-center gap-[2px] h-3 w-3">
                                                    <div className="w-[2px] bg-primary animate-[bounce_0.8s_infinite_alternate]" style={{ height: '60%' }} />
                                                    <div className="w-[2px] bg-primary animate-[bounce_0.8s_infinite_alternate_0.2s]" style={{ height: '90%' }} />
                                                    <div className="w-[2px] bg-primary animate-[bounce_0.8s_infinite_alternate_0.4s]" style={{ height: '40%' }} />
                                                </div>
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <img className="w-9 h-9 rounded shadow" src={item.image} alt={item.name} />
                                        <div className="flex flex-col min-w-0">
                                            <span className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-white'}`}>{item.name}</span>
                                            <span className="text-xs text-text-muted font-normal truncate mt-0.5">{item.desc}</span>
                                        </div>
                                    </div>
                                    <span className="hidden sm:flex items-center text-xs font-normal text-text-muted truncate">{albumData.name}</span>
                                    <span className="hidden md:flex items-center text-xs font-normal text-text-muted truncate">5 days ago</span>
                                    <div className="flex items-center justify-end pr-4">
                                        <span className="text-xs font-normal text-text-muted tabular-nums group-hover:text-white transition-colors">{item.duration}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(AlbumDetails);
