'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

function MapClickHandler({
  onLocationSelect,
  setMarker,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  setMarker: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.getContainer().style.cursor = 'crosshair';
    return () => {
      map.getContainer().style.cursor = '';
    };
  }, [map]);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setMarker({ lat, lng });

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        const data = await res.json();
        const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}, ${data.display_name || ''}`.trim().replace(/,\s*$/, '');
        onLocationSelect(lat, lng, address);
      } catch {
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    },
  });
  return null;
}

interface LeafletMapProps {
  lat: number;
  lng: number;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

export default function LeafletMap({ lat, lng, onLocationSelect }: LeafletMapProps) {
  const [markerPos, setMarkerPos] = useState({ lat, lng });

  useEffect(() => {
    setMarkerPos({ lat, lng });
  }, [lat, lng]);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[markerPos.lat, markerPos.lng]} icon={markerIcon} />
      <RecenterMap lat={lat} lng={lng} />
      {onLocationSelect && (
        <MapClickHandler onLocationSelect={onLocationSelect} setMarker={setMarkerPos} />
      )}
    </MapContainer>
  );
}
