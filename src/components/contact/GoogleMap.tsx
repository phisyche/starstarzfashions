
import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markerText?: string;
}

export function GoogleMap({ 
  center = { lat: -1.286389, lng: 36.817223 }, // Default to Nairobi
  zoom = 15,
  markerText = "StarStarz Fashion Boutique"
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      
      // Add marker with custom icon
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = L.marker(center, { icon: defaultIcon }).addTo(mapInstanceRef.current);
      marker.bindPopup(`<b>${markerText}</b>`).openPopup();
    } else {
      // Update map if it already exists
      mapInstanceRef.current.setView(center, zoom);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, markerText]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200"
      aria-label="Store location map"
    />
  );
}
