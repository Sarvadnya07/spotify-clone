import { useEffect, useState, useRef } from 'react';
import usePlayerStore from '../store/usePlayerStore';

/**
 * useVisualizer
 * High-performance audio frequency analysis hook.
 * Extracts real-time FFT data to drive reactive UI elements (Background glows, pulses).
 */
export const useVisualizer = () => {
  const { playStatus } = usePlayerStore();
  const [intensity, setIntensity] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Find the singleton audio element
    const audioEl = document.querySelector('audio');
    if (!audioEl) return;

    // Initialize Audio Context on first play (Browser policy)
    const init = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64; // Low FFT for performance and smooth UI response
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    const update = () => {
      if (!analyserRef.current) return;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average intensity from mid-range frequencies
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setIntensity(avg / 255); // Normalize to 0-1
      
      animationRef.current = requestAnimationFrame(update);
    };

    if (playStatus) {
      init();
      update();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIntensity(0);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [playStatus]);

  return intensity;
};
