import snowflake from 'snowflake-sdk';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { PropertyQuery, MatchResult, GeocodingResult } from '../src/api/dpe-matcher/types';

let connection: snowflake.Connection | null = null;
let connecting = false;

function loadPrivateKey(): string | null {
  const keyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH
    || resolve(process.cwd(), '.snowflake-keys', 'rsa_key.p8');
  try {
    return readFileSync(keyPath, 'utf-8');
  } catch {
    return null;
  }
}

function getConnection(): snowflake.Connection | null {
  const account = process.env.SNOWFLAKE_ACCOUNT;
  const username = process.env.SNOWFLAKE_USER;

  if (!account || !username) return null;
  if (connection) return connection;
  if (connecting) return null;

  const privateKey = loadPrivateKey();
  if (!privateKey) return null;

  connecting = true;
  const conn = snowflake.createConnection({
    account,
    username,
    authenticator: 'SNOWFLAKE_JWT',
    privateKey,
    role: process.env.SNOWFLAKE_ROLE || 'SNF_R_DATA_ANALYST',
    database: 'PLAYGROUND',
    schema: 'BPATRAS',
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'WH_PROD_PERSONA',
  });

  conn.connect((err) => {
    connecting = false;
    if (err) {
      connection = null;
    } else {
      connection = conn;
    }
  });

  return null;
}

export function logSearchToSnowflake(
  query: PropertyQuery,
  geo: GeocodingResult,
  match: MatchResult,
): void {
  const conn = getConnection();
  if (!conn) return;

  const sql = `
    INSERT INTO PLAYGROUND.BPATRAS.SHERLOCK_SEARCHES
      (ADDRESS, POSTAL_CODE, CITY, AREA, FLOOR, PROPERTY_TYPE, PUBLICATION_DATE,
       GEO_LAT, GEO_LON, GEO_SCORE,
       MATCH_FOUND, BEST_DPE_LABEL, BEST_SCORE, BEST_NUMERO_DPE,
       CANDIDATE_COUNT, TOTAL_FETCHED)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const binds = [
    query.address,
    query.postalCode ?? geo.postcode,
    query.city ?? geo.city,
    query.area,
    query.floor ?? null,
    query.propertyType,
    query.publicationDate ?? null,
    geo.lat,
    geo.lon,
    geo.score,
    match.found,
    match.best?.dpeLabel ?? null,
    match.best?.matchScore ?? null,
    match.best?.numero_dpe ?? null,
    match.stats.afterFloorFilter,
    match.stats.totalFetched,
  ];

  conn.execute({
    sqlText: sql,
    binds: binds as snowflake.Binds,
    complete: () => {
      // Silent — logging must never break the API
    },
  });
}
