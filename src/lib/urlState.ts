import type { SearchFilters } from '@/types';

export function serializeFilters(filters: Partial<SearchFilters>): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set('q', filters.query);
  }

  if (filters.years && filters.years.length > 0) {
    params.set('years', filters.years.join(','));
  }

  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }

  if (filters.status && filters.status.length > 0) {
    params.set('status', filters.status.join(','));
  }

  if (filters.authors && filters.authors.length > 0) {
    params.set('authors', filters.authors.join(','));
  }

  if (filters.artifactTypes && filters.artifactTypes.length > 0) {
    params.set('artifacts', filters.artifactTypes.join(','));
  }

  return params;
}

export function deserializeFilters(params: URLSearchParams): Partial<SearchFilters> {
  const filters: Partial<SearchFilters> = {};

  const query = params.get('q');
  if (query) {
    filters.query = query;
  }

  const years = params.get('years');
  if (years) {
    filters.years = years.split(',').map(Number).filter(Boolean);
  }

  const tags = params.get('tags');
  if (tags) {
    filters.tags = tags.split(',').filter(Boolean);
  }

  const status = params.get('status');
  if (status) {
    filters.status = status.split(',') as SearchFilters['status'];
  }

  const authors = params.get('authors');
  if (authors) {
    filters.authors = authors.split(',').filter(Boolean);
  }

  const artifacts = params.get('artifacts');
  if (artifacts) {
    filters.artifactTypes = artifacts.split(',') as SearchFilters['artifactTypes'];
  }

  return filters;
}
