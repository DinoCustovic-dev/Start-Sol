import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const SpinnerIcon = ImSpinner2 as unknown as React.FC<{ className?: string }>;

type IconButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'base';
  icon: React.ElementType;
  classNames?: { icon?: string };
} & React.ComponentPropsWithRef<'button'>;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'base',
      isDarkBg = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded transition-colors duration-75',
          size === 'base' ? 'p-2 text-sm' : 'p-1.5 text-xs',
          variant === 'primary' &&
            'bg-primary-500 text-white hover:bg-primary-600',
          variant === 'outline' &&
            (isDarkBg
              ? 'text-primary-500 border border-primary-500 hover:bg-gray-900'
              : 'text-primary-500 border border-primary-500 hover:bg-primary-50'),
          variant === 'ghost' &&
            (isDarkBg
              ? 'text-primary-500 hover:bg-gray-900'
              : 'text-primary-500 hover:bg-primary-50'),
          variant === 'light' &&
            'bg-white text-gray-700 border hover:bg-gray-100',
          variant === 'dark' &&
            'bg-gray-900 text-white border hover:bg-gray-800',
          'focus-visible:ring-primary-500 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-70',
          isLoading && 'relative text-transparent cursor-wait',
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <SpinnerIcon className='animate-spin' />
          </div>
        )}
        {!isLoading && Icon && typeof Icon === 'function' && (
          <Icon className={cn('text-lg', classNames?.icon)} />
        )}
      </button>
    );
  },
);

export default IconButton;
