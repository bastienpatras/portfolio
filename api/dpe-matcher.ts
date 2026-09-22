import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyQuery {
  address: string;
  postalCode?: string | null;
  city?: string | null;
  area: number;
  floor?: number | null;
  propertyType: 'APARTMENT' | 'HOUSE';
  publicationDate?: string | null;
  fields?: string[];
}

interface GeocodingResult {
  label: string;
  lat: number;
  lon: number;
  postcode: string;
  citycode: string;
  city: string;
  depcode: string;
  score: number;
}

interface DPERecord {
  adresse_ban: string;
  etiquette_dpe: string;
  etiquette_ges: string;
  surface_habitable_logement: number | null;
  numero_dpe: string;
  date_reception_dpe: string | null;
  type_batiment: string;
  numero_etage_appartement: number | null;
  _geopoint: string | null;
  _score: number;
}

interface ScoredDPE extends DPERecord {
  matchScore: number;
  dpeLabel: string | null;
  extra?: Record<string, string | number | null>;
}

interface MatchResult {
  found: boolean;
  best: ScoredDPE | null;
  candidates: ScoredDPE[];
  stats: {
    totalFetched: number;
    afterAreaFilter: number;
    afterDateFilter: number;
    afterFloorFilter: number;
  };
}

// ─── Field catalog (non-default keys for validation) ──────────────────────────

const VALID_EXTRA_KEYS = new Set([
  'consommation_energie', 'emission_ges', 'type_energie_principale_chauffage',
  'type_energie_principale_ecs', 'type_installation_chauffage', 'type_installation_ecs',
  'type_ventilation', 'annee_construction', 'periode_construction',
  'nombre_niveau_logement', 'nombre_piece_principal', 'hauteur_sous_plafond',
  'configuration_murs_exterieurs', 'type_vitrage', 'cout_total_5_usages',
  'cout_chauffage', 'cout_ecs', 'cout_refroidissement', 'cout_eclairage',
  'version_dpe', 'modele_dpe', 'organisme_certificateur', 'nom_diagnostiqueur',
  'date_etablissement_dpe',
]);

// ─── Geocoder (BAN) ───────────────────────────────────────────────────────────

const BAN_BASE = 'https://api-adresse.data.gouv.fr';

