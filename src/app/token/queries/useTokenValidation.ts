import { useEffect, useState } from 'react';

import type { QueryResult } from './types';

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

export function useTokenValidation(
  formData: TokenFormData,
): QueryResult<ValidationResult> {
  const [data, setData] = useState<ValidationResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const validate = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const errors: string[] = [];

        if (!formData.name.trim()) {
          errors.push('Ime tokena je obavezno');
        }

        if (!formData.symbol.trim()) {
          errors.push('Simbol tokena je obavezan');
        } else if (formData.symbol.length > 10) {
          errors.push('Simbol ne može biti duži od 10 znakova');
        }

        const decimals = parseInt(formData.decimals);
        if (isNaN(decimals) || decimals < 0 || decimals > 18) {
          errors.push('Decimalna mjesta moraju biti između 0 i 18');
        }

        const supply = parseInt(formData.supply);
        if (isNaN(supply) || supply < 1) {
          errors.push('Početna količina mora biti veća od 0');
        }

        setData({
          isValid: errors.length === 0,
          errors,
        });
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Validation failed'));
      } finally {
        setIsLoading(false);
      }
    };

    validate();
  }, [formData]);

  return { data, isLoading, isError, error };
}
