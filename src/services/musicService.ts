import { albumsData, songsData } from "../assets/assets";
import { Album, Song } from "../types";

/**
 * musicService
 * Abstracted data access layer. Currently mocks asynchronous API calls 
 * but can be easily replaced with real Axios/Fetch calls to a backend.
 */
export const musicService = {
  /**
   * Fetches all albums
   */
  getAlbums: async (): Promise<Album[]> => {
    return new Promise((resolve) => {
      // Simulate network latency
      setTimeout(() => resolve([...albumsData]), 300);
    });
  },

  /**
   * Fetches a single album by ID
   */
  getAlbumById: async (id: number): Promise<Album | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(albumsData.find(a => a.id === id)), 200);
    });
  },

  /**
   * Fetches all songs
   */
  getSongs: async (): Promise<Song[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...songsData]), 300);
    });
  },

  /**
   * Fetches a single song by ID
   */
  getSongById: async (id: number): Promise<Song | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(songsData.find(s => s.id === id)), 100);
    });
  }
};
