import { describe, it, expect, beforeEach, vi } from 'vitest';
import usePlayerStore from '../usePlayerStore';
import { songsData } from '../../assets/assets';

/**
 * usePlayerStore Unit Tests
 * Validates the core business logic of the music platform.
 */
describe('usePlayerStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearQueue } = usePlayerStore.getState();
    clearQueue();
  });

  it('should initialize with the default track', () => {
    const state = usePlayerStore.getState();
    expect(state.track).toBeDefined();
    expect(state.track.id).toBe(0);
  });

  it('should add a song to the queue', () => {
    const { addToQueue } = usePlayerStore.getState();
    const songId = 1;
    
    addToQueue(songId);
    
    const state = usePlayerStore.getState();
    expect(state.queue).toContain(songId);
  });

  it('should handle play/pause toggling', () => {
    const { play, pause } = usePlayerStore.getState();
    
    play();
    expect(usePlayerStore.getState().playStatus).toBe(true);
    
    pause();
    expect(usePlayerStore.getState().playStatus).toBe(false);
  });

  it('should remove a song from the queue', () => {
    const { addToQueue, removeFromQueue } = usePlayerStore.getState();
    const songId = 2;
    
    addToQueue(songId);
    removeFromQueue(songId);
    
    const state = usePlayerStore.getState();
    expect(state.queue).not.toContain(songId);
  });

  it('should clear the entire queue', () => {
    const { addToQueue, clearQueue } = usePlayerStore.getState();
    
    addToQueue(1);
    addToQueue(2);
    clearQueue();
    
    const state = usePlayerStore.getState();
    expect(state.queue.length).toBe(0);
  });
});
