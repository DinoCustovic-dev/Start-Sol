'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import Button from '@/components/buttons/Button';

export function Hero() {
  return (
    <section className='relative flex flex-col items-center justify-center text-center w-full min-h-screen overflow-hidden'>
      {/* POZADINSKI EFEKTI S TAMNIJOM BAZOM ZA BOLJI KONTRAST */}
      <div className='absolute inset-0 bg-gray-900/90 z-0'></div>
      <div
        className='absolute top-0 -left-36 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-800 via-indigo-900 to-transparent opacity-40 blur-3xl z-0'
        aria-hidden='true'
      />
      <div
        className='absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-fuchsia-800 via-purple-900 to-transparent opacity-30 blur-3xl z-0'
        aria-hidden='true'
      />
      <div
        className='absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-800 opacity-20 blur-3xl z-0'
        aria-hidden='true'
      />

      {/* SADRŽAJ S POBOLJŠANIM KONTRASTOM I ČITLJIVOŠĆU */}
      <motion.div
        className='relative z-10 max-w-5xl mx-auto px-6 md:px-8 lg:px-12 py-24'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-8 drop-shadow-lg'
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Dobrodošli u{' '}
          <span className='text-purple-300 drop-shadow-lg'>
            Solana Onboard Hub
          </span>
        </motion.h1>

        <motion.p
          className='text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-100 font-medium mb-16 drop-shadow-lg'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Jednostavan ulazak u svijet Solane – kreiraj wallet, mintaj tokene i
          NFT-ove bez kodiranja. Počni za 2 minute.
        </motion.p>

        <motion.div
          className='flex flex-col sm:flex-row justify-center gap-5 sm:gap-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link href='/wallet' passHref legacyBehavior>
            <a className='w-full sm:w-auto'>
              <Button
                variant='primary'
                className='w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold text-lg md:text-xl px-8 py-5 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300'
                as='button'
              >
                Kreiraj Wallet
              </Button>
            </a>
          </Link>

          <Link href='/token' passHref legacyBehavior>
            <a className='w-full sm:w-auto'>
              <Button
                variant='secondary'
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg md:text-xl px-8 py-5 rounded-xl shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300'
                as='button'
              >
                Mintaj Token
              </Button>
            </a>
          </Link>

          <Link href='/learn' passHref legacyBehavior>
            <a className='w-full sm:w-auto'>
              <Button
                variant='outline'
                className='w-full border-2 border-purple-300 hover:border-purple-200 text-white hover:text-white hover:bg-purple-700/50 font-bold text-lg md:text-xl px-8 py-5 rounded-xl shadow-lg transition-all duration-300'
                as='button'
              >
                Nauči osnove
              </Button>
            </a>
          </Link>
        </motion.div>
      </motion.div>

      {/* DODATNI DEKORATIVNI ELEMENTI */}
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-40'></div>

      {/* DODATNA SVJETLA ZA AMBIJENT */}
      <div className='absolute top-1/4 right-1/4 w-6 h-6 bg-purple-400 rounded-full blur-xl opacity-60'></div>
      <div className='absolute bottom-1/3 left-1/3 w-4 h-4 bg-indigo-400 rounded-full blur-xl opacity-40'></div>
    </section>
  );
}
