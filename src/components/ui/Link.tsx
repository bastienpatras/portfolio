import * as React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LinkProps extends RouterLinkProps {
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external, ...props }, ref) => {
    if (external || typeof props.to === 'string' && props.to.startsWith('http')) {
      return (
        <a
          ref={ref}
          href={props.to as string}
          className={cn(
            'text-primary hover:underline underline-offset-4',
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <RouterLink
        ref={ref}
        className={cn(
          'text-primary hover:underline underline-offset-4',
          className
        )}
        {...props}
      />
    );
  }
);

Link.displayName = 'Link';
