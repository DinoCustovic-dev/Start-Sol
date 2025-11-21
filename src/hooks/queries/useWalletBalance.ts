import { useEffect, useState } from 'react';

import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { QueryResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

export function useWalletBalance(address: string | null): QueryResult<number> {
  const [data, setData] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setData(undefined);
      setIsError(false);
      setError(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let balance: number;

        if (USE_MOCK) {
          // Use mock service with localStorage simulation
          const cached = localStorage.getItem(`balance_${address}`);
          if (cached) {
            balance = parseFloat(cached);
          } else {
            balance = await mockSolana.getBalance(address);
            localStorage.setItem(`balance_${address}`, balance.toString());
          }
        } else {
          balance = await solanaService.getBalance(address);
        }

        setData(balance);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load balance'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { data, isLoading, isError, error };
}
