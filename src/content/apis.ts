import type { APIDemo } from '@/types';

export const apis: APIDemo[] = [
  {
    id: 'dpe-matcher',
    title: "Sherlock'Homes \ud83c\udfe0 API",
    description:
      'Matches a French property to its official energy performance certificate (DPE) from the ADEME database. Geocodes the address via the BAN API, fetches DPE candidates from the ADEME open data, and applies a weighted scoring algorithm (area, floor, date recency, label dispersion) to identify the best match.',
    tags: ['energy-efficiency', 'real-estate', 'geocoding', 'france'],
    limitations: [
      'Coverage limited to mainland France and overseas departments',
      'Depends on ADEME open data availability (15M+ records)',
      'Address must be precise enough for BAN geocoding',
      'Area matching tolerance: ±3 m²',
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/dpe-matcher',
        description: 'Find the best DPE match for a property',
        parameters: [
          {
            name: 'address',
            type: 'string',
            required: true,
            description: 'Full French address (e.g. "25 Rue de Belfort, 11000 Carcassonne")',
          },
          {
            name: 'area',
            type: 'number',
            required: true,
            description: 'Living area in m²',
          },
          {
            name: 'floor',
            type: 'number',
            required: false,
            description: 'Floor number (apartments only)',
          },
          {
            name: 'propertyType',
            type: 'string',
            required: false,
            description: 'APARTMENT or HOUSE',
            default: 'APARTMENT',
          },
          {
            name: 'publicationDate',
            type: 'string',
            required: false,
            description: 'Reference date (YYYY-MM-DD) — DPEs issued after this date are excluded',
          },
          {
            name: 'fields',
            type: 'string[]',
            required: false,
            description: 'Additional ADEME fields to include in the response (see Available Fields below)',
          },
        ],
        response:
          '{"geocoding": {"label": "...", "lat": 43.21, ...}, "match": {"found": true, "best": {"dpeLabel": "C", ...}, "candidates": [...], "stats": {...}}}',
      },
    ],
    examples: [
      {
        language: 'curl',
        description: 'Match a Carcassonne apartment',
        code: `curl -X POST http://localhost:5173/api/dpe-matcher \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "25 Rue de Belfort, 11000 Carcassonne",
    "area": 46,
    "floor": 2,
    "propertyType": "APARTMENT"
  }'`,
      },
      {
        language: 'python',
        description: 'Using requests library',
        code: `import requests

response = requests.post(
    "http://localhost:5173/api/dpe-matcher",
    json={
        "address": "178 Rue de Rivoli, 75001 Paris",
        "area": 65,
        "propertyType": "APARTMENT",
        "publicationDate": "2025-01-01"
    }
)
result = response.json()
if result["match"]["found"]:
    best = result["match"]["best"]
    print(f"DPE: {best['dpeLabel']} (score: {best['matchScore']})")
    print(f"Certificate: {best['numero_dpe']}")`,
      },
    ],
    securityNotes: [
      'No authentication required — demo endpoint',
      'Queries are proxied to public APIs (BAN + ADEME) and not logged',
      'No personal data is stored',
    ],
    rateLimit: 'Subject to BAN and ADEME API rate limits',
    lastUpdated: '2025-06-01',
  },
];

