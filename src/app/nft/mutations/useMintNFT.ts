import { PublicKey, Transaction } from '@solana/web3.js';
import { useState } from 'react';

import { type NFTInfo } from '@/lib/solana/mockSolana';
import { mockSolana } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import type { MutationResult } from './types';

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_SOLANA === 'true' ||
  !process.env.NEXT_PUBLIC_USE_MOCK_SOLANA; // Default to mock

interface MintNFTVariables {
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  payer: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
}

export function useMintNFT(): MutationResult<NFTInfo, MintNFTVariables> {
  const [data, setData] = useState<NFTInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: MintNFTVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      let nft: NFTInfo;

      if (USE_MOCK) {
        nft = await mockSolana.mintNFT(
          variables.name,
          variables.description,
          variables.imageUrl,
          variables.owner,
        );
        const existingNFTs = JSON.parse(
          localStorage.getItem(`nfts_${variables.owner}`) || '[]',
        );
        existingNFTs.push(nft);
        localStorage.setItem(
          `nfts_${variables.owner}`,
          JSON.stringify(existingNFTs),
        );
        localStorage.setItem(`nft_info_${nft.mint}`, JSON.stringify(nft));
      } else {
        nft = await solanaService.mintNFT(
          variables.name,
          variables.description,
          variables.imageUrl,
          variables.owner,
          variables.payer,
          variables.signTransaction,
        );
      }

      setData(nft);
      return nft;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to mint NFT');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
