import { create } from 'zustand';
import type { SearchFilters } from '@/types';

interface SearchState {
  filters: Partial<SearchFilters>;
  setFilters: (filters: Partial<SearchFilters>) => void;
  updateFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {
    query: '',
    years: [],
    tags: [],
    status: [],
    authors: [],
    artifactTypes: [],
  },
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () =>
    set({
      filters: {
        query: '',
        years: [],
        tags: [],
        status: [],
        authors: [],
        artifactTypes: [],
      },
    }),
}));
