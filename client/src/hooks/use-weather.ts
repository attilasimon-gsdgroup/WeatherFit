import { useQuery } from "@tanstack/react-query";

// Open-Meteo Types
export interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  current_units: {
    temperature_2m: string;
  };
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
}

// Fetch weather from Open-Meteo
export function useWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async (): Promise<WeatherData> => {
      if (lat === null || lon === null) throw new Error("Location not provided");
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!res.ok) throw new Error("Failed to fetch weather data");
      return res.json();
    },
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Search cities via Open-Meteo Geocoding
export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ["citySearch", query],
    queryFn: async (): Promise<GeocodingResult[]> => {
      if (!query || query.length < 2) return [];
      
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!res.ok) throw new Error("Failed to search cities");
      const data = await res.json();
      return data.results || [];
    },
    enabled: query.length >= 2,
  });
}

// WMO Weather Codes map to descriptions and icon names
// We'll handle the actual Icon component in the UI layer
export const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return codes[code] || "Unknown";
};

export const getOutfitRecommendation = (code: number, temp: number): string => {
  // Rain codes
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  // Snow codes
  const snowCodes = [71, 73, 75, 77, 85, 86];

  let outfit = "";

  if (temp > 25) {
    outfit = "T-shirt + shorts + sunglasses ☀️";
  } else if (temp >= 15) {
    outfit = "Jeans + light jacket 👕";
  } else if (temp >= 5) {
    outfit = "Warm coat + sweater 🧥";
  } else {
    outfit = "Heavy coat + scarf + gloves 🧣";
  }

  if (rainCodes.includes(code)) {
    outfit += " + umbrella ☔";
  } else if (snowCodes.includes(code)) {
    outfit = "Winter gear + waterproof boots ❄️";
  }

  return outfit;
};
