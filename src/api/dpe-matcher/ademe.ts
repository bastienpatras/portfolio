import type { DPERecord } from './types';
import { DPE_AVAILABLE_FIELDS } from './types';

const ADEME_BASE = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant';

const DEFAULT_FIELDS = [
  'etiquette_dpe',
  'etiquette_ges',
  'surface_habitable_logement',
  'code_postal_ban',
  'nom_commune_ban',
  'adresse_ban',
  'numero_dpe',
  'date_reception_dpe',
  'type_batiment',
  'numero_etage_appartement',
  '_geopoint',
];

const VALID_EXTRA_KEYS = new Set(
  DPE_AVAILABLE_FIELDS.filter((f) => !f.isDefault).map((f) => f.key),
);

export async function fetchDPECandidates(
  address: string,
  postcode: string,
  extraFields: string[] = [],
  size = 50,
): Promise<{ records: DPERecord[]; extraData: Map<string, Record<string, string | number | null>> }> {
  const validExtra = extraFields.filter((k) => VALID_EXTRA_KEYS.has(k));
  const selectFields = [...DEFAULT_FIELDS, ...validExtra].join(',');

  const query = `${address} ${postcode}`;
  const params = new URLSearchParams({
    q: query,
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
      surface_habitable_logement: r.surface_habitable_logement != null
        ? Number(r.surface_habitable_logement)
        : null,
      numero_dpe: dpeId,
      date_reception_dpe: r.date_reception_dpe as string | null,
      type_batiment: r.type_batiment as string,
      numero_etage_appartement: r.numero_etage_appartement != null
        ? Number(r.numero_etage_appartement)
        : null,
      _geopoint: r._geopoint as string | null,
      _score: Number(r._score ?? 0),
    };
  });

  return { records, extraData };
}
