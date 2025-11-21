import { useState } from 'react';

import type { MutationResult } from './types';

interface CopyAddressVariables {
  address: string;
}

export function useCopyAddress(): MutationResult<
  boolean,
  CopyAddressVariables
> {
  const [data, setData] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: CopyAddressVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      await navigator.clipboard.writeText(variables.address);
      setData(true);
      return true;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to copy address');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
