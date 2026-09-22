import { describe, it, expect } from 'vitest';
import { slugify, getYearRange, formatDate } from '../utils';

describe('utils', () => {
  describe('slugify', () => {
    it('converts text to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });
  });

  describe('getYearRange', () => {
    it('returns sorted year range', () => {
      const items = [{ year: 2023 }, { year: 2021 }, { year: 2024 }];
      expect(getYearRange(items)).toEqual([2024, 2023, 2022, 2021]);
    });

    it('returns empty array for empty input', () => {
      expect(getYearRange([])).toEqual([]);
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const formatted = formatDate('2024-12-01');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('December');
    });
  });
});
