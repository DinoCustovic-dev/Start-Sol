import { motion } from 'framer-motion';

import Button from '@/components/buttons/Button';

interface TokenFormData {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

interface TokenFormProps {
  formData: TokenFormData;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export function TokenForm({
  formData,
  isLoading,
  onInputChange,
  onSubmit,
}: TokenFormProps) {
  return (
    <motion.div
      className='bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-gray-700 p-4 sm:p-6 md:p-8'
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className='text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6'>
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
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder='npr. Moj Super Token'
            className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
          />
        </div>

        <div>
          <label className='block text-white font-medium mb-2'>Simbol *</label>
          <input
            type='text'
            value={formData.symbol}
            onChange={(e) =>
              onInputChange('symbol', e.target.value.toUpperCase())
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
            onChange={(e) => onInputChange('decimals', e.target.value)}
            min='0'
            max='18'
            className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
          />
          <p className='text-gray-400 text-sm mt-1'>Standardno: 9 (kao SOL)</p>
        </div>

        <div>
          <label className='block text-white font-medium mb-2'>
            Početna količina
          </label>
          <input
            type='number'
            value={formData.supply}
            onChange={(e) => onInputChange('supply', e.target.value)}
            min='1'
            className='w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500'
          />
        </div>

        <div className='bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'>
          <p className='text-blue-200 text-sm'>
            💡 <strong>Napomena:</strong> Kreiranje tokena zahtijeva SOL za
            transakciju (oko 0.01-0.05 SOL). Provjerite da imate dovoljno
            sredstava u walletu.
          </p>
        </div>

        <Button
          variant='primary'
          onClick={onSubmit}
          isLoading={isLoading}
          className='w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg py-4 rounded-xl'
        >
          Kreiraj Token →
        </Button>
      </div>
    </motion.div>
  );
}
