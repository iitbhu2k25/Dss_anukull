'use client'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { RasterLayerProps, MapLibrary } from '@/app/types/raster';

// Import OpenLayersMap normally as it doesn't have SSR issues
import OpenLayersMap from './openlayer';

// Import LeafletMap with dynamic import to prevent SSR issues
// This is because Leaflet depends on window object
const LeafletMap = dynamic(
  () => import('./leaflet'),
  { ssr: false }
);

interface MapViewProps {
  selectedRasters: RasterLayerProps[];
  library: MapLibrary;
  onPixelInfoRequest?: (rasterId: string, coords: [number, number]) => void;
}

const MapView: React.FC<MapViewProps> = ({
  selectedRasters,
  library,
  onPixelInfoRequest
}) => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const handleMapClick = (coords: [number, number]) => {
    setSelectedCoords(coords);
    
    // Request pixel information for all visible rasters
    if (onPixelInfoRequest) {
      selectedRasters.forEach(({ raster, visible }) => {
        if (visible) {
          onPixelInfoRequest(raster.id, coords);
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map component based on selected library */}
      <div className="w-full h-full">
        {library === 'openlayers' ? (
          <OpenLayersMap
            selectedRasters={selectedRasters}
            onMapClick={handleMapClick}
          />
        ) : (
          <LeafletMap
            selectedRasters={selectedRasters}
            onMapClick={handleMapClick}
          />
        )}
      </div>
      
      {/* Coordinates display */}
      {selectedCoords && (
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-sm">
          Lng: {selectedCoords[0].toFixed(6)}, Lat: {selectedCoords[1].toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default MapView;