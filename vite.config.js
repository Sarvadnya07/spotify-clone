import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// -------- OPTIONAL PLUGINS WITH SAFE IMPORT --------
let viteImagemin = null;
let visualizer = null;

try {
  viteImagemin = (await import("vite-plugin-imagemin")).default;
} catch (_) {
  console.warn("⚠️ vite-plugin-imagemin not installed. Skipping image optimization.");
}

try {
  visualizer = (await import("rollup-plugin-visualizer")).visualizer;
} catch (_) {
  console.warn("⚠️ rollup-plugin-visualizer not installed. Skipping bundle analyzer.");
}

// -------- BROWSER TARGETS --------
const targetBrowsers = ["chrome90", "firefox90", "edge90", "safari13"];

// -------------------------------------------------------------
//                    MAIN VITE CONFIG
// -------------------------------------------------------------
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      include: "**/*.jsx"
      // ❌ Removed babel preset – Vite doesn't use it
    }),

    // ---------- OPTIONAL IMAGE COMPRESSION ----------
    viteImagemin
      ? viteImagemin({
          gifsicle: { optimizationLevel: 3 },
          optipng: { optimizationLevel: 7 },
          mozjpeg: { quality: 80 },
          svgo: {
            plugins: [
              { name: "removeViewBox", active: false },
              { name: "removeEmptyAttrs", active: true }
            ]
          }
        })
      : null,

    // ---------- OPTIONAL BUNDLE VISUALIZER ----------
    visualizer
      ? visualizer({
          filename: "dist/stats.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false
        })
      : null
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@context": path.resolve(__dirname, "src/context"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles")
    }
  },

  server: {
    port: 5173,
    open: true,
    cors: true,
    strictPort: false,
    hmr: {
      protocol: "ws",
      host: "localhost",
      overlay: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "DENY"
    }
  },

  preview: {
    port: 4173,
    open: true,
    strictPort: true
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: { charset: false }
    }
  },

  build: {
    target: targetBrowsers,
    minify: "esbuild",
    sourcemap: false,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: true,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("react")) return "react-bundle";
          if (id.includes("@components")) return "components";
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    esbuildOptions: { target: "es2020" }
  },

  define: {
    __APP_VERSION__: JSON.stringify("1.0.0"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  esbuild: {
    jsxFactory: "jsx",
    jsxFragment: "Fragment",
    treeShaking: true
  },

  experimental: {
    renderBuiltUrl(filename) {
      return `/${filename}`;
    }
  },

  envPrefix: ["VITE_", "APP_"]
});
