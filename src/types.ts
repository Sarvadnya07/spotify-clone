import React from 'react';

export interface Song {
  id: number;
  name: string;
  image: string;
  file: string;
  desc: string;
  duration: string;
}

export interface Album {
  id: number;
  name: string;
  image: string;
  desc: string;
  bgColor: string;
}

export interface PlayerTime {
  currentTime: {
    second: number;
    minute: number;
  };
  totalTime: {
    second: number;
    minute: number;
  };
}

export interface PlayerStore {
  track: Song;
  playStatus: boolean;
  isReady: boolean;
  isBuffering: boolean;
  volume: number;
  error: string | null;
  time: PlayerTime;
  
  // Actions
  setTrack: (track: Song) => void;
  setPlayStatus: (status: boolean) => void;
  setIsReady: (status: boolean) => void;
  setIsBuffering: (status: boolean) => void;
  setError: (error: string | null) => void;
  setTime: (time: PlayerTime) => void;
  setVolume: (val: number) => void;
  
  // Logical Actions
  play: () => void;
  pause: () => void;
  playWithId: (id: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  likedSongs: number[];
  toggleLike: (id: number) => void;
}
