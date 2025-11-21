import { motion } from 'framer-motion';
import { ArrowRight, Wallet } from 'lucide-react';

export function ConnectWalletPrompt() {
  return (
    <motion.div
      className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-6 sm:p-8 md:p-12'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='text-center space-y-6 sm:space-y-8'>
        <div>
          <Wallet className='w-16 h-16 sm:w-20 sm:h-20 mx-auto text-purple-300 mb-3 sm:mb-4' />
          <h2 className='text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2'>
            Povežite svoj Wallet
          </h2>
          <p className='text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2'>
            Koristite gumb u navigaciji gore desno da biste se povezali sa
            svojim Solana walletom (Phantom, Solflare, itd.)
          </p>
        </div>

        <div className='bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 text-left max-w-2xl mx-auto'>
          <h3 className='text-lg sm:text-xl font-semibold text-white mb-3'>
            Što je Wallet?
          </h3>
          <ul className='space-y-2 text-sm sm:text-base text-gray-300'>
            <li className='flex items-start gap-2'>
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 text-purple-300 mt-0.5 flex-shrink-0' />
              <span>Siguran način za čuvanje vašeg digitalnog novca</span>
            </li>
            <li className='flex items-start gap-2'>
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 text-purple-300 mt-0.5 flex-shrink-0' />
              <span>Potpuno pod vašom kontrolom - samo vi imate pristup</span>
            </li>
            <li className='flex items-start gap-2'>
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 text-purple-300 mt-0.5 flex-shrink-0' />
              <span>
                Možete koristiti za slanje, primanje i čuvanje SOL-a, tokena i
                NFT-ova
              </span>
            </li>
          </ul>
        </div>

        <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4'>
          <p className='text-blue-200 text-xs sm:text-sm px-1'>
            💡 <strong>Savjet:</strong> Instalirajte Phantom wallet extension
            ako ga još nemate. Nakon instalacije, osvježite stranicu i kliknite
            gumb "Select Wallet" u navigaciji.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
