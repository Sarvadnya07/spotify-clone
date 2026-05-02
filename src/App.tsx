import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
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
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useElectronHotkeys } from "./hooks/useElectronHotkeys";
import { useVisualizer } from "./hooks/useVisualizer";
import usePlayerStore from "./store/usePlayerStore";
import ErrorToast from "./components/ErrorToast";

/**
 * App Root - Reactive Ecosystem
 * - Features Real-Time Audio Visualization (Visualizer Synergy).
 * - Integrates AI DJ, Native Hotkeys, and Seamless Glass Layout.
 */
const App: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { showMiniplayer, toggleMiniplayer } = usePlayerStore();

  const toggleShortcuts = useCallback(() => {
    setIsShortcutsOpen(prev => !prev);
  }, []);

  useAudioEngine();
  useKeyboardShortcuts(toggleShortcuts);
  useElectronHotkeys();
  const intensity = useVisualizer();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reactive Background Styles
  const bgStyles = useMemo(() => ({
    "--pulse-intensity": intensity,
    filter: `contrast(${100 + intensity * 20}%)`,
  } as React.CSSProperties), [intensity]);

  const layoutClass = `h-screen bg-black bg-gradient-animate overflow-hidden transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={layoutClass} style={bgStyles}>
      <div className="h-full flex flex-col relative">
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

      {/* Reactive Glow Layer */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, rgba(29, 185, 84, ${intensity * 0.15}) 0%, transparent 70%)`,
          opacity: intensity > 0.1 ? 1 : 0
        }}
      />
    </div>
  );
};

export default memo(App);
