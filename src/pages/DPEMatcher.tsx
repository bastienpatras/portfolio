import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { DPESearchForm } from '@/components/dpe/DPESearchForm';
import { DPEResultCard } from '@/components/dpe/DPEResultCard';
import { GeocodingMap } from '@/components/dpe/GeocodingMap';
import { AlgorithmExplainer } from '@/components/dpe/AlgorithmExplainer';
import { DPEFieldCatalog } from '@/components/dpe/DPEFieldCatalog';
import { matchDPE } from '@/api/dpe-matcher/client';
import type { PropertyQuery, MatchResult, GeocodingResult } from '@/api/dpe-matcher/types';

export function DPEMatcher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [geocoding, setGeocoding] = useState<GeocodingResult | null>(null);

  const handleSearch = async (query: PropertyQuery) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setGeocoding(null);

    try {
      const response = await matchDPE(query);
      setGeocoding(response.geocoding);
      setResult(response.match);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Sherlock'Homes &#x1f3e0;"
      description="Find the official energy performance certificate (DPE) for any French property. Powered by ADEME open data and the BAN geocoder."
    >
      <div className="space-y-8">
        {/* Form + Result side by side */}
        <div className="grid gap-8 lg:grid-cols-2">
          <DPESearchForm onSubmit={handleSearch} loading={loading} />
          <DPEResultCard
            result={result}
            geocoding={geocoding}
            loading={loading}
            error={error}
          />
        </div>

        {/* Available fields */}
        <DPEFieldCatalog />

        {/* Map */}
        {geocoding && <GeocodingMap geocoding={geocoding} />}

        {/* Algorithm explanation */}
        <AlgorithmExplainer />
      </div>
    </PageLayout>
  );
}
