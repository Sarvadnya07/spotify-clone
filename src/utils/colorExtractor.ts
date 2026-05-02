/**
 * colorExtractor Utility
 * Extracts the dominant/average color from an image URL using the Canvas API.
 * Useful for dynamic theming and background gradients.
 */
export const getAverageColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#121212");
        return;
      }

      canvas.width = 1;
      canvas.height = 1;

      // Draw the image into a 1x1 pixel to get the average color
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      // Convert to hex
      const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      
      // If the color is too dark, return a fallback or lighten it
      // For this clone, we want it to be a bit vibrant but not too bright
      resolve(hex);
    };

    img.onerror = () => {
      resolve("#121212");
    };
  });
};
