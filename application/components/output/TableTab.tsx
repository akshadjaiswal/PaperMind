import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface TableTabProps {
  markdown: string;
}

const components: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full border-collapse text-sm font-sans">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-secondary/25 border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  th: ({ children }) => (
    <th className="text-left px-4 py-3 font-serif text-xs font-semibold text-app-text uppercase tracking-wide border-r border-border/50 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border-b border-border/50 border-r border-r-border/30 last:border-r-0 text-app-text/75 align-top leading-relaxed text-[13px]">
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => {
    const isEven = Number((props as { 'data-index'?: number })['data-index']) % 2 === 0;
    return (
      <tr className={`${isEven ? '' : 'bg-surface-raised/50'} hover:bg-primary/5 transition-colors`}>
        {children}
      </tr>
    );
  },
  p: ({ children }) => <span>{children}</span>,
};

export function TableTab({ markdown }: TableTabProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-app-text/50 font-sans">
        Comparison of key aspects across the selected papers
      </p>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
