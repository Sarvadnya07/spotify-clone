import React, {
  useState,
  useEffect,
  memo,
} from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import usePlayerStore from "./store/usePlayerStore";
import { useAudioEngine } from "./hooks/useAudioEngine";
import ErrorToast from "./components/ErrorToast";

const App: React.FC = () => {
  const { playStatus, play, pause } = usePlayerStore();
  
  // Initialize audio engine
  useAudioEngine();

  // Render guards for smooth entry
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Global Keybinds (Keeping logic here for app-wide context)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        playStatus ? pause() : play();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playStatus, play, pause]);

  const layoutClass = isMounted
    ? "h-screen bg-black transition-opacity duration-300 opacity-100"
    : "h-screen bg-black opacity-0";

  return (
    <div className={layoutClass}>
      <div className="h-[90%] flex overflow-hidden">
        <Sidebar />
        <Display />
      </div>
      <Player />
      <ErrorToast />
    </div>
  );
};

export default memo(App);
