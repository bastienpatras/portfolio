import type {
  Publication,
  Project,
  Talk,
  SearchableItem,
  SearchFilters,
} from '@/types';

export function createSearchableItem(
  item: Publication | Project | Talk,
  type: SearchableItem['type']
): SearchableItem {
  if (type === 'publication') {
    const pub = item as Publication;
    return {
      id: pub.id,
      type: 'publication',
      title: pub.title,
      description: pub.abstract,
      year: pub.year,
      tags: pub.tags,
      authors: pub.authors,
      status: pub.status,
    };
  }

  if (type === 'project') {
    const proj = item as Project;
    return {
      id: proj.id,
      type: 'project',
      title: proj.title,
      description: proj.description,
      year: proj.year,
      tags: proj.tags,
    };
  }

  const talk = item as Talk;
  return {
    id: talk.id,
    type: 'talk',
    title: talk.title,
    description: talk.event,
    tags: talk.tags,
  };
}

export function filterSearchableItems(
  items: SearchableItem[],
  filters: Partial<SearchFilters>
): SearchableItem[] {
  return items.filter((item) => {
    // Query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDescription = item.description.toLowerCase().includes(query);
      const matchesTags = item.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      const matchesAuthors =
        item.authors?.some((author) => author.toLowerCase().includes(query)) ||
        false;

      if (!matchesTitle && !matchesDescription && !matchesTags && !matchesAuthors) {
        return false;
      }
    }

    // Year filter
    if (filters.years && filters.years.length > 0 && item.year) {
      if (!filters.years.includes(item.year)) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((tag) => item.tags.includes(tag))) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status.length > 0 && item.status) {
      if (!filters.status.includes(item.status)) {
        return false;
      }
    }

    // Authors filter
    if (filters.authors && filters.authors.length > 0 && item.authors) {
      if (!filters.authors.some((author) => item.authors?.includes(author))) {
        return false;
      }
    }

    return true;
  });
}

export function getAllTags(items: SearchableItem[]): string[] {
  const tagSet = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllAuthors(items: SearchableItem[]): string[] {
  const authorSet = new Set<string>();
  items.forEach((item) => {
    item.authors?.forEach((author) => authorSet.add(author));
  });
  return Array.from(authorSet).sort();
}
