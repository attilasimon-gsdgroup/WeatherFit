import { Loader2, MapPin, Trash2, Plus } from "lucide-react";
import { useLocations, useDeleteLocation, useCreateLocation } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";

interface SavedLocationsProps {
  currentLocationName: string;
  currentLat: number;
  currentLon: number;
  onSelect: (lat: number, lon: number, name: string) => void;
}

export function SavedLocations({ 
  currentLocationName, 
  currentLat, 
  currentLon,
  onSelect 
}: SavedLocationsProps) {
  const { data: locations, isLoading } = useLocations();
  const deleteMutation = useDeleteLocation();
  const createMutation = useCreateLocation();

  const isAlreadySaved = locations?.some(
    (loc) => loc.name === currentLocationName && 
    Math.abs(loc.lat - currentLat) < 0.01 && 
    Math.abs(loc.lon - currentLon) < 0.01
  );

  const handleSave = () => {
    createMutation.mutate({
      name: currentLocationName,
      lat: currentLat,
      lon: currentLon,
    });
  };

  if (isLoading) return <div className="py-4"><Loader2 className="animate-spin w-5 h-5 mx-auto text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-bold font-display">Favorite Places</h3>
        {!isAlreadySaved && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="text-xs h-8 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Plus className="w-3 h-3 mr-1" />
            )}
            Save Current
          </Button>
        )}
      </div>
      
      {!locations?.length ? (
        <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
          <p className="text-sm text-muted-foreground">No saved locations yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <div 
              key={loc.id}
              className="group relative bg-card hover:bg-muted/30 rounded-xl p-4 border border-border transition-all hover:shadow-md cursor-pointer flex items-center justify-between"
              onClick={() => onSelect(loc.lat, loc.lon, loc.name)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-semibold text-foreground truncate max-w-[120px]">
                  {loc.name}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(loc.id);
                }}
                disabled={deleteMutation.isPending}
                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
