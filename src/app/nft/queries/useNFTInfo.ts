import { useEffect, useState } from 'react';

import { type NFTInfo } from '@/lib/solana/mockSolana';

import type { QueryResult } from './types';

export function useNFTInfo(mint: string | null): QueryResult<NFTInfo> {
  const [data, setData] = useState<NFTInfo | undefined>(undefined);
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

    const fetchNFTInfo = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // Get from localStorage (mock implementation)
        const cached = localStorage.getItem(`nft_info_${mint}`);
        if (cached) {
          setData(JSON.parse(cached));
        } else {
          setData(undefined);
        }
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load NFT info'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTInfo();
  }, [mint]);

  return { data, isLoading, isError, error };
}
