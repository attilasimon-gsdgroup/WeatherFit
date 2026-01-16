import { format } from "date-fns";
import { type WeatherData } from "@/hooks/use-weather";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastProps {
  data: WeatherData;
}

export function Forecast({ data }: ForecastProps) {
  const daily = data.daily;
  // Skip today (index 0) and show next 3 days
  const nextDays = daily.time.slice(1, 4).map((time, index) => ({
    date: new Date(time),
    code: daily.weather_code[index + 1],
    max: daily.temperature_2m_max[index + 1],
    min: daily.temperature_2m_min[index + 1],
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-display px-1">3-Day Forecast</h3>
      <div className="grid gap-3">
        {nextDays.map((day, i) => (
          <div 
            key={i} 
            className="bg-card rounded-xl p-4 flex items-center justify-between border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full p-2">
                <WeatherIcon code={day.code} className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">
                  {format(day.date, "EEEE")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {format(day.date, "MMM d")}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="font-bold text-lg">{Math.round(day.max)}°</span>
                <span className="text-xs text-muted-foreground">Max</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-muted-foreground">{Math.round(day.min)}°</span>
                <span className="text-xs text-muted-foreground">Min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
