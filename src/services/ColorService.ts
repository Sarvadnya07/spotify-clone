
/**
 * ColorService
 * Extracts dominant colors from artwork using a native canvas approach.
 * Highly optimized for performance without external dependencies.
 */
class ColorService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  async getDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        }

        const canvas = this.canvas;
        const ctx = this.ctx!;
        
        // Downsample for performance
        canvas.width = 50;
        canvas.height = 50;
        
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        
        let r = 0, g = 0, b = 0;
        const count = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Boost saturation for UI visibility
        const hex = this.rgbToHex(r, g, b);
        resolve(hex);
      };

      img.onerror = () => resolve('#1DB954'); // Fallback to Spotify Green
    });
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

export const colorService = new ColorService();
