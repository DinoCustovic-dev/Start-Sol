import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

import Button from '@/components/buttons/Button';

interface BalanceCardProps {
  balance: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BalanceCard({
  balance,
  isLoading,
  onRefresh,
}: BalanceCardProps) {
  return (
    <motion.div
      className='bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 sm:p-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className='flex items-center justify-between mb-4 sm:mb-6'>
        <h2 className='text-xl sm:text-2xl font-bold text-white'>Balance</h2>
        <Button
          variant='ghost'
          onClick={onRefresh}
          isLoading={isLoading}
          className='text-purple-300 hover:text-purple-200'
        >
          <RefreshCw className='w-4 h-4 sm:w-5 sm:h-5' />
        </Button>
      </div>
      <div className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2'>
        {balance.toFixed(4)} SOL
      </div>
      <p className='text-sm sm:text-base text-gray-300'>
        ≈ ${(balance * 150).toFixed(2)} USD (demo cijena)
      </p>
    </motion.div>
  );
}
