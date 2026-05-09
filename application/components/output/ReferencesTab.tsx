import { m } from 'framer-motion';
import type { Reference } from '@/lib/types';

interface ReferencesTabProps {
  refs: Reference[];
}

export function ReferencesTab({ refs }: ReferencesTabProps) {
  if (!refs || refs.length === 0) {
    return (
      <p className="text-sm text-app-text/40 font-sans py-4">No references available.</p>
    );
  }

  return (
    <ol className="list-none space-y-4">
      {refs.map((ref, i) => (
        <m.li
          key={ref.number}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="flex gap-4 pb-4 border-b border-border/40 last:border-b-0"
        >
          <span className="text-sm font-serif text-primary font-semibold w-8 shrink-0 pt-0.5">
            [{ref.number}]
          </span>
          <div className="text-sm font-sans text-app-text/75 leading-relaxed min-w-0">
            <span className="font-medium text-app-text">{ref.title}</span>
            <span className="text-app-text/50"> · {ref.authors}</span>
            {ref.year && (
              <span className="text-app-text/45"> ({ref.year})</span>
            )}
            {ref.journal && (
              <span className="italic text-app-text/40"> · {ref.journal}</span>
            )}
            {ref.doi && (
              <a
                href={`https://doi.org/${ref.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-interactive hover:underline text-xs font-medium"
              >
                DOI ↗
              </a>
            )}
          </div>
        </m.li>
      ))}
    </ol>
  );
}
