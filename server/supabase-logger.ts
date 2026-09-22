import type { PropertyQuery, MatchResult, GeocodingResult } from '../src/api/dpe-matcher/types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY;

export function logSearch(
  query: PropertyQuery,
  geo: GeocodingResult,
  match: MatchResult,
): void {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  const row = {
    address: query.address,
    postal_code: query.postalCode ?? geo.postcode,
    city: query.city ?? geo.city,
    area: query.area,
    floor: query.floor ?? null,
    property_type: query.propertyType,
    publication_date: query.publicationDate ?? null,
    geo_lat: geo.lat,
    geo_lon: geo.lon,
    geo_score: geo.score,
    match_found: match.found,
    best_dpe_label: match.best?.dpeLabel ?? null,
    best_score: match.best?.matchScore ?? null,
    best_numero_dpe: match.best?.numero_dpe ?? null,
    candidate_count: match.stats.afterFloorFilter,
    total_fetched: match.stats.totalFetched,
  };

  fetch(`${SUPABASE_URL}/rest/v1/sherlock_searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  }).catch(() => {
    // Silent failure — logging must never break the API
  });
}
