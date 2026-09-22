import type { PropertyQuery, DPEMatcherResponse } from './types';

export async function matchDPE(query: PropertyQuery): Promise<DPEMatcherResponse> {
  const res = await fetch('/api/dpe-matcher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}
