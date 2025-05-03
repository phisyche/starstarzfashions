
import { useState, useEffect } from "react";
import { useLoadScript, GoogleMap as GoogleMapComponent, MarkerF } from "@react-google-maps/api";

const center = { lat: -1.286389, lng: 36.817223 }; // Nairobi coordinates

export function Map() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Get the API key from environment variables or allow user to enter it
  useEffect(() => {
    const storedKey = localStorage.getItem("google_maps_api_key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "AIzaSyC_H0LEH5QhfK8OD45YwT2_fSo5Ax_L0Sc", // Default key (this would be replaced with the user's key)
  });

  const handleSetApiKey = () => {
    const key = prompt("Please enter your Google Maps API key:");
    if (key) {
      localStorage.setItem("google_maps_api_key", key);
      setApiKey(key);
      window.location.reload();
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
        <p className="mb-4">Loading map...</p>
        <button 
          onClick={handleSetApiKey}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Set API Key
        </button>
      </div>
    );
  }

  return (
    <GoogleMapComponent
      zoom={15}
      center={center}
      mapContainerClassName="w-full h-[400px] rounded-lg"
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <MarkerF position={center} />
    </GoogleMapComponent>
  );
}

// Export named components for external use
export const GoogleMapComponent = Map;
export const GoogleMap = Map;
