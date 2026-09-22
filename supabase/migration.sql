-- Run this in the Supabase SQL Editor to create the search logging table.

create table if not exists sherlock_searches (
  id             uuid             primary key default gen_random_uuid(),
  created_at     timestamptz      not null    default now(),

  -- Search inputs
  address        text             not null,
  postal_code    text,
  city           text,
  area           real             not null,
  floor          smallint,
  property_type  text             not null,
  publication_date date,

  -- Geocoding result
  geo_lat        double precision,
  geo_lon        double precision,
  geo_score      real,

  -- Match result
  match_found    boolean          not null,
  best_dpe_label char(1),
  best_score     real,
  best_numero_dpe text,
  candidate_count smallint        not null default 0,
  total_fetched  smallint         not null default 0
);

-- Index for querying by date
create index if not exists idx_sherlock_searches_created
  on sherlock_searches (created_at desc);


-- ============================================================
-- Snowflake equivalent (run in Snowsight with a role that has
-- CREATE TABLE on PLAYGROUND.BPATRAS, e.g. SNF_R_DATA_ANALYST)
-- ============================================================

-- USE ROLE SNF_R_DATA_ANALYST;

CREATE TABLE IF NOT EXISTS PLAYGROUND.BPATRAS.SHERLOCK_SEARCHES (
  ID              STRING        DEFAULT UUID_STRING(),
  CREATED_AT      TIMESTAMP_TZ  DEFAULT CURRENT_TIMESTAMP(),
  ADDRESS         STRING        NOT NULL,
  POSTAL_CODE     STRING,
  CITY            STRING,
  AREA            FLOAT         NOT NULL,
  FLOOR           INT,
  PROPERTY_TYPE   STRING        NOT NULL,
  PUBLICATION_DATE DATE,
  GEO_LAT         FLOAT,
  GEO_LON         FLOAT,
  GEO_SCORE       FLOAT,
  MATCH_FOUND     BOOLEAN       NOT NULL,
  BEST_DPE_LABEL  STRING(1),
  BEST_SCORE      FLOAT,
  BEST_NUMERO_DPE STRING,
  CANDIDATE_COUNT INT           DEFAULT 0,
  TOTAL_FETCHED   INT           DEFAULT 0
);
