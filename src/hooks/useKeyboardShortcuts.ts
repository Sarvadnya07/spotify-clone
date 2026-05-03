import { useEffect } from 'react';
import usePlayerStore from '../store/usePlayerStore';

/**
 * useKeyboardShortcuts
 * Global hook to handle keyboard interactions for playback control.
 * Implements standard Spotify hotkeys.
 */
export const useKeyboardShortcuts = (onHelpToggle?: () => void) => {
  const { 
    togglePlay, 
    playNext, 
    playPrevious, 
    volume, 
    setVolume, 
    track, 
    toggleLike 
  } = usePlayerStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input (like search)
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ': // Space - Play/Pause
          e.preventDefault();
          togglePlay();
          break;
        case 'l': // L - Toggle Like
          toggleLike(track.id);
          break;
        case '?': // ? - Toggle Help
        case '/': // Often used as help too
          if (onHelpToggle) {
            e.preventDefault();
            onHelpToggle();
          }
          break;
        case 'arrowright': // ArrowRight - Skip Forward 10s or Next
          if (e.shiftKey) {
            playNext();
          }
          break;
        case 'arrowleft': // ArrowLeft - Skip Back or Previous
          if (e.shiftKey) {
            playPrevious();
          }
          break;
        case 'arrowup': // ArrowUp - Volume Up
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'arrowdown': // ArrowDown - Volume Down
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'm': // M - Mute Toggle
          setVolume(volume > 0 ? 0 : 0.5);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, playNext, playPrevious, volume, setVolume, track.id, toggleLike, onHelpToggle]);
};
