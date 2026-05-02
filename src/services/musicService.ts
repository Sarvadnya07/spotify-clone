import { IMusicService } from './IMusicService';
import { albumsData, songsData } from '../assets/assets';
import { Album, Song } from '../types';

/**
 * LocalMusicService
 * Implementation of IMusicService using local static assets.
 */
class LocalMusicService implements IMusicService {
  async getAlbums(): Promise<Album[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(albumsData), 300);
    });
  }

  async getAlbumById(id: number): Promise<Album | undefined> {
    return albumsData.find((album) => album.id === id);
  }

  async getSongs(): Promise<Song[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(songsData), 200);
    });
  }

  async getSongById(id: number): Promise<Song | undefined> {
    return songsData.find((song) => song.id === id);
  }

  async search(query: string): Promise<{ songs: Song[], albums: Album[] }> {
    const q = query.toLowerCase();
    const songs = songsData.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
    const albums = albumsData.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
    return { songs, albums };
  }
}

/**
 * SpotifyApiService Mock / Integration
 * Prepared for real Spotify API calls.
 */
class SpotifyApiService implements IMusicService {
  async getAlbums(): Promise<Album[]> { return []; }
  async getAlbumById(): Promise<Album | undefined> { return undefined; }
  async getSongs(): Promise<Song[]> { return []; }
  async getSongById(): Promise<Song | undefined> { return undefined; }
  async search(): Promise<{ songs: Song[], albums: Album[] }> { return { songs: [], albums: [] }; }
}

// ⚡ Dynamic Service Provider Resolution
// Determines the data source based on environment configuration.
const PROVIDER = import.meta.env.VITE_MUSIC_PROVIDER || 'local';

export const musicService: IMusicService = PROVIDER === 'spotify' 
  ? new SpotifyApiService() 
  : new LocalMusicService();

console.log(`[SERVICE] Initialized with provider: ${PROVIDER}`);
