# Plan: Vercel Deployment

## Context

The portfolio is a Vite + React SPA with one server-side endpoint (`POST /api/dpe-matcher`) implemented as a Vite dev middleware plugin. For production on Vercel:
- The static SPA is built by `vite build` and served from the CDN (works out of the box)
- The API endpoint needs to become a **Vercel Serverless Function** at `api/dpe-matcher.ts`
- The Snowflake logger (`snowflake-sdk`) uses native bindings that are too heavy for serverless -- Supabase-only logging in production

## What changes

### 1. Create `api/dpe-matcher.ts` (Vercel serverless function)

This file re-uses the existing logic from `src/api/dpe-matcher/` (geocoder, ademe, matcher, types) and the Supabase logger. It exports a default handler with the Vercel `VercelRequest`/`VercelResponse` signature.

The core logic is identical to `server/dpe-matcher.ts` but adapted from Node `IncomingMessage` to Vercel's pre-parsed `req.body`. No `dotenv` needed -- Vercel injects env vars directly into `process.env`.

Snowflake logging is skipped in the serverless function (the `snowflake-sdk` is not serverless-friendly due to native deps and persistent connections). Supabase logging remains.

### 2. Create `vercel.json`

Minimal config:
- `rewrites`: route `/api/dpe-matcher` to the serverless function, and all other routes to `index.html` (SPA fallback)
- `buildCommand` / `outputDirectory` already match Vite defaults (`dist`)

### 3. Update `.gitignore`

Add `.vercel/` directory (Vercel CLI local state).

### 4. What stays the same

- `server/dpe-matcher.ts` -- still used for local dev (`npm run dev`)
- All `src/` code -- unchanged
- `vite.config.ts` -- unchanged (the `dpeMatcher()` plugin only activates in dev via `configureServer`)
- Build command (`vite build`) -- unchanged

## After implementation

1. Push to GitHub (or create a repo if not already)
2. Go to [vercel.com](https://vercel.com), import the repo
3. In project settings, add environment variables: `SUPABASE_URL` and `SUPABASE_SECRET_KEY`
4. Deploy -- Vercel auto-detects Vite and builds

## Critical files

- `api/dpe-matcher.ts` -- New serverless function (core deliverable)
- `vercel.json` -- Deployment config with SPA rewrites
- `server/dpe-matcher.ts` -- Reference for the logic being ported (unchanged)
- `src/api/dpe-matcher/` -- Shared modules used by both dev and prod
