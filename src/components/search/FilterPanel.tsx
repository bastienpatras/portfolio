import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { useSearchStore } from '@/stores/searchStore';
import type { PublicationStatus } from '@/types';

interface FilterPanelProps {
  availableYears: number[];
  availableTags: string[];
  availableAuthors: string[];
}

export function FilterPanel({
  availableYears,
  availableTags,
  availableAuthors,
}: FilterPanelProps) {
  const { filters, updateFilter, clearFilters } = useSearchStore();

  const toggleYear = (year: number) => {
    const years = filters.years || [];
    updateFilter(
      'years',
      years.includes(year)
        ? years.filter((y) => y !== year)
        : [...years, year]
    );
  };

  const toggleTag = (tag: string) => {
    const tags = filters.tags || [];
    updateFilter(
      'tags',
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  const toggleStatus = (status: PublicationStatus) => {
    const statuses = filters.status || [];
    updateFilter(
      'status',
      statuses.includes(status)
        ? statuses.filter((s) => s !== status)
        : [...statuses, status]
    );
  };

  const toggleAuthor = (author: string) => {
    const authors = filters.authors || [];
    updateFilter(
      'authors',
      authors.includes(author)
        ? authors.filter((a) => a !== author)
        : [...authors, author]
    );
  };

  const hasActiveFilters =
    (filters.years?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.status?.length ?? 0) > 0 ||
    (filters.authors?.length ?? 0) > 0;

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <div className="flex flex-wrap gap-2">
            {(['published', 'working-paper', 'under-review'] as PublicationStatus[]).map(
              (status) => (
                <Tag
                  key={status}
                  variant={
                    filters.status?.includes(status) ? 'default' : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => toggleStatus(status)}
                >
                  {status}
                </Tag>
              )
            )}
          </div>
        </div>

        {/* Years */}
        {availableYears.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <div className="flex flex-wrap gap-2">
              {availableYears.map((year) => (
                <Tag
                  key={year}
                  variant={filters.years?.includes(year) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleYear(year)}
                >
                  {year}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Topics</label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {availableTags.map((tag) => (
                <Tag
                  key={tag}
                  variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Authors */}
        {availableAuthors.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Authors</label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {availableAuthors.map((author) => (
                <Tag
                  key={author}
                  variant={
                    filters.authors?.includes(author) ? 'default' : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => toggleAuthor(author)}
                >
                  {author}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
