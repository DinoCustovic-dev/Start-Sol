import { Loader } from 'lucide-react';

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message, className }: LoadingProps) {
  if (!message) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 ${className || ''}`}
    >
      <Loader className='w-16 h-16 text-purple-300 animate-spin mb-4' />
      <p className='text-gray-300 text-center max-w-md'>{message}</p>
    </div>
  );
}
