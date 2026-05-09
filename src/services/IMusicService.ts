import { Album, Song } from '../core/types';

/**
 * IMusicService
 * Interface defining the contract for music data providers.
 * Allows switching between Local Mock, Spotify API, or custom Backends.
 */
export interface IMusicService {
  getAlbums(): Promise<Album[]>;
  getAlbumById(id: number): Promise<Album | undefined>;
  getSongs(): Promise<Song[]>;
  getSongById(id: number): Promise<Song | undefined>;
  search(query: string): Promise<{ songs: Song[], albums: Album[] }>;
}
