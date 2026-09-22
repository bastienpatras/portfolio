import type { GeocodingResult } from './types';

const BAN_BASE = 'https://api-adresse.data.gouv.fr';

export async function geocodeAddress(
  address: string,
  postcode?: string | null,
  city?: string | null,
): Promise<GeocodingResult> {
  const fullQuery = [address, city].filter(Boolean).join(', ');
  const params = new URLSearchParams({
    q: fullQuery,
    limit: '1',
    type: 'housenumber',
  });
  if (postcode) params.set('postcode', postcode);

  const res = await fetch(`${BAN_BASE}/search/?${params}`);
  if (!res.ok) throw new Error(`BAN geocoder error: ${res.status}`);

  const data = await res.json();

  if (!data.features || data.features.length === 0) {
    // Retry without type filter (maybe it's a street-level address)
    params.delete('type');
    const res2 = await fetch(`${BAN_BASE}/search/?${params}`);
    if (!res2.ok) throw new Error(`BAN geocoder error: ${res2.status}`);
    const data2 = await res2.json();
    if (!data2.features || data2.features.length === 0) {
      throw new Error('Address not found by BAN geocoder');
    }
    return extractResult(data2.features[0]);
  }

  return extractResult(data.features[0]);
}

function extractResult(feature: Record<string, unknown>): GeocodingResult {
  const props = feature.properties as Record<string, unknown>;
  const geom = feature.geometry as { coordinates: [number, number] };
  return {
    label: props.label as string,
    lon: geom.coordinates[0],
    lat: geom.coordinates[1],
    postcode: props.postcode as string,
    citycode: props.citycode as string,
    city: props.city as string,
    depcode: (props.depcode ?? (props.context as string)?.split(',')[0]?.trim()) as string,
    score: props.score as number,
  };
}
