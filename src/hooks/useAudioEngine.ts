import { useEffect, useRef, useCallback } from 'react';
import usePlayerStore from '../store/usePlayerStore';

/**
 * Singleton Audio instance to ensure consistent state across the app lifecycle.
 */
const audioInstance = new Audio();

// Web Audio API Singletons
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;

/**
 * useAudioEngine
 * Centralized hook to manage the HTMLAudioElement and sync it with Zustand.
 * Now includes Web Audio API Analyser support for real-time visualization.
 */
export const useAudioEngine = () => {
  const lastSecondRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  
  const {
    track,
    playStatus,
    volume,
    setTime,
    setIsReady,
    setIsBuffering,
    setError,
    setPlayStatus,
    play,
    pause,
    playNext,
    playPrevious,
  } = usePlayerStore();

  /**
   * Initializes the AudioContext and AnalyserNode on first user interaction
   * to comply with browser autoplay/audio policies.
   */
  const initVisualizer = useCallback(() => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source = audioContext.createMediaElementSource(audioInstance);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, []);

  // Optimized Progress Update Logic
  const syncProgress = useCallback(() => {
    const audio = audioInstance;
    if (!audio.duration) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    document.documentElement.style.setProperty('--player-progress', `${progress}%`);

    const currentSecond = Math.floor(audio.currentTime);
    if (currentSecond !== lastSecondRef.current) {
      lastSecondRef.current = currentSecond;
      setTime({
        currentTime: {
          second: currentSecond % 60,
          minute: Math.floor(currentSecond / 60),
        },
        totalTime: {
          second: Math.floor(audio.duration % 60),
          minute: Math.floor(audio.duration / 60),
        },
      });
    }

    if (!audio.paused) {
      rafRef.current = requestAnimationFrame(syncProgress);
    }
  }, [setTime]);

  // Media Session API Support
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: 'Spotify Clone',
      album: track.desc,
      artwork: [
        { src: track.image, sizes: '512x512', type: 'image/jpeg' },
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        audioInstance.currentTime = details.seekTime;
        syncProgress();
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [track, play, pause, playNext, playPrevious, syncProgress]);

  // Event Listeners & Initialization
  useEffect(() => {
    const audio = audioInstance;

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
      playNext();
    };

    const onPlay = () => {
      initVisualizer();
      rafRef.current = requestAnimationFrame(syncProgress);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };

    const onPause = () => {
      cancelAnimationFrame(rafRef.current);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    syncProgress();

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setIsReady, setIsBuffering, setError, setPlayStatus, syncProgress, playNext, initVisualizer]);

  // Sync Track Source
  useEffect(() => {
    const audio = audioInstance;
    if (!track) return;

    const currentSrc = audio.src;
    const nextSrc = track.file.startsWith('http') ? track.file : new URL(track.file, window.location.origin).href;

    if (currentSrc !== nextSrc) {
      setIsReady(false);
      audio.src = track.file;
      audio.load();
    }
  }, [track, setIsReady]);

  // Sync Play/Pause
  useEffect(() => {
    const audio = audioInstance;
    if (playStatus) {
      audio.play().catch((err) => {
        console.warn('Playback blocked:', err);
        setPlayStatus(false);
      });
    } else {
      audio.pause();
    }
  }, [playStatus, setPlayStatus]);

  // Sync Volume
  useEffect(() => {
    audioInstance.volume = volume;
  }, [volume]);

  // Imperative Seek Action
  const seek = useCallback((percentage: number) => {
    const audio = audioInstance;
    if (audio.duration) {
      audio.currentTime = audio.duration * percentage;
      syncProgress();
    }
  }, [syncProgress]);

  return { seek, analyser };
};
