'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { type WalletInfo, mockSolana } from '@/lib/solana/mockSolana';

import Button from '@/components/buttons/Button';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [privateKey, setPrivateKey] = useState<string>('');

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('demo_wallet');
    if (savedWallet) {
      const parsed = JSON.parse(savedWallet);
      setWallet(parsed);
      loadBalance(parsed.address);
    }
  }, []);

  const loadBalance = async (address: string) => {
    setIsLoading(true);
    try {
      const bal = await mockSolana.getBalance(address);
      setBalance(bal);
    } catch (error) {
      // Error loading balance
    } finally {
      setIsLoading(false);
    }
  };

  const createWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = await mockSolana.createWallet();
      // Generate a mock private key for demo (in real app, this would be from Keypair)
      const mockPrivateKey = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');

      setWallet(newWallet);
      setPrivateKey(mockPrivateKey);
      setBalance(0);

      // Save to localStorage
      localStorage.setItem('demo_wallet', JSON.stringify(newWallet));
      localStorage.setItem('demo_private_key', mockPrivateKey);
    } catch (error) {
      // Error creating wallet
    } finally {
      setIsLoading(false);
    }
  };

  const importWallet = () => {
    // For demo, we'll just create a new wallet
    // In real implementation, this would import from private key or seed phrase
    createWallet();
  };

  const requestAirdrop = async () => {
    if (!wallet) return;

    setIsLoading(true);
    try {
      await mockSolana.requestAirdrop(wallet.address, 1);
      await loadBalance(wallet.address);
    } catch (error) {
      // Error requesting airdrop
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!wallet) return;

    await navigator.clipboard.writeText(wallet.address);
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
            Kreirajte ili upravljajte svojim Solana walletom
          </p>
        </motion.div>

        {/* Demo Mode Banner */}
        <motion.div
          className='mb-8 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className='text-yellow-200 text-sm text-center'>
            🧪 Demo Mode: Ovo je simulacija. Stvarni wallet će biti povezan s
            Solana blockchainom kada implementiramo pravu integraciju.
          </p>
        </motion.div>

        {!wallet ? (
          /* Create/Import Wallet */
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
                  Kreirajte svoj Wallet
                </h2>
                <p className='text-gray-300 text-lg max-w-2xl mx-auto'>
                  Wallet je vaš pristup Solana ekosistemu. Kreirajte novi ili
                  importajte postojeći.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  variant='primary'
                  onClick={createWallet}
                  isLoading={isLoading}
                  className='bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg px-8 py-4 rounded-xl min-w-[200px]'
                >
                  <Plus className='w-5 h-5 mr-2' />
                  Kreiraj Novi Wallet
                </Button>
                <Button
                  variant='outline'
                  onClick={importWallet}
                  isLoading={isLoading}
                  className='border-2 border-purple-300 text-purple-300 hover:bg-purple-700/50 font-bold text-lg px-8 py-4 rounded-xl min-w-[200px]'
                >
                  <Download className='w-5 h-5 mr-2' />
                  Import Wallet
                </Button>
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
                  onClick={() => loadBalance(wallet.address)}
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
                  {wallet.address}
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

            {/* Private Key Card (Demo Only) */}
            {privateKey && (
              <motion.div
                className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-red-500/30 p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold text-white'>
                    Privatni Ključ (Demo)
                  </h3>
                  <Button
                    variant='ghost'
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className='text-gray-400 hover:text-white'
                  >
                    {showPrivateKey ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </Button>
                </div>
                <div className='bg-gray-900/50 rounded-lg p-4'>
                  <code className='text-red-300 font-mono text-xs break-all'>
                    {showPrivateKey ? privateKey : '•'.repeat(64)}
                  </code>
                </div>
                <p className='text-red-300 text-sm mt-3'>
                  ⚠️ U stvarnoj aplikaciji, privatni ključ se nikada ne bi
                  prikazivao ovako. Ovo je samo za demo.
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
              <Button
                variant='outline'
                onClick={() => {
                  localStorage.removeItem('demo_wallet');
                  localStorage.removeItem('demo_private_key');
                  setWallet(null);
                  setPrivateKey('');
                  setBalance(0);
                }}
                className='border-2 border-red-500/50 text-red-300 hover:bg-red-500/20 font-bold py-4 rounded-xl'
              >
                Obriši Wallet
              </Button>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
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
