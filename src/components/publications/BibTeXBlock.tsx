import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface BibTeXBlockProps {
  bibtex: string;
}

export function BibTeXBlock({ bibtex }: BibTeXBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await copyToClipboard(bibtex);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'BibTeX citation copied successfully',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy BibTeX to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
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
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
        <code>{bibtex}</code>
      </pre>
    </div>
  );
}
