import { useEffect, useState } from 'react';

import { type WalletInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { QueryResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

export function useWalletInfo(address: string | null): QueryResult<WalletInfo> {
  const [data, setData] = useState<WalletInfo | undefined>(undefined);
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

    const fetchWalletInfo = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        let walletInfo: WalletInfo | null;

        if (USE_MOCK) {
          const cached = localStorage.getItem(`wallet_info_${address}`);
          if (cached) {
            walletInfo = JSON.parse(cached);
          } else {
            walletInfo = await mockSolana.getWalletInfo(address);
            if (walletInfo) {
              localStorage.setItem(
                `wallet_info_${address}`,
                JSON.stringify(walletInfo),
              );
            }
          }
        } else {
          walletInfo = await solanaService.getWalletInfo(address);
        }

        setData(walletInfo || undefined);
      } catch (err) {
        setIsError(true);
        setError(
          err instanceof Error ? err : new Error('Failed to load wallet info'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletInfo();
  }, [address]);

  return { data, isLoading, isError, error };
}
