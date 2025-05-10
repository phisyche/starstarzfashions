
import { useState, useEffect } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
let defaultIcon: L.Icon;

// Function to create a custom icon
const createCustomIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// The coordinates for Akai Plaza (near Mountain Mall, Thika Road)
// Approximate location based on the description
const position: [number, number] = [-1.219, 36.888]; // Latitude, Longitude

export function Map() {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapLoaded) {
      // Dynamic imports to avoid SSR issues
      import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
        setMapLoaded(true);
        
        // Get or create the default icon
        defaultIcon = createCustomIcon();
        
        // Fix Leaflet's default icon issue
        const DefaultIcon = L.Icon.extend({
          options: {
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          }
        });
        
        const map = L.map('map-container').setView(position, 16);
        setMapInstance(map);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        const marker = new L.Marker(position, { icon: defaultIcon }).addTo(map);
        marker.bindPopup(`
          <strong>Star Starz Fashions</strong>
          <p>
            Akai Plaza Ground Floor,<br />
            Office No 2 At Rosters<br />
            Off Thika Superhighway<br />
            Next to Mountain Mall
          </p>
        `).openPopup();
      });
    }
    
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapLoaded, mapInstance]);

  return (
    <div id="map-container" className="w-full h-[400px] rounded-lg overflow-hidden border"></div>
  );
}

// Export named components for external use
export const MapComponent = Map;
export const GoogleMap = Map;
