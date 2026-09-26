import api from '@/src/lib/api/api';

import type {
  SearchQueryType,
  SearchResponse,
} from '@/src/lib/types/search';

export interface SearchParams {
  q: string;
  type?: SearchQueryType;
  limit?: number;
}

interface ApiSearchResult {
  type: SearchResponse['results'][number]['type'];
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  created_at: string;
  route?: string;
}

interface ApiSearchResponse {
  query: string;
  type: SearchQueryType;
  total: number;
  results: ApiSearchResult[];
}

export const searchApi = {
  async search(
    params: SearchParams,
  ): Promise<SearchResponse> {
    const response =
      await api.get<ApiSearchResponse>(
        '/search',
        {
          params: {
            q: params.q,
            type: params.type ?? 'all',
            limit: params.limit ?? 20,
          },
        },
      );

    return {
      query: response.data.query,
      type: response.data.type,
      total: response.data.total,
      results: (response.data.results ?? []).map(
        (result) => ({
          type: result.type,
          id: result.id,
          title: result.title,
          subtitle: result.subtitle,
          status: result.status,
          createdAt: result.created_at,
          route: result.route,
        }),
      ),
    };
  },
};