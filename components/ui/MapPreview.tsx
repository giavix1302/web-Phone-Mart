'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

interface MapPreviewProps {
  lat: number;
  lng: number;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

export default function MapPreview({ lat, lng, onLocationSelect }: MapPreviewProps) {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 mt-3">
      <LeafletMap lat={lat} lng={lng} onLocationSelect={onLocationSelect} />
      {onLocationSelect && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 text-xs text-gray-600 px-3 py-1 rounded-full shadow pointer-events-none">
          Click trên bản đồ để chọn vị trí
        </div>
      )}
    </div>
  );
}
