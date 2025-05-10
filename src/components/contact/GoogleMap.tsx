
import { useState, useEffect, useRef } from "react";

// The coordinates for Akai Plaza (near Mountain Mall, Thika Road)
// Approximate location based on the description
const position: [number, number] = [-1.219, 36.888]; // Latitude, Longitude

export function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapLoaded) return;

    // Dynamic imports to avoid SSR issues
    const loadMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Import CSS
        import('leaflet/dist/leaflet.css');
        
        // Fix for default marker icons in Leaflet
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Initialize map
        const map = L.map(mapRef.current).setView(position, 16);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker
        const marker = L.marker(position, { icon }).addTo(map);
        marker.bindPopup(`
          <strong>Star Starz Fashions</strong>
          <p>
            Akai Plaza Ground Floor,<br />
            Office No 2 At Rosters<br />
            Off Thika Superhighway<br />
            Next to Mountain Mall
          </p>
        `).openPopup();
        
        setMapLoaded(true);
        
        // Cleanup function to remove map when component unmounts
        return () => {
          map.remove();
        };
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };
    
    loadMap();
  }, [mapLoaded]);

  return (
    <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden border"></div>
  );
}

// Export named components for external use
export const MapComponent = Map;
export const GoogleMap = Map;
