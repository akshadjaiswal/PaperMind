import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PaperCard } from './PaperCard';
import { PaperCardSkeleton } from './PaperCardSkeleton';
import { usePaperMindStore } from '@/lib/store';
import type { AppStatus } from '@/lib/types';

interface PaperListProps {
  warnings?: string[];
}

export function PaperList({ warnings }: PaperListProps) {
  const { papers, selectedIds, toggleSelect, clearSelected, status } = usePaperMindStore();

  const isSearching = status === 'searching';
  const hasResults = papers.length > 0;

  return (
    <div className="relative">
      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="mb-3 bg-secondary/25 border border-secondary rounded-card p-3 text-xs text-app-text/65 font-sans">
          {warnings[0]}
        </div>
      )}

      {/* Skeleton loading */}
      {isSearching && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PaperCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isSearching && !hasResults && (
        <div className="text-center py-16 font-sans text-app-text/40">
          <Search size={36} className="mx-auto mb-4 text-app-text/20" />
          <p className="text-base">No papers found for this topic.</p>
          <p className="text-sm mt-1">Try broader keywords or switching to &quot;Both&quot; sources.</p>
        </div>
      )}

      {/* Paper cards */}
      {!isSearching && hasResults && (
        <>
          <div className="space-y-3">
            <AnimatePresence>
              {papers.map((paper, index) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedIds.includes(paper.id)}
                  onToggle={() => toggleSelect(paper.id)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Sticky selection counter */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="sticky bottom-0 mt-3 bg-bg/95 backdrop-blur-sm border-t border-border py-3 px-1 flex justify-between items-center"
              >
                <span className="text-sm font-sans text-app-text/60">
                  <span className="font-semibold text-app-text">{selectedIds.length}</span> of{' '}
                  {papers.length} papers selected
                  {selectedIds.length < 3 && (
                    <span className="text-app-text/40 ml-1">
                      (select {3 - selectedIds.length} more to synthesize)
                    </span>
                  )}
                </span>
                <button
                  onClick={clearSelected}
                  className="text-xs text-app-text/45 hover:text-app-text/70 font-sans transition-colors"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
