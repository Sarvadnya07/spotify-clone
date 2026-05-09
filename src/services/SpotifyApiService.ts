import { Album, Song } from '../core/types';
import { IMusicService } from './IMusicService';

/**
 * SpotifyApiService
 * Implementation of IMusicService that connects to the real Spotify Web API.
 * NOTE: Requires a valid Access Token obtained via OAuth2.
 */
class SpotifyApiService implements IMusicService {
  private baseUrl = 'https://api.spotify.com/v1';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async fetchFromSpotify(endpoint: string) {
    if (!this.token) throw new Error('Spotify Access Token not set.');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAlbums(): Promise<Album[]> {
    // Example: Fetching "New Releases" or "Featured Playlists"
    const data = await this.fetchFromSpotify('/browse/new-releases');
    return data.albums.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.images[0]?.url,
      desc: item.artists[0]?.name,
      bgColor: '#121212' // Default
    }));
  }

  async getAlbumById(id: number | string): Promise<Album | undefined> {
    const item = await this.fetchFromSpotify(`/albums/${id}`);
    return {
      id: Number(item.id), // Mapping logic depends on ID type
      name: item.name,
      image: item.images[0]?.url,
      desc: item.artists[0]?.name,
      bgColor: '#121212'
    };
  }

  async getSongs(): Promise<Song[]> {
    // Example: Fetching User's Top Tracks
    const data = await this.fetchFromSpotify('/me/top/tracks');
    return data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.album.images[0]?.url,
      file: item.preview_url, // Spotify previews are 30s
      desc: item.artists[0]?.name,
      duration: '0:30'
    }));
  }

  async getSongById(id: number | string): Promise<Song | undefined> {
    const item = await this.fetchFromSpotify(`/tracks/${id}`);
    return {
      id: Number(item.id),
      name: item.name,
      image: item.album.images[0]?.url,
      file: item.preview_url,
      desc: item.artists[0]?.name,
      duration: '0:30'
    };
  }

  async search(query: string): Promise<{ songs: Song[], albums: Album[] }> {
    const data = await this.fetchFromSpotify(`/search?q=${encodeURIComponent(query)}&type=track,album`);
    
    const songs = data.tracks.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.album.images[0]?.url,
      file: item.preview_url,
      desc: item.artists[0]?.name,
      duration: '0:30'
    }));

    const albums = data.albums.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.images[0]?.url,
      desc: item.artists[0]?.name,
      bgColor: '#121212'
    }));

    return { songs, albums };
  }
}

export const spotifyApiService = new SpotifyApiService();
