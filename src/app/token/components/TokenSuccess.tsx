import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

import { type TokenInfo } from '@/lib/solana/mockSolana';

import Button from '@/components/buttons/Button';

interface TokenSuccessProps {
  token: TokenInfo;
  onReset: () => void;
  onGoToWallet: () => void;
}

export function TokenSuccess({
  token,
  onReset,
  onGoToWallet,
}: TokenSuccessProps) {
  return (
    <motion.div
      className='bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border-2 border-green-500/50 p-4 sm:p-6 md:p-8'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className='text-center mb-4 sm:mb-6'>
        <CheckCircle className='w-12 h-12 sm:w-16 sm:h-16 mx-auto text-green-400 mb-3 sm:mb-4' />
        <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
          Token uspješno kreiran! 🎉
        </h2>
        <p className='text-sm sm:text-base text-gray-300'>
          Vaš token je sada dostupan na Solana blockchainu
        </p>
      </div>

      <div className='bg-gray-900/50 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
        <div>
          <label className='text-gray-400 text-sm'>Ime</label>
          <p className='text-white font-semibold text-lg'>{token.name}</p>
        </div>
        <div>
          <label className='text-gray-400 text-sm'>Simbol</label>
          <p className='text-white font-semibold text-lg'>{token.symbol}</p>
        </div>
        <div>
          <label className='text-gray-400 text-sm'>Mint Adresa</label>
          <p className='text-purple-300 font-mono text-sm break-all'>
            {token.mint}
          </p>
        </div>
        <div>
          <label className='text-gray-400 text-sm'>Ukupna količina</label>
          <p className='text-white font-semibold text-lg'>
            {token.supply.toLocaleString()} {token.symbol}
          </p>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <Button
          variant='primary'
          onClick={onReset}
          className='flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base'
        >
          Kreiraj Novi Token
        </Button>
        <Button
          variant='outline'
          onClick={onGoToWallet}
          className='flex-1 border-2 border-purple-300 text-purple-300 hover:bg-purple-700/50 font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base'
        >
          Idi na Wallet
        </Button>
      </div>
    </motion.div>
  );
}
