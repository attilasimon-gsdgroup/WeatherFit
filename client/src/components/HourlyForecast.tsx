import { format, parseISO } from "date-fns";
import { WeatherIcon } from "./WeatherIcon";
import { type WeatherData } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface HourlyForecastProps {
  data: WeatherData;
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const hourly = data.hourly;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-display font-bold px-1">Next 24 Hours</h3>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-3xl">
        <div className="flex w-max gap-3 p-1">
          {hourly.time.map((time, i) => (
            <Card key={time} className="flex flex-col items-center justify-center p-4 min-w-[80px] border-none bg-secondary/50 dark:bg-white/5 backdrop-blur-sm hover-elevate transition-all">
              <span className="text-xs font-medium text-muted-foreground mb-2">
                {i === 0 ? "Now" : format(parseISO(time), "HH:mm")}
              </span>
              <WeatherIcon 
                code={hourly.weather_code[i]} 
                isDay={1} // Assuming daytime icons for better visibility in list
                className="w-8 h-8 mb-2" 
              />
              <span className="text-lg font-bold font-display">
                {Math.round(hourly.temperature_2m[i])}°
              </span>
              <div className="flex items-center text-[10px] text-primary/70 mt-1 font-bold">
                {hourly.precipitation_probability[i]}%
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
