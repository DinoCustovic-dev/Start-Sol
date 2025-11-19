import { Cluster } from '@solana/web3.js';

/**
 * Solana Network Configuration
 *
 * Set these in your .env.local file:
 * - NEXT_PUBLIC_SOLANA_NETWORK=devnet (or mainnet-beta)
 * - NEXT_PUBLIC_SOLANA_RPC_URL=your-rpc-url-here
 */

export const SOLANA_NETWORK: Cluster =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster) || 'devnet';

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const COMMITMENT = 'confirmed' as const;
