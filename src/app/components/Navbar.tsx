'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/token', label: 'Tokeni' },
  { href: '/nft', label: 'NFT' },
  { href: '/learn', label: 'Nauči' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      className='sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-purple-500/20 px-4 md:px-6 lg:px-12'
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between py-4 gap-4'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-white mb-4 sm:mb-0'>
            <span className='text-purple-300'>Solana</span> Hub
          </h1>
        </Link>

        <div className='flex items-center gap-4'>
          <ul className='flex flex-wrap justify-center gap-2 md:gap-3'>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-white px-3 py-2 rounded-lg transition-all duration-300 ${
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
    </motion.nav>
  );
}
