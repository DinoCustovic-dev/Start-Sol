import Link from 'next/link';

export function Footer() {
  return (
    <footer className='relative mt-20 border-t border-purple-500/20 pt-8 pb-10 px-4 md:px-6 lg:px-12 text-center'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='text-left'>
            <h3 className='text-xl font-semibold text-white mb-2'>
              <span className='text-purple-300'>Solana</span> Hub
            </h3>
            <p className='text-white/60 max-w-md'>
              Jednostavno iskustvo u Solana ekosistemu za kreiranje novčanika,
              mintanje tokena i NFT-ova.
            </p>
          </div>

          <div className='flex gap-6'>
            <Link
              href='/learn'
              className='text-white/80 hover:text-purple-300 transition-colors'
            >
              Vodič
            </Link>
            <Link
              href='/'
              className='text-white/80 hover:text-purple-300 transition-colors'
            >
              Privatnost
            </Link>
            <Link
              href='/'
              className='text-white/80 hover:text-purple-300 transition-colors'
            >
              Uvjeti
            </Link>
          </div>
        </div>

        <div className='mt-8 text-sm text-white/60'>
          ©️ {new Date().getFullYear()} Solana Hub. Sva prava zadržana.
        </div>

        {/* Dekorativni element */}
        <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30'></div>
      </div>
    </footer>
  );
}
