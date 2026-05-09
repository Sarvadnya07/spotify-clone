import { useEffect, useState, useRef } from 'react';
import usePlayerStore from '../store/usePlayerStore';
import { analyser } from '../features/player/hooks/useAudioEngine';

/**
 * useVisualizer
 * High-performance audio frequency analysis hook.
 * Reads from the global Analyser singleton to drive reactive UI elements.
 */
export const useVisualizer = () => {
  const { playStatus } = usePlayerStore();
  const [intensity, setIntensity] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (!analyser) {
        animationRef.current = requestAnimationFrame(update);
        return;
      }
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average intensity from mid-range frequencies
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setIntensity(avg / 255); // Normalize to 0-1
      
      animationRef.current = requestAnimationFrame(update);
    };

    if (playStatus) {
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
