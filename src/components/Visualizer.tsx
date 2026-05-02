import React, { useEffect, useRef } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import usePlayerStore from '../store/usePlayerStore';

/**
 * Visualizer Component
 * Renders a real-time frequency-based bar visualizer using the Web Audio API.
 * Uses canvas for high-performance rendering outside the React update cycle.
 */
const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser } = useAudioEngine();
  const { playStatus } = usePlayerStore();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // Create a Spotify-themed gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#1db954'); // Spotify Green
        gradient.addColorStop(1, '#1ed760'); // Lighter Green

        ctx.fillStyle = gradient;
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, 2);
        ctx.fill();

        x += barWidth + 1;
      }
    };

    if (playStatus) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(rafRef.current);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, playStatus]);

  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={32} 
      className="opacity-40 hover:opacity-100 transition-opacity duration-500"
    />
  );
};

export default Visualizer;
