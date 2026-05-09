import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { usePaperMindStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  onClick: () => void;
}

export function GenerateButton({ onClick }: GenerateButtonProps) {
  const { selectedIds, status } = usePaperMindStore();
  const isGenerating = status === 'generating';
  const count = selectedIds.length;
  const canGenerate = count >= 3;
  const hasAny = count >= 1;

  return (
    <AnimatePresence>
      {(hasAny || isGenerating) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none px-5 md:pl-[calc(256px+1.25rem)]"
        >
          <div className="pointer-events-auto w-full max-w-sm">
            <motion.button
              onClick={canGenerate && !isGenerating ? onClick : undefined}
              disabled={!canGenerate || isGenerating}
              whileHover={canGenerate && !isGenerating ? { scale: 1.02 } : {}}
              whileTap={canGenerate && !isGenerating ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15 }}
              className={cn(
                'w-full rounded-pill py-3.5 px-8 text-sm font-medium',
                'flex items-center justify-center gap-2',
                'transition-all duration-300',
                'backdrop-blur-sm',
                canGenerate && !isGenerating
                  ? 'bg-interactive text-white shadow-soft-xl hover:bg-interactive-hover cursor-pointer'
                  : isGenerating
                  ? 'bg-interactive/80 text-white shadow-soft-lg cursor-wait'
                  : 'bg-app-text/15 text-app-text/45 shadow-soft-md cursor-not-allowed backdrop-blur-none'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Synthesizing…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  {canGenerate
                    ? `Synthesize ${count} paper${count !== 1 ? 's' : ''}`
                    : `Select ${3 - count} more to synthesize`}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
