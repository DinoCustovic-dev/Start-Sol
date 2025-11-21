import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: string | Error | null;
  className?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, className, onRetry }: ErrorProps) {
  if (!error) return null;

  const errorMessage =
    error instanceof Error ? error.message : error || 'An error occurred';

  return (
    <div
      className={`bg-red-500/20 border border-red-500/50 rounded-xl p-4 ${className || ''}`}
    >
      <div className='flex items-start gap-3'>
        <AlertCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
        <div className='flex-1'>
          <p className='text-red-200 text-sm'>{errorMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className='mt-2 text-red-300 hover:text-red-200 text-sm underline'
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
