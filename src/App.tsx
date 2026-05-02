import React, {
  useState,
  useEffect,
  memo,
} from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import ErrorToast from "./components/ErrorToast";

/**
 * App Root
 * Orchestrates the global layout, audio engine, and global interaction hooks.
 */
const App: React.FC = () => {
  // Initialize core services
  useAudioEngine();
  useKeyboardShortcuts();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const layoutClass = `h-screen bg-black transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`;

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
