'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { CheckCircle, Image as ImageIcon, Loader, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type NFTInfo } from '@/lib/solana/mockSolana';
import { solanaService } from '@/lib/solana/solanaService';

import Button from '@/components/buttons/Button';

export default function NFTPage() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdNFT, setCreatedNFT] = useState<NFTInfo | null>(null);
  const [nfts, setNfts] = useState<NFTInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  // Load NFTs when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadNFTs();
    } else {
      setNfts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  const loadNFTs = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const walletNFTs = await solanaService.getNFTs(publicKey.toString());
      setNfts(walletNFTs);
    } catch (error) {
      // Error loading NFTs
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMintNFT = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Molimo povežite svoj wallet prvo');
      return;
    }

    if (!formData.name || !formData.description || !formData.imageUrl) {
      setError('Molimo unesite sve podatke');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(2);

    try {
      const nft = await solanaService.mintNFT(
        formData.name,
        formData.description,
        formData.imageUrl,
        publicKey.toString(),
        publicKey,
        signTransaction,
      );

      setCreatedNFT(nft);
      const updatedNFTs = [...nfts, nft];
      setNfts(updatedNFTs);
      setStep(3);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Greška pri kreiranju NFT-a. Provjerite da imate dovoljno SOL-a za transakciju.',
      );
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCreatedNFT(null);
    setError(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
    });
  };

  return (
    <div className='min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-8 lg:px-12'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-8 sm:mb-10 md:mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4'>
            <ImageIcon className='inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2 sm:mr-3 md:mr-4 text-purple-300' />
            NFT Galerija
          </h1>
          <p className='text-base sm:text-lg md:text-xl text-gray-300 px-2'>
            Kreirajte i pregledajte svoje NFT-ove
          </p>
        </motion.div>

        {/* Tabs */}
        <div className='flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-700 overflow-x-auto'>
          <button
            onClick={() => setStep(1)}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
              step === 1
                ? 'text-purple-300 border-b-2 border-purple-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Kreiraj NFT
          </button>
          <button
            onClick={() => {
              setStep(4);
              if (connected) loadNFTs();
            }}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition-colors whitespace-nowrap text-sm sm:text-base ${
              step === 4
                ? 'text-purple-300 border-b-2 border-purple-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Moja Galerija ({nfts.length})
          </button>
        </div>

        {!connected && step !== 4 && (
          <motion.div
            className='bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-center mb-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className='text-yellow-200'>
              🔗 Molimo povežite svoj wallet u navigaciji prije kreiranja NFT-a.
            </p>
          </motion.div>
        )}

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

        {/* Step 1: Create Form */}
        {step === 1 && (
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-4 sm:p-6 md:p-8'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className='text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6'>
              Kreiraj Novi NFT
            </h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-white font-medium mb-2'>
                  Ime NFT-a *
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='npr. Moja Prva Umjetnost'
                  className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>
                  Opis *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Opisite svoj NFT...'
                  rows={4}
                  className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>
                  URL Slike *
                </label>
                <input
                  type='url'
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange('imageUrl', e.target.value)
                  }
                  placeholder='https://example.com/image.png'
                  className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
                />
                <p className='text-gray-400 text-sm mt-1'>
                  Unesite URL slike ili koristite placeholder:
                  https://via.placeholder.com/300
                </p>
              </div>

              {formData.imageUrl && (
                <div className='bg-gray-900/50 rounded-lg p-3 sm:p-4'>
                  <p className='text-gray-400 text-sm mb-2'>Pregled:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt='Preview'
                    className='w-full max-w-xs sm:w-48 sm:h-48 object-cover rounded-lg mx-auto'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}

              <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'>
                <p className='text-blue-200 text-sm'>
                  💡 <strong>Napomena:</strong> Mintanje NFT-a zahtijeva SOL za
                  transakciju (oko 0.01-0.05 SOL). Provjerite da imate dovoljno
                  sredstava u walletu.
                </p>
              </div>

              <Button
                variant='primary'
                onClick={handleMintNFT}
                isLoading={isLoading}
                disabled={!connected}
                className='w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg py-4 rounded-xl'
              >
                <Upload className='w-5 h-5 mr-2 inline' />
                Mintaj NFT →
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
              Mintanje NFT-a...
            </h2>
            <p className='text-gray-300 mb-4'>
              Molimo pričekajte dok se NFT kreira na blockchainu
            </p>
            <p className='text-gray-400 text-sm'>
              Možda ćete trebati potvrditi transakciju u vašem walletu
            </p>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && createdNFT && (
          <motion.div
            className='bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border-2 border-green-500/50 p-8'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className='text-center mb-6'>
              <CheckCircle className='w-16 h-16 mx-auto text-green-400 mb-4' />
              <h2 className='text-3xl font-bold text-white mb-2'>
                NFT uspješno kreiran! 🎉
              </h2>
            </div>

            <div className='bg-gray-900/50 rounded-xl p-6 mb-6'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={createdNFT.image}
                alt={createdNFT.name}
                className='w-full max-w-md mx-auto rounded-lg mb-4'
              />
              <div className='text-center'>
                <h3 className='text-2xl font-bold text-white mb-2'>
                  {createdNFT.name}
                </h3>
                <p className='text-gray-300 mb-4'>{createdNFT.description}</p>
                <p className='text-purple-300 font-mono text-sm'>
                  {createdNFT.mint}
                </p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <Button
                variant='primary'
                onClick={() => {
                  resetForm();
                  setStep(4);
                }}
                className='flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base'
              >
                Pregledaj Galeriju
              </Button>
              <Button
                variant='outline'
                onClick={resetForm}
                className='flex-1 border-2 border-purple-300 text-purple-300 hover:bg-purple-700/50 font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base'
              >
                Kreiraj Novi NFT
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Gallery */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-6'
          >
            {!connected ? (
              <div className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-12 text-center'>
                <ImageIcon className='w-16 h-16 mx-auto text-gray-500 mb-4' />
                <h3 className='text-2xl font-bold text-white mb-2'>
                  Povežite Wallet
                </h3>
                <p className='text-gray-400 mb-6'>
                  Povežite svoj wallet da biste vidjeli svoje NFT-ove!
                </p>
              </div>
            ) : nfts.length === 0 ? (
              <div className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-12 text-center'>
                <ImageIcon className='w-16 h-16 mx-auto text-gray-500 mb-4' />
                <h3 className='text-2xl font-bold text-white mb-2'>
                  Nema NFT-ova
                </h3>
                <p className='text-gray-400 mb-6'>
                  Kreirajte svoj prvi NFT da biste započeli kolekciju!
                </p>
                <Button
                  variant='primary'
                  onClick={() => setStep(1)}
                  className='bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-4 px-8 rounded-xl'
                >
                  Kreiraj NFT
                </Button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {nfts.map((nft, index) => (
                  <motion.div
                    key={nft.mint || index}
                    className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 overflow-hidden hover:border-purple-500/50 transition-colors'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {nft.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className='w-full h-64 object-cover'
                      />
                    ) : (
                      <div className='w-full h-64 bg-gray-700 flex items-center justify-center'>
                        <ImageIcon className='w-16 h-16 text-gray-500' />
                      </div>
                    )}
                    <div className='p-4'>
                      <h3 className='text-xl font-bold text-white mb-2'>
                        {nft.name}
                      </h3>
                      <p className='text-gray-400 text-sm mb-4 line-clamp-2'>
                        {nft.description}
                      </p>
                      <p className='text-purple-300 font-mono text-xs'>
                        {nft.mint.slice(0, 8)}...
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
