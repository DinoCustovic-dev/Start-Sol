import { useEffect, useState } from 'react';

import type { QueryResult } from './types';

interface NFTFormData {
  name: string;
  description: string;
  imageUrl: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function useNFTValidation(
  formData: NFTFormData,
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
          errors.push('Ime NFT-a je obavezno');
        }

        if (!formData.description.trim()) {
          errors.push('Opis NFT-a je obavezan');
        }

        if (!formData.imageUrl.trim()) {
          errors.push('URL slike je obavezan');
        } else {
          try {
            new URL(formData.imageUrl);
          } catch {
            errors.push('URL slike nije validan');
          }
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
