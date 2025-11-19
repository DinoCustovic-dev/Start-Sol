/**
 * Real Solana Service Layer
 *
 * This replaces the mock service with real blockchain interactions.
 * Uses @solana/web3.js and wallet adapter for all operations.
 */

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import { COMMITMENT, SOLANA_RPC_URL } from './config';
import type {
  NFTInfo,
  TokenInfo,
  TransactionInfo,
  WalletInfo,
} from './mockSolana';

// Create connection instance
const connection = new Connection(SOLANA_RPC_URL, COMMITMENT);

class SolanaService {
  /**
   * Create a new wallet (Keypair)
   * In production, users should use their own wallet, not generate new ones
   * This is mainly for demo/development purposes
   */
  async createWallet(): Promise<WalletInfo> {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();

    // Request airdrop for devnet (will fail on mainnet)
    try {
      const signature = await connection.requestAirdrop(
        keypair.publicKey,
        1 * LAMPORTS_PER_SOL,
      );
      await connection.confirmTransaction(signature);
    } catch (error) {
      // Airdrop might fail, that's okay (might be mainnet or rate limited)
    }

    return {
      address: publicKey,
      balance: 0,
      publicKey,
    };
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get wallet info
   */
  async getWalletInfo(address: string): Promise<WalletInfo | null> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);

      return {
        address,
        balance: balance / LAMPORTS_PER_SOL,
        publicKey: address,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Request airdrop (devnet only)
   */
  async requestAirdrop(address: string, amount = 1): Promise<string> {
    try {
      const publicKey = new PublicKey(address);
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL,
      );
      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      throw new Error(
        'Airdrop failed. Make sure you are on devnet and not rate limited.',
      );
    }
  }

  /**
   * Create/Mint a new SPL token
   * Requires wallet to sign transaction
   */
  async createToken(
    name: string,
    symbol: string,
    decimals = 9,
    initialSupply = 1000000,
    payer: PublicKey,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
  ): Promise<TokenInfo> {
    try {
      // Create mint
      const mint = await createMint(
        connection,
        { publicKey: payer, signTransaction },
        payer,
        null,
        decimals,
      );

      // Create associated token account
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        { publicKey: payer, signTransaction },
        mint,
        payer,
      );

      // Mint initial supply
      await mintTo(
        connection,
        { publicKey: payer, signTransaction },
        mint,
        tokenAccount.address,
        payer,
        initialSupply * Math.pow(10, decimals),
      );

      return {
        mint: mint.toString(),
        name,
        symbol,
        decimals,
        supply: initialSupply,
      };
    } catch (error) {
      throw new Error(
        `Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get token info
   */
  async getTokenInfo(mint: string): Promise<TokenInfo | null> {
    try {
      const mintPublicKey = new PublicKey(mint);
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);

      if (!mintInfo.value) {
        return null;
      }

      // Parse token metadata from account data
      // This is simplified - in production you'd fetch from Token Metadata Program
      return {
        mint,
        name: 'Token',
        symbol: 'TKN',
        decimals: 9,
        supply: 0,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Mint an NFT
   * This is a simplified version - for full NFT support, use Metaplex
   */
  async mintNFT(
    name: string,
    description: string,
    imageUrl: string,
    owner: string,
    payer: PublicKey,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
  ): Promise<NFTInfo> {
    try {
      // For now, create a token with supply of 1 (NFT-like)
      // In production, use Metaplex Token Metadata Program for proper NFTs
      const mint = await createMint(
        connection,
        { publicKey: payer, signTransaction },
        payer,
        null,
        0, // 0 decimals = NFT
      );

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        { publicKey: payer, signTransaction },
        mint,
        payer,
      );

      // Mint exactly 1 token (NFT)
      await mintTo(
        connection,
        { publicKey: payer, signTransaction },
        mint,
        tokenAccount.address,
        payer,
        1,
      );

      return {
        mint: mint.toString(),
        name,
        image: imageUrl,
        description,
        owner,
      };
    } catch (error) {
      throw new Error(
        `Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get NFTs for a wallet
   * Simplified - in production use Metaplex to get proper NFT metadata
   */
  async getNFTs(owner: string): Promise<NFTInfo[]> {
    try {
      const ownerPublicKey = new PublicKey(owner);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        ownerPublicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );

      // Filter for NFTs (tokens with supply = 1 and decimals = 0)
      const nfts: NFTInfo[] = [];

      for (const account of tokenAccounts.value) {
        const amount = account.account.data.parsed.info.tokenAmount;
        if (amount.uiAmount === 1 && amount.decimals === 0) {
          nfts.push({
            mint: account.account.data.parsed.info.mint,
            name: 'NFT',
            image: '',
            description: '',
            owner,
          });
        }
      }

      return nfts;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(address: string): Promise<TransactionInfo[]> {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 20,
      });

      const transactions: TransactionInfo[] = [];

      for (const sigInfo of signatures) {
        const tx = await connection.getTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (tx) {
          transactions.push({
            signature: sigInfo.signature,
            from: address,
            to: address, // Simplified
            amount: 0, // Would need to parse transaction
            timestamp: sigInfo.blockTime
              ? sigInfo.blockTime * 1000
              : Date.now(),
            type: 'transfer',
          });
        }
      }

      return transactions;
    } catch (error) {
      return [];
    }
  }

  /**
   * Transfer SOL
   */
  async transfer(
    from: PublicKey,
    to: string,
    amount: number,
    signTransaction: (tx: Transaction) => Promise<Transaction>,
  ): Promise<string> {
    try {
      const toPublicKey = new PublicKey(to);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from,
          toPubkey: toPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      return signature;
    } catch (error) {
      throw new Error(
        `Failed to transfer SOL: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}

// Export singleton instance
export const solanaService = new SolanaService();
