import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MermaidChart } from './MermaidChart';

interface FlowchartTabProps {
  mermaid: string;
}

export function FlowchartTab({ mermaid }: FlowchartTabProps) {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-xs text-app-text/50 font-sans">
        Research process flowchart generated from your selected papers
      </p>

      <MermaidChart chart={mermaid} />

      {/* Source toggle */}
      <button
        onClick={() => setShowSource(!showSource)}
        className="flex items-center gap-1.5 text-xs text-app-text/40 hover:text-app-text/60 transition-colors font-sans"
      >
        {showSource ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {showSource ? 'Hide' : 'View'} Mermaid source
      </button>

      {showSource && (
        <pre className="text-xs bg-surface-raised rounded-card p-4 overflow-x-auto text-app-text/60 font-mono leading-relaxed whitespace-pre-wrap border border-border">
          {mermaid}
        </pre>
      )}
    </div>
  );
}
