import { format } from "date-fns";
import { ArrowUp, ArrowDown, Droplets, Wind, Sun, Umbrella, Bell } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { type WeatherData, getWeatherDescription, getOutfitRecommendation } from "@/hooks/use-weather";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: string;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const { toast } = useToast();
  const current = data.current;
  const today = data.daily;
  const description = getWeatherDescription(current.weather_code);
  const uvIndex = today.uv_index_max[0];
  const outfit = getOutfitRecommendation(current.weather_code, current.temperature_2m, uvIndex);
  
  // Calculate correct local time using UTC offset
  const getLocalTime = () => {
    const now = new Date();
    // Get UTC time in milliseconds
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Add Open-Meteo offset (seconds to milliseconds)
    return new Date(utc + (data.utc_offset_seconds * 1000));
  };
  
  const localTime = getLocalTime();
  
  // Determine gradient based on weather code
  // Simple logic: Day/Clear = sunny, Night/Cloud = cloudy, Rain = rainy
  let gradientClass = "weather-gradient-cloudy";
  if (current.weather_code <= 2 && current.is_day) gradientClass = "weather-gradient-sunny";
  if ([51, 61, 80, 95].some(code => current.weather_code >= code)) gradientClass = "weather-gradient-rainy";

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not supported",
        description: "Your browser does not support notifications.",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast({
        title: "Notifications enabled",
        description: `You will now receive alerts for ${locationName}.`
      });
      
      // Simulate an alert check
      if (current.weather_code >= 80) {
        setTimeout(() => {
          new Notification("Weather Alert", {
            body: `Heavy weather detected in ${locationName}: ${description}`,
            icon: "/icon-192x192.png"
          });
        }, 3000);
      }
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${gradientClass} text-slate-900 dark:text-white p-6 md:p-8 transition-all duration-500 min-h-[400px] flex items-center justify-center`}>
      {/* Decorative blurred circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center w-full">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight drop-shadow-md">
            {locationName}
          </h2>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 border border-white/20"
            onClick={handleEnableNotifications}
            title="Enable alerts"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-2">
          {format(localTime, "EEEE, HH:mm")} {data.timezone_abbreviation}
        </p>
        <p className="text-slate-800 dark:text-white/90 font-medium mb-6 drop-shadow-sm">{description}</p>

        <div className="flex items-center justify-center mb-2">
          <WeatherIcon 
            code={current.weather_code} 
            isDay={current.is_day} 
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] filter brightness-90 dark:brightness-100" 
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
          <div className="bg-white/40 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center border border-black/5 dark:border-white/10">
            <div className="flex items-center text-slate-900 dark:text-white/90 text-sm font-bold mb-1">
              <Sun className="w-3 h-3 mr-1 stroke-[3px]" /> UV Index
            </div>
            <span className="font-extrabold text-lg">{Math.round(today.uv_index_max[0])}</span>
          </div>
          <div className="bg-white/40 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center border border-black/5 dark:border-white/10">
            <div className="flex items-center text-slate-900 dark:text-white/90 text-sm font-bold mb-1">
              <Umbrella className="w-3 h-3 mr-1 stroke-[3px]" /> Rain
            </div>
            <span className="font-extrabold text-lg">{today.precipitation_probability_max[0]}%</span>
          </div>
          <div className="bg-white/40 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center border border-black/5 dark:border-white/10">
            <div className="flex items-center text-slate-900 dark:text-white/90 text-sm font-bold mb-1">
              <Wind className="w-3 h-3 mr-1 stroke-[3px]" /> Wind
            </div>
            <span className="font-extrabold text-lg">{Math.round(current.wind_speed_10m)}<span className="text-xs font-normal ml-1">km/h</span></span>
          </div>
          <div className="bg-white/40 dark:bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center border border-black/5 dark:border-white/10">
            <div className="flex items-center text-slate-900 dark:text-white/90 text-sm font-bold mb-1">
              <Droplets className="w-3 h-3 mr-1 stroke-[3px]" /> Humidity
            </div>
            <span className="font-extrabold text-lg">{current.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
