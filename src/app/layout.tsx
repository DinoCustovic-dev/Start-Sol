import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import '../styles/globals.css';

import { Footer } from '@/app/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { WalletContextProvider } from '@/contexts/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Solana Onboard Hub',
  description: 'Jednostavan ulazak u Solana ekosistem',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body
        className={
          inter.className +
          ' bg-gradient-to-br from-indigo-900 to-black text-white min-h-screen'
        }
      >
        <WalletContextProvider>
          <div className='container mx-auto px-4'>
            <Navbar />
            <main className='py-10'>{children}</main>
            <Footer />
          </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
