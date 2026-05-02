import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { songsData } from '../assets/assets';
import { PlayerStore, Song, PlayerTime } from '../types';

/**
 * usePlayerStore
 * Core state management for the Spotify Clone.
 */
const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // State
      track: songsData[0] as Song,
      playStatus: false,
      isReady: false,
      isBuffering: false,
      volume: 1.0,
      likedSongs: [],
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

      toggleLike: (id: number) => {
        const { likedSongs } = get();
        if (likedSongs.includes(id)) {
          set({ likedSongs: likedSongs.filter(sId => sId !== id) });
        } else {
          set({ likedSongs: [...likedSongs, id] });
        }
      },

      // Logical Actions
      play: () => set({ playStatus: true }),
      pause: () => set({ playStatus: false }),
      togglePlay: () => set((state) => ({ playStatus: !state.playStatus })),
      
      playWithId: (id: number) => {
        const track = songsData.find(s => s.id === id);
        if (track) {
          set({ 
            track, 
            playStatus: true,
            isReady: false 
          });
        }
      },

      playNext: () => {
        const { track, playWithId } = get();
        const currentIndex = songsData.findIndex(s => s.id === track.id);
        if (currentIndex !== -1 && currentIndex < songsData.length - 1) {
          playWithId(songsData[currentIndex + 1].id);
        } else {
          playWithId(songsData[0].id);
        }
      },

      playPrevious: () => {
        const { track, playWithId } = get();
        const currentIndex = songsData.findIndex(s => s.id === track.id);
        if (currentIndex !== -1 && currentIndex > 0) {
          playWithId(songsData[currentIndex - 1].id);
        } else {
          playWithId(songsData[songsData.length - 1].id);
        }
      },
    }),
    {
      name: 'spotify-player-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        volume: state.volume, 
        track: state.track,
        likedSongs: state.likedSongs
      }),
    }
  )
);

export default usePlayerStore;
