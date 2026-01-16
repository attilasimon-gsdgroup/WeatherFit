import { useState, useEffect } from "react";
import { Loader2, MapPinOff } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeather } from "@/components/CurrentWeather";
import { Forecast } from "@/components/Forecast";
import { SavedLocations } from "@/components/SavedLocations";

interface LocationState {
  lat: number | null;
  lon: number | null;
  name: string;
}

export default function Home() {
  const [location, setLocation] = useState<LocationState>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("weatherfit_last_location");
    return saved ? JSON.parse(saved) : { lat: null, lon: null, name: "" };
  });

  const [geoError, setGeoError] = useState<string | null>(null);

  const { data: weather, isLoading, error, refetch } = useWeather(location.lat, location.lon);

  useEffect(() => {
    if (location.lat && location.lon) {
      localStorage.setItem("weatherfit_last_location", JSON.stringify(location));
    }
  }, [location]);

  const handleGetCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: "Current Location",
        });
      },
      () => {
        setGeoError("Location access denied. Please search for a city.");
      }
    );
  };

  // Initial load: get location if none set
  useEffect(() => {
    if (!location.lat) {
      handleGetCurrentLocation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6 md:py-10 space-y-8">
        
        {/* Header / Search */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
              WeatherFit
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans font-medium">
                BETA
              </span>
            </h1>
          </div>
          <CitySearch 
            onSelect={(city) => setLocation({ lat: city.latitude, lon: city.longitude, name: city.name })}
            onUseCurrentLocation={handleGetCurrentLocation}
          />
        </header>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-pulse">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Forecasting your style...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 text-center">
            <p className="text-destructive font-medium mb-2">Could not load weather</p>
            <button 
              onClick={() => refetch()}
              className="text-sm font-semibold underline underline-offset-2 hover:text-destructive/80"
            >
              Try again
            </button>
          </div>
        ) : !location.lat ? (
          <div className="text-center py-20 px-6 bg-secondary/50 rounded-3xl border border-dashed border-secondary-foreground/10">
            <MapPinOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold mb-2">Where are you?</h3>
            <p className="text-muted-foreground mb-6">
              {geoError || "We need your location to show the weather and recommend outfits."}
            </p>
            <button
              onClick={handleGetCurrentLocation}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Enable Location
            </button>
          </div>
        ) : weather ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <CurrentWeather data={weather} locationName={location.name} />
            
            <Forecast data={weather} />
            
            <SavedLocations 
              currentLocationName={location.name}
              currentLat={location.lat}
              currentLon={location.lon}
              onSelect={(lat, lon, name) => setLocation({ lat, lon, name })}
            />
          </div>
        ) : null}

      </div>
    </div>
  );
}
