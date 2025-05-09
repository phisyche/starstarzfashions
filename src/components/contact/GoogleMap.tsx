
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  // Get or create the default icon
  useEffect(() => {
    defaultIcon = createCustomIcon();
    
    // Fix Leaflet's default icon issue
    // @ts-ignore - this is a valid use case for Leaflet
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border">
      <MapContainer 
        center={position as any} 
        zoom={16} 
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>Star Starz Fashions</strong>
            <p>
              Akai Plaza Ground Floor,<br />
              Office No 2 At Rosters<br />
              Off Thika Superhighway<br />
              Next to Mountain Mall
            </p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

// Export named components for external use
export const MapComponent = Map;
export const GoogleMap = Map;
