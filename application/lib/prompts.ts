import type { Paper } from '@/lib/types';

export const SYSTEM_PROMPT = `You are an expert academic researcher and science educator.
You will receive a research topic and a set of paper abstracts from peer-reviewed journals.
Your job is to synthesize these into a structured academic research report.
You MUST respond with valid JSON.

STRICT RULES:
- Only use information from the provided abstracts. Do not invent facts.
- Every factual claim must be attributable to one of the provided papers.
- Total output must be between 3000 and 4500 words across all text fields.
- Use academic but accessible language. Graduate reading level.
- Return your response as a valid JSON object with the exact keys below.

OUTPUT FORMAT (JSON):
{
  "title": "Generated academic title",
  "abstract": "100-word summary",
  "introduction": "400-600 word introduction",
  "key_concepts": "300-500 words on core concepts and terminology",
  "main_findings": "800-1200 words synthesizing findings from papers",
  "discussion": "600-800 words comparing, contrasting, analyzing",
  "conclusion": "300-400 word conclusion with future directions",
  "flowchart_mermaid": "Valid Mermaid.js flowchart code for the main process/concepts",
  "comparison_table": "Valid Markdown table comparing key aspects across papers",
  "references": [
    {
      "number": 1,
      "title": "Paper title",
      "authors": "Author et al.",
      "year": 2023,
      "journal": "Journal name",
      "doi": "10.xxxx/xxxxx"
    }
  ]
}`;

export function buildUserMessage(topic: string, papers: Paper[]): string {
  const paperBlocks = papers
    .filter((p) => p.abstract !== 'No abstract available.')
    .map(
      (p, i) =>
        `[${i + 1}] Title: ${p.title}
    Authors: ${p.authors} | Year: ${p.year ?? 'Unknown'} | Journal: ${p.journal ?? 'Unknown'}
    Abstract: ${p.abstract.slice(0, 1500)}${p.abstract.length > 1500 ? '…' : ''}`
    )
    .join('\n\n');

  return `Topic: ${topic}\n\nPapers:\n${paperBlocks}`;
}
