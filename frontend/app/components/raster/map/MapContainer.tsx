import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
    className?: string;
    initialOptions?: {
      center?: [number, number];
      zoom?: number;
      style?: string;
    };
  }

  const MapContainer: React.FC<MapContainerProps> = ({
    className = '',
    initialOptions,
  }) => {