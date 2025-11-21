import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export function TokenHeader() {
  return (
    <motion.div
      className='text-center mb-8 sm:mb-10 md:mb-12'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4'>
        <Coins className='inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mr-2 sm:mr-3 md:mr-4 text-purple-300' />
        Kreiraj Token
      </h1>
      <p className='text-base sm:text-lg md:text-xl text-gray-300 px-2'>
        Kreirajte svoj vlastiti token na Solani u nekoliko koraka
      </p>
    </motion.div>
  );
}
