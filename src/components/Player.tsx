import React, { useCallback, useRef } from "react";
import { assets } from "../assets/assets";
import usePlayerStore from "../store/usePlayerStore";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { PlayerTime } from "../types";

/**
 * Enhanced Player Component
 * - Managed via useAudioEngine for centralized playback logic.
 * - Reactive progress bar based on Zustand state.
 * - Accessibility-friendly keyboard controls.
 */
const Player = () => {
  const {
    track,
    playStatus,
    play,
    pause,
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(percentage);
  };

  // Calculate progress percentage for the seek bar
  const totalSeconds = time.totalTime.minute * 60 + time.totalTime.second;
  const currentSeconds = time.currentTime.minute * 60 + time.currentTime.second;
  const progressPercent = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

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
    <div className="h-[10%] bg-black text-white flex justify-between items-center px-4 select-none border-t border-[#222]">
      
      {/* LEFT — Current Song Information */}
      <div className="hidden lg:flex items-center gap-4 w-[22%] min-w-[200px]">
        <img
          className={`w-12 rounded shadow-md transition-opacity ${isBuffering ? 'opacity-50' : 'opacity-100'}`}
          src={track.image}
          alt={track.name}
        />
        <div className="leading-tight">
          <p className="font-semibold text-sm truncate max-w-[150px]">{track.name}</p>
          <p className="text-xs text-gray-400 truncate max-w-[150px]">{track.desc}</p>
        </div>
      </div>

      {/* CENTER — Player Controls + Seek Bar */}
      <div className="flex flex-col items-center gap-2 flex-grow">
        <div className="flex gap-5 justify-center items-center">
          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition" src={assets.shuffle_icon} alt="Shuffle" />
          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition" src={assets.prev_icon} alt="Previous" />
          
          <button 
            onClick={playStatus ? pause : play}
            onKeyDown={togglePlay}
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:scale-105 active:scale-95 transition"
          >
            <img 
              className="w-4 invert" 
              src={playStatus ? assets.pause_icon : assets.play_icon} 
              alt={playStatus ? "Pause" : "Play"} 
            />
          </button>

          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition" src={assets.next_icon} alt="Next" />
          <img className="w-4 opacity-70 hover:opacity-100 cursor-pointer transition" src={assets.loop_icon} alt="Loop" />
        </div>

        <div className="flex items-center gap-3 w-full justify-center max-w-[600px]">
          <p className="text-[10px] tabular-nums opacity-60 w-8 text-right">
            {formatTime(time.currentTime)}
          </p>
          <div
            ref={seekBg}
            onClick={handleSeek}
            className="group relative flex-grow h-1 bg-[#4d4d4d] rounded-full cursor-pointer"
          >
            <div
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954] rounded-full transition-colors"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Knob visible on hover */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
          <p className="text-[10px] tabular-nums opacity-60 w-8">
            {formatTime(time.totalTime)}
          </p>
        </div>
      </div>

      {/* RIGHT — Volume & Extra Controls */}
      <div className="hidden lg:flex items-center gap-3 w-[22%] justify-end opacity-70 hover:opacity-100 transition">
        <img className="w-4 cursor-pointer" src={assets.mic_icon} alt="Lyrics" />
        <img className="w-4 cursor-pointer" src={assets.queue_icon} alt="Queue" />
        <img className="w-4 cursor-pointer" src={assets.speaker_icon} alt="Devices" />
        
        <div className="flex items-center gap-2 group w-32">
          <img className="w-4" src={assets.volume_icon} alt="Volume" />
          <div className="relative flex-grow h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-[#1db954]"
              style={{ width: `${volume * 100}%` }}
            />
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

        <img className="w-4 cursor-pointer" src={assets.zoom_icon} alt="Full Screen" />
      </div>
    </div>
  );
};

export default Player;
