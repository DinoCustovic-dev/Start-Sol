import { useState } from 'react';

import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { MutationResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

interface RefreshBalanceVariables {
  address: string;
}

export function useRefreshBalance(): MutationResult<
  number,
  RefreshBalanceVariables
> {
  const [data, setData] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: RefreshBalanceVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      let balance: number;

      if (USE_MOCK) {
        balance = await mockSolana.getBalance(variables.address);
        localStorage.setItem(
          `wallet_balance_${variables.address}`,
          balance.toString(),
        );
      } else {
        balance = await solanaService.getBalance(variables.address);
      }

      setData(balance);
      return balance;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to refresh balance');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
