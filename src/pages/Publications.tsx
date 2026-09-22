import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { FilterPanel } from '@/components/search/FilterPanel';
import { publications } from '@/content/publications';
import { createSearchableItem, filterSearchableItems, getAllTags, getAllAuthors } from '@/lib/search';
import { getYearRange } from '@/lib/utils';
import { useSearchStore } from '@/stores/searchStore';
import { deserializeFilters, serializeFilters } from '@/lib/urlState';

export function Publications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useSearchStore();

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters = deserializeFilters(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = serializeFilters(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const searchableItems = useMemo(
    () => publications.map((p) => createSearchableItem(p, 'publication')),
    []
  );

  const filteredItems = useMemo(
    () => filterSearchableItems(searchableItems, filters),
    [searchableItems, filters]
  );

  const filteredPublications = useMemo(
    () =>
      publications.filter((pub) =>
        filteredItems.some((item) => item.id === pub.id)
      ),
    [filteredItems]
  );

  const availableYears = useMemo(
    () => getYearRange(publications),
    []
  );

  const availableTags = useMemo(
    () => getAllTags(searchableItems),
    [searchableItems]
  );

  const availableAuthors = useMemo(
    () => getAllAuthors(searchableItems),
    [searchableItems]
  );

  return (
    <PageLayout
      title="Publications"
      description="Research papers, working papers, and preprints"
    >
      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterPanel
            availableYears={availableYears}
            availableTags={availableTags}
            availableAuthors={availableAuthors}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredPublications.length} of {publications.length}{' '}
            publications
          </div>

          <div className="space-y-6">
            {filteredPublications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No publications match your filters.
                </p>
              </div>
            ) : (
              filteredPublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
