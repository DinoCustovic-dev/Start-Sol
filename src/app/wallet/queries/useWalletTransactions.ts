import { useEffect, useState } from 'react';

import { type TransactionInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';

import type { QueryResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

export function useWalletTransactions(
  address: string | null,
): QueryResult<TransactionInfo[]> {
  const [data, setData] = useState<TransactionInfo[] | undefined>(undefined);
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

    const fetchTransactions = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let transactions: TransactionInfo[];

        if (USE_MOCK) {
          const cached = localStorage.getItem(`wallet_transactions_${address}`);
          if (cached) {
            transactions = JSON.parse(cached);
          } else {
            transactions = await mockSolana.getTransactions(address);
            localStorage.setItem(
              `wallet_transactions_${address}`,
              JSON.stringify(transactions),
            );
          }
        } else {
          // For real implementation, would query blockchain
          transactions = [];
        }

        setData(transactions);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load transactions'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  return { data, isLoading, isError, error };
}
