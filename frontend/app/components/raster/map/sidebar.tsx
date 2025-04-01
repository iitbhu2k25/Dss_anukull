'use client'
import { useState, useEffect } from 'react';
import { RasterMetadata, RasterLayerProps } from '@/app/types/raster';
import { fetchAvailableRasters } from '@/app/utils/rasterUtils';
import { ChevronDown, ChevronUp, Layers, Settings, Eye, EyeOff, RefreshCw, AlertTriangle, Info } from 'lucide-react';

interface SidebarProps {
  selectedMapLibrary: 'openlayers' | 'leaflet';
  onMapLibraryChange: (library: 'openlayers' | 'leaflet') => void;
  onRasterSelectionChange?: (selectedRasters: RasterLayerProps[]) => void;
}

interface Organisation {
  id: string;
  name: string;
}

interface RasterFile {
  id: string;
  name: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedMapLibrary, 
  onMapLibraryChange,
  onRasterSelectionChange
}) => {
  // State for Organisations and raster files
  const [Organisations, setOrganisations] = useState<Organisation[]>([]);
  const [rasterFiles, setRasterFiles] = useState<RasterFile[]>([]);

  // State for selected items
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('');
  const [selectedRasterFile, setSelectedRasterFile] = useState<string>('');
  const [selectedRasterLayers, setSelectedRasterLayers] = useState<RasterLayerProps[]>([]);

  // UI state
  const [isOrganisationsLoading, setIsOrganisationsLoading] = useState<boolean>(true);
  const [isRasterFilesLoading, setIsRasterFilesLoading] = useState<boolean>(false);
  const [OrganisationsError, setOrganisationsError] = useState<string | null>(null);
  const [rasterFilesError, setRasterFilesError] = useState<string | null>(null);
  
  // Dropdown state
  const [OrganisationDropdownOpen, setOrganisationDropdownOpen] = useState<boolean>(false);
  const [rasterFileDropdownOpen, setRasterFileDropdownOpen] = useState<boolean>(false);

  // Fetch Organisations on component mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        setIsOrganisationsLoading(true);
        setOrganisationsError(null);
        const response = await fetch('http://localhost:9000/api/raster_visual/categories/');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Organisations: ${response.statusText}`);
        }      
          
        const data = await response.json();
        setOrganisations(data);
      } catch (error) {
        console.error('Error fetching Organisations:', error);
        setOrganisationsError(error instanceof Error ? error.message : 'Failed to load Organisations');
      } finally {
        setIsOrganisationsLoading(false);
      }
    };

    fetchOrganisations();
  }, []);

  // Fetch raster files when Organisation is selected
  useEffect(() => {
    if (!selectedOrganisation) return;
    
    const fetchRasterFiles = async () => {
      try {
        setIsRasterFilesLoading(true);
        setRasterFilesError(null);
        
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:9000/api/raster_visual/categories/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organisation: selectedOrganisation }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch raster files: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        setRasterFiles(data);
      } catch (error) {
        console.error('Error fetching raster files:', error);
        setRasterFilesError(error instanceof Error ? error.message : 'Failed to load raster files');
      } finally {
        setIsRasterFilesLoading(false);
      }
    };

    fetchRasterFiles();
  }, [selectedOrganisation]);

  // Handle Organisation selection
  const handleOrganisationSelect = (OrganisationName: string) => {
    setSelectedOrganisation(OrganisationName);
    setSelectedRasterFile(''); // Reset raster file selection
    setSelectedRasterLayers([]); // Reset raster layers
    setOrganisationDropdownOpen(false);
  };

  // Handle raster file selection
  const handleRasterFileSelect = (rasterFileId: string) => {
    setSelectedRasterFile(rasterFileId);
    setRasterFileDropdownOpen(false);
    
    // Find the selected raster file
    const selectedFile = rasterFiles.find(file => file.id === rasterFileId);
    
    if (selectedFile && onRasterSelectionChange) {
      const rasterLayer: RasterLayerProps = {
        id: selectedFile.id,
        name: selectedFile.name,
        visible: true
      };
      
      setSelectedRasterLayers([rasterLayer]);
      onRasterSelectionChange([rasterLayer]);
    }
  };

  // Get Organisation name by ID
  const getOrganisationName = (id: string) => {
    const org = Organisations.find(org => org.id === id);
    return org ? org.name : 'Select an Organisation';
  };

  // Get raster file name by ID
  const getRasterFileName = (id: string) => {
    const file = rasterFiles.find(file => file.id === id);
    return file ? file.name : 'Select a raster file';
  };

  return (
    <div className="w-64 bg-white shadow-md p-4 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Layers className="mr-2 h-5 w-5 text-blue-500" />
          Raster Viewer
        </h2>
        
        <div className="space-y-4">
          {/* Organisation Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Organisation
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={() => setOrganisationDropdownOpen(!OrganisationDropdownOpen)}
                disabled={isOrganisationsLoading}
              >
                <span className="truncate">{selectedOrganisation ? getOrganisationName(selectedOrganisation) : 'Select an Organisation'}</span>
                {isOrganisationsLoading ? (
                  <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
                ) : (
                  OrganisationDropdownOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {OrganisationDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                  {Organisations.length > 0 ? (
                    Organisations.map((org) => (
                      <li
                        key={org.id}
                        className={`cursor-pointer select-none relative py-2 px-3 hover:bg-blue-50 ${selectedOrganisation === org.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}
                        onClick={() => handleOrganisationSelect(org.name)}
                      >
                        {org.name}
                      </li>
                    ))
                  ) : (
                    <li className="cursor-default select-none relative py-2 px-3 text-gray-500">
                      {OrganisationsError ? 'Error loading Organisations' : 'No Organisations available'}
                    </li>
                  )}
                </ul>
              )}
            </div>
            
            {OrganisationsError && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {OrganisationsError}
              </div>
            )}
          </div>
          
          {/* Raster File Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select raster file
            </label>
            <div className="relative">
              <button
                type="button"
                className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm flex justify-between items-center focus:outline-none ${!selectedOrganisation ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                onClick={() => setRasterFileDropdownOpen(!rasterFileDropdownOpen)}
                disabled={!selectedOrganisation || isRasterFilesLoading}
              >
                <span className="truncate">{selectedRasterFile ? getRasterFileName(selectedRasterFile) : 'Select a raster file'}</span>
                {isRasterFilesLoading ? (
                  <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
                ) : (
                  rasterFileDropdownOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              {rasterFileDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                  {rasterFiles.length > 0 ? (
                    rasterFiles.map((file) => (
                      <li
                        key={file.id}
                        className={`cursor-pointer select-none relative py-2 px-3 hover:bg-blue-50 ${selectedRasterFile === file.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}
                        onClick={() => handleRasterFileSelect(file.id)}
                      >
                        {file.name}
                      </li>
                    ))
                  ) : (
                    <li className="cursor-default select-none relative py-2 px-3 text-gray-500">
                      {rasterFilesError ? 'Error loading raster files' : 'No raster files available'}
                    </li>
                  )}
                </ul>
              )}
            </div>
            
            {rasterFilesError && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {rasterFilesError}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Selected Layers Section
      {selectedRasterLayers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Layers</h3>
          <ul className="space-y-2">
            {selectedRasterLayers.map(layer => (
              <li key={layer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <button 
                    className="mr-2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const updatedLayers = selectedRasterLayers.map(l => 
                        l.id === layer.id ? { ...l, visible: !layer.visible } : l
                      );
                      setSelectedRasterLayers(updatedLayers);
                      if (onRasterSelectionChange) onRasterSelectionChange(updatedLayers);
                    }}
                  >
                    {layer.visible ? 
                      <Eye className="h-4 w-4" /> : 
                      <EyeOff className="h-4 w-4" />
                    }
                  </button>
                  <span className="text-sm truncate max-w-[150px]">{layer.name}</span>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    const updatedLayers = selectedRasterLayers.filter(l => l.id !== layer.id);
                    setSelectedRasterLayers(updatedLayers);
                    if (onRasterSelectionChange) onRasterSelectionChange(updatedLayers);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )} */}
      
      {/* Map Library Selection */}
      <div className="mt-auto pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Map Library</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded ${selectedMapLibrary === 'openlayers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => onMapLibraryChange('openlayers')}
          >
            OpenLayers
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${selectedMapLibrary === 'leaflet' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => onMapLibraryChange('leaflet')}
          >
            Leaflet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;