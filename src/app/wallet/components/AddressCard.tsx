import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/buttons/Button';

interface AddressCardProps {
  address: string;
}

export function AddressCard({ address }: AddressCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-4 sm:p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>
        Wallet Adresa
      </h3>
      <div className='flex items-center gap-2 sm:gap-3 bg-gray-900/50 rounded-lg p-3 sm:p-4'>
        <code className='flex-1 text-purple-300 font-mono text-xs sm:text-sm break-all'>
          {address}
        </code>
        <Button
          variant='ghost'
          onClick={copyAddress}
          className='text-gray-400 hover:text-white flex-shrink-0 p-2'
        >
          {copied ? (
            <Check className='w-4 h-4 sm:w-5 sm:h-5 text-green-400' />
          ) : (
            <Copy className='w-4 h-4 sm:w-5 sm:h-5' />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