function extractGeoResult(feature: Record<string, unknown>): GeocodingResult {
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

async function geocodeAddress(
  address: string,
  postcode?: string | null,
  city?: string | null,
): Promise<GeocodingResult> {
  const fullQuery = [address, city].filter(Boolean).join(', ');
  const params = new URLSearchParams({ q: fullQuery, limit: '1', type: 'housenumber' });
  if (postcode) params.set('postcode', postcode);

  const res = await fetch(`${BAN_BASE}/search/?${params}`);
  if (!res.ok) throw new Error(`BAN geocoder error: ${res.status}`);
  const data = await res.json();

  if (!data.features || data.features.length === 0) {
    params.delete('type');
    const res2 = await fetch(`${BAN_BASE}/search/?${params}`);
    if (!res2.ok) throw new Error(`BAN geocoder error: ${res2.status}`);
    const data2 = await res2.json();
    if (!data2.features || data2.features.length === 0) {
      throw new Error('Address not found by BAN geocoder');
    }
    return extractGeoResult(data2.features[0]);
  }
  return extractGeoResult(data.features[0]);
}

// ─── ADEME API ────────────────────────────────────────────────────────────────

const ADEME_BASE = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant';

const DEFAULT_FIELDS = [
  'etiquette_dpe', 'etiquette_ges', 'surface_habitable_logement',
  'code_postal_ban', 'nom_commune_ban', 'adresse_ban', 'numero_dpe',
  'date_reception_dpe', 'type_batiment', 'numero_etage_appartement', '_geopoint',
];

async function fetchDPECandidates(
  address: string,
  postcode: string,
  extraFields: string[] = [],
  size = 50,
): Promise<{ records: DPERecord[]; extraData: Map<string, Record<string, string | number | null>> }> {
  const validExtra = extraFields.filter((k) => VALID_EXTRA_KEYS.has(k));
  const selectFields = [...DEFAULT_FIELDS, ...validExtra].join(',');

  const params = new URLSearchParams({
    q: `${address} ${postcode}`,
    size: String(size),
    select: selectFields,
  });

  const res = await fetch(`${ADEME_BASE}/lines?${params}`);
  if (!res.ok) throw new Error(`ADEME API error: ${res.status}`);
  const data = await res.json();

  const extraData = new Map<string, Record<string, string | number | null>>();

  const records = (data.results ?? []).map((r: Record<string, unknown>) => {
    const dpeId = r.numero_dpe as string;
    if (validExtra.length > 0) {
      const extra: Record<string, string | number | null> = {};
      for (const key of validExtra) {
        const v = r[key];
        extra[key] = v != null ? (typeof v === 'number' ? v : String(v)) : null;
      }
      extraData.set(dpeId, extra);
    }
    return {
      adresse_ban: r.adresse_ban as string,
      etiquette_dpe: r.etiquette_dpe as string,
      etiquette_ges: r.etiquette_ges as string,
      surface_habitable_logement: r.surface_habitable_logement != null ? Number(r.surface_habitable_logement) : null,
      numero_dpe: dpeId,
      date_reception_dpe: r.date_reception_dpe as string | null,
      type_batiment: r.type_batiment as string,
      numero_etage_appartement: r.numero_etage_appartement != null ? Number(r.numero_etage_appartement) : null,
      _geopoint: r._geopoint as string | null,
      _score: Number(r._score ?? 0),
    };
  });

  return { records, extraData };
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

function areaScore(dpeArea: number, queryArea: number, threshold = 6): number {
  return Math.max(0, Math.min(1, 1 - Math.abs(dpeArea - queryArea) / threshold));
}

function dateScore(dpeDateStr: string | null, pubDateStr: string | null, decayDays = 365): number {
  if (!dpeDateStr) return 0.7;
  if (!pubDateStr) return 1.0;
  const diffMs = new Date(pubDateStr).getTime() - new Date(dpeDateStr).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 0.0;
  return Math.max(0, Math.min(1, 1 - diffDays / decayDays));
}

function floorScoreGaussian(dpeFloor: number | null, queryFloor: number | null, sigma = 1.0): number {
  if (dpeFloor == null || queryFloor == null) return 0.0;
  const diff = dpeFloor - queryFloor;
  return Math.max(0, Math.min(1, Math.exp(-0.5 * (diff / sigma) ** 2)));
}

function letterCount(candidates: (string | null)[]): [number, number, number] {
  const valid = candidates.filter((c): c is string => c != null);
  if (valid.length === 0) return [0, 0, 0];
  const n = valid.length;
  const ab = valid.filter((c) => 'AB'.includes(c)).length / n;
  const cde = valid.filter((c) => 'CDE'.includes(c)).length / n;
  const fg = valid.filter((c) => 'FG'.includes(c)).length / n;
  return [Math.round(ab * 100) / 100, Math.round(cde * 100) / 100, Math.round(fg * 100) / 100];
}

function letterDispersionScore(freqAB: number, freqCDE: number, freqFG: number): number {
  const sAB = Math.max(freqAB - 1 / 3, 0);
  const sCDE = Math.max(freqCDE - 1 / 3, 0);
  const sFG = Math.max(freqFG - 1 / 3, 0);
  return (sAB + sCDE + sFG) * 3 / 2;
}

function computeDpe(energyLabel: string | null, ghgLabel: string | null): string | null {
  if (!energyLabel || !ghgLabel) return null;
  const a = energyLabel.toUpperCase();
  const b = ghgLabel.toUpperCase();
  if (a < 'A' || a > 'G' || b < 'A' || b > 'G') return null;
  return a > b ? a : b;
}

function scoreMatch(record: DPERecord, query: PropertyQuery, candidateLabels: (string | null)[], useFloor: boolean): number {
  const aS = areaScore(record.surface_habitable_logement ?? 0, query.area);
  const fS = useFloor ? floorScoreGaussian(record.numero_etage_appartement, query.floor ?? null) : 0.0;
  const dS = query.publicationDate ? dateScore(record.date_reception_dpe, query.publicationDate) : 1.0;
  const [ab, cde, fg] = letterCount(candidateLabels);
  const lS = letterDispersionScore(ab, cde, fg);
  return Math.round((aS * 0.5 + fS * 0.1 + dS * 0.2 + lS * 0.2) * 1000) / 1000;
}

function searchDPE(candidates: DPERecord[], query: PropertyQuery, minScoreThreshold = 0.3): MatchResult {
  const stats = { totalFetched: candidates.length, afterAreaFilter: 0, afterDateFilter: 0, afterFloorFilter: 0 };
  const isHouse = query.propertyType === 'HOUSE';

  let filtered = candidates.filter((r) => {
    const area = r.surface_habitable_logement;
    return area != null && Math.abs(area - query.area) <= 3;
  });
  stats.afterAreaFilter = filtered.length;

  if (query.publicationDate) {
    const pubDate = new Date(query.publicationDate);
    filtered = filtered.filter((r) => !r.date_reception_dpe || new Date(r.date_reception_dpe) < pubDate);
  }
  stats.afterDateFilter = filtered.length;

  if (!isHouse && query.floor != null && filtered.length > 1) {
    const ff = filtered.filter((r) => r.numero_etage_appartement == null || Math.abs(r.numero_etage_appartement - query.floor!) <= 5);
    if (ff.length > 0) filtered = ff;
  }
  stats.afterFloorFilter = filtered.length;

  if (filtered.length === 0) return { found: false, best: null, candidates: [], stats };

  const candidateLabels = filtered.map((r) => computeDpe(r.etiquette_dpe, r.etiquette_ges));
  const scored: ScoredDPE[] = filtered.map((r) => {
    let ms = scoreMatch(r, query, candidateLabels, !isHouse);
    if (isHouse) ms *= 0.9;
    return { ...r, matchScore: ms, dpeLabel: computeDpe(r.etiquette_dpe, r.etiquette_ges) };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const best = scored[0];
  const found = best.matchScore >= minScoreThreshold;
  return { found, best: found ? best : null, candidates: scored, stats };
}

// ─── Supabase logging ─────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY;

function logSearch(
  query: PropertyQuery,
  geo: { postcode: string; city: string; lat: number; lon: number; score: number },
  match: { found: boolean; best: ScoredDPE | null; stats: { afterFloorFilter: number; totalFetched: number } },
) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  fetch(`${SUPABASE_URL}/rest/v1/sherlock_searches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Prefer: 'return=minimal' },
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

// ─── Handler ──────────────────────────────────────────────────────────────────

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
    const { records: candidates, extraData } = await fetchDPECandidates(geo.label, geo.postcode, query.fields);
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
