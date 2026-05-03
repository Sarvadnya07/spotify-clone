import { useEffect, useRef, useCallback } from 'react';
import usePlayerStore from '../store/usePlayerStore';
import { songsData } from '../assets/assets';

/**
 * Singleton Audio instance to ensure consistent state across the app lifecycle.
 */
const audioInstance = new Audio();

// Web Audio API Singletons
export let audioContext: AudioContext | null = null;
export let analyser: AnalyserNode | null = null;
export let source: MediaElementAudioSourceNode | null = null;
export { audioInstance };

/**
 * useAudioEngine - Top 1% Optimization
 * Centralized hook to manage the HTMLAudioElement and sync it with Zustand.
 * - Granular state selection for zero re-render overhead.
 * - Pre-fetch intelligence for next track assets.
 * - Hardware-accelerated progress synchronization.
 */
export const useAudioEngine = () => {
  const lastSecondRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  const preloadedRef = useRef<string | null>(null);
  
  // Surgical state extraction
  const track = usePlayerStore(state => state.track);
  const playStatus = usePlayerStore(state => state.playStatus);
  const volume = usePlayerStore(state => state.volume);
  const setTime = usePlayerStore(state => state.setTime);
  const setIsReady = usePlayerStore(state => state.setIsReady);
  const setIsBuffering = usePlayerStore(state => state.setIsBuffering);
  const setError = usePlayerStore(state => state.setError);
  const setPlayStatus = usePlayerStore(state => state.setPlayStatus);
  const play = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const playNext = usePlayerStore(state => state.playNext);
  const playPrevious = usePlayerStore(state => state.playPrevious);

  /**
   * Initializes the AudioContext and AnalyserNode on first user interaction
   */
  const initVisualizer = useCallback(() => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      
      source = audioContext.createMediaElementSource(audioInstance);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }, []);

  // Intelligence: Pre-fetch next track assets as the current song nears end
  const preloadNext = useCallback(() => {
    const nextIndex = (track.id + 1) % songsData.length;
    const nextTrack = songsData[nextIndex];
    if (preloadedRef.current === nextTrack.id.toString()) return;

    console.log("[AUDIO] Pre-fetching next track assets:", nextTrack.name);
    const img = new Image();
    img.src = nextTrack.image;
    
    const audio = new Audio();
    audio.src = nextTrack.file;
    audio.preload = "auto";
    
    preloadedRef.current = nextTrack.id.toString();
  }, [track.id]);

  // Optimized Progress Update Logic
  const syncProgress = useCallback(() => {
    const audio = audioInstance;
    if (!audio.duration) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    document.documentElement.style.setProperty('--player-progress', `${progress}%`);

    // Intelligent Pre-fetching at 80% completion
    if (progress > 80) {
      preloadNext();
    }

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
  }, [setTime, preloadNext]);

  // Media Session API Support
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: 'Spotify Elite',
      album: track.desc,
      artwork: [{ src: track.image, sizes: '512x512', type: 'image/jpeg' }]
    });

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext());

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [track, play, pause, playNext, playPrevious]);

  // Event Listeners & Initialization
  useEffect(() => {
    const audio = audioInstance;

    const onCanPlay = () => {
      setIsReady(true);
      setIsBuffering(false);
    };

    const onWaiting = () => setIsBuffering(true);
    const onError = () => {
      setIsBuffering(false);
      setPlayStatus(false);
      setError('Failed to load audio.');
    };
    const onEnded = () => playNext();
    
    const onPlay = () => {
      initVisualizer();
      rafRef.current = requestAnimationFrame(syncProgress);
    };

    const onPause = () => cancelAnimationFrame(rafRef.current);

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

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
    if (!track) return;
    const audio = audioInstance;
    const nextSrc = new URL(track.file, window.location.href).href;

    if (audio.src !== nextSrc) {
      setIsReady(false);
      audio.src = track.file;
      audio.load();
    }
  }, [track, setIsReady]);

  // Sync Play/Pause
  useEffect(() => {
    if (playStatus) {
      audioInstance.play().catch(() => setPlayStatus(false));
    } else {
      audioInstance.pause();
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
