import { m } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn, truncateAbstract } from '@/lib/utils';
import type { Paper } from '@/lib/types';

interface PaperCardProps {
  paper: Paper;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

export function PaperCard({ paper, isSelected, onToggle, index }: PaperCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05, ease: 'easeOut' }}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      className={cn(
        'bg-surface rounded-card border transition-all duration-300 p-5 flex gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isSelected
          ? 'border-primary/50 shadow-soft-md bg-primary/5'
          : 'border-border shadow-soft-sm hover:shadow-soft-md hover:border-primary/30'
      )}
    >
      {/* Checkbox */}
      <div className="shrink-0 pt-0.5" role="presentation" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border"
          aria-label={`Select paper: ${paper.title}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className="font-serif text-sm font-medium text-app-text leading-snug line-clamp-2">
          {paper.title}
        </p>

        {/* Meta */}
        <p className="font-sans text-xs text-app-text/55 mt-1.5">
          {paper.authors}
          {paper.year && <span className="text-app-text/40"> · {paper.year}</span>}
          {paper.journal && (
            <span className="italic text-app-text/40"> · {paper.journal}</span>
          )}
        </p>

        {/* Abstract */}
        {paper.abstract && paper.abstract !== 'No abstract available.' && (
          <p className="font-sans text-xs text-app-text/65 mt-2 leading-relaxed">
            {truncateAbstract(paper.abstract)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-3">
          <Badge
            variant="secondary"
            className="text-[10px] rounded-full px-2 py-0.5 font-sans font-medium bg-secondary/50 text-app-text/65 border-0"
          >
            {paper.source === 'pubmed' ? 'PubMed' : 'Semantic Scholar'}
          </Badge>

          {paper.pdf_url && (
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[11px] text-interactive hover:underline font-sans font-medium"
            >
              <ExternalLink size={11} />
              PDF
            </a>
          )}
        </div>
      </div>
    </m.div>
  );
}
