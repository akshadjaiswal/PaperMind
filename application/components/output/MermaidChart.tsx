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

  // If no diagram type declaration, prepend graph TD (top-down reads better than LR)
  if (!/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|mindmap|timeline)/i.test(s.trimStart())) {
    s = 'graph TD\n' + s;
  }

  // Force LR → TD so wide chains don't render as a squished horizontal strip
  s = s.replace(/^(graph|flowchart)\s+LR\b/im, (match) => match.replace(/LR/i, 'TD'));

  return s
    // Fix -->|label|> — stray > after closing label pipe
    .replace(/(\|[^|\n]*\|)>/g, '$1')
    // Fix double-arrow heads
    .replace(/-->>/g, '-->')
    .replace(/==>>/g, '==>')
    // Fix |>label| — pipe that starts with >
    .replace(/\|>(.*?)\|/g, '|$1|')
    // Fix --label--> (dashes around label, no pipes) → -->|label|
    .replace(/--([^->\n]+)-->/g, '-->|$1|')
    // Remove semicolons at end of lines (valid in some versions, causes parse errors in others)
    .replace(/;$/gm, '')
    // Strip any lines that are just whitespace
    .replace(/^\s*$/gm, '')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Normalize smart quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
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

        // Mermaid v11 returns error SVGs instead of throwing — detect and fall back
        if (svg.includes('Syntax error') || svg.includes('mermaid-error')) {
          console.warn('[MermaidChart] Mermaid returned error SVG. Clean chart:\n', cleanChart);
          if (!cancelled) setError('fallback');
          return;
        }

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            // Read natural dimensions from viewBox before stripping width/height attributes
            const vb = svgEl.getAttribute('viewBox');
            const naturalW = parseFloat(svgEl.getAttribute('width') || '0');
            const naturalH = parseFloat(svgEl.getAttribute('height') || '0');

            svgEl.removeAttribute('width');
            svgEl.removeAttribute('height');
            svgEl.style.width = '100%';
            svgEl.style.display = 'block';

            if (vb) {
              // viewBox="minX minY width height" — use to set preserveAspectRatio and min-height
              const parts = vb.split(/[\s,]+/);
              const vbW = parseFloat(parts[2]);
              const vbH = parseFloat(parts[3]);
              if (vbW > 0 && vbH > 0) {
                svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                // Let CSS aspect-ratio handle height; floor at 240px for tiny charts
                const containerW = containerRef.current.clientWidth || 600;
                const renderedH = Math.max(240, Math.round((vbH / vbW) * containerW));
                svgEl.style.height = `${renderedH}px`;
              }
            } else if (naturalW > 0 && naturalH > 0) {
              const containerW = containerRef.current.clientWidth || 600;
              const renderedH = Math.max(240, Math.round((naturalH / naturalW) * containerW));
              svgEl.style.height = `${renderedH}px`;
            } else {
              svgEl.style.minHeight = '240px';
            }
          }
          setRendered(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn('[MermaidChart] Render failed. Clean chart was:\n', sanitizeMermaid(chart));
          console.warn('[MermaidChart] Error:', e);
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
        'mermaid-container w-full rounded-card bg-surface p-6 transition-opacity duration-500',
        rendered ? 'opacity-100' : 'opacity-0 min-h-[240px]'
      )}
    />
  );
}
