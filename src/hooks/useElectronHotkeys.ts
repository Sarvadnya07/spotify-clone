import { useEffect } from 'react';
import usePlayerStore from '../store/usePlayerStore';

/**
 * useElectronHotkeys
 * Connects native Electron global shortcuts to the React state.
 * Only activates if the 'electronAPI' is present in the global window object.
 */
export const useElectronHotkeys = () => {
  const { togglePlay, playNext, playPrevious } = usePlayerStore();

  useEffect(() => {
    // Check if running in Electron environment
    const electron = (window as any).electronAPI;
    if (!electron) return;

    // Register listeners
    electron.onPlayPause(togglePlay);
    electron.onNext(playNext);
    electron.onPrev(playPrevious);

    console.log('[Electron] Native Hotkeys Initialized');
  }, [togglePlay, playNext, playPrevious]);
};
