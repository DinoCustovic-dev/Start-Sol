import { useState } from 'react';

import type { MutationResult } from './types';

interface TokenFormData {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

interface ResetFormVariables {
  initialFormData: TokenFormData;
}

export function useResetForm(): MutationResult<
  TokenFormData,
  ResetFormVariables
> {
  const [data, setData] = useState<TokenFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: ResetFormVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      setData(variables.initialFormData);
      return variables.initialFormData;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to reset form');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
