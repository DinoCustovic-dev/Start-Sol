import { PublicKey, Transaction } from '@solana/web3.js';
import { useState } from 'react';

import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { MutationResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

interface TransferSOLVariables {
  from: PublicKey;
  to: string;
  amount: number;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
}

export function useTransferSOL(): MutationResult<string, TransferSOLVariables> {
  const [data, setData] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TransferSOLVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      let signature: string;

      if (USE_MOCK) {
        // Use mock service with localStorage simulation
        signature = await mockSolana.transfer(
          variables.from.toString(),
          variables.to,
          variables.amount,
        );
        // Update cached balances
        const fromBalance = parseFloat(
          localStorage.getItem(`balance_${variables.from.toString()}`) || '0',
        );
        const toBalance = parseFloat(
          localStorage.getItem(`balance_${variables.to}`) || '0',
        );
        localStorage.setItem(
          `balance_${variables.from.toString()}`,
          (fromBalance - variables.amount).toString(),
        );
        localStorage.setItem(
          `balance_${variables.to}`,
          (toBalance + variables.amount).toString(),
        );
      } else {
        signature = await solanaService.transfer(
          variables.from,
          variables.to,
          variables.amount,
          variables.signTransaction,
        );
      }

      setData(signature);
      return signature;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to transfer SOL');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
