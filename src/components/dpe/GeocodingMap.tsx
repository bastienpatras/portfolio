import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
import type { GeocodingResult } from '@/api/dpe-matcher/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GeocodingMapProps {
  geocoding: GeocodingResult | null;
}

export function GeocodingMap({ geocoding }: GeocodingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!geocoding || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current).setView([geocoding.lat, geocoding.lon], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:#ef4444;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      className: '',
    });

    L.marker([geocoding.lat, geocoding.lon], { icon })
      .addTo(map)
      .bindPopup(`<strong>${geocoding.label}</strong><br/>${geocoding.city} (${geocoding.depcode})`)
      .openPopup();

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [geocoding]);

  if (!geocoding) return null;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{geocoding.label}</span>
          <span className="text-muted-foreground">
            ({geocoding.lat.toFixed(4)}, {geocoding.lon.toFixed(4)})
          </span>
        </div>
        <div
          ref={mapRef}
          className="h-[300px] w-full rounded-md overflow-hidden border"
        />
      </CardContent>
    </Card>
  );
}
