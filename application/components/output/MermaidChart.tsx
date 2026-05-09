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
  let s = raw
    // Strip markdown code fences
    .replace(/^```(?:mermaid)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // If LLM output is a single line with literal \n sequences, decode them
  if (!s.includes('\n') && s.includes('\\n')) {
    s = s.replace(/\\n/g, '\n');
  }

  // If still single-line flowchart, split on node transition patterns to add newlines
  // e.g. "graph LR A[x] --> B[y] --> C[z]" → multi-line
  if (!s.includes('\n') && /^(graph|flowchart)\s/i.test(s)) {
    // Split after the graph directive line, then add newline before each arrow segment
    s = s
      .replace(/^((graph|flowchart)\s+\w+)\s+/i, '$1\n')
      .replace(/\s+([\w"']+[\[({>])/g, '\n$1');
  }

  // If no diagram type declaration, prepend graph LR
  if (!/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|mindmap|timeline)/i.test(s.trimStart())) {
    s = 'graph LR\n' + s;
  }

  return s
    // Fix -->|label|> — stray > after closing label pipe
    .replace(/(\|[^|\n]*\|)>/g, '$1')
    // Fix double-arrow heads
    .replace(/-->>/g, '-->')
    .replace(/==>>/g, '==>')
    // Fix |>label| — pipe that starts with >
    .replace(/\|>(.*?)\|/g, '|$1|')
    // Normalize smart quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");
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
