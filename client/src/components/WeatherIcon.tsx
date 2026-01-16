import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Moon,
  CloudMoon
} from "lucide-react";

interface WeatherIconProps {
  code: number;
  isDay?: number; // 1 for day, 0 for night
  className?: string;
}

export function WeatherIcon({ code, isDay = 1, className = "w-6 h-6" }: WeatherIconProps) {
  // Clear
  if (code === 0 || code === 1) {
    return isDay ? <Sun className={`text-yellow-500 ${className}`} /> : <Moon className={`text-blue-300 ${className}`} />;
  }
  
  // Partly Cloudy
  if (code === 2) {
    return isDay ? <CloudSun className={`text-yellow-400 ${className}`} /> : <CloudMoon className={`text-blue-200 ${className}`} />;
  }
  
  // Overcast
  if (code === 3) {
    return <Cloud className={`text-gray-400 ${className}`} />;
  }
  
  // Fog
  if (code === 45 || code === 48) {
    return <CloudFog className={`text-gray-400 ${className}`} />;
  }
  
  // Drizzle
  if ([51, 53, 55, 56, 57].includes(code)) {
    return <CloudDrizzle className={`text-blue-400 ${className}`} />;
  }
  
  // Rain
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudRain className={`text-blue-500 ${className}`} />;
  }
  
  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <Snowflake className={`text-cyan-200 ${className}`} />;
  }
  
  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return <CloudLightning className={`text-purple-500 ${className}`} />;
  }

  // Default
  return <Sun className={`text-yellow-500 ${className}`} />;
}
