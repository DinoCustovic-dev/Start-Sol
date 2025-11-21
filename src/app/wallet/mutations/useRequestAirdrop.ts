import { useState } from 'react';

import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { MutationResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

interface RequestAirdropVariables {
  address: string;
  amount?: number;
}

export function useRequestAirdrop(): MutationResult<
  string,
  RequestAirdropVariables
> {
  const [data, setData] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: RequestAirdropVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      let signature: string;

      if (USE_MOCK) {
        signature = await mockSolana.requestAirdrop(
          variables.address,
          variables.amount || 1,
        );
        const currentBalance = parseFloat(
          localStorage.getItem(`wallet_balance_${variables.address}`) || '0',
        );
        localStorage.setItem(
          `wallet_balance_${variables.address}`,
          (currentBalance + (variables.amount || 1)).toString(),
        );
      } else {
        signature = await solanaService.requestAirdrop(
          variables.address,
          variables.amount || 1,
        );
      }

      setData(signature);
      return signature;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to request airdrop');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
