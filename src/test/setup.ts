import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the HTMLAudioElement
class AudioMock {
  src: string = '';
  volume: number = 1;
  paused: boolean = true;
  currentTime: number = 0;
  duration: number = 180;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  load = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

vi.stubGlobal('Audio', AudioMock);

// Mock the MediaSession API
vi.stubGlobal('navigator', {
  ...navigator,
  mediaSession: {
    metadata: null,
    setActionHandler: vi.fn(),
    playbackState: 'none',
  },
});
