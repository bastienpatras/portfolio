export interface PropertyQuery {
  address: string;
  postalCode?: string | null;
  city?: string | null;
  area: number;
  floor?: number | null;
  propertyType: 'APARTMENT' | 'HOUSE';
  publicationDate?: string | null;
  fields?: string[];
}

// ─── ADEME field catalog ────────────────────────────────────────────────────

export type FieldCategory = 'Energy' | 'Building' | 'Cost' | 'Administrative';

export interface DPEFieldDef {
  key: string;
  label: string;
  description: string;
  category: FieldCategory;
  isDefault: boolean;
}

export const DPE_AVAILABLE_FIELDS: DPEFieldDef[] = [
  // ── Defaults (already returned) ──
  { key: 'etiquette_dpe', label: 'DPE label', description: 'Energy performance label (A–G)', category: 'Energy', isDefault: true },
  { key: 'etiquette_ges', label: 'GHG label', description: 'Greenhouse gas emissions label (A–G)', category: 'Energy', isDefault: true },
  { key: 'surface_habitable_logement', label: 'Living area', description: 'Habitable surface area (m²)', category: 'Building', isDefault: true },
  { key: 'adresse_ban', label: 'Address', description: 'Address from the BAN geocoder', category: 'Administrative', isDefault: true },
  { key: 'numero_dpe', label: 'Certificate ID', description: 'Unique DPE certificate number', category: 'Administrative', isDefault: true },
  { key: 'date_reception_dpe', label: 'Issue date', description: 'Date the DPE was issued', category: 'Administrative', isDefault: true },
  { key: 'type_batiment', label: 'Building type', description: 'Type of building (apartment, house, etc.)', category: 'Building', isDefault: true },
  { key: 'numero_etage_appartement', label: 'Floor', description: 'Floor number (apartments)', category: 'Building', isDefault: true },

  // ── Extended energy fields ──
  { key: 'consommation_energie', label: 'Energy consumption', description: 'Primary energy consumption (kWh/m²/year)', category: 'Energy', isDefault: false },
  { key: 'emission_ges', label: 'GHG emissions', description: 'Greenhouse gas emissions (kgCO₂/m²/year)', category: 'Energy', isDefault: false },
  { key: 'type_energie_principale_chauffage', label: 'Heating energy', description: 'Main energy source for heating (gas, electric, etc.)', category: 'Energy', isDefault: false },
  { key: 'type_energie_principale_ecs', label: 'Hot water energy', description: 'Main energy source for domestic hot water', category: 'Energy', isDefault: false },
  { key: 'type_installation_chauffage', label: 'Heating system', description: 'Type of heating installation', category: 'Energy', isDefault: false },
  { key: 'type_installation_ecs', label: 'Hot water system', description: 'Type of hot water installation', category: 'Energy', isDefault: false },
  { key: 'type_ventilation', label: 'Ventilation', description: 'Type of ventilation system', category: 'Energy', isDefault: false },

  // ── Extended building fields ──
  { key: 'annee_construction', label: 'Construction year', description: 'Year the building was constructed', category: 'Building', isDefault: false },
  { key: 'periode_construction', label: 'Construction period', description: 'Construction period range', category: 'Building', isDefault: false },
  { key: 'nombre_niveau_logement', label: 'Number of levels', description: 'Number of levels in the dwelling', category: 'Building', isDefault: false },
  { key: 'nombre_piece_principal', label: 'Number of rooms', description: 'Number of main rooms', category: 'Building', isDefault: false },
  { key: 'hauteur_sous_plafond', label: 'Ceiling height', description: 'Average ceiling height (m)', category: 'Building', isDefault: false },
  { key: 'configuration_murs_exterieurs', label: 'Wall configuration', description: 'Exterior wall configuration', category: 'Building', isDefault: false },
  { key: 'type_vitrage', label: 'Glazing type', description: 'Type of window glazing', category: 'Building', isDefault: false },

  // ── Cost fields ──
  { key: 'cout_total_5_usages', label: 'Total annual cost', description: 'Estimated total cost for 5 energy uses (€/year)', category: 'Cost', isDefault: false },
  { key: 'cout_chauffage', label: 'Heating cost', description: 'Estimated annual heating cost (€/year)', category: 'Cost', isDefault: false },
  { key: 'cout_ecs', label: 'Hot water cost', description: 'Estimated annual hot water cost (€/year)', category: 'Cost', isDefault: false },
  { key: 'cout_refroidissement', label: 'Cooling cost', description: 'Estimated annual cooling cost (€/year)', category: 'Cost', isDefault: false },
  { key: 'cout_eclairage', label: 'Lighting cost', description: 'Estimated annual lighting cost (€/year)', category: 'Cost', isDefault: false },

  // ── Administrative fields ──
  { key: 'version_dpe', label: 'DPE version', description: 'Version of the DPE methodology', category: 'Administrative', isDefault: false },
  { key: 'modele_dpe', label: 'DPE model', description: 'Calculation model used', category: 'Administrative', isDefault: false },
  { key: 'organisme_certificateur', label: 'Certifier', description: 'Certifying organization', category: 'Administrative', isDefault: false },
  { key: 'nom_diagnostiqueur', label: 'Diagnostician', description: 'Name of the diagnostician', category: 'Administrative', isDefault: false },
  { key: 'date_etablissement_dpe', label: 'Establishment date', description: 'Date the DPE was established', category: 'Administrative', isDefault: false },
];

export interface GeocodingResult {
  label: string;
  lat: number;
  lon: number;
  postcode: string;
  citycode: string;
  city: string;
  depcode: string;
  score: number;
}

export interface DPERecord {
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

export interface ScoredDPE extends DPERecord {
  matchScore: number;
  dpeLabel: string | null;
  extra?: Record<string, string | number | null>;
}

export interface MatchResult {
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

export interface DPEMatcherResponse {
  geocoding: GeocodingResult;
  match: MatchResult;
}
