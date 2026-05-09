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
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const provider = import.meta.env.VITE_WEATHER_PROVIDER || 'simulation';

    if (apiKey && provider !== 'simulation') {
      try {
        // Production Grade: Real-time Geolocation + OpenWeather API
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        
        const { latitude, longitude } = pos.coords;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        const conditionMap: Record<string, WeatherCondition> = {
          'Clear': 'Clear',
          'Rain': 'Rain',
          'Drizzle': 'Rain',
          'Clouds': 'Clouds',
          'Snow': 'Snow',
          'Thunderstorm': 'Storm',
          'Mist': 'Clouds',
          'Smoke': 'Clouds',
          'Haze': 'Clouds',
          'Dust': 'Clouds',
          'Fog': 'Clouds',
          'Sand': 'Clouds',
          'Ash': 'Clouds',
          'Squall': 'Storm',
          'Tornado': 'Storm'
        };

        const condition = conditionMap[data.weather[0].main] || 'Clear';
        const isNight = new Date().getHours() > 20 || new Date().getHours() < 6;

        return {
          temp: Math.round(data.main.temp),
          condition: isNight ? 'Night' : condition,
          city: data.name,
          mood: this.moodMap[isNight ? 'Night' : condition]
        };
      } catch (error) {
        console.warn("[WEATHER] Production API failed, falling back to simulation:", error);
      }
    }

    // Fallback Simulation (High-Fidelity)
    return new Promise((resolve) => {
      setTimeout(() => {
        const hour = new Date().getHours();
        const isNight = hour > 20 || hour < 6;
        const conditions: WeatherCondition[] = ['Clear', 'Rain', 'Clouds'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const condition = isNight ? 'Night' : randomCondition;

        resolve({
          temp: 24,
          condition: condition,
          city: 'London',
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
