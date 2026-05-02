import React, {
  useState,
  useEffect,
  memo,
  useCallback,
} from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import Lyrics from "./components/Lyrics";
import Queue from "./components/Queue";
import FriendActivity from "./components/FriendActivity";
import DJOverlay from "./components/DJOverlay";
import Miniplayer from "./components/Miniplayer";
import ToastContainer from "./components/ToastContainer";
import ShortcutsModal from "./components/common/ShortcutsModal";
import ReactiveBackground from "./components/ReactiveBackground";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useElectronHotkeys } from "./hooks/useElectronHotkeys";
import { useWeather } from "./hooks/useWeather";
import usePlayerStore from "./store/usePlayerStore";
import ErrorToast from "./components/ErrorToast";

/**
 * App Root - Optimized for Performance
 * - High-frequency visual updates are isolated to ReactiveBackground.
 * - Main tree only re-renders on structural state changes.
 */
const App: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { showMiniplayer, toggleMiniplayer } = usePlayerStore();

  const toggleShortcuts = useCallback(() => {
    setIsShortcutsOpen(prev => !prev);
  }, []);

  useAudioEngine(); // Core Audio Singleton
  useKeyboardShortcuts(toggleShortcuts);
  useElectronHotkeys();
  useWeather(); // Intelligence Polling

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const layoutClass = `h-screen overflow-hidden transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={layoutClass}>
      <ReactiveBackground />
      
      <div className="h-full flex flex-col relative z-10">
        <div className="flex-grow flex overflow-hidden">
          <Sidebar onShowShortcuts={toggleShortcuts} />
          
          <div className="flex-grow glass-panel border-y-0 border-r-0 overflow-hidden relative shadow-2xl">
            <Display />
          </div>

          <FriendActivity />
        </div>

        <Player />

        {/* Floating Overlays */}
        <Lyrics />
        <Queue />
        <DJOverlay />
        <Miniplayer isOpen={showMiniplayer} onClose={toggleMiniplayer} />
        <ToastContainer />
        <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
        <ErrorToast />
      </div>
    </div>
  );
};

export default memo(App);
