
import { searchApi } from '@/src/lib/api/search';
import type {
  SearchQueryType,
  SearchResponse,
} from '@/src/lib/types/search';

export const searchService = {
  search(
    query: string,
    type: SearchQueryType = 'all',
    limit = 20,
  ): Promise<SearchResponse> {
    return searchApi.search({
      q: query.trim(),
      type,
      limit,
    });
  },
};

