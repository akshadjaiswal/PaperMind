import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MermaidChartProps {
  chart: string;
}

/**
 * Sanitizes LLM-generated Mermaid to fix common syntax mistakes.
 * LLMs frequently output invalid arrow/label combinations.
 */
function sanitizeMermaid(raw: string): string {
  return (
    raw
      // Strip markdown code fences
      .replace(/^```(?:mermaid)?\s*/im, '')
      .replace(/\s*```\s*$/m, '')
      .trim()
      // Fix -->|label|> — stray > after closing label pipe
      .replace(/(\|[^|]*\|)>/g, '$1')
      // Fix ==>|label|> and -.->|label|> variants
      .replace(/(==\|[^|]*\|)>/g, '$1')
      .replace(/(-\.-\|[^|]*\|)>/g, '$1')
      // Fix double-arrow heads like -->> or ==>> (invalid in flowchart LR/TD)
      .replace(/-->>/g, '-->')
      .replace(/==>>/g, '==>')
      // Fix |>label| — pipe arrow label that starts with >
      .replace(/\|>(.*?)\|/g, '|$1|')
      // Fix unclosed brackets: [label without closing]
      // Only fixable per-line safely — skip, mermaid gives decent error for these
      // Normalize smart quotes that LLMs sometimes emit
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
  );
}

export function MermaidChart({ chart }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const [rawChart, setRawChart] = useState('');

  useEffect(() => {
    if (!containerRef.current || !chart) return;
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: '#DDE5D9',
            primaryTextColor: '#2D3A31',
            primaryBorderColor: '#8C9A84',
            lineColor: '#DCCFC2',
            secondaryColor: '#F4F2EE',
            tertiaryColor: '#F9F8F4',
            background: '#FFFFFF',
            mainBkg: '#DDE5D9',
            nodeBorder: '#8C9A84',
            clusterBkg: '#F4F2EE',
            titleColor: '#2D3A31',
            edgeLabelBackground: '#F9F8F4',
            fontFamily: 'Source Sans 3, system-ui, sans-serif',
            fontSize: '14px',
          },
        });

        const cleanChart = sanitizeMermaid(chart);
        setRawChart(cleanChart);

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, cleanChart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
          }
          setRendered(true);
        }
      } catch (e) {
        if (!cancelled) {
          // Log for debugging but don't surface raw parse error to user
          console.warn('[MermaidChart] Render failed after sanitization:', e);
          setError('fallback');
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  // Graceful fallback: show formatted source instead of crash
  if (error === 'fallback') {
    return (
      <div className="bg-surface-raised rounded-card border border-border p-5">
        <p className="text-xs text-app-text/45 font-sans mb-3">
          Diagram could not render — showing source instead.
        </p>
        <pre className="text-xs text-app-text/60 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap bg-surface rounded-xl p-4 border border-border/50">
          {rawChart || sanitizeMermaid(chart)}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'mermaid-container w-full overflow-x-auto rounded-card bg-surface p-4 transition-opacity duration-500',
        rendered ? 'opacity-100' : 'opacity-0 min-h-[120px]'
      )}
    />
  );
}
