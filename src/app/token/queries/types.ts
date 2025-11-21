/**
 * React Query-like interface for queries
 * Matches the standard useQuery return type
 */

export interface QueryResult<TData = unknown> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
