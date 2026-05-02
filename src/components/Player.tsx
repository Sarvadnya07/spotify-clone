import React, { useCallback, useRef } from "react";
import { assets } from "../assets/assets";
import usePlayerStore from "../store/usePlayerStore";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { PlayerTime } from "../types";
import Visualizer from "./Visualizer";

/**
 * Enhanced Player Component
 * - Optimized for both Desktop (Keyboard) and Mobile (Touch).
 * - High-performance visual updates via CSS variables.
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
    <div className="h-[10%] min-h-[80px] bg-black text-white flex justify-between items-center px-4 select-none border-t border-[#222]">
      
      {/* LEFT — Current Song Information */}
      <div className="hidden lg:flex items-center gap-4 w-[30%] min-w-[280px]">
        <img
          className={`w-14 h-14 rounded shadow-md transition-all duration-300 ${isBuffering ? 'opacity-40 grayscale blur-[1px]' : 'opacity-100'}`}
          src={track.image}
          alt={track.name}
        />
        <div className="leading-tight flex flex-col gap-1">
          <p className="font-semibold text-sm truncate max-w-[150px]">{track.name}</p>
          <p className="text-xs text-gray-400 truncate max-w-[150px]">{track.desc}</p>
          <div className="h-6 mt-1 overflow-hidden">
            <Visualizer />
          </div>
        </div>
      </div>

      {/* CENTER — Player Controls + Seek Bar */}
      <div className="flex flex-col items-center gap-1 flex-grow max-w-full lg:max-w-[40%]">
        <div className="flex gap-6 justify-center items-center">
          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition active:scale-90" src={assets.shuffle_icon} alt="Shuffle" />
          <img onClick={playPrevious} className="w-5 opacity-70 hover:opacity-100 cursor-pointer transition active:scale-90" src={assets.prev_icon} alt="Previous" />
          
          <button 
            onClick={playStatus ? pause : play}
            onKeyDown={togglePlay}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full hover:scale-105 active:scale-95 transition shadow-lg"
          >
            <img 
              className="w-4 invert" 
              src={playStatus ? assets.pause_icon : assets.play_icon} 
              alt={playStatus ? "Pause" : "Play"} 
            />
          </button>

          <img onClick={playNext} className="w-5 opacity-70 hover:opacity-100 cursor-pointer transition active:scale-90" src={assets.next_icon} alt="Next" />
          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition active:scale-90" src={assets.loop_icon} alt="Loop" />
        </div>

        <div className="flex items-center gap-3 w-full justify-center group">
          <p className="text-[10px] tabular-nums opacity-60 w-10 text-right">
            {formatTime(time.currentTime)}
          </p>

          {/* Hit Area Wrapper (Optimized for Touch) */}
          <div
            ref={seekBg}
            onClick={handleSeek}
            onTouchStart={handleSeek}
            className="relative flex-grow h-6 flex items-center cursor-pointer"
          >
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors"
                style={{ width: 'var(--player-progress, 0%)' }}
              />
            </div>
            {/* Visual Knob */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-xl transition-opacity pointer-events-none"
              style={{ left: 'calc(var(--player-progress, 0%) - 6px)' }}
            />
          </div>

          <p className="text-[10px] tabular-nums opacity-60 w-10">
            {formatTime(time.totalTime)}
          </p>
        </div>
      </div>

      {/* RIGHT — Volume & Extra Controls */}
      <div className="hidden lg:flex items-center gap-3 w-[22%] justify-end">
        <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.mic_icon} alt="Lyrics" />
        <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.queue_icon} alt="Queue" />
        <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.speaker_icon} alt="Devices" />
        
        <div className="flex items-center gap-2 group w-32 ml-2">
          <img className="w-4 opacity-70" src={assets.volume_icon} alt="Volume" />
          <div className="relative flex-grow h-6 flex items-center cursor-pointer">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div 
                className="h-full bg-white group-hover:bg-[#1db954]"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <img className="w-4 cursor-pointer opacity-70 hover:opacity-100" src={assets.zoom_icon} alt="Full Screen" />
      </div>
    </div>
  );
};

export default Player;
