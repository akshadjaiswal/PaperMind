import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { PaperSource } from '@/lib/types';

const OPTIONS: { value: PaperSource; label: string; description: string }[] = [
  { value: 'pubmed', label: 'PubMed', description: 'Biomedical & life sciences' },
  { value: 'semantic', label: 'Semantic Scholar', description: 'All disciplines, AI-powered' },
  { value: 'both', label: 'Both sources', description: 'Broader coverage, deduped' },
];

interface SourceToggleProps {
  value: PaperSource;
  onChange: (value: PaperSource) => void;
  disabled?: boolean;
}

export function SourceToggle({ value, onChange, disabled }: SourceToggleProps) {
  return (
    <div className="flex flex-col gap-1">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 w-full',
              isActive
                ? 'bg-primary/15 text-app-text'
                : 'text-app-text/60 hover:bg-surface-raised hover:text-app-text',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {/* Check indicator */}
            <div
              className={cn(
                'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-150',
                isActive
                  ? 'bg-primary border-primary'
                  : 'border-border',
              )}
            >
              {isActive && <Check size={9} className="text-white" strokeWidth={3} />}
            </div>

            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-tight">{opt.label}</p>
              <p className="text-[11px] text-app-text/40 mt-0.5 leading-tight">{opt.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
