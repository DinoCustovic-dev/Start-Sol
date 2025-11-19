'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Image as ImageIcon, Loader, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type NFTInfo, mockSolana } from '@/lib/solana/mockSolana';

import Button from '@/components/buttons/Button';

export default function NFTPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [createdNFT, setCreatedNFT] = useState<NFTInfo | null>(null);
  const [nfts, setNfts] = useState<NFTInfo[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  // Load NFTs on mount (demo - would load from wallet in real app)
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    // Demo: Load from localStorage or show sample NFTs
    const savedNFTs = localStorage.getItem('demo_nfts');
    if (savedNFTs) {
      setNfts(JSON.parse(savedNFTs));
    } else {
      // Show some sample NFTs for demo
      setNfts([
        {
          mint: 'sample1',
          name: 'Primjer NFT #1',
          image: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=NFT+1',
          description: 'Ovo je primjer NFT-a',
          owner: 'demo',
        },
      ]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMintNFT = async () => {
    if (!formData.name || !formData.description || !formData.imageUrl) {
      alert('Molimo unesite sve podatke');
      return;
    }

    setIsLoading(true);
    setStep(2);

    try {
      const nft = await mockSolana.mintNFT(
        formData.name,
        formData.description,
        formData.imageUrl,
        'demo_wallet',
      );

      setCreatedNFT(nft);
      const updatedNFTs = [...nfts, nft];
      setNfts(updatedNFTs);
      localStorage.setItem('demo_nfts', JSON.stringify(updatedNFTs));
      setStep(3);
    } catch (error) {
      alert('Greška pri kreiranju NFT-a');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCreatedNFT(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
    });
  };

  return (
    <div className='min-h-screen py-12 px-4 md:px-8 lg:px-12'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4'>
            <ImageIcon className='inline-block w-12 h-12 mr-4 text-purple-300' />
            NFT Galerija
          </h1>
          <p className='text-xl text-gray-300'>
            Kreirajte i pregledajte svoje NFT-ove
          </p>
        </motion.div>

        {/* Demo Banner */}
        <motion.div
          className='mb-8 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className='text-yellow-200 text-sm text-center'>
            🧪 Demo Mode: Ovo je simulacija. Stvarni NFT-ovi će biti kreirani na
            Solana blockchainu kada implementiramo pravu integraciju.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className='flex gap-4 mb-8 border-b border-gray-700'>
          <button
            onClick={() => setStep(1)}
            className={`px-6 py-3 font-semibold transition-colors ${
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
              loadNFTs();
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              step === 4
                ? 'text-purple-300 border-b-2 border-purple-300'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Moja Galerija ({nfts.length})
          </button>
        </div>

        {/* Step 1: Create Form */}
        {step === 1 && (
          <motion.div
            className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-8'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className='text-2xl font-bold text-white mb-6'>
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
                <div className='bg-gray-900/50 rounded-lg p-4'>
                  <p className='text-gray-400 text-sm mb-2'>Pregled:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt='Preview'
                    className='w-48 h-48 object-cover rounded-lg'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}

              <Button
                variant='primary'
                onClick={handleMintNFT}
                isLoading={isLoading}
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
            <p className='text-gray-300'>
              Molimo pričekajte dok se NFT kreira na blockchainu
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

            <div className='flex gap-4'>
              <Button
                variant='primary'
                onClick={() => {
                  resetForm();
                  setStep(4);
                }}
                className='flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-4 rounded-xl'
              >
                Pregledaj Galeriju
              </Button>
              <Button
                variant='outline'
                onClick={resetForm}
                className='flex-1 border-2 border-purple-300 text-purple-300 hover:bg-purple-700/50 font-bold py-4 rounded-xl'
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
            {nfts.length === 0 ? (
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className='w-full h-64 object-cover'
                    />
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
