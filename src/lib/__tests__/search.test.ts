import { describe, it, expect } from 'vitest';
import { filterSearchableItems, getAllTags, getAllAuthors } from '../search';
import type { SearchableItem } from '@/types';

describe('search', () => {
  const mockItems: SearchableItem[] = [
    {
      id: '1',
      type: 'publication',
      title: 'Neural Networks',
      description: 'A paper about neural networks',
      year: 2023,
      tags: ['deep-learning', 'ai'],
      authors: ['Alice', 'Bob'],
      status: 'published',
    },
    {
      id: '2',
      type: 'publication',
      title: 'Machine Learning',
      description: 'A paper about machine learning',
      year: 2024,
      tags: ['ml', 'ai'],
      authors: ['Alice', 'Charlie'],
      status: 'working-paper',
    },
  ];

  describe('filterSearchableItems', () => {
    it('filters by query', () => {
      const result = filterSearchableItems(mockItems, {
        query: 'neural',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('filters by year', () => {
      const result = filterSearchableItems(mockItems, {
        years: [2024],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('filters by tags', () => {
      const result = filterSearchableItems(mockItems, {
        tags: ['deep-learning'],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('filters by status', () => {
      const result = filterSearchableItems(mockItems, {
        status: ['published'],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('filters by authors', () => {
      const result = filterSearchableItems(mockItems, {
        authors: ['Charlie'],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('getAllTags', () => {
    it('returns unique sorted tags', () => {
      const tags = getAllTags(mockItems);
      expect(tags).toEqual(['ai', 'deep-learning', 'ml']);
    });
  });

  describe('getAllAuthors', () => {
    it('returns unique sorted authors', () => {
      const authors = getAllAuthors(mockItems);
      expect(authors).toEqual(['Alice', 'Bob', 'Charlie']);
    });
  });
});
