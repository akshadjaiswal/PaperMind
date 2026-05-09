import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputObject } from '@/lib/types';

interface ExportButtonProps {
  output: OutputObject;
  className?: string;
}

export function ExportButton({ output: _output, className }: ExportButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={cn(
        'flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-medium font-sans',
        'border border-border text-app-text/60 hover:text-app-text hover:border-primary/40',
        'bg-surface hover:bg-surface-raised transition-all duration-200',
        className
      )}
    >
      <Printer size={13} />
      Print / Save PDF
    </button>
  );
}
