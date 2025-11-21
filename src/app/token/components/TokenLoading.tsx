import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

export function TokenLoading() {
  return (
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
  );
}
