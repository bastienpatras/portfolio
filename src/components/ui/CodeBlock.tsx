import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';
import { Button } from './Button';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'plaintext',
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('relative group', className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="rounded-lg bg-muted p-4 overflow-x-auto">
        {language && (
          <div className="text-xs text-muted-foreground mb-2 font-mono">
            {language}
          </div>
        )}
        <pre className="font-mono text-sm">
          <code>
            {showLineNumbers
              ? lines.map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell pr-4 text-muted-foreground select-none text-right">
                      {i + 1}
                    </span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}
