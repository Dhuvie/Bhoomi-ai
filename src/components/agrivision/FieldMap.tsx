'use client';

import { useEffect, useRef, useState } from 'react';
import type { Field } from './FieldManagementPage';
import { Button } from '../ui/button';
import { Layers, Map as MapIcon } from 'lucide-react';

// Leaflet types (will be loaded dynamically)
interface LatLng {
  lat: number;
  lng: number;
}

// Declare Leaflet as any to avoid type errors before dynamic import
declare global {
  interface Window {
    L: any;
  }
}

export default function FieldMap({
  fields,
  isDrawing,
  onCoordinatesChange,
  selectedField,
  onFieldSelect,
}: {
  fields: Field[];
  isDrawing: boolean;
  onCoordinatesChange: (coords: [number, number][], area: number) => void;
  selectedField: Field | null;
  onFieldSelect: (field: Field | null) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const drawControlRef = useRef<any>(null);
  const fieldLayersRef = useRef<Map<string, any>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const tileLayerRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    const initMap = async () => {
      // Dynamically import Leaflet
      const L = (await import('leaflet')).default;
      // Import CSS
      if (typeof document !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (mapRef.current) return;

      // Always center on Bhubaneswar, Odisha
      const initialCenter: [number, number] = [20.2961, 85.8245]; // Bhubaneswar city center
      const initialZoom = 12; // City-level zoom for better detail

      if (!mapContainerRef.current) return;
      
      // Check if container already has a map instance
      const container = mapContainerRef.current;
      if ((container as any)._leaflet_id) {
        return; // Map already initialized
      }
      
      const map = L.map(container).setView(initialCenter, initialZoom);

      // Add street map layer (default)
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      });

      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;

      mapRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle map type toggle
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const switchMapType = async () => {
      const L = (await import('leaflet')).default;
      const map = mapRef.current;

      // Remove current tile layer
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      // Add new tile layer based on type
      let newLayer;
      if (mapType === 'satellite') {
        // Using Esri World Imagery (free satellite tiles)
        newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri',
          maxZoom: 19,
        });
      } else {
        // Street map
        newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        });
      }

      newLayer.addTo(map);
      tileLayerRef.current = newLayer;
    };

    switchMapType();
  }, [mapType]);

  // Handle drawing mode with Leaflet Draw
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const setupDrawing = async () => {
      const L = (await import('leaflet')).default;
      // Import Leaflet Draw CSS via link tag
      if (typeof document !== 'undefined') {
        const existingLink = document.getElementById('leaflet-draw-css');
        if (!existingLink) {
          const link = document.createElement('link');
          link.id = 'leaflet-draw-css';
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
          document.head.appendChild(link);
        }
      }
      
      await import('leaflet-draw');
      
      const map = mapRef.current;

      if (isDrawing) {
        // Remove existing draw control if it exists
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null;
        }

        // Clear previous drawing
        if (drawingLayerRef.current) {
          map.removeLayer(drawingLayerRef.current);
        }

        // Create a feature group for drawn items
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawingLayerRef.current = drawnItems;

        // Initialize the draw control with improved styling
        const drawControl = new (L as any).Control.Draw({
          position: 'topleft',
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
              metric: ['ha', 'km'],
              shapeOptions: {
                color: '#10b981',
                weight: 3,
                fillColor: '#10b981',
                fillOpacity: 0.2,
                opacity: 0.8
              },
              drawError: {
                color: '#ef4444',
                timeout: 1000
              },
              guidelineDistance: 20,
              repeatMode: false
            },
            rectangle: {
              showArea: true,
              metric: ['ha', 'km'],
              shapeOptions: {
                color: '#3b82f6',
                weight: 3,
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                opacity: 0.8
              },
              repeatMode: false
            },
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false
          },
          edit: {
            featureGroup: drawnItems,
            remove: false // Disable since we handle deletion separately
          }
        });

        map.addControl(drawControl);
        drawControlRef.current = drawControl;

        // Handle draw created event
        map.on((L as any).Draw.Event.CREATED, (e: any) => {
          const layer = e.layer;
          const type = e.layerType;
          
          // Add the layer to drawnItems so it stays visible
          drawnItems.addLayer(layer);
          
          // Get coordinates
          let coords: [number, number][] = [];
          if (type === 'polygon' || type === 'rectangle') {
            const latlngs = layer.getLatLngs()[0];
            coords = latlngs.map((ll: any) => [ll.lat, ll.lng]);
          }
          
          // Calculate area
          let area = 0;
          if (coords.length >= 3) {
            // Use spherical excess formula
            const earthRadius = 6371000;
            const toRad = (deg: number) => deg * Math.PI / 180;
            
            for (let i = 0; i < coords.length; i++) {
              const j = (i + 1) % coords.length;
              const lat1 = toRad(coords[i][0]);
              const lat2 = toRad(coords[j][0]);
              const lng1 = toRad(coords[i][1]);
              const lng2 = toRad(coords[j][1]);
              
              area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
            }
            
            area = Math.abs(area * earthRadius * earthRadius / 2) / 10000; // Convert to hectares
          }
          
          // Notify parent component with coordinates and area
          onCoordinatesChange(coords, area);
        });
      } else {
        // Clear drawing mode
        if (drawControlRef.current) {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null;
        }
        
        if (drawingLayerRef.current) {
          map.removeLayer(drawingLayerRef.current);
          drawingLayerRef.current = null;
        }
      }
    };

    setupDrawing();
  }, [isDrawing, isMapReady, onCoordinatesChange]);

  // Display existing fields
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const displayFields = async () => {
      const L = (await import('leaflet')).default;
      const map = mapRef.current;

      // Remove old field layers
      fieldLayersRef.current.forEach(layer => map.removeLayer(layer));
      fieldLayersRef.current.clear();

      // Add field layers
      fields.forEach(field => {
        const polygon = L.polygon(field.coordinates as any, {
          color: field.color,
          fillColor: field.color,
          fillOpacity: selectedField?.id === field.id ? 0.4 : 0.2,
          weight: selectedField?.id === field.id ? 4 : 2,
        }).addTo(map);

        polygon.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="font-size: 14px;">${field.name}</strong><br/>
            <span style="color: #666; font-size: 12px;">${field.crop}</span><br/>
            <span style="font-size: 12px;">${field.size.toFixed(2)} ha</span>
          </div>
        `);

        polygon.on('click', () => {
          onFieldSelect(field);
        });

        fieldLayersRef.current.set(field.id, polygon);
      });

      // Fit bounds if fields exist
      if (fields.length > 0 && !isDrawing) {
        const allCoords = fields.flatMap(f => f.coordinates);
        if (allCoords.length > 0) {
          map.fitBounds(allCoords as any, { padding: [50, 50] });
        }
      }
    };

    displayFields();
  }, [fields, selectedField, isDrawing, isMapReady, onFieldSelect]);

  return (
    <div className="relative w-full h-full">
      {/* Map Type Toggle */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <Button
          size="sm"
          variant={mapType === 'street' ? 'default' : 'outline'}
          onClick={() => setMapType('street')}
          className="shadow-lg backdrop-blur-sm bg-background/95"
        >
          <MapIcon className="w-4 h-4 mr-2" />
          Street
        </Button>
        <Button
          size="sm"
          variant={mapType === 'satellite' ? 'default' : 'outline'}
          onClick={() => setMapType('satellite')}
          className="shadow-lg backdrop-blur-sm bg-background/95"
        >
          <Layers className="w-4 h-4 mr-2" />
          Satellite
        </Button>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
