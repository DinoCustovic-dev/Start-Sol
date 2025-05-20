import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const SpinnerIcon = ImSpinner2 as unknown as React.FC<{ className?: string }>;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'base';
  leftIcon?: React.ElementType | null;
  rightIcon?: React.ElementType | null;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'base',
      //isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
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
          'inline-flex items-center justify-center rounded font-medium transition-colors duration-75',
          size === 'base'
            ? 'px-3 py-1.5 text-sm md:text-base'
            : 'px-2 py-1 text-xs md:text-sm',
          variant === 'primary' &&
            'bg-primary-500 text-white hover:bg-primary-600',
          variant === 'outline' &&
            'text-primary-500 border border-primary-500 hover:bg-primary-50',
          variant === 'ghost' && 'text-primary-500 hover:bg-primary-50',
          variant === 'light' &&
            'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
          variant === 'dark' &&
            'bg-gray-900 text-white border border-gray-600 hover:bg-gray-800',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring disabled:cursor-not-allowed',
          isLoading && 'relative text-transparent disabled:cursor-wait',
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <SpinnerIcon className='animate-spin' />
          </div>
        )}
        {LeftIcon && typeof LeftIcon === 'function' && !isLoading && (
          <LeftIcon className={cn('mr-1', classNames?.leftIcon)} />
        )}
        {children}
        {RightIcon && typeof RightIcon === 'function' && !isLoading && (
          <RightIcon className={cn('ml-1', classNames?.rightIcon)} />
        )}
      </button>
    );
  },
);

export default Button;
