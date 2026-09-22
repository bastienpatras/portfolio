# Plan: Supabase Search Logging

## Context

Every time someone uses Sherlock'Homes, we want to persist the search inputs and match results to a Supabase Postgres database. This is silent server-side telemetry — no UI changes.

## Database schema

One table `sherlock_searches`:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (default `gen_random_uuid()`) | PK |
| `created_at` | `timestamptz` (default `now()`) | |
| `address` | `text` | Input address |
| `postal_code` | `text` | Geocoded or input |
| `city` | `text` | Geocoded city |
| `area` | `real` | Input area (m²) |
| `floor` | `smallint` | Input floor (nullable) |
| `property_type` | `text` | APARTMENT or HOUSE |
| `publication_date` | `date` | Reference date (nullable) |
| `geo_lat` | `double precision` | Geocoded latitude |
| `geo_lon` | `double precision` | Geocoded longitude |
| `geo_score` | `real` | BAN geocoding confidence |
| `match_found` | `boolean` | Whether a match was found |
| `best_dpe_label` | `char(1)` | Best match DPE label (nullable) |
| `best_score` | `real` | Match confidence 0–1 (nullable) |
| `best_numero_dpe` | `text` | Certificate ID (nullable) |
| `candidate_count` | `smallint` | Number of candidates after filtering |
| `total_fetched` | `smallint` | Raw ADEME results count |

## Architecture

```
User → POST /api/dpe-matcher → server middleware
  1. Geocode + Fetch + Match (existing flow)
  2. Return response to user immediately
  3. Fire-and-forget: INSERT into Supabase via REST API (no driver needed)
```

We use the **Supabase REST API** (PostgREST) with the service role key — no npm dependency needed. A single `fetch()` POST to `https://<project>.supabase.co/rest/v1/sherlock_searches` with the `apikey` and `Authorization` headers. This runs after `res.end()` so it doesn't slow down the response.

## Environment variable

One env var: `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (service role key for server-side inserts). Stored in a `.env` file (gitignored).

## What changes

| File | Change |
|---|---|
| `server/supabase-logger.ts` | **New** — `logSearch()` function: builds the row object, POSTs to Supabase REST API, catches errors silently |
| `server/dpe-matcher.ts` | After `res.end()`, call `logSearch(query, geo, match)` fire-and-forget (no await) |
| `.env` | Add `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` |
| `.env.example` | Document the two variables |
| `.gitignore` | Ensure `.env` is listed |

## What you need to do on Supabase (manual)

1. Create a free Supabase project at supabase.com
2. Run the CREATE TABLE SQL (I'll generate it)
3. Copy the project URL and service role key into `.env`

## What does NOT change

- No new npm dependencies
- No UI changes (silent logging)
- No impact on response latency (fire-and-forget)
- Existing behavior is identical even if Supabase is unreachable (errors are swallowed)
