# Plan: Sherlock'Homes Field Catalog

## Context

The DPE Matcher (to be renamed **Sherlock'Homes 🏠**) currently queries the ADEME API with a fixed set of 11 fields. The ADEME `dpe03existant` dataset exposes many more fields (energy consumption values, construction details, heating types, costs, etc.) that users might want.

The goal is threefold:
1. **Rename** "DPE Matcher" → "Sherlock'Homes 🏠" on both pages (dedicated page + API docs)
2. **Show** a collapsible catalog of all available fields on both pages
3. **Make those fields requestable** via a new `fields` API parameter so callers can get richer data when a match is found

## What changes

### 1. Rename (user-facing text only)

All occurrences of "DPE Matcher" in rendered text become **Sherlock'Homes 🏠**. This touches:
- `Header.tsx` nav label
- `DPEMatcher.tsx` page title/headings
- `apis.ts` catalog entry (title, description)
- Any `<title>` / document title

Internal identifiers (`dpe-matcher` route, file names, variable names) stay as-is — no unnecessary churn.

### 2. Field catalog constant

A new constant `DPE_AVAILABLE_FIELDS` in `types.ts` with structure:
```ts
{ key: string; label: string; description: string; category: 'Energy' | 'Building' | 'Cost' | 'Administrative'; default: boolean }
```

This is the single source of truth for what can be requested. The current 11 fields are marked `default: true`. New fields (~15-20) are `default: false`.

### 3. API `fields` parameter

- **Request**: optional `fields?: string[]` — each value is a `key` from the catalog
- **Server**: merges requested keys into the ADEME `select` parameter, maps them into the response
- **Response**: `ScoredDPE` gains `extra?: Record<string, string | number | null>` for non-default fields
- If `fields` is omitted or empty, behavior is identical to today (backward compatible)

### 4. Collapsible UI component

A `DPEFieldCatalog` component:
- Header: "Available fields ▸" (clickable, toggles open/closed, starts closed)
- Body: fields grouped by category, each showing `key`, `label`, and `description`
- A note explaining these can be passed via the `fields` API parameter
- Placed on both the dedicated page and the API docs page

### What does NOT change
- Route paths (`/dpe-matcher`, `/apis/dpe-matcher`)
- File/folder names
- Matching algorithm logic
- Default API behavior (no `fields` param = same response as today)
