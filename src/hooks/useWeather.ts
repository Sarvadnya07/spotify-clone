import { useEffect, useRef } from 'react';
import { weatherService, WeatherData } from '../services/WeatherService';
import usePlayerStore from '../store/usePlayerStore';
import { useToastStore } from '../store/useToastStore';

/**
 * useWeather Hook
 * Manages the real-time weather lifecycle.
 * Polls for environment changes and synchronizes the global store.
 */
export const useWeather = () => {
  const setWeather = usePlayerStore((state) => state.setWeather);
  const currentCondition = usePlayerStore((state) => state.currentWeather?.condition);
  const { addToast } = useToastStore();
  const initialFetch = useRef(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await weatherService.getCurrentWeather();
        
        // Only announce/update if the condition has changed to prevent fatigue
        if (data.condition !== currentCondition) {
          setWeather(data);
          
          if (initialFetch.current) {
            addToast(`Environment Update: ${data.mood}`, 'info');
          }
          initialFetch.current = true;
        }
      } catch (error) {
        console.error("Weather sync failed:", error);
      }
    };

    fetchWeather();
    
    // Poll every 15 minutes (900000ms) for environment shifts
    const interval = setInterval(fetchWeather, 900000);
    
    return () => clearInterval(interval);
  }, [setWeather, currentCondition, addToast]);
};
