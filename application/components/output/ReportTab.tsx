import type { OutputObject } from '@/lib/types';

const SECTIONS: { key: keyof OutputObject; label: string }[] = [
  { key: 'abstract', label: 'Abstract' },
  { key: 'introduction', label: 'Introduction' },
  { key: 'key_concepts', label: 'Key Concepts' },
  { key: 'main_findings', label: 'Main Findings' },
  { key: 'discussion', label: 'Discussion' },
  { key: 'conclusion', label: 'Conclusion' },
];

interface ReportTabProps {
  output: OutputObject;
}

export function ReportTab({ output }: ReportTabProps) {
  return (
    <div className="space-y-0">
      {/* Title */}
      <h1 className="font-serif text-2xl font-semibold text-app-text mb-6 leading-snug animate-slide-up">
        {output.title}
      </h1>

      {SECTIONS.map(({ key, label }) => {
        const content = output[key];
        if (typeof content !== 'string') return null;

        return (
          <section key={key} className="mb-8 animate-slide-up">
            {key === 'abstract' ? (
              <div className="bg-secondary/20 rounded-card p-5" style={{ boxShadow: 'inset 3px 0 0 var(--secondary-color)' }}>
                <h2 className="font-serif text-sm font-semibold text-app-text/60 uppercase tracking-widest mb-3">
                  {label}
                </h2>
                <p className="font-sans text-app-text/75 leading-relaxed text-[14px] italic">
                  {content}
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-lg font-semibold text-app-text mb-3 pb-2 border-b border-border">
                  {label}
                </h2>
                <div className="font-sans text-app-text/80 leading-relaxed text-[14px] whitespace-pre-wrap">
                  {content}
                </div>
              </>
            )}
          </section>
        );
      })}
    </div>
  );
}
