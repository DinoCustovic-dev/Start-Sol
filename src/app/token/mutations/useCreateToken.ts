import { PublicKey, Transaction } from '@solana/web3.js';
import { useState } from 'react';

import { type TokenInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { MutationResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

interface CreateTokenVariables {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  payer: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  owner: string;
}

export function useCreateToken(): MutationResult<
  TokenInfo,
  CreateTokenVariables
> {
  const [data, setData] = useState<TokenInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: CreateTokenVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      let token: TokenInfo;

      if (USE_MOCK) {
        token = await mockSolana.createToken(
          variables.name,
          variables.symbol,
          variables.decimals,
          variables.initialSupply,
        );
        localStorage.setItem(`token_info_${token.mint}`, JSON.stringify(token));
        const tokenList = JSON.parse(
          localStorage.getItem(`token_list_${variables.owner}`) || '[]',
        );
        tokenList.push(token);
        localStorage.setItem(
          `token_list_${variables.owner}`,
          JSON.stringify(tokenList),
        );
      } else {
        token = await solanaService.createToken(
          variables.name,
          variables.symbol,
          variables.decimals,
          variables.initialSupply,
          variables.payer,
          variables.signTransaction,
        );
      }

      setData(token);
      return token;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to create token');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
