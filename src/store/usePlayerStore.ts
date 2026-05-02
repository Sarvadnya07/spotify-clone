import { create } from 'zustand';
import { songsData } from '../assets/assets';
import { PlayerStore, Song, PlayerTime } from '../types';

const usePlayerStore = create<PlayerStore>((set, get) => ({
  // State
  track: songsData[0] as Song,
  playStatus: false,
  isReady: false,
  isBuffering: false,
  volume: 1.0,
  error: null,
  time: {
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  },

  // Actions
  setTrack: (track: Song) => set({ track }),
  setPlayStatus: (status: boolean) => set({ playStatus: status }),
  setIsReady: (status: boolean) => set({ isReady: status }),
  setIsBuffering: (status: boolean) => set({ isBuffering: status }),
  setError: (error: string | null) => set({ error }),
  setTime: (time: PlayerTime) => set({ time }),
  setVolume: (volume: number) => set({ volume: Math.min(1, Math.max(0, volume)) }),

  // Logical Actions
  play: () => set({ playStatus: true }),
  pause: () => set({ playStatus: false }),
  togglePlay: () => set((state) => ({ playStatus: !state.playStatus })),
  
  playWithId: (id: number) => {
    const track = songsData[id] as Song;
    if (track) {
      set({ 
        track, 
        playStatus: true,
        isReady: false 
      });
    }
  },
}));

export default usePlayerStore;
