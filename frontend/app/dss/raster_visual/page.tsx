'use client'
import { useState } from 'react';
import Sidebar from '@/app/components/raster/map/sidebar';
import MapView from '@/app/components/raster/map/mapview';
import { RasterLayerProps, MapLibrary } from '@/app/types/raster';


const rasterLayout: React.FC = () => {
  const [selectedRasters, setSelectedRasters] = useState<RasterLayerProps[]>([]);
  const [mapLibrary, setMapLibrary] = useState<MapLibrary>('openlayers');
  const [pixelInfo, setPixelInfo] = useState<Record<string, any>>({});

  const handleRasterSelect = (rasters: RasterLayerProps[]) => {
    setSelectedRasters(rasters);
  };

  const handleMapLibraryChange = (library: MapLibrary) => {
    setMapLibrary(library);
  };

  const handlePixelInfoRequest = (rasterId: string, coords: [number, number]) => {
    setPixelInfo(prev => ({
      ...prev,
      [rasterId]: {
        coords,
        value: Math.random() * 1000,
        timestamp: new Date().toISOString()
      }
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-100 h-full">
        <Sidebar
          selectedMapLibrary={mapLibrary}
          onMapLibraryChange={handleMapLibraryChange}
        />
      </div>
      
      {/* Main content area */}
      {/* <div className="flex-1 h-full overflow-hidden">
        <MapView
          selectedRasters={selectedRasters}
          library={mapLibrary}
          onPixelInfoRequest={handlePixelInfoRequest}
        />
      </div> */}
      
    </div>
  );
};

export default rasterLayout;