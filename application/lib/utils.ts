import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OutputObject } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAbstract(text: string, maxLength = 280): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function titleSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.split(' ').filter((t) => t.length > 2));
  const tokensB = new Set(b.split(' ').filter((t) => t.length > 2));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap++;
  }
  return overlap / Math.max(tokensA.size, tokensB.size);
}

export function formatOutputAsMarkdown(output: OutputObject): string {
  const sections = [
    ['Abstract', output.abstract],
    ['Introduction', output.introduction],
    ['Key Concepts', output.key_concepts],
    ['Main Findings', output.main_findings],
    ['Discussion', output.discussion],
    ['Conclusion', output.conclusion],
  ];

  const body = sections.map(([heading, content]) => `## ${heading}\n\n${content}`).join('\n\n---\n\n');

  const refs = output.references
    .map(
      (r) =>
        `[${r.number}] ${r.title} — ${r.authors}${r.year ? ` (${r.year})` : ''}${r.journal ? `. ${r.journal}` : ''}${r.doi ? `. DOI: ${r.doi}` : ''}`
    )
    .join('\n');

  return `# ${output.title}\n\n${body}\n\n---\n\n## Flowchart\n\n\`\`\`mermaid\n${output.flowchart_mermaid}\n\`\`\`\n\n---\n\n## Comparison Table\n\n${output.comparison_table}\n\n---\n\n## References\n\n${refs}`;
}
