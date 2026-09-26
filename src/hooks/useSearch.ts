'use client';

import { useCallback, useRef, useState } from 'react';

import { searchService } from '@/src/lib/services/searchService';
import type {
  SearchQueryType,
  SearchResponse,
} from '@/src/lib/types/search';

export function useSearch() {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);

  const search = useCallback(
    async (
      query: string,
      type: SearchQueryType = 'all',
    ) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      const currentRequest = ++requestId.current;

      setLoading(true);
      setError(null);

      try {
        const response = await searchService.search(
          trimmedQuery,
          type,
        );

        if (currentRequest !== requestId.current) {
          return;
        }

        setData(response);
      } catch (err: unknown) {
        if (currentRequest !== requestId.current) {
          return;
        }

        console.error('Search failed:', err);

        setError(
          'Search failed. Please try again.',
        );

        setData(null);
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const clear = useCallback(() => {
    requestId.current += 1;

    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    results: data?.results ?? [],
    loading,
    error,
    search,
    clear,
  };
}