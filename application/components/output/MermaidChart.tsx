import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MermaidChartProps {
  chart: string;
}

export function MermaidChart({ chart }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !chart) return;
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
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

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart.trim());

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive
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
          console.error('[MermaidChart] Render error:', e);
          setError('Could not render the flowchart diagram.');
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="bg-surface-raised rounded-card p-6 text-center">
        <p className="text-sm text-app-text/50 font-sans">{error}</p>
        <pre className="text-xs mt-3 text-app-text/35 font-mono overflow-x-auto whitespace-pre-wrap">
          {chart}
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
