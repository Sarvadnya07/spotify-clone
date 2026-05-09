
import { IPersistenceProvider } from './IPersistenceProvider';
import { HistoryItem } from '../store/usePlayerStore';

/**
 * CloudPersistenceService
 * Simulated transactional cloud backend (Firebase/Supabase Style).
 * Implements the IPersistenceProvider contract.
 */
class CloudPersistenceService implements IPersistenceProvider {
  private STORAGE_KEY = 'elite_cloud_sync_mock';

  private async simulateLatency() {
    return new Promise(resolve => setTimeout(resolve, 800));
  }

  async saveHistory(history: HistoryItem[]): Promise<void> {
    await this.simulateLatency();
    localStorage.setItem(`${this.STORAGE_KEY}_history`, JSON.stringify(history));
    console.log('[CLOUD] History Synced');
  }

  async getHistory(): Promise<HistoryItem[]> {
    await this.simulateLatency();
    const data = localStorage.getItem(`${this.STORAGE_KEY}_history`);
    return data ? JSON.parse(data) : [];
  }

  async saveLikedSongs(ids: number[]): Promise<void> {
    await this.simulateLatency();
    localStorage.setItem(`${this.STORAGE_KEY}_liked`, JSON.stringify(ids));
    console.log('[CLOUD] Library Synced');
  }

  async getLikedSongs(): Promise<number[]> {
    await this.simulateLatency();
    const data = localStorage.getItem(`${this.STORAGE_KEY}_liked`);
    return data ? JSON.parse(data) : [];
  }

  async savePlaylists(playlists: any[]): Promise<void> {
    await this.simulateLatency();
    localStorage.setItem(`${this.STORAGE_KEY}_playlists`, JSON.stringify(playlists));
    console.log('[CLOUD] Playlists Synced');
  }

  async getPlaylists(): Promise<any[]> {
    await this.simulateLatency();
    const data = localStorage.getItem(`${this.STORAGE_KEY}_playlists`);
    return data ? JSON.parse(data) : [];
  }
}

export const cloudPersistenceService = new CloudPersistenceService();
