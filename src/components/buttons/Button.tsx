/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const SpinnerIcon = ImSpinner2 as React.FC<{ className?: string }>;

type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'light'
  | 'dark';

type ButtonSizes = 'sm' | 'base';

type ButtonProps<T extends React.ElementType = 'button'> = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: ButtonVariants;
  size?: ButtonSizes;
  leftIcon?: React.ElementType | null;
  rightIcon?: React.ElementType | null;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

const defaultElement = 'button';

const Button = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      as,
      ...restProps
    }: ButtonProps<T>,
    ref: React.Ref<any>, // Generalizovan tip ref-a da se ne javljaju greške
  ) => {
    const Component = as || defaultElement;
    const disabled = isLoading || buttonDisabled;

    return (
      <Component
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium transition-colors duration-75',
          size === 'base'
            ? 'px-3 py-1.5 text-sm md:text-base'
            : 'px-2 py-1 text-xs md:text-sm',
          variant === 'primary' &&
            'bg-primary-500 text-white hover:bg-primary-600',
          variant === 'secondary' &&
            'bg-purple-600 text-white hover:bg-purple-700',
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
        {...restProps}
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
      </Component>
    );
  },
);

export default Button;
