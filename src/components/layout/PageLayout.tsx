import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  fullWidth?: boolean;
}

export function PageLayout({
  children,
  title,
  description,
  className,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <div className={cn('py-8 md:py-12', className)}>
      <div
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          fullWidth ? 'max-w-full' : 'max-w-7xl'
        )}
      >
        {(title || description) && (
          <div className="mb-8 md:mb-12">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
