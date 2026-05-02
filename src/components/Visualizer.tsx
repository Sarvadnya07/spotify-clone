import React, { useEffect, useRef } from 'react';
import { analyser } from '../hooks/useAudioEngine';
import usePlayerStore from '../store/usePlayerStore';

/**
 * Visualizer Component
 * Renders a real-time frequency-based bar visualizer using the Web Audio API.
 * Uses the global analyser singleton to ensure stability and high performance.
 */
const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playStatus } = usePlayerStore();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyser) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(1, '#1ed760');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Fallback for older browsers without roundRect
        if (ctx.roundRect) {
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 1, barHeight, 2);
        } else {
          ctx.rect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        }
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
  }, [playStatus]);

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
