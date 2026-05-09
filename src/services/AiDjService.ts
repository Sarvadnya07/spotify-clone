import { Song, Album } from '../core/types';
import { WeatherData } from '../features/weather/WeatherService';

/**
 * IAiService
 * Contract for AI-powered features within the music platform.
 */
export interface IAiService {
  getCommentary(previousSong: Song, nextSong: Song, weather?: WeatherData | null): Promise<string>;
  getRecommendationReason(song: Song): string;
  semanticSearch(query: string, songs: Song[]): Song[];
  getWeatherCommentary(weather: WeatherData): string;
}

/**
 * AiDjService
 * Simulated AI DJ providing contextual commentary, semantic search, and weather awareness.
 */
class AiDjService implements IAiService {
  private scripts = [
    "That was a classic vibe from {artist}. Transitioning now into some modern energy.",
    "Hope you enjoyed that one. Up next, we're keeping the tempo high with {song}.",
    "Smooth transitions only. Here's a curated pick just for you.",
    "This next track is trending in your area. Let's dive in.",
    "You've been listening to a lot of {artist} lately. Here's something similar."
  ];

  private weatherScripts: Record<string, string[]> = {
    'Clear': ["It's a beautiful sunny day in {city}. Let's keep the energy up with some bright tunes.", "Sunshine and good music. Perfect combination for {city} today."],
    'Rain': ["It's raining in {city}. Time to slow things down and get cozy with some lo-fi jazz.", "Rainy days were made for this playlist. Lean back and relax."],
    'Clouds': ["Cloudy skies over {city}. Perfect weather for some indie discovery.", "Keeping it chill while the clouds roll in."],
    'Storm': ["Intense weather in {city} right now. Playing some high-energy tracks to match the mood.", "Matching the storm's energy with this next selection."],
    'Night': ["Late night in {city}. Transitioning into ambient sounds for your deep focus.", "Under the stars now. Here's something atmospheric."]
  };

  async getCommentary(previousSong: Song, nextSong: Song, weather?: WeatherData | null): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 30% chance to give weather-based commentary if available
    if (weather && Math.random() > 0.7) {
      return this.getWeatherCommentary(weather);
    }

    const artist = nextSong.desc.split('•')[0].trim();
    const script = this.scripts[Math.floor(Math.random() * this.scripts.length)];
    return script.replace('{artist}', artist).replace('{song}', nextSong.name);
  }

  getWeatherCommentary(weather: WeatherData): string {
    const scripts = this.weatherScripts[weather.condition] || this.scripts;
    const script = scripts[Math.floor(Math.random() * scripts.length)];
    return script.replace('{city}', weather.city);
  }

  getRecommendationReason(song: Song): string {
    return `Based on your love for ${song.desc.split('•')[0].trim()}.`;
  }

  semanticSearch(query: string, songs: Song[]): Song[] {
    const q = query.toLowerCase();
    
    // Advanced Vibe Mapping (Production Grade)
    const vibeProfiles: Record<string, { keywords: string[], weights: Record<string, number> }> = {
      chill: { 
        keywords: ['relax', 'calm', 'soft', 'slow', 'peaceful', 'lofi', 'ambient', 'chill'], 
        weights: { 'acoustic': 0.8, 'lo-fi': 0.9, 'jazz': 0.7 } 
      },
      energetic: { 
        keywords: ['hype', 'fast', 'beat', 'dance', 'workout', 'power', 'gym', 'electronic'], 
        weights: { 'dance': 0.9, 'pop': 0.7, 'high energy': 1.0 } 
      },
      focus: { 
        keywords: ['study', 'deep', 'work', 'concentration', 'brain', 'minimal'], 
        weights: { 'instrumental': 0.9, 'classical': 0.8, 'deep': 0.7 } 
      },
      atmospheric: { 
        keywords: ['mood', 'space', 'cinematic', 'night', 'stars', 'ethereal'], 
        weights: { 'ambient': 1.0, 'synth': 0.7, 'reverb': 0.8 } 
      }
    };

    // 1. Keyword Scoring
    const scoredSongs = songs.map(song => {
      let score = 0;
      const songText = `${song.name} ${song.desc}`.toLowerCase();
      
      // Match against vibe profiles
      for (const [profile, data] of Object.entries(vibeProfiles)) {
        if (data.keywords.some(k => q.includes(k))) {
          // If query matches a vibe, score based on song metadata
          if (songText.includes(profile)) score += 10;
          for (const [meta, weight] of Object.entries(data.weights)) {
            if (songText.includes(meta)) score += weight * 10;
          }
        }
      }

      // Basic text match bonus
      if (songText.includes(q)) score += 5;
      
      return { song, score };
    });

    // 2. Rank and Filter
    return scoredSongs
      .filter(s => s.score > 0 || s.song.name.toLowerCase().includes(q))
      .sort((a, b) => b.score - a.score)
      .map(s => s.song)
      .slice(0, 8);
  }
}

export const aiDjService = new AiDjService();
