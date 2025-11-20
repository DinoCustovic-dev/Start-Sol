import { useEffect, useState } from 'react';

import { type TokenInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { QueryResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

export function useTokenInfo(mint: string | null): QueryResult<TokenInfo> {
  const [data, setData] = useState<TokenInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!mint) {
      setData(undefined);
      setIsError(false);
      setError(null);
      return;
    }

    const fetchTokenInfo = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let tokenInfo: TokenInfo | null;

        if (USE_MOCK) {
          // Use mock service with localStorage simulation
          const cached = localStorage.getItem(`token_${mint}`);
          if (cached) {
            tokenInfo = JSON.parse(cached);
          } else {
            tokenInfo = await mockSolana.getTokenInfo(mint);
            if (tokenInfo) {
              localStorage.setItem(`token_${mint}`, JSON.stringify(tokenInfo));
            }
          }
        } else {
          tokenInfo = await solanaService.getTokenInfo(mint);
        }

        setData(tokenInfo || undefined);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load token info'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
  }, [mint]);

  return { data, isLoading, isError, error };
}
