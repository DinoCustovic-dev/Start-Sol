'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/token', label: 'Tokeni' },
  { href: '/nft', label: 'NFT' },
  { href: '/learn', label: 'Nauči' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className='sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-purple-500/20 px-3 sm:px-4 md:px-6 lg:px-12'
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-7xl mx-auto'>
        {/* Desktop Layout */}
        <div className='hidden md:flex items-center justify-between py-4 gap-4'>
          <Link href='/'>
            <h1 className='text-xl lg:text-2xl font-bold text-white'>
              <span className='text-purple-300'>Solana</span> Hub
            </h1>
          </Link>

          <div className='flex items-center gap-3 lg:gap-4'>
            <ul className='flex items-center gap-2 lg:gap-3'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm lg:text-base text-white px-2 lg:px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-purple-600/60 to-indigo-600/60 font-semibold shadow-md shadow-purple-500/20'
                        : 'hover:bg-white/10 hover:shadow-sm'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className='wallet-adapter-button-trigger'>
              <WalletMultiButton />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='md:hidden flex items-center justify-between py-3'>
          <Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className='text-lg font-bold text-white'>
              <span className='text-purple-300'>Solana</span> Hub
            </h1>
          </Link>

          <div className='flex items-center gap-2'>
            <div className='wallet-adapter-button-trigger scale-90'>
              <WalletMultiButton />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 text-white hover:bg-white/10 rounded-lg transition-colors'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className='md:hidden border-t border-purple-500/20 py-4'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul className='flex flex-col gap-2'>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-white px-4 py-3 rounded-lg transition-all duration-300 ${
                      pathname === link.href
                        ? 'bg-gradient-to-r from-purple-600/60 to-indigo-600/60 font-semibold'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
