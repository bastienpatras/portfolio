import type { DPERecord, ScoredDPE, PropertyQuery, MatchResult } from './types';

function areaScore(dpeArea: number, queryArea: number, threshold = 6): number {
  return Math.max(0, Math.min(1, 1 - Math.abs(dpeArea - queryArea) / threshold));
}

function dateScore(
  dpeDateStr: string | null,
  pubDateStr: string | null,
  decayDays = 365,
): number {
  if (!dpeDateStr) return 0.7;
  if (!pubDateStr) return 1.0;

  const dpeDate = new Date(dpeDateStr);
  const pubDate = new Date(pubDateStr);
  const diffMs = pubDate.getTime() - dpeDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 0.0;
  return Math.max(0, Math.min(1, 1 - diffDays / decayDays));
}

function floorScoreGaussian(
  dpeFloor: number | null,
  queryFloor: number | null,
  sigma = 1.0,
): number {
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

export function computeDpe(energyLabel: string | null, ghgLabel: string | null): string | null {
  if (!energyLabel || !ghgLabel) return null;
  const a = energyLabel.toUpperCase();
  const b = ghgLabel.toUpperCase();
  if (a < 'A' || a > 'G' || b < 'A' || b > 'G') return null;
  return a > b ? a : b;
}

function scoreMatch(
  record: DPERecord,
  query: PropertyQuery,
  candidateLabels: (string | null)[],
  useFloor: boolean,
): number {
  const aWeight = 0.5;
  const floorWeight = 0.1;
  const dateWeight = 0.2;
  const dispersionWeight = 0.2;

  const aS = areaScore(record.surface_habitable_logement ?? 0, query.area);
  const fS = useFloor
    ? floorScoreGaussian(record.numero_etage_appartement, query.floor ?? null)
    : 0.0;
  const dS = query.publicationDate
    ? dateScore(record.date_reception_dpe, query.publicationDate)
    : 1.0;
  const [ab, cde, fg] = letterCount(candidateLabels);
  const lS = letterDispersionScore(ab, cde, fg);

  const total = aS * aWeight + fS * floorWeight + dS * dateWeight + lS * dispersionWeight;
  return Math.round(total * 1000) / 1000;
}

export function searchDPE(
  candidates: DPERecord[],
  query: PropertyQuery,
  minScoreThreshold = 0.3,
): MatchResult {
  const stats = {
    totalFetched: candidates.length,
    afterAreaFilter: 0,
    afterDateFilter: 0,
    afterFloorFilter: 0,
  };

  const areaThreshold = 3;
  const floorThreshold = 5;
  const isHouse = query.propertyType === 'HOUSE';

  // Stage 1: Area filter (±3 m²)
  let filtered = candidates.filter((r) => {
    const area = r.surface_habitable_logement;
    return area != null && Math.abs(area - query.area) <= areaThreshold;
  });
  stats.afterAreaFilter = filtered.length;

  // Stage 2: Date filter (DPE issued before publication)
  if (query.publicationDate) {
    const pubDate = new Date(query.publicationDate);
    filtered = filtered.filter((r) => {
      if (!r.date_reception_dpe) return true;
      return new Date(r.date_reception_dpe) < pubDate;
    });
  }
  stats.afterDateFilter = filtered.length;

  // Stage 3: Floor filter for apartments
  if (!isHouse && query.floor != null && filtered.length > 1) {
    const floorFiltered = filtered.filter((r) => {
      if (r.numero_etage_appartement == null) return true;
      return Math.abs(r.numero_etage_appartement - query.floor!) <= floorThreshold;
    });
    if (floorFiltered.length > 0) {
      filtered = floorFiltered;
    }
  }
  stats.afterFloorFilter = filtered.length;

  if (filtered.length === 0) {
    return { found: false, best: null, candidates: [], stats };
  }

  // Compute DPE labels for all candidates at this address (for dispersion scoring)
  const candidateLabels = filtered.map((r) => computeDpe(r.etiquette_dpe, r.etiquette_ges));

  // Score each candidate
  const scored: ScoredDPE[] = filtered.map((r) => {
    let ms = scoreMatch(r, query, candidateLabels, !isHouse);
    if (isHouse) ms *= 0.9;
    return {
      ...r,
      matchScore: ms,
      dpeLabel: computeDpe(r.etiquette_dpe, r.etiquette_ges),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  const best = scored[0];
  const found = best.matchScore >= minScoreThreshold;

  return {
    found,
    best: found ? best : null,
    candidates: scored,
    stats,
  };
}
