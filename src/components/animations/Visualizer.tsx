import React, { useEffect, useRef, memo } from 'react';
import { analyser } from '../../features/player/hooks/useAudioEngine';
import usePlayerStore from '../../store/usePlayerStore';

/**
 * Elite Visualizer Component
 * Renders a high-fidelity frequency-based bar visualizer.
 * Optimized for performance using requestAnimationFrame and the global analyser singleton.
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

    // Use higher device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let dataArray: Uint8Array | null = null;
    
    const draw = () => {
      if (!analyser) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (!dataArray) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }

      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear with slight fade for motion blur effect
      ctx.clearRect(0, 0, rect.width, rect.height);

      const bufferLength = dataArray.length;

      const barCount = 12; // Fewer, thicker bars for cleaner look
      const barWidth = (rect.width / barCount) * 0.8;
      const gap = (rect.width / barCount) * 0.2;
      let x = 0;

      for (let i = 0; i < barCount; i++) {
        // Average some frequency bins for each bar
        const step = Math.floor(bufferLength / barCount);
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j];
        }
        const average = sum / step;
        const barHeight = (average / 255) * rect.height;

        const gradient = ctx.createLinearGradient(0, rect.height, 0, 0);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(1, '#1ed760');

        ctx.fillStyle = gradient;
        
        // Manual rounded rect drawing for better compatibility and control
        const radius = 2;
        const y = rect.height - barHeight;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, rect.height);
        ctx.lineTo(x, rect.height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        x += barWidth + gap;
      }
    };

    if (playStatus) {
      draw();
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
      cancelAnimationFrame(rafRef.current);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [playStatus]);

  return (
    <div className="flex items-center justify-center w-24 h-8">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-40 group-hover:opacity-100 transition-opacity duration-500 will-change-transform"
      />
    </div>
  );
};

export default memo(Visualizer);
