import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useCitySearch, type GeocodingResult } from "@/hooks/use-weather";
import { useDebounce } from "@/hooks/use-debounce"; // We'll implement this simple hook inline or in component

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface CitySearchProps {
  onSelect: (city: GeocodingResult) => void;
  onUseCurrentLocation: () => void;
}

export function CitySearch({ onSelect, onUseCurrentLocation }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounceValue(query, 500);
  const { data: results, isLoading } = useCitySearch(debouncedQuery);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: GeocodingResult) => {
    onSelect(city);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search city..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-border backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm font-medium"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => {
              onUseCurrentLocation();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-3 text-primary font-medium border-b border-border/50"
          >
            <MapPin className="h-4 w-4" />
            Use my current location
          </button>

          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Searching...
            </div>
          ) : results && results.length > 0 ? (
            <ul>
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-foreground">{city.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {city.admin1 ? `${city.admin1}, ` : ""}{city.country_code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 1 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No cities found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
