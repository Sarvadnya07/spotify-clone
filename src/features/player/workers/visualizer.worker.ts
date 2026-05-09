
/**
 * Visualizer Web Worker
 * Handles high-frequency canvas rendering on a separate thread.
 */

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    canvas = payload.canvas;
    ctx = canvas!.getContext('2d');
  }

  if (type === 'DRAW' && ctx && canvas) {
    const { dataArray, width, height, dpr } = payload;
    
    // Clear and Draw
    ctx.clearRect(0, 0, width, height);
    
    const barCount = 12;
    const barWidth = (width / barCount) * 0.8;
    const gap = (width / barCount) * 0.2;
    let x = 0;

    for (let i = 0; i < barCount; i++) {
      const step = Math.floor(dataArray.length / barCount);
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j];
      }
      const average = sum / step;
      const barHeight = (average / 255) * height;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#1db954');
      gradient.addColorStop(1, '#1ed760');

      ctx.fillStyle = gradient;
      
      const radius = 2;
      const y = height - barHeight;
      
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, radius);
      ctx.fill();

      x += barWidth + gap;
    }
  }
};
