import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { SourceToggle } from './SourceToggle';
import { usePaperMindStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { PaperSource } from '@/lib/types';

const schema = z.object({
  topic: z
    .string()
    .min(3, 'Topic must be at least 3 characters')
    .max(200, 'Topic too long'),
});

type FormValues = z.infer<typeof schema>;

interface TopicInputProps {
  onSearch: (topic: string, sources: PaperSource) => void;
  isLoading?: boolean;
}

const SOURCE_LABELS: Record<PaperSource, string> = {
  pubmed: 'PubMed',
  semantic: 'Semantic Scholar',
  both: 'Both sources',
};

export function TopicInput({ onSearch, isLoading }: TopicInputProps) {
  const { sources, setSources, topic, setTopic } = usePaperMindStore();
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic },
  });

  const currentValue = watch('topic');

  const onSubmit = (values: FormValues) => {
    setTopic(values.topic);
    setSourcesOpen(false);
    onSearch(values.topic, sources);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="w-full">
      <motion.div
        animate={
          isLoading
            ? {
                boxShadow: [
                  '0 0 0 1.5px #8C9A84',
                  '0 0 0 3px rgba(140,154,132,0.25)',
                  '0 0 0 1.5px #8C9A84',
                ],
              }
            : { boxShadow: 'none' }
        }
        transition={isLoading ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
        className="bg-surface rounded-2xl border border-border overflow-visible relative"
        style={{ boxShadow: isLoading ? undefined : '0 2px 8px rgba(45,58,49,0.06)' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Main input row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            {/* Left icon */}
            <div className="shrink-0 text-app-text/30">
              {isLoading ? (
                <Loader2 size={17} className="text-primary animate-spin" />
              ) : (
                <Search size={17} />
              )}
            </div>

            {/* Input */}
            <input
              {...register('topic')}
              type="text"
              placeholder="Enter a research topic…"
              disabled={isLoading}
              className={cn(
                'flex-1 bg-transparent outline-none text-app-text font-sans text-[15px]',
                'placeholder:text-app-text/30 disabled:opacity-60 min-w-0',
              )}
              autoComplete="off"
            />

            {/* Clear button — visible when there's text */}
            <AnimatePresence>
              {currentValue && !isLoading && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setValue('topic', '')}
                  className="shrink-0 w-5 h-5 rounded-full bg-app-text/10 flex items-center justify-center text-app-text/40 hover:text-app-text/70 hover:bg-app-text/15 transition-colors"
                >
                  <X size={11} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Send / Search button */}
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 rounded-xl bg-interactive text-white px-4 py-2 text-[13px] font-semibold hover:bg-interactive-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft-sm active:scale-95"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Bottom bar — sources tool button */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-0" ref={dropdownRef}>
            {/* Sources button — Claude-style tool toggle */}
            <div className="relative">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setSourcesOpen((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium font-sans',
                  'transition-all duration-200 border',
                  sourcesOpen
                    ? 'bg-primary/10 text-primary border-primary/25'
                    : 'text-app-text/45 border-transparent hover:bg-surface-raised hover:text-app-text/65 hover:border-border',
                  isLoading && 'opacity-40 cursor-not-allowed',
                )}
              >
                <SlidersHorizontal size={12} />
                Sources
                <span
                  className={cn(
                    'ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    sources === 'both'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-interactive/15 text-interactive',
                  )}
                >
                  {SOURCE_LABELS[sources]}
                </span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {sourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute bottom-full left-0 mb-2 z-50 bg-surface rounded-2xl border border-border shadow-soft-lg p-3 min-w-[220px]"
                  >
                    <p className="text-[10px] text-app-text/35 font-sans uppercase tracking-wider mb-2 px-1">
                      Paper sources
                    </p>
                    <SourceToggle value={sources} onChange={(v) => { setSources(v); setSourcesOpen(false); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hint text */}
            <span className="text-[11px] text-app-text/25 font-sans">
              Press Enter to search
            </span>
          </div>
        </form>
      </motion.div>

      {errors.topic && (
        <p className="text-xs text-interactive mt-2 px-1 font-sans">{errors.topic.message}</p>
      )}
    </div>
  );
}
