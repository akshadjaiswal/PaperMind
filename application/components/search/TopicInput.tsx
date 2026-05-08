import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

export function TopicInput({ onSearch, isLoading }: TopicInputProps) {
  const { sources, setSources, topic, setTopic } = usePaperMindStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic },
  });

  const onSubmit = (values: FormValues) => {
    setTopic(values.topic);
    onSearch(values.topic, sources);
  };

  return (
    <div className="w-full">
      {/* Main input card */}
      <motion.div
        animate={
          isLoading
            ? { boxShadow: ['0 0 0 2px #8C9A84', '0 0 0 4px rgba(140,154,132,0.3)', '0 0 0 2px #8C9A84'] }
            : { boxShadow: '0 4px 16px rgba(45,58,49,0.08)' }
        }
        transition={isLoading ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
        className="bg-surface rounded-card border border-border overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="shrink-0">
              {isLoading ? (
                <Loader2 size={20} className="text-primary animate-spin" />
              ) : (
                <Search size={20} className="text-app-text/35" />
              )}
            </div>
            <input
              {...register('topic')}
              type="text"
              placeholder="Enter a research topic…"
              disabled={isLoading}
              className={cn(
                'flex-1 bg-transparent outline-none text-app-text font-sans text-base',
                'placeholder:text-app-text/35 disabled:opacity-60 min-w-0'
              )}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0 rounded-pill bg-interactive text-white px-5 py-2 text-sm font-medium hover:bg-interactive-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft-sm"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Source toggle row */}
          <div className="flex items-center gap-3 px-5 pb-4 pt-0 border-t border-border/50">
            <span className="text-xs text-app-text/40 font-sans">Sources:</span>
            <SourceToggle value={sources} onChange={setSources} disabled={isLoading} />
          </div>
        </form>
      </motion.div>

      {/* Validation error */}
      {errors.topic && (
        <p className="text-xs text-interactive mt-2 px-1 font-sans">{errors.topic.message}</p>
      )}
    </div>
  );
}
