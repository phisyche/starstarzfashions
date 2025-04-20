
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";

const center = { lat: -1.286389, lng: 36.817223 }; // Nairobi coordinates

export function GoogleMapComponent() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API key
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={15}
      center={center}
      mapContainerClassName="w-full h-[400px] rounded-lg"
    >
      <MarkerF position={center} />
    </GoogleMap>
  );
}
