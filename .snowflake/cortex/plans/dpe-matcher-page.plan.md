# Plan: DPE Matcher Dedicated Page

## Design Decisions

- **Standalone tool page** at `/dpe-matcher` — focused on the user experience, not API docs
- **Clean summary card** for results: colored DPE badge (A=green...G=red), certificate number, date, area, match score, collapsible candidates
- **Interactive Leaflet map** showing the geocoded address
- **Algorithm explanation section** with visual scoring weight breakdown
- **Top-level nav item** in the Header

The existing `/apis/dpe-matcher` API docs page stays untouched. The new page links to it for technical documentation.

## Page Layout (top to bottom)

```
┌──────────────────────────────────────────────┐
│ Header: ... DPE Matcher  Research  Pubs ...  │
├──────────────────────────────────────────────┤
│                                              │
│  DPE Matcher                                 │
│  Find the energy performance certificate     │
│  for any French property                     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────┐  ┌──────────────────┐   │
│  │ INPUT FORM      │  │ RESULT CARD      │   │
│  │                 │  │                  │   │
│  │ Address  [____] │  │  ┌──┐            │   │
│  │ Area m²  [____] │  │  │C │  DPE C     │   │
│  │ Floor    [____] │  │  └──┘            │   │
│  │ Type  [v APART] │  │  Score: 0.878    │   │
│  │ Date   [______] │  │  Cert: 2511E...  │   │
│  │                 │  │  Date: 2025-02   │   │
│  │ [  Search DPE ] │  │  Area: 46 m²     │   │
│  └─────────────────┘  │                  │   │
│                       │  ▸ 4 candidates  │   │
│                       └──────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │ GEOCODING RESULT + MAP               │   │
│  │  📍 25 Rue de Belfort 11000 Carcas.  │   │
│  │  ┌──────────────────────────────┐    │   │
│  │  │                              │    │   │
│  │  │     [Leaflet OSM map]        │    │   │
│  │  │         📌                    │    │   │
│  │  │                              │    │   │
│  │  └──────────────────────────────┘    │   │
│  └───────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│  How the Matching Algorithm Works            │
│                                              │
│  ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────┐  │
│  │Area 50% │ │Date 20%│ │Disp 20%│ │Fl 10│  │
│  │█████████│ │████    │ │████    │ │██   │  │
│  └─────────┘ └────────┘ └────────┘ └─────┘  │
│                                              │
│  1. Geocode → 2. Fetch → 3. Filter → 4.Score│
│                                              │
│  → View full API documentation               │
│                                              │
├──────────────────────────────────────────────┤
│ Footer                                       │
└──────────────────────────────────────────────┘
```

## File changes

### New files

| File | Purpose |
|---|---|
| `src/pages/DPEMatcher.tsx` | Main page component with form, results, map, and algorithm section |
| `src/components/dpe/DPEBadge.tsx` | Colored DPE letter badge (A-G with energy-class colors) |
| `src/components/dpe/DPEResultCard.tsx` | Clean summary card: badge + metadata + collapsible candidates |
| `src/components/dpe/GeocodingMap.tsx` | Leaflet map showing the geocoded pin |
| `src/components/dpe/AlgorithmExplainer.tsx` | Scoring weights visualization + pipeline steps |
| `src/components/dpe/DPESearchForm.tsx` | Dedicated form (not the generic APIPlayground) |

### Modified files

| File | Change |
|---|---|
| `src/App.tsx` | Add route `/dpe-matcher` → `DPEMatcher` |
| `src/components/layout/Header.tsx` | Add "DPE Matcher" to `navItems` |

### New dependency

| Package | Purpose |
|---|---|
| `react-leaflet` + `leaflet` | Interactive map component |

## Component details

### DPEBadge
A colored letter in a rounded box, sized by prop. Color scale:
- A: `#319834` (dark green), B: `#33cc31` (green), C: `#cbfc34` (yellow-green)
- D: `#fbeb09` (yellow), E: `#fccc04` (orange-yellow), F: `#fc9935` (orange), G: `#fc1912` (red)

Uses the official French DPE color scheme.

### DPEResultCard
- Shows `DPEBadge` prominently on the left
- Right side: DPE label text, match score as a subtle progress bar, certificate number, date, area
- Collapsible "X candidates found" section at the bottom — simple table: address, DPE letter (mini badge), area, floor, score
- States: idle (empty), loading (spinner), result, no-match (muted message)

### GeocodingMap
- Leaflet map with OSM tiles, centered on the geocoded lat/lon
- Single marker pin with a popup showing the formatted address
- Height: ~300px, rounded corners to match Card styling
- Shows below the result card, with a small address summary above

### AlgorithmExplainer
- 4 horizontal bars showing the weight of each scoring component (area 50%, date 20%, dispersion 20%, floor 10%)
- Each bar uses a themed color (primary variants)
- Below: a 4-step pipeline diagram (Geocode → Fetch DPE → Filter → Score & Rank)
- Brief text explanation of each component
- Link to `/apis/dpe-matcher` for full API documentation

### DPESearchForm
- Dedicated form (not the generic APIPlayground) with better UX:
  - Address input (full width, prominent)
  - Area input with "m²" suffix
  - Floor input (shown only when type is APARTMENT)
  - Property type toggle (APARTMENT / HOUSE) — styled as segmented control or radio group
  - Optional publication date
  - Submit button with loading state
- Calls the existing `matchDPE()` client function

### DPEMatcher page
- Uses `PageLayout` with title "DPE Matcher" and description
- Two-column layout on desktop (`grid lg:grid-cols-2 gap-8`): form on left, result on right
- Map section below (full width)
- Algorithm explainer section below the map
- Manages state: form inputs, loading, result, error
