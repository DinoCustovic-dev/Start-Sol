import { useState } from 'react';

import type { MutationResult } from './types';

interface NFTFormData {
  name: string;
  description: string;
  imageUrl: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ValidateFormVariables {
  formData: NFTFormData;
}

export function useValidateForm(): MutationResult<
  ValidationResult,
  ValidateFormVariables
> {
  const [data, setData] = useState<ValidationResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: ValidateFormVariables) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setData(undefined);

    try {
      const errors: string[] = [];

      if (!variables.formData.name.trim()) {
        errors.push('Ime NFT-a je obavezno');
      }

      if (!variables.formData.description.trim()) {
        errors.push('Opis NFT-a je obavezan');
      }

      if (!variables.formData.imageUrl.trim()) {
        errors.push('URL slike je obavezan');
      } else {
        try {
          new URL(variables.formData.imageUrl);
        } catch {
          errors.push('URL slike nije validan');
        }
      }

      const result = {
        isValid: errors.length === 0,
        errors,
      };

      setData(result);
      return result;
    } catch (err) {
      setIsError(true);
      const errorObj =
        err instanceof Error ? err : new Error('Validation failed');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, isError, error };
}
