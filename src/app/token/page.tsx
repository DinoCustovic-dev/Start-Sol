'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { ErrorDisplay } from './components/Error';
import { ProgressSteps } from './components/ProgressSteps';
import { TokenForm } from './components/TokenForm';
import { TokenHeader } from './components/TokenHeader';
import { TokenLoading } from './components/TokenLoading';
import { TokenSuccess } from './components/TokenSuccess';
import { useCreateToken } from './mutations/useCreateToken';
import { useResetForm } from './mutations/useResetForm';
import { useValidateForm } from './mutations/useValidateForm';

const initialFormData = {
  name: '',
  symbol: '',
  decimals: '9',
  supply: '1000000',
};

export default function TokenPage() {
  const { publicKey, signTransaction, connected } = useWallet();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  // Mutations
  const createTokenMutation = useCreateToken();
  const validateFormMutation = useValidateForm();
  const resetFormMutation = useResetForm();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateToken = async () => {
    if (!connected || !publicKey || !signTransaction) {
      return;
    }

    // Validate form
    const validation = await validateFormMutation.mutate({ formData });
    if (!validation?.isValid) {
      return;
    }

    setStep(2);

    try {
      await createTokenMutation.mutate({
        name: formData.name,
        symbol: formData.symbol,
        decimals: parseInt(formData.decimals),
        initialSupply: parseInt(formData.supply),
        payer: publicKey,
        signTransaction,
        owner: publicKey.toString(),
      });
      setStep(3);
    } catch (error) {
      setStep(1);
    }
  };

  const handleReset = () => {
    resetFormMutation.mutate({ initialFormData });
    setFormData(initialFormData);
    setStep(1);
  };

  const handleGoToWallet = () => {
    window.location.href = '/wallet';
  };

  const errorMessage =
    createTokenMutation.error?.message ||
    (validateFormMutation.data && !validateFormMutation.data.isValid
      ? validateFormMutation.data.errors.join(', ')
      : null);

  return (
    <div className='min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-8 lg:px-12'>
      <div className='max-w-4xl mx-auto'>
        <TokenHeader />

        {!connected ? (
          <motion.div
            className='bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className='text-yellow-200'>
              🔗 Molimo povežite svoj wallet u navigaciji prije kreiranja
              tokena.
            </p>
          </motion.div>
        ) : (
          <>
            <ProgressSteps currentStep={step} />

            {errorMessage && (
              <ErrorDisplay error={errorMessage} className='mb-6' />
            )}

            {step === 1 && (
              <TokenForm
                formData={formData}
                isLoading={createTokenMutation.isLoading}
                onInputChange={handleInputChange}
                onSubmit={handleCreateToken}
              />
            )}

            {step === 2 && <TokenLoading />}

            {step === 3 && createTokenMutation.data && (
              <TokenSuccess
                token={createTokenMutation.data}
                onReset={handleReset}
                onGoToWallet={handleGoToWallet}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
