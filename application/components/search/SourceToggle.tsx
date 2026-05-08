import { cn } from '@/lib/utils';
import type { PaperSource } from '@/lib/types';

const OPTIONS: { value: PaperSource; label: string }[] = [
  { value: 'pubmed', label: 'PubMed' },
  { value: 'semantic', label: 'Semantic Scholar' },
  { value: 'both', label: 'Both' },
];

interface SourceToggleProps {
  value: PaperSource;
  onChange: (value: PaperSource) => void;
  disabled?: boolean;
}

export function SourceToggle({ value, onChange, disabled }: SourceToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-surface-raised rounded-pill p-1 border border-border">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1 rounded-pill text-xs font-medium transition-all duration-200 whitespace-nowrap',
            value === opt.value
              ? 'bg-primary text-white shadow-soft-sm'
              : 'text-app-text/55 hover:text-app-text hover:bg-border/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
