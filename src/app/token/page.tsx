'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { CheckCircle, Coins, Loader } from 'lucide-react';
import { useState } from 'react';

import { type TokenInfo, solanaService } from '@/lib/solana/solanaService';

import Button from '@/components/buttons/Button';

export default function TokenPage() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdToken, setCreatedToken] = useState<TokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: '9',
    supply: '1000000',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateToken = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Molimo povežite svoj wallet prvo');
      return;
    }

    if (!formData.name || !formData.symbol) {
      setError('Molimo unesite ime i simbol tokena');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(2);

    try {
      const token = await solanaService.createToken(
        formData.name,
        formData.symbol,
        parseInt(formData.decimals),
        parseInt(formData.supply),
        publicKey,
        signTransaction,
      );

      setCreatedToken(token);
      setStep(3);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Greška pri kreiranju tokena. Provjerite da imate dovoljno SOL-a za transakciju.',
      );
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCreatedToken(null);
    setError(null);
    setFormData({
      name: '',
      symbol: '',
      decimals: '9',
      supply: '1000000',
    });
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
            <Coins className='inline-block w-12 h-12 mr-4 text-purple-300' />
            Kreiraj Token
          </h1>
          <p className='text-xl text-gray-300'>
            Kreirajte svoj vlastiti token na Solani u nekoliko koraka
          </p>
        </motion.div>

        {!connected ? (
          <motion.div
            className='bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className='text-yellow-200'>
              🔗 Molimo povežite svoj wallet u navigaciji prije kreiranja
              tokena.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className='flex items-center justify-center mb-8'>
              {[1, 2, 3].map((s) => (
                <div key={s} className='flex items-center'>
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold
                      ${
                        step >= s
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }
                    `}
                  >
                    {step > s ? <CheckCircle className='w-6 h-6' /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-24 h-1 mx-2 ${
                        step > s ? 'bg-purple-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className='mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className='text-red-200 text-sm'>{error}</p>
              </motion.div>
            )}

            {/* Step 1: Form */}
            {step === 1 && (
              <motion.div
                className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-8'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className='text-2xl font-bold text-white mb-6'>
                  Korak 1: Unesite podatke o tokenu
                </h2>

                <div className='space-y-6'>
                  <div>
                    <label className='block text-white font-medium mb-2'>
                      Ime Tokena *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder='npr. Moj Super Token'
                      className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                    />
                  </div>

                  <div>
                    <label className='block text-white font-medium mb-2'>
                      Simbol *
                    </label>
                    <input
                      type='text'
                      value={formData.symbol}
                      onChange={(e) =>
                        handleInputChange(
                          'symbol',
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder='npr. MST'
                      maxLength={10}
                      className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 uppercase'
                    />
                  </div>

                  <div>
                    <label className='block text-white font-medium mb-2'>
                      Decimalna mjesta
                    </label>
                    <input
                      type='number'
                      value={formData.decimals}
                      onChange={(e) =>
                        handleInputChange('decimals', e.target.value)
                      }
                      min='0'
                      max='18'
                      className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                    />
                    <p className='text-gray-400 text-sm mt-1'>
                      Standardno: 9 (kao SOL)
                    </p>
                  </div>

                  <div>
                    <label className='block text-white font-medium mb-2'>
                      Početna količina
                    </label>
                    <input
                      type='number'
                      value={formData.supply}
                      onChange={(e) =>
                        handleInputChange('supply', e.target.value)
                      }
                      min='1'
                      className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                    />
                  </div>

                  <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'>
                    <p className='text-blue-200 text-sm'>
                      💡 <strong>Napomena:</strong> Kreiranje tokena zahtijeva
                      SOL za transakciju (oko 0.01-0.05 SOL). Provjerite da
                      imate dovoljno sredstava u walletu.
                    </p>
                  </div>

                  <Button
                    variant='primary'
                    onClick={handleCreateToken}
                    isLoading={isLoading}
                    className='w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg py-4 rounded-xl'
                  >
                    Kreiraj Token →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Loading */}
            {step === 2 && (
              <motion.div
                className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-purple-500/50 p-12 text-center'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Loader className='w-16 h-16 mx-auto text-purple-300 animate-spin mb-4' />
                <h2 className='text-2xl font-bold text-white mb-2'>
                  Kreiranje tokena...
                </h2>
                <p className='text-gray-300 mb-4'>
                  Molimo pričekajte dok se token kreira na blockchainu
                </p>
                <p className='text-gray-400 text-sm'>
                  Možda ćete trebati potvrditi transakciju u vašem walletu
                </p>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && createdToken && (
              <motion.div
                className='bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border-2 border-green-500/50 p-8'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className='text-center mb-6'>
                  <CheckCircle className='w-16 h-16 mx-auto text-green-400 mb-4' />
                  <h2 className='text-3xl font-bold text-white mb-2'>
                    Token uspješno kreiran! 🎉
                  </h2>
                  <p className='text-gray-300'>
                    Vaš token je sada dostupan na Solana blockchainu
                  </p>
                </div>

                <div className='bg-gray-900/50 rounded-xl p-6 space-y-4 mb-6'>
                  <div>
                    <label className='text-gray-400 text-sm'>Ime</label>
                    <p className='text-white font-semibold text-lg'>
                      {createdToken.name}
                    </p>
                  </div>
                  <div>
                    <label className='text-gray-400 text-sm'>Simbol</label>
                    <p className='text-white font-semibold text-lg'>
                      {createdToken.symbol}
                    </p>
                  </div>
                  <div>
                    <label className='text-gray-400 text-sm'>Mint Adresa</label>
                    <p className='text-purple-300 font-mono text-sm break-all'>
                      {createdToken.mint}
                    </p>
                  </div>
                  <div>
                    <label className='text-gray-400 text-sm'>
                      Ukupna količina
                    </label>
                    <p className='text-white font-semibold text-lg'>
                      {createdToken.supply.toLocaleString()}{' '}
                      {createdToken.symbol}
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <Button
                    variant='primary'
                    onClick={resetForm}
                    className='flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-4 rounded-xl'
                  >
                    Kreiraj Novi Token
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => (window.location.href = '/wallet')}
                    className='flex-1 border-2 border-purple-300 text-purple-300 hover:bg-purple-700/50 font-bold py-4 rounded-xl'
                  >
                    Idi na Wallet
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
