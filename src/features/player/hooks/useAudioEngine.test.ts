import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAudioEngine, audioInstance } from './useAudioEngine';
import usePlayerStore from '../store/usePlayerStore';

describe('useAudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePlayerStore.setState({
      playStatus: false,
      track: { id: 0, name: 'Test Song', file: 'test.mp3', image: '', duration: '3:00', desc: 'Test' }
    });
  });

  it('should sync playStatus with audio instance', () => {
    const { rerender } = renderHook(() => useAudioEngine());
    
    expect(audioInstance.play).not.toHaveBeenCalled();

    usePlayerStore.setState({ playStatus: true });
    rerender();

    expect(audioInstance.play).toHaveBeenCalled();
  });

  it('should update audio source when track changes', () => {
    renderHook(() => useAudioEngine());
    
    const newTrack = { id: 1, name: 'Next Song', file: 'next.mp3', image: '', duration: '3:00', desc: 'Next' };
    usePlayerStore.setState({ track: newTrack });

    expect(audioInstance.src).toContain('next.mp3');
    expect(audioInstance.load).toHaveBeenCalled();
  });

  it('should update volume on audio instance', () => {
    renderHook(() => useAudioEngine());
    
    usePlayerStore.setState({ volume: 0.5 });
    expect(audioInstance.volume).toBe(0.5);
  });
});
