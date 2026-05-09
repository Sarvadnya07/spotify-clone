
import { useEffect } from 'react';
import { Song } from '../../../core/types';

/**
 * useMediaSession
 * Connects the browser/OS Media Session API to the application state.
 */
export const useMediaSession = (
  track: Song | null,
  play: () => void,
  pause: () => void,
  playNext: () => void,
  playPrevious: () => void
) => {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: 'Spotify Elite',
      album: track.desc,
      artwork: [{ src: track.image, sizes: '512x512', type: 'image/jpeg' }]
    });

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNext());

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [track, play, pause, playNext, playPrevious]);
};
