'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import Button from '@/components/buttons/Button';

import { AddressCard } from './components/AddressCard';
import { BalanceCard } from './components/BalanceCard';
import { ConnectWalletPrompt } from './components/ConnectWalletPrompt';
import { ErrorDisplay } from './components/Error';
import { Loading } from './components/Loading';
import { QuickInfoCard } from './components/QuickInfoCard';
import { WalletHeader } from './components/WalletHeader';
import { useRefreshBalance } from './mutations/useRefreshBalance';
import { useRequestAirdrop } from './mutations/useRequestAirdrop';
import { useWalletBalance } from './queries/useWalletBalance';

export default function WalletPage() {
  const { publicKey, connected } = useWallet();
  const address = publicKey?.toString() || null;

  // Queries
  const balanceQuery = useWalletBalance(address);
  const refreshBalanceMutation = useRefreshBalance();
  const requestAirdropMutation = useRequestAirdrop();

  // Refresh balance after airdrop
  useEffect(() => {
    if (requestAirdropMutation.data && address) {
      refreshBalanceMutation.mutate({ address });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestAirdropMutation.data]);

  const handleRefreshBalance = () => {
    if (address) {
      refreshBalanceMutation.mutate({ address });
    }
  };

  const handleRequestAirdrop = () => {
    if (address) {
      requestAirdropMutation.mutate({ address, amount: 1 });
    }
  };

  const isLoading =
    balanceQuery.isLoading ||
    refreshBalanceMutation.isLoading ||
    requestAirdropMutation.isLoading;

  return (
    <div className='min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-8 lg:px-12'>
      <div className='max-w-4xl mx-auto'>
        <WalletHeader />

        {!connected ? (
          <ConnectWalletPrompt />
        ) : (
          <>
            {balanceQuery.isLoading && (
              <Loading message='Učitavanje balansa...' />
            )}

            {balanceQuery.isError && (
              <ErrorDisplay
                error={balanceQuery.error}
                onRetry={handleRefreshBalance}
              />
            )}

            {requestAirdropMutation.isError && (
              <ErrorDisplay
                error={requestAirdropMutation.error}
                className='mb-6'
              />
            )}

            {balanceQuery.data !== undefined && (
              <div className='space-y-6'>
                <BalanceCard
                  balance={balanceQuery.data}
                  isLoading={isLoading}
                  onRefresh={handleRefreshBalance}
                />

                {address && <AddressCard address={address} />}

                <motion.div
                  className='grid grid-cols-1 sm:grid-cols-2 gap-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant='primary'
                    onClick={handleRequestAirdrop}
                    isLoading={isLoading}
                    className='bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold py-4 rounded-xl'
                  >
                    <RefreshCw className='w-5 h-5 mr-2' />
                    Zatraži Airdrop (1 SOL)
                  </Button>
                  <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4'>
                    <p className='text-yellow-200 text-sm'>
                      ⚠️ Airdrop radi samo na devnet mreži. Ako ste na mainnet,
                      ova opcija neće raditi.
                    </p>
                  </div>
                </motion.div>

                <QuickInfoCard />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
