import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { songsData } from '../assets/assets';
import { Song, PlayerTime } from '../core/types';
import { WeatherData } from '../features/weather/WeatherService';

export type UserTier = 'Free' | 'Premium';

export interface HistoryItem {
  songId: number;
  timestamp: number;
  weather?: WeatherData;
}

interface PlayerState {
  track: Song;
  playStatus: boolean;
  time: PlayerTime;
  volume: number;
  isBuffering: boolean;
  isReady: boolean;
  error: string | null;
  showLyrics: boolean;
  shuffleMode: boolean;
  showQueue: boolean;
  showMiniplayer: boolean;
  showDjOverlay: boolean;
  showFriendActivity: boolean;
  sidebarCollapsed: boolean;
  currentWeather: WeatherData | null;
  accentColor: string;
  queue: number[];
  contextQueue: number[]; // The sequence of songs in current context (album/playlist)
  likedSongs: number[];
  history: HistoryItem[]; 
  playlists: { id: string; name: string; desc: string; image: string; tracks: number[] }[];
  searchQuery: string;
  
  setTrack: (track: Song) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playWithId: (id: number, context?: number[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  setTime: (time: PlayerTime) => void;
  setVolume: (volume: number) => void;
  setIsBuffering: (status: boolean) => void;
  setIsReady: (status: boolean) => void;
  setError: (error: string | null) => void;
  setPlayStatus: (status: boolean) => void;
  toggleLyrics: () => void;
  toggleShuffle: () => void;
  toggleQueue: () => void;
  toggleMiniplayer: () => void;
  toggleDjOverlay: () => void;
  toggleFriendActivity: () => void;
  toggleSidebarCollapsed: () => void;
  setWeather: (weather: WeatherData) => void;
  setAccentColor: (color: string) => void;
  addToQueue: (id: number) => void;
  removeFromQueue: (id: number) => void;
  clearQueue: () => void;
  toggleLike: (id: number) => void;
  createPlaylist: (name: string) => void;
  getNextTrack: () => Song | null;
  setSearchQuery: (query: string) => void;
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
      isReady: false,
      error: null,
      showLyrics: false,
      shuffleMode: false,
      showQueue: false,
      showMiniplayer: false,
      showDjOverlay: false,
      showFriendActivity: true,
      sidebarCollapsed: false,
      currentWeather: null,
      accentColor: '#1DB954',
      queue: [],
      contextQueue: songsData.map(s => s.id),
      likedSongs: [],
      history: [],
      playlists: [
        { id: '1', name: 'My Playlist #1', desc: 'Playlist • By You', image: songsData[2].image, tracks: [0, 1, 2] }
      ],
      searchQuery: '',

      setTrack: (track) => set({ track }),
      play: () => set({ playStatus: true }),
      pause: () => set({ playStatus: false }),
      togglePlay: () => set((state) => ({ playStatus: !state.playStatus })),
      
      playWithId: (id, context) => {
        const track = songsData.find(s => s.id === id);
        if (track) {
          const { currentWeather, history, contextQueue } = get();
          const newItem: HistoryItem = { 
            songId: id, 
            timestamp: Date.now(),
            weather: currentWeather || undefined
          };
          
          const safeHistory = (history || []).filter(h => typeof h === 'object' && h !== null && h.songId !== id);

          set({
            track,
            playStatus: true,
            history: [newItem, ...safeHistory].slice(0, 100),
            contextQueue: context || contextQueue
          });
        }
      },

      playNext: () => {
        const { track, queue, contextQueue, shuffleMode } = get();
        
        // 1. Priority: User Queue
        if (queue.length > 0) {
          const nextId = queue[0];
          set((state) => ({ queue: state.queue.slice(1) }));
          get().playWithId(nextId);
          return;
        }

        // 2. Secondary: Context (Album/Playlist)
        if (shuffleMode) {
          const randomIndex = Math.floor(Math.random() * contextQueue.length);
          get().playWithId(contextQueue[randomIndex]);
          return;
        }

        const currentIndexInContext = contextQueue.indexOf(track.id);
        if (currentIndexInContext !== -1 && currentIndexInContext < contextQueue.length - 1) {
          get().playWithId(contextQueue[currentIndexInContext + 1]);
        } else {
          // Loop or move to first if context ends
          get().playWithId(contextQueue[0]);
        }
      },

      playPrevious: () => {
        const { track, contextQueue } = get();
        const currentIndexInContext = contextQueue.indexOf(track.id);
        if (currentIndexInContext !== -1 && currentIndexInContext > 0) {
          get().playWithId(contextQueue[currentIndexInContext - 1]);
        } else {
          get().playWithId(contextQueue[contextQueue.length - 1]);
        }
      },

      setTime: (time) => set({ time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setIsBuffering: (status) => set({ isBuffering: status }),
      setIsReady: (status) => set({ isReady: status }),
      setError: (error) => set({ error }),
      setPlayStatus: (status) => set({ playStatus: status }),
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics, showQueue: false })),
      toggleShuffle: () => set((state) => ({ shuffleMode: !state.shuffleMode })),
      toggleQueue: () => set((state) => ({ showQueue: !state.showQueue, showLyrics: false })),
      toggleMiniplayer: () => set((state) => ({ showMiniplayer: !state.showMiniplayer })),
      toggleDjOverlay: () => set((state) => ({ showDjOverlay: !state.showDjOverlay })),
      toggleFriendActivity: () => set((state) => ({ showFriendActivity: !state.showFriendActivity })),
      toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setWeather: (weather) => set({ currentWeather: weather }),
      setAccentColor: (color) => set({ accentColor: color }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addToQueue: (id) => set((state) => {
        const exists = songsData.some((song) => song.id === id);
        if (!exists) return state;
        return { queue: [...state.queue, id] };
      }),
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
      })),

      getNextTrack: () => {
        const { track, queue, contextQueue, shuffleMode } = get();
        if (queue.length > 0) {
          const nextId = queue[0];
          return songsData.find(s => s.id === nextId) || null;
        }
        if (shuffleMode) {
          // Can't reliably predict next shuffle, but we can return a random one
          return null; 
        }
        const currentIndexInContext = contextQueue.indexOf(track.id);
        if (currentIndexInContext !== -1 && currentIndexInContext < contextQueue.length - 1) {
          const nextId = contextQueue[currentIndexInContext + 1];
          return songsData.find(s => s.id === nextId) || null;
        }
        return songsData.find(s => s.id === contextQueue[0]) || null;
      }
    }),
    {
      name: 'player-storage',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (!persistedState) return persistedState;
        if (version === 1) {
          const state = persistedState as PlayerState;
          return {
            ...state,
            history: (state.history || []).map((item: any) => ({
              songId: typeof item === 'number' ? item : item.songId,
              timestamp: Date.now(),
              weather: undefined
            }))
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        likedSongs: state.likedSongs,
        history: state.history,
        playlists: state.playlists,
        volume: state.volume,
        showFriendActivity: state.showFriendActivity,
        sidebarCollapsed: state.sidebarCollapsed,
        showDjOverlay: state.showDjOverlay
      })
    }
  )
);

export default usePlayerStore;
