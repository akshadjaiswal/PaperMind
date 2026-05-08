import { Loader2, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePaperMindStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  onClick: () => void;
}

export function GenerateButton({ onClick }: GenerateButtonProps) {
  const { selectedIds, status } = usePaperMindStore();
  const isGenerating = status === 'generating';
  const canGenerate = selectedIds.length >= 3;
  const isDisabled = !canGenerate || isGenerating;

  const button = (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'w-full rounded-pill py-3.5 px-8 text-sm font-medium transition-all duration-200',
        'flex items-center justify-center gap-2',
        'shadow-soft-sm hover:shadow-soft-md',
        canGenerate && !isGenerating
          ? 'bg-interactive text-white hover:bg-interactive-hover'
          : 'bg-app-text/10 text-app-text/40 cursor-not-allowed',
        isGenerating && 'bg-interactive/70 text-white cursor-wait'
      )}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Synthesizing…
        </>
      ) : (
        <>
          <Sparkles size={16} />
          Synthesize Research
        </>
      )}
    </button>
  );

  if (!canGenerate && !isGenerating) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-app-text text-bg text-xs rounded-xl px-3 py-1.5 font-sans"
          >
            Select at least 3 papers to synthesize
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
