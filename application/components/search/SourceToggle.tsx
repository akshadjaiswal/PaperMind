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
    <div className="flex items-center bg-surface-raised rounded-pill border border-border/60 p-0.5 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-2.5 py-1 rounded-pill text-[11px] font-medium transition-all duration-200 whitespace-nowrap leading-none',
            value === opt.value
              ? 'bg-primary text-white shadow-soft-sm'
              : 'text-app-text/45 hover:text-app-text/75',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
