import React, { memo, useCallback } from 'react';
import { assets } from '../../assets/assets';
import usePlayerStore from '../../store/usePlayerStore';
import Visualizer from '../../components/animations/Visualizer';
import SpatialControls from './components/SpatialControls';

/**
 * Enterprise-Grade Spotify Player Bar
 * - Precision styled according to the official Spotify desktop application.
 * - Dynamic slider progress and volume hover-indicator knobs.
 * - Clean typography, zero pulsing cover-art, zero techno decoration.
 */
const Player = () => {
  const track = usePlayerStore(state => state.track);
  const playStatus = usePlayerStore(state => state.playStatus);
  const play = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const playNext = usePlayerStore(state => state.playNext);
  const playPrevious = usePlayerStore(state => state.playPrevious);
  const time = usePlayerStore(state => state.time);
  const volume = usePlayerStore(state => state.volume);
  const setVolume = usePlayerStore(state => state.setVolume);
  const shuffleMode = usePlayerStore(state => state.shuffleMode);
  const toggleShuffle = usePlayerStore(state => state.toggleShuffle);
  const showLyrics = usePlayerStore(state => state.showLyrics);
  const toggleLyrics = usePlayerStore(state => state.toggleLyrics);
  const showQueue = usePlayerStore(state => state.showQueue);
  const toggleQueue = usePlayerStore(state => state.toggleQueue);
  const showMiniplayer = usePlayerStore(state => state.showMiniplayer);
  const toggleMiniplayer = usePlayerStore(state => state.toggleMiniplayer);

  const formatTime = useCallback((time: { minute: number, second: number }) => {
    return `${time.minute}:${time.second.toString().padStart(2, '0')}`;
  }, []);

  return (
    <footer className="h-[90px] bg-black px-4 flex items-center justify-between z-[100] relative select-none">
      
      {/* TRACK INFO */}
      <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
        <img 
          className="w-14 h-14 rounded object-cover border border-white/5 shadow-md flex-shrink-0"
          src={track.image} 
          alt={track.name} 
          loading="eager"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
            {track.name}
          </p>
          <p className="text-[11px] text-[#b3b3b3] truncate hover:text-white hover:underline cursor-pointer mt-0.5 font-normal">
            {track.desc}
          </p>
        </div>
        <button className="ml-3 p-1 transition-transform active:scale-95 flex-shrink-0">
          <img className="w-4 opacity-70 hover:opacity-100" src={assets.like_icon} alt="Like" />
        </button>
      </div>

      {/* CONTROLS & PROGRESS */}
      <div className="flex flex-col items-center gap-1.5 max-w-[45%] w-full">
        <div className="flex items-center gap-5">
          <button onClick={toggleShuffle} className="transition-opacity active:scale-95">
            <img className={`w-4 h-4 ${shuffleMode ? 'brightness-100 text-[#1ed760]' : 'opacity-70 hover:opacity-100'}`} src={assets.shuffle_icon} alt="Shuffle" />
          </button>
          <button onClick={playPrevious} className="active:scale-95">
            <img className="w-4 h-4 opacity-70 hover:opacity-100" src={assets.prev_icon} alt="Prev" />
          </button>
          
          <button 
            onClick={playStatus ? pause : play}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <img className="w-3.5 h-3.5 brightness-0 ml-[1px]" src={playStatus ? assets.pause_icon : assets.play_icon} alt="Play/Pause" />
          </button>

          <button onClick={playNext} className="active:scale-95">
            <img className="w-4 h-4 opacity-70 hover:opacity-100" src={assets.next_icon} alt="Next" />
          </button>
          <button className="opacity-70 hover:opacity-100 transition-opacity">
            <img className="w-4 h-4" src={assets.loop_icon} alt="Loop" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-[#a7a7a7] font-normal tabular-nums min-w-[30px] text-right">
            {formatTime(time.currentTime)}
          </span>
          <div className="flex-grow h-1 bg-white/20 rounded-full relative group cursor-pointer">
            <div 
              className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#1ed760] transition-colors rounded-full"
              style={{ width: 'var(--player-progress, 0%)' }}
            />
            <div 
              className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              style={{ left: 'var(--player-progress, 0%)' }}
            />
          </div>
          <span className="text-[11px] text-[#a7a7a7] font-normal tabular-nums min-w-[30px]">
            {track.duration}
          </span>
        </div>
      </div>

      {/* UTILITIES */}
      <div className="flex items-center justify-end gap-3.5 w-[30%] min-w-[280px]">
        <SpatialControls />
        <Visualizer />
        
        <div className="flex items-center gap-0.5">
          <button onClick={toggleLyrics} className={`p-1.5 transition-opacity ${showLyrics ? 'text-[#1ed760]' : 'opacity-70 hover:opacity-100'}`}>
            <img className={`w-4 h-4 ${showLyrics ? 'invert-[35%] sepia-[82%] saturate-[1478%] hue-rotate-[112deg] brightness-[98%] contrast-[86%]' : ''}`} src={assets.mic_icon} alt="Lyrics" />
          </button>
          <button onClick={toggleQueue} className={`p-1.5 transition-opacity ${showQueue ? 'text-[#1ed760]' : 'opacity-70 hover:opacity-100'}`}>
            <img className={`w-4 h-4 ${showQueue ? 'invert-[35%] sepia-[82%] saturate-[1478%] hue-rotate-[112deg] brightness-[98%] contrast-[86%]' : ''}`} src={assets.queue_icon} alt="Queue" />
          </button>
          <button onClick={toggleMiniplayer} className={`p-1.5 transition-opacity ${showMiniplayer ? 'text-[#1ed760]' : 'opacity-70 hover:opacity-100'}`}>
            <img className={`w-4 h-4 ${showMiniplayer ? 'invert-[35%] sepia-[82%] saturate-[1478%] hue-rotate-[112deg] brightness-[98%] contrast-[86%]' : ''}`} src={assets.mini_player_icon} alt="Miniplayer" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 group w-20 ml-1">
          <img className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" src={assets.volume_icon} alt="Volume" />
          <div className="flex-grow h-1 bg-white/20 rounded-full relative cursor-pointer">
            <div 
              className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#1ed760] transition-colors rounded-full" 
              style={{ width: `${volume * 100}%` }} 
            />
            <div 
              className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              style={{ left: `${volume * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Player);
