import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatOutputAsMarkdown } from '@/lib/utils';
import type { OutputObject } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  output: OutputObject;
  className?: string;
}

export function CopyButton({ output, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatOutputAsMarkdown(output));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore silently
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-medium font-sans',
        'border border-border text-app-text/60 hover:text-app-text hover:border-primary/40',
        'bg-surface hover:bg-surface-raised transition-all duration-200',
        className
      )}
    >
      {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
