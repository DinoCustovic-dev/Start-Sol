import * as React from 'react';

import { cn } from '@/lib/utils';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

type ButtonLinkProps = {
  variant?: 'primary' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'base';
  isDarkBg?: boolean;
  leftIcon?: React.ElementType | null;
  rightIcon?: React.ElementType | null;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      //className,
      variant = 'primary',
      size = 'base',
      isDarkBg = false,
      leftIcon: LeftIcon = null,
      rightIcon: RightIcon = null,
      classNames,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        className={cn(
          'inline-flex items-center rounded font-medium transition-colors duration-75',
          size === 'base' ? 'px-3 py-1.5 text-sm' : 'px-2 py-1 text-xs',
          variant === 'primary' &&
            'bg-primary-500 text-white hover:bg-primary-600',
          variant === 'outline' &&
            (isDarkBg
              ? 'text-primary-500 border border-primary-500 hover:bg-gray-900'
              : 'text-primary-500 border-primary-500 border hover:bg-primary-50'),
          variant === 'ghost' &&
            (isDarkBg
              ? 'text-primary-500 hover:bg-gray-900'
              : 'text-primary-500 hover:bg-primary-50'),
          variant === 'light' &&
            'bg-white text-gray-700 border hover:bg-gray-100',
          variant === 'dark' &&
            'bg-gray-900 text-white border-gray-600 border hover:bg-gray-800',
          'focus-visible:ring-primary-500 focus:outline-none',
          rest.href ? '' : 'cursor-not-allowed opacity-70',
        )}
        {...rest}
      >
        {LeftIcon && typeof LeftIcon === 'function' && (
          <LeftIcon className={cn('mr-1', classNames?.leftIcon)} />
        )}
        {children}
        {RightIcon && typeof RightIcon === 'function' && (
          <RightIcon className={cn('ml-1', classNames?.rightIcon)} />
        )}
      </UnstyledLink>
    );
  },
);

export default ButtonLink;
