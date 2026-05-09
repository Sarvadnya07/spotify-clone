import React, { memo, useCallback } from 'react';
import { assets } from '../../assets/assets';
import usePlayerStore from '../../store/usePlayerStore';
import Visualizer from '../../components/animations/Visualizer';

/**
 * Top-Tier High Performance Player
 * - Optimized with granular Zustand selectors to minimize re-renders.
 * - Decoupled UI components for surgical updates.
 */
const Player = () => {
  // Granular state selectors for Top 1% performance
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
    <footer className="h-[90px] bg-[#000000] border-t border-white/5 px-6 flex items-center justify-between z-[100] relative select-none gpu">
      
      {/* TRACK INFO - OPTIMIZED */}
      <div className="flex items-center gap-4 w-[30%] min-w-[280px]">
        <img 
          className="w-14 h-14 rounded-md shadow-lg border border-white/5 object-cover will-change-transform" 
          src={track.image} 
          alt={track.name} 
          loading="eager"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-bold text-white truncate hover:underline cursor-pointer tracking-tight">{track.name}</p>
          <p className="text-[11px] text-[#a7a7a7] truncate hover:text-white transition-colors cursor-pointer mt-0.5">{track.desc}</p>
        </div>
        <button className="ml-4 p-2 transition-transform hover:scale-110 active:scale-90">
          <img className="w-4 opacity-40 hover:opacity-100" src={assets.like_icon} alt="Like" />
        </button>
      </div>

      {/* CONTROLS & PROGRESS - ZERO LAG */}
      <div className="flex flex-col items-center gap-2 max-w-[40%] w-full">
        <div className="flex items-center gap-4">
          <button onClick={toggleShuffle} className="p-2 transition-opacity active:scale-90">
            <img className={`w-4 ${shuffleMode ? 'brightness-125' : 'opacity-40 hover:opacity-100'}`} src={assets.shuffle_icon} alt="S" />
          </button>
          <button onClick={playPrevious} className="p-2 active:scale-90">
            <img className="w-5 opacity-60 hover:opacity-100" src={assets.prev_icon} alt="P" />
          </button>
          
          <button 
            onClick={playStatus ? pause : play}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <img className="w-4 brightness-0" src={playStatus ? assets.pause_icon : assets.play_icon} alt="C" />
          </button>

          <button onClick={playNext} className="p-2 active:scale-90">
            <img className="w-5 opacity-60 hover:opacity-100" src={assets.next_icon} alt="N" />
          </button>
          <button className="p-2 opacity-40 hover:opacity-100 transition-opacity">
            <img className="w-4" src={assets.loop_icon} alt="L" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full max-w-[600px]">
          <span className="text-[11px] text-[#a7a7a7] font-medium tabular-nums w-10 text-right">{formatTime(time.currentTime)}</span>
          <div className="flex-grow h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#1db954] transition-colors rounded-full"
              style={{ width: 'var(--player-progress, 0%)' }}
            />
          </div>
          <span className="text-[11px] text-[#a7a7a7] font-medium tabular-nums w-10">{track.duration}</span>
        </div>
      </div>

      {/* UTILITIES - SURGICAL UPDATES */}
      <div className="flex items-center justify-end gap-5 w-[30%] min-w-[280px]">
        <Visualizer />
        
        <div className="flex items-center gap-1">
          <button onClick={toggleLyrics} className={`p-2 transition-opacity ${showLyrics ? 'brightness-125' : 'opacity-40 hover:opacity-100'}`}>
            <img className="w-4" src={assets.mic_icon} alt="L" />
          </button>
          <button onClick={toggleQueue} className={`p-2 transition-opacity ${showQueue ? 'brightness-125' : 'opacity-40 hover:opacity-100'}`}>
            <img className="w-4" src={assets.queue_icon} alt="Q" />
          </button>
          <button onClick={toggleMiniplayer} className={`p-2 transition-opacity ${showMiniplayer ? 'brightness-125' : 'opacity-40 hover:opacity-100'}`}>
            <img className="w-4" src={assets.mini_player_icon} alt="M" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 group w-32 ml-2">
          <img className="w-4 opacity-50 group-hover:opacity-100 transition duration-300" src={assets.volume_icon} alt="V" />
          <div className="flex-grow h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#1db954] transition-colors" 
              style={{ width: `${volume * 100}%` }} 
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Player);
