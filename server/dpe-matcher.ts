import 'dotenv/config';
import type { Plugin } from 'vite';
import { geocodeAddress } from '../src/api/dpe-matcher/geocoder';
import { fetchDPECandidates } from '../src/api/dpe-matcher/ademe';
import { searchDPE } from '../src/api/dpe-matcher/matcher';
import type { PropertyQuery, ScoredDPE } from '../src/api/dpe-matcher/types';
import { logSearch } from './supabase-logger';
import { logSearchToSnowflake } from './snowflake-logger';

export function dpeMatcher(): Plugin {
  return {
    name: 'dpe-matcher-api',
    configureServer(server) {
      server.middlewares.use('/api/dpe-matcher', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = await readBody(req);
          const query = parseQuery(body);

          // 1. Geocode the address
          const geo = await geocodeAddress(query.address, query.postalCode, query.city);

          // 2. Fetch DPE candidates from ADEME
          const { records: candidates, extraData } = await fetchDPECandidates(
            geo.label,
            geo.postcode,
            query.fields,
          );

          // 3. Run matching algorithm
          const match = searchDPE(candidates, query);

          // 4. Attach extra fields if requested
          if (extraData.size > 0) {
            const attachExtra = (dpe: ScoredDPE) => {
              const ex = extraData.get(dpe.numero_dpe);
              if (ex) dpe.extra = ex;
            };
            if (match.best) attachExtra(match.best);
            match.candidates.forEach(attachExtra);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ geocoding: geo, match }));

          // Fire-and-forget: log search to Supabase + Snowflake
          logSearch(query, geo, match);
          logSearchToSnowflake(query, geo, match);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

function readBody(req: import('http').IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function parseQuery(body: string): PropertyQuery {
  const json = JSON.parse(body);
  if (!json.address || typeof json.address !== 'string') {
    throw new Error('Missing required field: address');
  }
  if (json.area == null || typeof json.area !== 'number') {
    throw new Error('Missing required field: area (number)');
  }
  return {
    address: json.address,
    postalCode: json.postalCode || null,
    city: json.city || null,
    area: json.area,
    floor: json.floor ?? null,
    propertyType: json.propertyType === 'HOUSE' ? 'HOUSE' : 'APARTMENT',
    publicationDate: json.publicationDate ?? null,
    fields: Array.isArray(json.fields) ? json.fields.filter((f: unknown) => typeof f === 'string') : undefined,
  };
}
