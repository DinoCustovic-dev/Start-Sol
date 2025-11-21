import { useEffect, useState } from 'react';

import { type NFTInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { QueryResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

export function useNFTs(owner: string | null): QueryResult<NFTInfo[]> {
  const [data, setData] = useState<NFTInfo[] | undefined>(undefined);
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

    const fetchNFTs = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let nfts: NFTInfo[];

        if (USE_MOCK) {
          const cached = localStorage.getItem(`nfts_${owner}`);
          if (cached) {
            nfts = JSON.parse(cached);
          } else {
            nfts = await mockSolana.getNFTs(owner);
            localStorage.setItem(`nfts_${owner}`, JSON.stringify(nfts));
          }
        } else {
          nfts = await solanaService.getNFTs(owner);
        }

        setData(nfts);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Failed to load NFTs'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [owner]);

  return { data, isLoading, isError, error };
}
