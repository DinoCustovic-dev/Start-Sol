import { useState } from 'react';

import type { MutationResult } from './types';

interface TokenFormData {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

interface SaveDraftVariables {
  formData: TokenFormData;
  owner: string;
}

export function useSaveDraft(): MutationResult<boolean, SaveDraftVariables> {
  const [data, setData] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: SaveDraftVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      localStorage.setItem(
        `token_draft_${variables.owner}`,
        JSON.stringify(variables.formData),
      );
      setData(true);
      return true;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Failed to save draft');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
