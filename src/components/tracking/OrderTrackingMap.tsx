
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Package, CheckCircle } from 'lucide-react';

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
  status: string;
  description: string;
}

interface OrderTrackingMapProps {
  orderId: string;
  deliveryAddress: {
    lat: number;
    lng: number;
    address: string;
  };
  currentLocation?: TrackingLocation;
  trackingHistory?: TrackingLocation[];
  estimatedDelivery?: string;
}

export function OrderTrackingMap({ 
  orderId, 
  deliveryAddress, 
  currentLocation,
  trackingHistory = [],
  estimatedDelivery 
}: OrderTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([deliveryAddress.lat, deliveryAddress.lng], 13);

    // Add OpenStreetMap layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom icons
    const deliveryIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const truckIcon = L.divIcon({
      html: '<div style="background: #3b82f6; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;"><svg width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg></div>',
      className: 'truck-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add delivery address marker
    const deliveryMarker = L.marker([deliveryAddress.lat, deliveryAddress.lng], { icon: deliveryIcon })
      .addTo(map)
      .bindPopup(`<strong>Delivery Address</strong><br/>${deliveryAddress.address}`)
      .openPopup();

    // Add current location marker if available
    if (currentLocation) {
      const currentMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: truckIcon })
        .addTo(map)
        .bindPopup(`<strong>Current Location</strong><br/>${currentLocation.description}<br/><small>${new Date(currentLocation.timestamp).toLocaleString()}</small>`);

      // Draw route line from current location to delivery address
      const routeLine = L.polyline([
        [currentLocation.lat, currentLocation.lng],
        [deliveryAddress.lat, deliveryAddress.lng]
      ], {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);

      // Fit map to show both markers
      const group = new L.FeatureGroup([deliveryMarker, currentMarker]);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Add tracking history markers
    trackingHistory.forEach((location, index) => {
      const historyIcon = L.divIcon({
        html: `<div style="background: #10b981; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white;"></div>`,
        className: 'history-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([location.lat, location.lng], { icon: historyIcon })
        .addTo(map)
        .bindPopup(`<strong>${location.status}</strong><br/>${location.description}<br/><small>${new Date(location.timestamp).toLocaleString()}</small>`);
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [deliveryAddress, currentLocation, trackingHistory]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'out for delivery':
        return 'bg-blue-500';
      case 'in transit':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'out for delivery':
        return <Truck className="h-4 w-4" />;
      case 'in transit':
        return <MapPin className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Tracking - #{orderId}</span>
            {currentLocation && (
              <Badge className={getStatusColor(currentLocation.status)}>
                {getStatusIcon(currentLocation.status)}
                <span className="ml-1">{currentLocation.status}</span>
              </Badge>
            )}
          </CardTitle>
          {estimatedDelivery && (
            <p className="text-sm text-gray-500">
              Estimated delivery: {new Date(estimatedDelivery).toLocaleDateString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg overflow-hidden border border-gray-200"
            aria-label="Order tracking map"
          />
          {!isMapReady && (
            <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Loading map...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {trackingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingHistory.map((location, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                  <div className={`p-2 rounded-full ${getStatusColor(location.status)} text-white`}>
                    {getStatusIcon(location.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{location.status}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(location.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
