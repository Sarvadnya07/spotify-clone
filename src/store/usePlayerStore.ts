import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { songsData } from '../assets/assets';
import { Song, PlayerTime } from '../types';

interface PlayerState {
  track: Song;
  playStatus: boolean;
  time: PlayerTime;
  volume: number;
  isBuffering: boolean;
  showLyrics: boolean;
  shuffleMode: boolean;
  showQueue: boolean;
  showMiniplayer: boolean;
  queue: number[];
  likedSongs: number[];
  history: number[];
  playlists: { id: string; name: string; desc: string; image: string; tracks: number[] }[];
  
  setTrack: (track: Song) => void;
  play: () => void;
  pause: () => void;
  playWithId: (id: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setTime: (time: PlayerTime) => void;
  setVolume: (volume: number) => void;
  setIsBuffering: (status: boolean) => void;
  toggleLyrics: () => void;
  toggleShuffle: () => void;
  toggleQueue: () => void;
  toggleMiniplayer: () => void;
  addToQueue: (id: number) => void;
  removeFromQueue: (id: number) => void;
  clearQueue: () => void;
  toggleLike: (id: number) => void;
  createPlaylist: (name: string) => void;
}

const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      track: songsData[0],
      playStatus: false,
      time: {
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
      },
      volume: 0.7,
      isBuffering: false,
      showLyrics: false,
      shuffleMode: false,
      showQueue: false,
      showMiniplayer: false,
      queue: [],
      likedSongs: [],
      history: [],
      playlists: [
        { id: '1', name: 'My Playlist #1', desc: 'Playlist • By You', image: songsData[2].image, tracks: [0, 1, 2] }
      ],

      setTrack: (track) => set({ track }),
      play: () => set({ playStatus: true }),
      pause: () => set({ playStatus: false }),
      
      playWithId: (id) => {
        const track = songsData.find(s => s.id === id);
        if (track) {
          set((state) => ({
            track,
            playStatus: true,
            history: [id, ...state.history.filter(i => i !== id)].slice(0, 100)
          }));
        }
      },

      playNext: () => {
        const { track, queue, shuffleMode } = get();
        if (shuffleMode) {
          const randomIndex = Math.floor(Math.random() * songsData.length);
          get().playWithId(songsData[randomIndex].id);
          return;
        }
        if (queue.length > 0) {
          const nextId = queue[0];
          set((state) => ({ queue: state.queue.slice(1) }));
          get().playWithId(nextId);
        } else {
          const nextIndex = (track.id + 1) % songsData.length;
          get().playWithId(songsData[nextIndex].id);
        }
      },

      playPrevious: () => {
        const { track } = get();
        const prevIndex = (track.id - 1 + songsData.length) % songsData.length;
        get().playWithId(songsData[prevIndex].id);
      },

      setTime: (time) => set({ time }),
      setVolume: (volume) => set({ volume }),
      setIsBuffering: (status) => set({ isBuffering: status }),
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics, showQueue: false })),
      toggleShuffle: () => set((state) => ({ shuffleMode: !state.shuffleMode })),
      toggleQueue: () => set((state) => ({ showQueue: !state.showQueue, showLyrics: false })),
      toggleMiniplayer: () => set((state) => ({ showMiniplayer: !state.showMiniplayer })),
      
      addToQueue: (id) => set((state) => ({ queue: [...state.queue, id] })),
      removeFromQueue: (id) => set((state) => ({ queue: state.queue.filter(i => i !== id) })),
      clearQueue: () => set({ queue: [] }),
      
      toggleLike: (id) => set((state) => {
        const isLiked = state.likedSongs.includes(id);
        return {
          likedSongs: isLiked 
            ? state.likedSongs.filter(i => i !== id) 
            : [...state.likedSongs, id]
        };
      }),

      createPlaylist: (name) => set((state) => ({
        playlists: [...state.playlists, {
          id: Date.now().toString(),
          name: name || `My Playlist #${state.playlists.length + 1}`,
          desc: 'Playlist • By You',
          image: songsData[0].image,
          tracks: []
        }]
      }))
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        likedSongs: state.likedSongs,
        history: state.history,
        playlists: state.playlists,
        volume: state.volume
      })
    }
  )
);

export default usePlayerStore;
