export type WeatherCondition = 'Clear' | 'Rain' | 'Clouds' | 'Snow' | 'Storm' | 'Night';

export interface WeatherData {
  temp: number;
  condition: WeatherCondition;
  city: string;
  mood: string;
}

/**
 * WeatherService
 * Handles geolocation and real-time weather mapping.
 * Currently uses a high-fidelity simulation logic for demonstration.
 * Integration Ready: Swap simulation with OpenWeatherMap API call.
 */
class WeatherService {
  private moodMap: Record<WeatherCondition, string> = {
    'Clear': 'Energetic & Bright',
    'Rain': 'Lo-fi & Melancholy',
    'Clouds': 'Indie & Chill',
    'Snow': 'Cozy & Acoustic',
    'Storm': 'Dark & Intense',
    'Night': 'Ambient & Deep'
  };

  async getCurrentWeather(): Promise<WeatherData> {
    return new Promise((resolve) => {
      // Simulate Geolocation & API Latency
      setTimeout(() => {
        const hour = new Date().getHours();
        const isNight = hour > 20 || hour < 6;
        
        // Mock randomized weather for demo purposes
        const conditions: WeatherCondition[] = ['Clear', 'Rain', 'Clouds'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        const condition = isNight ? 'Night' : randomCondition;

        resolve({
          temp: 24,
          condition: condition,
          city: 'London', // In production, use reverse geocoding
          mood: this.moodMap[condition]
        });
      }, 1000);
    });
  }

  getWeatherTheme(condition: WeatherCondition) {
    const themes: Record<WeatherCondition, { primary: string; secondary: string; blur: string }> = {
      'Clear': { primary: '#f9c74f', secondary: '#f3722c', blur: 'rgba(249, 199, 79, 0.1)' },
      'Rain': { primary: '#4895ef', secondary: '#4cc9f0', blur: 'rgba(72, 149, 239, 0.1)' },
      'Clouds': { primary: '#90be6d', secondary: '#43aa8b', blur: 'rgba(144, 190, 109, 0.1)' },
      'Snow': { primary: '#f8f9fa', secondary: '#dee2e6', blur: 'rgba(248, 249, 250, 0.1)' },
      'Storm': { primary: '#5f0f40', secondary: '#310e68', blur: 'rgba(95, 15, 64, 0.1)' },
      'Night': { primary: '#0f172a', secondary: '#1e293b', blur: 'rgba(15, 23, 42, 0.1)' }
    };
    return themes[condition];
  }
}

export const weatherService = new WeatherService();
