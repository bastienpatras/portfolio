import type { VercelRequest, VercelResponse } from '@vercel/node';
import { geocodeAddress } from '../src/api/dpe-matcher/geocoder';
import { fetchDPECandidates } from '../src/api/dpe-matcher/ademe';
import { searchDPE } from '../src/api/dpe-matcher/matcher';
import type { PropertyQuery, ScoredDPE } from '../src/api/dpe-matcher/types';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY;

function logSearch(query: PropertyQuery, geo: { postcode: string; city: string; lat: number; lon: number; score: number }, match: { found: boolean; best: ScoredDPE | null; stats: { afterFloorFilter: number; totalFetched: number } }) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  fetch(`${SUPABASE_URL}/rest/v1/sherlock_searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
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
    }),
  }).catch(() => {});
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const json = req.body;

    if (!json.address || typeof json.address !== 'string') {
      return res.status(400).json({ error: 'Missing required field: address' });
    }
    if (json.area == null || typeof json.area !== 'number') {
      return res.status(400).json({ error: 'Missing required field: area (number)' });
    }

    const query: PropertyQuery = {
      address: json.address,
      postalCode: json.postalCode || null,
      city: json.city || null,
      area: json.area,
      floor: json.floor ?? null,
      propertyType: json.propertyType === 'HOUSE' ? 'HOUSE' : 'APARTMENT',
      publicationDate: json.publicationDate ?? null,
      fields: Array.isArray(json.fields) ? json.fields.filter((f: unknown) => typeof f === 'string') : undefined,
    };

    const geo = await geocodeAddress(query.address, query.postalCode, query.city);

    const { records: candidates, extraData } = await fetchDPECandidates(
      geo.label,
      geo.postcode,
      query.fields,
    );

    const match = searchDPE(candidates, query);

    if (extraData.size > 0) {
      const attachExtra = (dpe: ScoredDPE) => {
        const ex = extraData.get(dpe.numero_dpe);
        if (ex) dpe.extra = ex;
      };
      if (match.best) attachExtra(match.best);
      match.candidates.forEach(attachExtra);
    }

    res.status(200).json({ geocoding: geo, match });

    logSearch(query, geo, match);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
