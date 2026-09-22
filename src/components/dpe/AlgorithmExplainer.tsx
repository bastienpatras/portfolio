import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const WEIGHTS = [
  { label: 'Area similarity', weight: 50, description: 'Penalizes area differences (threshold: 6 m\u00b2)' },
  { label: 'Date recency', weight: 20, description: 'Prefers recently issued DPE certificates' },
  { label: 'Label dispersion', weight: 20, description: 'Rewards diverse label distribution among candidates' },
  { label: 'Floor proximity', weight: 10, description: 'Gaussian penalty for floor mismatches (apartments)' },
];

const STEPS = [
  { num: '1', title: 'Geocode', description: 'Address resolved via BAN API' },
  { num: '2', title: 'Fetch', description: 'DPE candidates from ADEME' },
  { num: '3', title: 'Filter', description: 'Area, date, floor thresholds' },
  { num: '4', title: 'Score', description: 'Weighted composite ranking' },
];

export function AlgorithmExplainer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How the Matching Algorithm Works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {step.num}
              </div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="absolute right-0 top-3 hidden h-4 w-4 text-muted-foreground md:block -mr-3.5" />
              )}
            </div>
          ))}
        </div>

        <div className="border-t pt-5" />

        {/* Scoring weights */}
        <div>
          <p className="mb-3 text-sm font-medium">Scoring weights</p>
          <div className="space-y-3">
            {WEIGHTS.map((w) => (
              <div key={w.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{w.label}</span>
                  <span className="font-mono text-muted-foreground">{w.weight}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all"
                    style={{ width: `${w.weight}%` }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{w.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional notes */}
        <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
          <p>Houses receive a 0.9x penalty. Minimum score threshold: 0.3.</p>
          <p>The final DPE label is the worse of the energy and GHG emission labels.</p>
          <Link
            to="/apis/dpe-matcher"
            className="mt-2 inline-flex items-center gap-1 text-primary hover:underline"
          >
            View full API documentation
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
