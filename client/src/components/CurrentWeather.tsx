import { format } from "date-fns";
import { ArrowUp, ArrowDown, Droplets, Wind, Sun, Umbrella } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { type WeatherData, getWeatherDescription, getOutfitRecommendation } from "@/hooks/use-weather";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: string;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const current = data.current;
  const today = data.daily;
  const description = getWeatherDescription(current.weather_code);
  const uvIndex = today.uv_index_max[0];
  const outfit = getOutfitRecommendation(current.weather_code, current.temperature_2m, uvIndex);
  
  // Determine gradient based on weather code
  // Simple logic: Day/Clear = sunny, Night/Cloud = cloudy, Rain = rainy
  let gradientClass = "weather-gradient-cloudy";
  if (current.weather_code <= 2 && current.is_day) gradientClass = "weather-gradient-sunny";
  if ([51, 61, 80, 95].some(code => current.weather_code >= code)) gradientClass = "weather-gradient-rainy";

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${gradientClass} text-slate-900 dark:text-white p-6 md:p-8 transition-all duration-500`}>
      {/* Dynamic Background Overlays */}
      <div className="absolute inset-0 opacity-50 dark:opacity-30">
        {current.weather_code >= 51 && (
          <div className="absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/rain.png')] bg-repeat" />
        )}
        {current.weather_code >= 71 && current.weather_code <= 77 && (
          <div className="absolute inset-0 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/snow.png')] bg-repeat" />
        )}
      </div>

      {/* Decorative blurred circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-1 drop-shadow-md">
          {locationName}
        </h2>
        <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-2">
          {format(new Date(), "EEEE, HH:mm")}
        </p>
        <p className="text-slate-800 dark:text-white/90 font-medium mb-6 drop-shadow-sm">{description}</p>

        <div className="flex items-center justify-center mb-2">
          <WeatherIcon 
            code={current.weather_code} 
            isDay={current.is_day} 
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg filter" 
          />
          <span className="text-7xl md:text-9xl font-bold font-display ml-4 drop-shadow-xl tracking-tighter">
            {Math.round(current.temperature_2m)}°
          </span>
        </div>

        <p className="text-sm font-medium mb-6 opacity-80">
          Feels like {Math.round(current.apparent_temperature)}°
        </p>

        <div className="glass-panel rounded-2xl p-4 w-full mb-6">
          <p className="text-lg font-medium leading-relaxed">
             {outfit}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4">
          <div className="bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-slate-800 dark:text-white/90 text-sm mb-1">
              <Sun className="w-3 h-3 mr-1" /> UV Index
            </div>
            <span className="font-bold text-lg">{Math.round(today.uv_index_max[0])}</span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-slate-800 dark:text-white/90 text-sm mb-1">
              <Umbrella className="w-3 h-3 mr-1" /> Rain
            </div>
            <span className="font-bold text-lg">{today.precipitation_probability_max[0]}%</span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-slate-800 dark:text-white/90 text-sm mb-1">
              <Wind className="w-3 h-3 mr-1" /> Wind
            </div>
            <span className="font-bold text-lg">{Math.round(current.wind_speed_10m)}<span className="text-xs font-normal ml-1">km/h</span></span>
          </div>
          <div className="bg-white/30 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center">
            <div className="flex items-center text-slate-800 dark:text-white/90 text-sm mb-1">
              <Droplets className="w-3 h-3 mr-1" /> Humidity
            </div>
            <span className="font-bold text-lg">{current.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
