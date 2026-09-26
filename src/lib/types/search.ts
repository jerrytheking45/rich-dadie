

export type SearchQueryType =
  | 'all'
  | 'investments'
  | 'deposits'
  | 'withdrawals'
  | 'plans'
  | 'transactions'
  | 'support';

export type SearchResultType =
  | 'investment'
  | 'deposit'
  | 'withdrawal'
  | 'plan'
  | 'transaction'
  | 'support';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  createdAt: string;
  route?: string;
}

export interface SearchResponse {
  query: string;
  type: SearchQueryType;
  total: number;
  results: SearchResult[];
}

