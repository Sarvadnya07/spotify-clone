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
import ErrorBoundary from "./components/common/ErrorBoundary";
import ReactiveBackground from "./components/ReactiveBackground";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useElectronHotkeys } from "./hooks/useElectronHotkeys";
import { useWeather } from "./hooks/useWeather";
import usePlayerStore from "./store/usePlayerStore";
import ErrorToast from "./components/ErrorToast";

/**
 * App Root - Production Hardened
 * - Minimalist architecture with high-performance event bus integration.
 * - Clean, distraction-free environment for professional display.
 */
const App: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { showMiniplayer, toggleMiniplayer } = usePlayerStore();

  const toggleShortcuts = useCallback(() => {
    setIsShortcutsOpen(prev => !prev);
  }, []);

  // Core Service Singletons
  useAudioEngine();
  useKeyboardShortcuts(toggleShortcuts);
  useElectronHotkeys();
  useWeather();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`h-screen overflow-hidden transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <ReactiveBackground />
      
      <div className="h-full flex flex-col relative z-10">
        <div className="flex-grow flex overflow-hidden">
          <ErrorBoundary>
            <Sidebar onShowShortcuts={toggleShortcuts} />
          </ErrorBoundary>
          
          <div className="flex-grow overflow-hidden relative bg-[#121212]">
            <ErrorBoundary>
              <Display />
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            <FriendActivity />
          </ErrorBoundary>
        </div>

        <ErrorBoundary>
          <Player />
        </ErrorBoundary>

        {/* OVERLAYS & MODALS */}
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
