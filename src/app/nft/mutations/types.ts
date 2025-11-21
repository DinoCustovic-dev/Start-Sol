/**
 * React Query-like interface for mutations
 * Matches the standard useMutation return type
 */

export interface MutationResult<TData = unknown, TVariables = void> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
