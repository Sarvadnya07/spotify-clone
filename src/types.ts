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
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  seekBar: React.MutableRefObject<HTMLDivElement | null>;
  seekBg: React.MutableRefObject<HTMLDivElement | null>;
  track: Song;
  playStatus: boolean;
  isReady: boolean;
  error: string | null;
  time: PlayerTime;
  setTrack: (track: Song) => void;
  setPlayStatus: (status: boolean) => void;
  setIsReady: (status: boolean) => void;
  setError: (error: string | null) => void;
  setTime: (time: PlayerTime) => void;
  play: () => void;
  pause: () => void;
  playWithId: (id: number) => Promise<void>;
  updateTime: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  setVolume: (val: number) => void;
}
