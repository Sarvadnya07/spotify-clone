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

export interface User {
  id: string;
  name: string;
  image: string;
  isPremium: boolean;
  followers: number;
}

export interface Playlist {
  id: string;
  name: string;
  desc: string;
  image: string;
  songIds: number[];
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
  showLyrics: boolean;
  shuffleMode: boolean;
  listeningHistory: number[];
  queue: number[];
  showQueue: boolean;
  
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
  playlists: Playlist[];
  toggleLike: (id: number) => void;
  toggleLyrics: () => void;
  toggleShuffle: () => void;
  toggleQueue: () => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (songId: number, playlistId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addToQueue: (songId: number) => void;
  removeFromQueue: (songId: number) => void;
  clearQueue: () => void;
}
