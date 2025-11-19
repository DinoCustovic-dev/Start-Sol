/**
 * Mock Solana Service Layer
 *
 * This is structured to be easily replaceable with real Solana functions.
 * When ready for real blockchain integration, simply replace the implementations
 * in this file with actual @solana/web3.js calls.
 */

export interface WalletInfo {
  address: string;
  balance: number;
  publicKey: string;
}

export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  balance?: number;
}

export interface NFTInfo {
  mint: string;
  name: string;
  image: string;
  description: string;
  owner: string;
}

export interface TransactionInfo {
  signature: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  type: 'transfer' | 'mint' | 'create';
}

class MockSolanaService {
  private mockWallets: Map<string, WalletInfo> = new Map();
  private mockTokens: Map<string, TokenInfo> = new Map();
  private mockNFTs: Map<string, NFTInfo[]> = new Map();
  private mockTransactions: Map<string, TransactionInfo[]> = new Map();

  /**
   * Generate a mock wallet address
   */
  private generateMockAddress(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '';
    for (let i = 0; i < 44; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  /**
   * Create a new wallet
   * In real implementation, this would use Keypair.generate()
   */
  async createWallet(): Promise<WalletInfo> {
    const address = this.generateMockAddress();
    const wallet: WalletInfo = {
      address,
      balance: 0,
      publicKey: address,
    };

    this.mockWallets.set(address, wallet);
    this.mockTransactions.set(address, []);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return wallet;
  }

  /**
   * Get wallet balance
   * In real implementation, this would use connection.getBalance()
   */
  async getBalance(address: string): Promise<number> {
    const wallet = this.mockWallets.get(address);
    if (!wallet) {
      // Simulate fetching from network
      await new Promise((resolve) => setTimeout(resolve, 300));
      return Math.random() * 10; // Random balance for demo
    }
    return wallet.balance;
  }

  /**
   * Get wallet info
   * In real implementation, this would fetch from blockchain
   */
  async getWalletInfo(address: string): Promise<WalletInfo | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const wallet = this.mockWallets.get(address);
    if (wallet) {
      return wallet;
    }

    // Return mock wallet if not found (for demo purposes)
    return {
      address,
      balance: Math.random() * 10,
      publicKey: address,
    };
  }

  /**
   * Request airdrop (for devnet/testing)
   * In real implementation, this would use connection.requestAirdrop()
   */
  async requestAirdrop(address: string, amount = 1): Promise<string> {
    const wallet = this.mockWallets.get(address);
    if (wallet) {
      wallet.balance += amount;
    }

    const signature = this.generateMockAddress();
    const transaction: TransactionInfo = {
      signature,
      from: 'System',
      to: address,
      amount,
      timestamp: Date.now(),
      type: 'transfer',
    };

    const transactions = this.mockTransactions.get(address) || [];
    transactions.unshift(transaction);
    this.mockTransactions.set(address, transactions);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return signature;
  }

  /**
   * Create/Mint a new token
   * In real implementation, this would use Token Program
   */
  async createToken(
    name: string,
    symbol: string,
    decimals = 9,
    initialSupply = 1000000,
  ): Promise<TokenInfo> {
    const mint = this.generateMockAddress();
    const token: TokenInfo = {
      mint,
      name,
      symbol,
      decimals,
      supply: initialSupply,
    };

    this.mockTokens.set(mint, token);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return token;
  }

  /**
   * Get token info
   * In real implementation, this would fetch from Token Program
   */
  async getTokenInfo(mint: string): Promise<TokenInfo | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.mockTokens.get(mint) || null;
  }

  /**
   * Mint an NFT
   * In real implementation, this would use Metaplex or similar
   */
  async mintNFT(
    name: string,
    description: string,
    imageUrl: string,
    owner: string,
  ): Promise<NFTInfo> {
    const mint = this.generateMockAddress();
    const nft: NFTInfo = {
      mint,
      name,
      image: imageUrl,
      description,
      owner,
    };

    const nfts = this.mockNFTs.get(owner) || [];
    nfts.push(nft);
    this.mockNFTs.set(owner, nfts);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return nft;
  }

  /**
   * Get NFTs for a wallet
   * In real implementation, this would query Metaplex or similar
   */
  async getNFTs(owner: string): Promise<NFTInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.mockNFTs.get(owner) || [];
  }

  /**
   * Get transaction history
   * In real implementation, this would use connection.getSignaturesForAddress()
   */
  async getTransactions(address: string): Promise<TransactionInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return this.mockTransactions.get(address) || [];
  }

  /**
   * Transfer SOL
   * In real implementation, this would create and send a transaction
   */
  async transfer(from: string, to: string, amount: number): Promise<string> {
    const fromWallet = this.mockWallets.get(from);
    if (fromWallet && fromWallet.balance >= amount) {
      fromWallet.balance -= amount;

      const toWallet = this.mockWallets.get(to);
      if (toWallet) {
        toWallet.balance += amount;
      }
    }

    const signature = this.generateMockAddress();
    const transaction: TransactionInfo = {
      signature,
      from,
      to,
      amount,
      timestamp: Date.now(),
      type: 'transfer',
    };

    const transactions = this.mockTransactions.get(from) || [];
    transactions.unshift(transaction);
    this.mockTransactions.set(from, transactions);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return signature;
  }
}

// Export singleton instance
export const mockSolana = new MockSolanaService();
