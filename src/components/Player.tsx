import React, { useCallback, useRef } from "react";
import { assets } from "../assets/assets";
import usePlayerStore from "../store/usePlayerStore";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { PlayerTime } from "../types";
import Visualizer from "./Visualizer";

/**
 * Modern Docked Player Component
 * - Seamlessly integrated at the bottom.
 * - Glassmorphism design without floating gaps.
 * - Maximizes usability and edge-to-edge aesthetics.
 */
const Player = () => {
  const {
    track,
    playStatus,
    play,
    pause,
    playNext,
    playPrevious,
    time,
    volume,
    setVolume,
    isBuffering,
    showLyrics,
    toggleLyrics,
    shuffleMode,
    toggleShuffle,
    showQueue,
    toggleQueue,
    showMiniplayer,
    toggleMiniplayer
  } = usePlayerStore();

  const { seek } = useAudioEngine();
  const seekBg = useRef<HTMLDivElement>(null);

  const formatTime = (time: PlayerTime["currentTime"]) => {
    return `${time.minute}:${time.second.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const percentage = Math.min(1, Math.max(0, clickX / rect.width));
    seek(percentage);
  };

  const togglePlay = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playStatus ? pause() : play();
      }
    },
    [playStatus, play, pause]
  );

  return (
    <div className="h-[95px] glass-panel border-x-0 border-b-0 flex justify-between items-center px-8 shadow-2xl z-[60] relative">
      
      {/* LEFT — Track Info */}
      <div className="hidden lg:flex items-center gap-4 w-[28%] min-w-[280px]">
        <div className="relative">
          <img
            className={`w-14 h-14 rounded-lg shadow-xl transition-all duration-500 ${isBuffering ? 'opacity-40 grayscale blur-[2px]' : 'opacity-100'}`}
            src={track.image}
            alt={track.name}
          />
        </div>
        <div className="leading-tight flex flex-col gap-0.5 min-w-0">
          <p className="font-bold text-sm truncate text-white">{track.name}</p>
          <p className="text-[11px] text-gray-400 truncate hover:text-[#1db954] transition-colors cursor-pointer">{track.desc}</p>
          <div className="h-4 mt-1">
            <Visualizer />
          </div>
        </div>
      </div>

      {/* CENTER — Control Hub */}
      <div className="flex flex-col items-center gap-1.5 flex-grow lg:max-w-[44%] w-full">
        <div className="flex gap-8 justify-center items-center">
          <button onClick={toggleShuffle} className={`transition-all ${shuffleMode ? 'text-[#1db954]' : 'text-gray-500 hover:text-white'}`}>
            <img className="w-4" src={assets.shuffle_icon} style={{ filter: shuffleMode ? 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(116deg) brightness(100%) contrast(100%)' : 'none' }} alt="S" />
          </button>

          <img onClick={playPrevious} className="w-5 opacity-60 hover:opacity-100 cursor-pointer active:scale-90 transition" src={assets.prev_icon} alt="P" />
          
          <button 
            onClick={playStatus ? pause : play}
            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-90 transition shadow-xl"
          >
            <img className="w-4 invert" src={playStatus ? assets.pause_icon : assets.play_icon} alt="P/P" />
          </button>

          <img onClick={playNext} className="w-5 opacity-60 hover:opacity-100 cursor-pointer active:scale-90 transition" src={assets.next_icon} alt="N" />
          <img className="w-4 opacity-60 hover:opacity-100 cursor-pointer transition" src={assets.loop_icon} alt="L" />
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-3 w-full px-4">
          <span className="text-[10px] font-medium text-gray-500 w-8 text-right">{formatTime(time.currentTime)}</span>
          <div
            ref={seekBg}
            onClick={handleSeek}
            className="relative flex-grow h-1.5 bg-white/10 rounded-full cursor-pointer group/seek overflow-hidden"
          >
            <div
              className="h-full bg-white group-hover/seek:bg-[#1db954] transition-all"
              style={{ width: 'var(--player-progress, 0%)' }}
            />
          </div>
          <span className="text-[10px] font-medium text-gray-500 w-8">{formatTime(time.totalTime)}</span>
        </div>
      </div>

      {/* RIGHT — Utility Bar */}
      <div className="hidden lg:flex items-center gap-4 w-[28%] justify-end">
        <button onClick={toggleLyrics} className={`transition-all ${showLyrics ? 'text-[#1db954]' : 'text-gray-500 hover:text-white'}`}>
          <img className="w-4" src={assets.mic_icon} style={{ filter: showLyrics ? 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(116deg) brightness(100%) contrast(100%)' : 'none' }} alt="L" />
        </button>
        <button onClick={toggleQueue} className={`transition-all ${showQueue ? 'text-[#1db954]' : 'text-gray-500 hover:text-white'}`}>
          <img className="w-4" src={assets.queue_icon} style={{ filter: showQueue ? 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(116deg) brightness(100%) contrast(100%)' : 'none' }} alt="Q" />
        </button>
        
        {/* Volume */}
        <div className="flex items-center gap-3 w-32 group/vol">
          <img className="w-4 opacity-50" src={assets.volume_icon} alt="V" />
          <div className="relative flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white group-hover/vol:bg-[#1db954] transition-all" style={{ width: `${volume * 100}%` }} />
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <button onClick={toggleMiniplayer} className={`transition-all ${showMiniplayer ? 'text-[#1db954]' : 'text-gray-500 hover:text-white'}`}>
          <img className="w-4" src={assets.zoom_icon} style={{ filter: showMiniplayer ? 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(116deg) brightness(100%) contrast(100%)' : 'none' }} alt="M" />
        </button>
      </div>
    </div>
  );
};

export default Player;
