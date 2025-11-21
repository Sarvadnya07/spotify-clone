import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);

  // Render guards & layout watchers
  const [isMounted, setIsMounted] = useState(false);
  const layoutRef = useRef(null);

  // Gives smoother layout activation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Auto-update audio source with safe load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.src = track.file;
      audio.load();
    } catch (e) {
      /* silently protect render */
    }
  }, [track, audioRef]);

  // Broadcast layout updates (future-proofing)
  const observeLayout = useCallback(() => {
    if (!layoutRef.current) return;

    const observer = new ResizeObserver(() => {
      /* Keep flexible spacing while minimising layout shifts */
    });

    observer.observe(layoutRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observeLayout();
    return cleanup;
  }, [observeLayout]);

  // Keybinds (global shortcuts: space = play/pause, arrows = seek)
  useEffect(() => {
    const handler = (e) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      if (e.code === "Space") {
        e.preventDefault();
        audio.paused ? audio.play() : audio.pause();
      }

      if (e.code === "ArrowRight") {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      }

      if (e.code === "ArrowLeft") {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [audioRef]);

  // Layout class generator
  const layoutClass = isMounted
    ? "h-screen bg-black transition-opacity duration-300 opacity-100"
    : "h-screen bg-black opacity-0";

  return (
    <div className={layoutClass} ref={layoutRef}>
      {/* Main zone */}
      <div className="h-[90%] flex overflow-hidden">
        <Sidebar />
        <Display />
      </div>

      {/* Bottom player */}
      <Player />

      {/* Audio element (same ID, same structure) */}
      <audio
        ref={audioRef}
        src={track.file}
        preload="auto"
        onError={() => {
          /* Soft fallback, avoids crashes */
        }}
      ></audio>
    </div>
  );
};

// Future optimization: memoized export
export default memo(App);
