import { useState } from 'react';

import type { MutationResult } from './types';

interface TokenFormData {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ValidateFormVariables {
  formData: TokenFormData;
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
        errors.push('Ime tokena je obavezno');
      }

      if (!variables.formData.symbol.trim()) {
        errors.push('Simbol tokena je obavezan');
      } else if (variables.formData.symbol.length > 10) {
        errors.push('Simbol ne može biti duži od 10 znakova');
      }

      const decimals = parseInt(variables.formData.decimals);
      if (isNaN(decimals) || decimals < 0 || decimals > 18) {
        errors.push('Decimalna mjesta moraju biti između 0 i 18');
      }

      const supply = parseInt(variables.formData.supply);
      if (isNaN(supply) || supply < 1) {
        errors.push('Početna količina mora biti veća od 0');
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
