import React from 'react';
import { create } from 'zustand';
import { songsData } from '../assets/assets';
import { PlayerStore, Song, PlayerTime } from '../types';

const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Refs (managed externally but stored for convenience)
  audioRef: { current: null },
  seekBar: { current: null },
  seekBg: { current: null },

  // State
  track: songsData[0] as Song,
  playStatus: false,
  isReady: false,
  error: null,
  time: {
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  },

  // Actions
  setTrack: (track: Song) => set({ track }),
  setPlayStatus: (status: boolean) => set({ playStatus: status }),
  setIsReady: (status: boolean) => set({ isReady: status }),
  setError: (error: string | null) => set({ error }),
  setTime: (time: PlayerTime) => set({ time }),

  play: () => {
    const { audioRef } = get();
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => set({ playStatus: true }))
        .catch(() => { /* handle autoplay block */ });
    }
  },

  pause: () => {
    const { audioRef } = get();
    if (audioRef.current) {
      audioRef.current.pause();
      set({ playStatus: false });
    }
  },

  playWithId: async (id: number) => {
    const { pause, audioRef, play } = get();
    pause();
    set({ isReady: false, track: songsData[id] as Song });

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
      }
    }, 50);

    setTimeout(() => {
      play();
      set({ isReady: true });
    }, 100);
  },

  updateTime: () => {
    const { audioRef, seekBar } = get();
    const audio = audioRef.current;
    if (!audio || audio.duration === 0 || isNaN(audio.duration)) return;

    const progress = audio.currentTime / audio.duration;

    if (seekBar.current) {
      seekBar.current.style.width = `${Math.floor(progress * 100)}%`;
    }

    set({
      time: {
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      },
    });
  },

  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => {
    const { audioRef, seekBg, updateTime } = get();
    const audio = audioRef.current;
    if (!audio || !seekBg.current) return;

    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    audio.currentTime = audio.duration * percentage;
    updateTime();
  },

  setVolume: (val: number) => {
    const { audioRef } = get();
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, val));
    }
  },
}));

export default usePlayerStore;
