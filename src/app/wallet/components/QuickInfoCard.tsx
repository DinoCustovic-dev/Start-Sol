import { motion } from 'framer-motion';

export function QuickInfoCard() {
  return (
    <motion.div
      className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className='text-lg sm:text-xl font-semibold text-white mb-3'>
        Sljedeći koraci:
      </h3>
      <div className='space-y-2 text-sm sm:text-base text-gray-300'>
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
  );
}
