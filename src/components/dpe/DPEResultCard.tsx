import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DPEBadge } from './DPEBadge';
import { ChevronDown, ChevronUp, ExternalLink, Loader2, SearchX } from 'lucide-react';
import type { MatchResult, GeocodingResult } from '@/api/dpe-matcher/types';

interface DPEResultCardProps {
  result: MatchResult | null;
  geocoding: GeocodingResult | null;
  loading: boolean;
  error: string | null;
}

export function DPEResultCard({ result, geocoding, loading, error }: DPEResultCardProps) {
  const [candidatesOpen, setCandidatesOpen] = useState(false);

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Searching DPE records...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <SearchX className="h-8 w-8 opacity-40" />
          <p className="text-sm">Enter a French address to find its DPE certificate</p>
        </div>
      </Card>
    );
  }

  if (!result.found || !result.best) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <SearchX className="mx-auto mb-3 h-8 w-8 text-muted-foreground opacity-60" />
          <p className="text-sm font-medium">No matching DPE found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {result.stats.totalFetched} records fetched, {result.stats.afterAreaFilter} matched by area
          </p>
        </CardContent>
      </Card>
    );
  }

  const best = result.best;
  const scorePercent = Math.round(best.matchScore * 100);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">DPE Match Found</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main result */}
        <div className="flex items-start gap-5">
          <DPEBadge label={best.dpeLabel!} size="lg" />
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-2xl font-bold">DPE {best.dpeLabel}</p>
              <p className="text-sm text-muted-foreground">
                Energy: {best.etiquette_dpe} / GHG: {best.etiquette_ges}
              </p>
            </div>

            {/* Score bar */}
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Match confidence</span>
                <span className="font-mono">{scorePercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Certificate</p>
            <a
              href={`https://observatoire-dpe-audit.ademe.fr/afficher-dpe/${best.numero_dpe}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            >
              {best.numero_dpe}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p>{best.date_reception_dpe ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Area</p>
            <p>{best.surface_habitable_logement ?? 'N/A'} m²</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Floor</p>
            <p>{best.numero_etage_appartement ?? 'N/A'}</p>
          </div>
        </div>

        {/* Address */}
        {geocoding && (
          <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
            <p className="text-xs text-muted-foreground">Geocoded address</p>
            <p>{geocoding.label}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{result.stats.totalFetched} fetched</span>
          <span>{result.stats.afterAreaFilter} area match</span>
          <span>{result.stats.afterDateFilter} date match</span>
          <span>{result.stats.afterFloorFilter} floor match</span>
        </div>

        {/* Collapsible candidates */}
        {result.candidates.length > 1 && (
          <div className="border-t pt-3">
            <button
              onClick={() => setCandidatesOpen(!candidatesOpen)}
              className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{result.candidates.length} candidates found</span>
              {candidatesOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {candidatesOpen && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-3">DPE</th>
                      <th className="pb-2 pr-3">Certificate</th>
                      <th className="pb-2 pr-3">Address</th>
                      <th className="pb-2 pr-3">Area</th>
                      <th className="pb-2 pr-3">Floor</th>
                      <th className="pb-2">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {result.candidates.map((c, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-3">
                          <DPEBadge label={c.dpeLabel ?? '?'} size="sm" />
                        </td>
                        <td className="py-2 pr-3">
                          <a
                            href={`https://observatoire-dpe-audit.ademe.fr/afficher-dpe/${c.numero_dpe}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
                          >
                            {c.numero_dpe}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </td>
                        <td className="py-2 pr-3 max-w-[200px] truncate">{c.adresse_ban}</td>
                        <td className="py-2 pr-3">{c.surface_habitable_logement ?? '-'}</td>
                        <td className="py-2 pr-3">{c.numero_etage_appartement ?? '-'}</td>
                        <td className="py-2 font-mono">{Math.round(c.matchScore * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
