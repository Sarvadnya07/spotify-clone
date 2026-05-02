import { useEffect, useRef, useCallback } from 'react';
import usePlayerStore from '../store/usePlayerStore';

/**
 * useAudioEngine
 * Centralized hook to manage the HTMLAudioElement and sync it with Zustand.
 * Decouples the UI and Store from the underlying Browser Audio API.
 */
export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    track,
    playStatus,
    volume,
    setTime,
    setIsReady,
    setIsBuffering,
    setError,
    setPlayStatus,
  } = usePlayerStore();

  // Initialization: Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Event Listeners
    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setTime({
        currentTime: {
          second: Math.floor(audio.currentTime % 60),
          minute: Math.floor(audio.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      });
    };

    const onCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
    };

    const onWaiting = () => {
      setIsBuffering(true);
    };

    const onError = () => {
      setError('Failed to load audio. Please check your connection.');
    };

    const onEnded = () => {
      setPlayStatus(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
    };
  }, [setTime, setIsReady, setIsBuffering, setError, setPlayStatus]);

  // Sync Track Source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    const currentSrc = audio.src;
    const nextSrc = new URL(track.file, window.location.origin).href;

    if (currentSrc !== nextSrc) {
      setIsReady(false);
      audio.src = track.file;
      audio.load();
    }
  }, [track, setIsReady]);

  // Sync Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playStatus) {
      audio.play().catch((err) => {
        console.warn('Playback blocked by browser policy:', err);
        setPlayStatus(false);
      });
    } else {
      audio.pause();
    }
  }, [playStatus, setPlayStatus]);

  // Sync Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Imperative Seek Action (for UI components)
  const seek = useCallback((percentage: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = audio.duration * percentage;
    }
  }, []);

  return { seek };
};
