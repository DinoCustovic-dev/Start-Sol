import { useEffect, useState } from 'react';

import { type TokenInfo } from '@/lib/solana/mockSolana';

import type { QueryResult } from './types';

export function useTokenList(owner: string | null): QueryResult<TokenInfo[]> {
  const [data, setData] = useState<TokenInfo[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!owner) {
      setData(undefined);
      setIsError(false);
      setError(null);
      return;
    }

    const fetchTokenList = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // Get tokens from localStorage (mock implementation)
        const cached = localStorage.getItem(`token_list_${owner}`);
        if (cached) {
          setData(JSON.parse(cached));
        } else {
          setData([]);
        }
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load token list'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenList();
  }, [owner]);

  return { data, isLoading, isError, error };
}
