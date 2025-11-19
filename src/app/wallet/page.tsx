'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, RefreshCw, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

import { solanaService } from '@/lib/solana/solanaService';

import Button from '@/components/buttons/Button';

export default function WalletPage() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load balance when wallet connects or address changes
  useEffect(() => {
    if (connected && publicKey) {
      loadBalance(publicKey.toString());
    } else {
      setBalance(0);
    }
  }, [connected, publicKey]);

  const loadBalance = async (address: string) => {
    setIsLoading(true);
    try {
      const bal = await solanaService.getBalance(address);
      setBalance(bal);
    } catch (error) {
      // Error loading balance
    } finally {
      setIsLoading(false);
    }
  };

  const requestAirdrop = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      await solanaService.requestAirdrop(publicKey.toString(), 1);
      // Wait a bit for transaction to confirm
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadBalance(publicKey.toString());
    } catch (error) {
      alert(
        'Airdrop failed. Make sure you are on devnet and not rate limited.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!publicKey) return;

    await navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='min-h-screen py-12 px-4 md:px-8 lg:px-12'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4'>
            <Wallet className='inline-block w-12 h-12 mr-4 text-purple-300' />
            Moj Wallet
          </h1>
          <p className='text-xl text-gray-300'>
            Povežite svoj wallet i upravljajte svojim Solana sredstvima
          </p>
        </motion.div>

        {!connected ? (
          /* Connect Wallet Prompt */
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-8 md:p-12'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className='text-center space-y-8'>
              <div>
                <Wallet className='w-20 h-20 mx-auto text-purple-300 mb-4' />
                <h2 className='text-3xl font-bold text-white mb-4'>
                  Povežite svoj Wallet
                </h2>
                <p className='text-gray-300 text-lg max-w-2xl mx-auto'>
                  Koristite gumb u navigaciji gore desno da biste se povezali sa
                  svojim Solana walletom (Phantom, Solflare, itd.)
                </p>
              </div>

              <div className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-left max-w-2xl mx-auto'>
                <h3 className='text-xl font-semibold text-white mb-3'>
                  Što je Wallet?
                </h3>
                <ul className='space-y-2 text-gray-300'>
                  <li className='flex items-start gap-2'>
                    <ArrowRight className='w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0' />
                    <span>Siguran način za čuvanje vašeg digitalnog novca</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <ArrowRight className='w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0' />
                    <span>
                      Potpuno pod vašom kontrolom - samo vi imate pristup
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <ArrowRight className='w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0' />
                    <span>
                      Možete koristiti za slanje, primanje i čuvanje SOL-a,
                      tokena i NFT-ova
                    </span>
                  </li>
                </ul>
              </div>

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'>
                <p className='text-blue-200 text-sm'>
                  💡 <strong>Savjet:</strong> Instalirajte Phantom wallet
                  extension ako ga još nemate. Nakon instalacije, osvježite
                  stranicu i kliknite gumb "Select Wallet" u navigaciji.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Wallet Dashboard */
          <div className='space-y-6'>
            {/* Balance Card */}
            <motion.div
              className='bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white'>Balance</h2>
                <Button
                  variant='ghost'
                  onClick={() => publicKey && loadBalance(publicKey.toString())}
                  isLoading={isLoading}
                  className='text-purple-300 hover:text-purple-200'
                >
                  <RefreshCw className='w-5 h-5' />
                </Button>
              </div>
              <div className='text-5xl font-extrabold text-white mb-2'>
                {balance.toFixed(4)} SOL
              </div>
              <p className='text-gray-300'>
                ≈ ${(balance * 150).toFixed(2)} USD (demo cijena)
              </p>
            </motion.div>

            {/* Wallet Address Card */}
            <motion.div
              className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className='text-lg font-semibold text-white mb-4'>
                Wallet Adresa
              </h3>
              <div className='flex items-center gap-3 bg-gray-900/50 rounded-lg p-4'>
                <code className='flex-1 text-purple-300 font-mono text-sm break-all'>
                  {publicKey?.toString()}
                </code>
                <Button
                  variant='ghost'
                  onClick={copyAddress}
                  className='text-gray-400 hover:text-white flex-shrink-0'
                >
                  {copied ? (
                    <Check className='w-5 h-5 text-green-400' />
                  ) : (
                    <Copy className='w-5 h-5' />
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant='primary'
                onClick={requestAirdrop}
                isLoading={isLoading}
                className='bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-4 rounded-xl'
              >
                <RefreshCw className='w-5 h-5 mr-2' />
                Zatraži Airdrop (1 SOL)
              </Button>
              <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4'>
                <p className='text-yellow-200 text-sm'>
                  ⚠️ Airdrop radi samo na devnet mreži. Ako ste na mainnet, ova
                  opcija neće raditi.
                </p>
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className='text-xl font-semibold text-white mb-3'>
                Sljedeći koraci:
              </h3>
              <div className='space-y-2 text-gray-300'>
                <p>
                  → Kreirajte token na{' '}
                  <a
                    href='/token'
                    className='text-purple-300 hover:text-purple-200 underline'
                  >
                    Token stranici
                  </a>
                </p>
                <p>
                  → Mintajte NFT na{' '}
                  <a
                    href='/nft'
                    className='text-purple-300 hover:text-purple-200 underline'
                  >
                    NFT stranici
                  </a>
                </p>
                <p>
                  → Naučite više na{' '}
                  <a
                    href='/learn'
                    className='text-purple-300 hover:text-purple-200 underline'
                  >
                    Learn stranici
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
