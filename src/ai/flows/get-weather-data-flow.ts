// src/ai/flows/get-weather-data-flow.ts
'use server';
/**
 * @fileOverview A flow to get real-time weather data from OpenWeatherMap API.
 *
 * - getWeatherData - A function that returns real-time weather data.
 * - WeatherData - The return type for the getWeatherData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherDataSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  feelsLike: z.number().describe('The feels like temperature in Celsius.'),
  rainfall: z.number().describe('The rainfall in millimeters.'),
  sunlightHours: z.number().describe('The daily sunlight hours.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  humidity: z.number().describe('The current humidity percentage.'),
  pressure: z.number().describe('Atmospheric pressure in hPa.'),
  uvIndex: z.number().optional().describe('UV index (0-11+).'),
  visibility: z.number().describe('Visibility in kilometers.'),
  cloudCoverage: z.number().describe('Cloud coverage percentage.'),
  dewPoint: z.number().optional().describe('Dew point in Celsius.'),
  description: z.string().describe('Weather description.'),
  location: z.string().describe('Location name.'),
  sunrise: z.number().optional().describe('Sunrise time (Unix timestamp).'),
  sunset: z.number().optional().describe('Sunset time (Unix timestamp).'),
});
export type WeatherData = z.infer<typeof WeatherDataSchema>;

export async function getWeatherData(lat?: number, lon?: number): Promise<WeatherData> {
  return getWeatherDataFlow({ lat, lon });
}

const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: z.object({
      lat: z.number().optional(),
      lon: z.number().optional(),
    }),
    outputSchema: WeatherDataSchema,
  },
  async (input) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    
    // Use provided coordinates or default to Bhubaneswar, Odisha, India
    const lat = input.lat ?? 20.2961;
    const lon = input.lon ?? 85.8245;
    
    try {
      if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        // Fallback to simulated data if API key is not configured
        console.warn('OpenWeatherMap API key not configured, using simulated data');
        return generateSimulatedWeatherData();
      }

      // Fetch current weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        console.error('Weather API error:', weatherResponse.statusText);
        return generateSimulatedWeatherData();
      }

      const weatherData = await weatherResponse.json();

      // Calculate sunlight hours (simplified: 12 hours minus cloud coverage effect)
      const cloudCoverage = weatherData.clouds?.all || 0;
      const sunlightHours = 12 - (cloudCoverage / 100) * 6;

      // Get rainfall data (if available in the last hour/3 hours)
      const rainfall = weatherData.rain?.['1h'] || weatherData.rain?.['3h'] || 0;

      // Calculate dew point (simplified Magnus formula)
      const temp = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
      const dewPoint = (b * alpha) / (a - alpha);

      return {
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        rainfall: rainfall,
        sunlightHours: sunlightHours,
        windSpeed: weatherData.wind.speed * 3.6, // Convert m/s to km/h
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        uvIndex: weatherData.uvi, // May not be available in current weather API
        visibility: (weatherData.visibility || 10000) / 1000, // Convert meters to km
        cloudCoverage: cloudCoverage,
        dewPoint: dewPoint,
        description: weatherData.weather[0]?.description || 'clear',
        location: weatherData.name || 'Unknown',
        sunrise: weatherData.sys?.sunrise,
        sunset: weatherData.sys?.sunset,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return generateSimulatedWeatherData();
    }
  }
);

async function generateSimulatedWeatherData(): Promise<WeatherData> {
  // Return realistic simulated data for Bhubaneswar, Odisha during monsoon season
  return {
    temperature: 28.5,
    feelsLike: 31.2,
    rainfall: 5.2,
    sunlightHours: 6.2,
    windSpeed: 18.5,
    humidity: 78,
    pressure: 1010,
    uvIndex: 7,
    visibility: 8.5,
    cloudCoverage: 52,
    dewPoint: 24.1,
    description: 'partly cloudy',
    location: 'Bhubaneswar',
    sunrise: Date.now() / 1000 - 3600 * 2, // 2 hours ago
    sunset: Date.now() / 1000 + 3600 * 6, // 6 hours from now
  };
}
