
import { HistoryItem } from '../store/usePlayerStore';

/**
 * IPersistenceProvider
 * Contract for handling application data persistence.
 * Decouples the storage implementation from the application logic.
 */
export interface IPersistenceProvider {
  saveHistory(history: HistoryItem[]): Promise<void>;
  getHistory(): Promise<HistoryItem[]>;
  
  saveLikedSongs(ids: number[]): Promise<void>;
  getLikedSongs(): Promise<number[]>;
  
  savePlaylists(playlists: any[]): Promise<void>;
  getPlaylists(): Promise<any[]>;
}
