# Plan: DPE Matcher API

## Context

The portfolio site is a static Vite + React SPA with mock API demos. The ADEME matching algorithm in Python (`match_improved.py`) identifies the best DPE (Diagnostic de Performance Energetique) certificate for a property based on address, area, floor, type, and date, using a weighted scoring system.

We'll port the algorithm to TypeScript and expose it as a real API via Vite dev server middleware, using two external services:
- **adresse.data.gouv.fr** (BAN) for geocoding French addresses
- **data.ademe.fr** Data Fair API for fetching DPE candidates

## Architecture

```
User (playground form)
  │
  ├─ POST /api/dpe-matcher  (Vite middleware)
  │     │
  │     ├── 1. Geocode address → api-adresse.data.gouv.fr/search/
  │     │     Returns: lat, lon, postcode, citycode, formatted label
  │     │
  │     ├── 2. Fetch DPE candidates → data.ademe.fr/.../lines?q=<address+postcode>&size=50
  │     │     Returns: DPE records near that address
  │     │
  │     ├── 3. Run matching algorithm (ported from Python)
  │     │     Filters: area ±3m², date < publication, floor ±5 (apartments)
  │     │     Scores: area (50%) + date (20%) + dispersion (20%) + floor (10%)
  │     │
  │     └── 4. Return best match + all candidates
  │
  └─ Renders result in APIPlayground
```

## Adaptation from the Python algorithm

The original algorithm relies on `address_id` matching (exact ID joins between listing and DPE data). Since we're querying the ADEME API on-the-fly via full-text search, the adaptation is:

- **Instead of address_id filtering**: Use the BAN geocoded address + postal code as the search query to ADEME. The ADEME API's `_score` field provides relevance ranking. We'll fetch `size=50` candidates and filter further in our scoring.
- **Area filtering**: Keep the ±3m² threshold from the original.
- **Date filtering**: Keep DPE `date_reception_dpe < publication_date`.
- **Floor filtering**: Keep ±5 floor threshold for apartments.
- **Scoring**: Port all four components exactly (area 50%, floor Gaussian 10%, date recency 20%, label dispersion 20%).
- **House penalty**: Keep the 0.9x multiplier.
- **Min score threshold**: Keep default 0.3.
- **compute_dpe**: Port as-is (worst of energy label and GHG label).

## Files to create / modify

### New files
| File | Purpose |
|---|---|
| `src/api/dpe-matcher/matcher.ts` | Ported matching algorithm (scoring functions + search pipeline) |
| `src/api/dpe-matcher/geocoder.ts` | BAN geocoder client |
| `src/api/dpe-matcher/ademe.ts` | ADEME DPE API client |
| `src/api/dpe-matcher/client.ts` | Frontend client calling POST /api/dpe-matcher |
| `src/api/dpe-matcher/types.ts` | Shared types (DPERecord, MatchResult, GeocodingResult, etc.) |
| `server/dpe-matcher.ts` | Vite middleware handler |

### Modified files
| File | Change |
|---|---|
| `vite.config.ts` | Add `server.proxy` or `configureServer` plugin for the middleware |
| `src/content/apis.ts` | Add DPE Matcher entry to `apis` array |
| `src/pages/APIDetail.tsx` | Add playground config + handler for `dpe-matcher` |

## Task details

### Task 1: TypeScript DPE matching algorithm (`src/api/dpe-matcher/matcher.ts`)

Port from `PropertySearcherDF` in `match_improved.py`:

```typescript
// Core scoring functions (pure, no dependencies)
function areaScore(dpeArea: number, queryArea: number, threshold = 6): number
function dateScore(dpeDate: string | null, pubDate: string | null, decay = 365): number
function floorScoreGaussian(dpeFloor: number | null, queryFloor: number | null, sigma = 1.0): number
function letterCount(candidates: string[]): [number, number, number]
function letterDispersionScore(freqAB: number, freqCDE: number, freqFG: number): number
function computeDpe(energyLabel: string, ghgLabel: string): string | null
function scoreMatch(record, query, candidates, options): number

// Main search pipeline
function searchDPE(candidates: DPERecord[], query: PropertyQuery): MatchResult
```

The search pipeline operates on an array of DPE records (fetched from ADEME) rather than a DataFrame.

### Task 2: ADEME and BAN API clients

**`src/api/dpe-matcher/geocoder.ts`**:
```typescript
// GET https://api-adresse.data.gouv.fr/search/?q={address}&limit=1
async function geocodeAddress(address: string): Promise<GeocodingResult>
// Returns: { label, lat, lon, postcode, citycode, city, depcode, score }
```

**`src/api/dpe-matcher/ademe.ts`**:
```typescript
// GET https://data.ademe.fr/data-fair/api/v1/datasets/dpe03existant/lines
//   ?q={address+postcode}&size=50&select=relevant_fields
async function fetchDPECandidates(address: string, postcode: string): Promise<DPERecord[]>
```

### Task 3: Vite server middleware (`server/dpe-matcher.ts`)

Register as a Vite plugin using `configureServer`:

```typescript
// vite.config.ts
import { dpeMatcher } from './server/dpe-matcher'

export default defineConfig({
  plugins: [react(), dpeMatcher()],
  ...
})
```

The middleware handles `POST /api/dpe-matcher` with JSON body:
```json
{
  "address": "25 Rue de Belfort, 11000 Carcassonne",
  "area": 46,
  "floor": 2,
  "propertyType": "APARTMENT",
  "publicationDate": "2025-01-01"
}
```

Response:
```json
{
  "geocoding": { "label": "...", "lat": 43.21, "lon": 2.35, "postcode": "11000", "city": "Carcassonne", "score": 0.92 },
  "match": {
    "found": true,
    "dpeLabel": "C",
    "energyLabel": "C",
    "ghgLabel": "A",
    "numeroDpe": "2511E0687948D",
    "dateReception": "2025-02-28",
    "area": 46,
    "floor": null,
    "matchScore": 0.72,
    "address": "25 Rue de Belfort 11000 Carcassonne"
  },
  "candidates": [ ... ],
  "stats": { "totalFetched": 50, "afterAreaFilter": 5, "afterDateFilter": 4, "afterFloorFilter": 3 }
}
```

### Task 4: Register API in content and wire playground

**`src/content/apis.ts`** — Add new entry:
- id: `dpe-matcher`
- title: "DPE Matcher"
- description: description of the matching algorithm
- endpoints: POST /api/dpe-matcher
- tags: ["energy-efficiency", "real-estate", "geocoding"]

**`src/pages/APIDetail.tsx`** — Add playground config with input fields:
- `address` (text, required): "25 Rue de Belfort, 11000 Carcassonne"
- `area` (number, required): living area in m²
- `floor` (number, optional): floor number (apartments)
- `propertyType` (select: APARTMENT / HOUSE)
- `publicationDate` (text, optional): YYYY-MM-DD reference date

### Task 5: End-to-end test

Run the dev server, navigate to /apis/dpe-matcher, enter a known address (e.g. "25 Rue de Belfort, 11000 Carcassonne", 46m², apartment), and verify the full pipeline returns a matching DPE C certificate.
