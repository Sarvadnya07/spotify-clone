import { Song, Album } from '../types';

/**
 * IAiService
 * Contract for AI-powered features within the music platform.
 */
export interface IAiService {
  getCommentary(previousSong: Song, nextSong: Song): Promise<string>;
  getRecommendationReason(song: Song): string;
  semanticSearch(query: string, songs: Song[]): Song[];
}

/**
 * AiDjService
 * Simulated AI DJ providing contextual commentary and semantic search.
 */
class AiDjService implements IAiService {
  private djName = "Alex";

  private scripts = [
    "That was a classic vibe from {artist}. Transitioning now into some modern energy.",
    "Hope you enjoyed that one. Up next, we're keeping the tempo high with {song}.",
    "Smooth transitions only. Here's a curated pick just for you.",
    "This next track is trending in your area. Let's dive in.",
    "You've been listening to a lot of {artist} lately. Here's something similar."
  ];

  async getCommentary(previousSong: Song, nextSong: Song): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const artist = nextSong.desc.split('•')[0].trim();
    const script = this.scripts[Math.floor(Math.random() * this.scripts.length)];
    return script.replace('{artist}', artist).replace('{song}', nextSong.name);
  }

  getRecommendationReason(song: Song): string {
    return `Based on your love for ${song.desc.split('•')[0].trim()}.`;
  }

  /**
   * Mock Semantic Search
   * Analyzes 'intent' within natural language queries.
   */
  semanticSearch(query: string, songs: Song[]): Song[] {
    const q = query.toLowerCase();
    
    // Semantic "Vibe" Mapping
    const vibes = {
      chill: ['relax', 'calm', 'soft', 'slow', 'peaceful'],
      energetic: ['hype', 'fast', 'beat', 'dance', 'workout'],
      focus: ['lofi', 'study', 'deep', 'ambient'],
      happy: ['upbeat', 'feel good', 'sun', 'bright']
    };

    // Find the intended vibe
    let targetVibe: string | null = null;
    for (const [vibe, keywords] of Object.entries(vibes)) {
      if (keywords.some(k => q.includes(k)) || q.includes(vibe)) {
        targetVibe = vibe;
        break;
      }
    }

    if (!targetVibe) return songs.filter(s => s.name.toLowerCase().includes(q));

    // Filter songs based on description/meta (Mocked mapping)
    // In production, this would use Vector Embeddings (Pinecone/pgvector)
    return songs.filter(s => {
      if (targetVibe === 'chill') return s.id % 2 === 0;
      if (targetVibe === 'energetic') return s.id % 2 !== 0;
      return true;
    }).slice(0, 5);
  }
}

export const aiDjService = new AiDjService();
