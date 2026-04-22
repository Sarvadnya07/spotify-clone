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
import usePlayerStore from "./store/usePlayerStore";

import ErrorToast from "./components/ErrorToast";

const App: React.FC = () => {
  const { audioRef, track, playStatus, updateTime, play, pause, setError } = usePlayerStore();

  // Render guards & layout watchers
  const [isMounted, setIsMounted] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Gives smoother layout activation
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Sync event listeners with Zustand
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => updateTime();
    const onLoaded = () => updateTime();
    
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [audioRef, updateTime]);

  // Sync playStatus with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playStatus) {
      audio.play().catch(() => {
        /* handle autoplay block */
      });
    } else {
      audio.pause();
    }
  }, [playStatus, audioRef]);

  // Auto-update audio source with safe load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.src = track.file;
      audio.load();
      if (playStatus) audio.play().catch(() => {});
    } catch (e) {
      /* silently protect render */
    }
  }, [track, audioRef, playStatus]);

  // Keybinds (global shortcuts: space = play/pause, arrows = seek)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      if (e.code === "Space") {
        e.preventDefault();
        playStatus ? pause() : play();
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
  }, [audioRef, playStatus, play, pause]);

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
      <ErrorToast />

      {/* Audio element (same ID, same structure) */}
      <audio
        ref={audioRef}
        preload="auto"
        onError={(e) => {
          setError("Failed to load audio. Please check your connection.");
          console.error("Audio playback error:", e);
        }}
      ></audio>
    </div>
  );
};

export default memo(App);
