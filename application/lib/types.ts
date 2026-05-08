export type AppStatus = 'idle' | 'searching' | 'generating' | 'done' | 'error';
export type PaperSource = 'pubmed' | 'semantic' | 'both';
export type ErrorType =
  | 'rate_limit'
  | 'timeout'
  | 'parse_failure'
  | 'search_failure'
  | 'network'
  | null;

export interface Paper {
  id: string;
  source: 'pubmed' | 'semantic';
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  abstract: string;
  doi: string | null;
  pdf_url: string | null;
}

export interface Reference {
  number: number;
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  doi: string | null;
}

export interface OutputObject {
  title: string;
  abstract: string;
  introduction: string;
  key_concepts: string;
  main_findings: string;
  discussion: string;
  conclusion: string;
  flowchart_mermaid: string;
  comparison_table: string;
  references: Reference[];
}

export interface SearchRequest {
  topic: string;
  sources: PaperSource;
}

export interface GenerateRequest {
  topic: string;
  papers: Paper[];
}

export interface SearchResponse {
  papers: Paper[];
  warnings?: string[];
  error?: string;
}

export interface GenerateResponse {
  output?: OutputObject;
  error?: ErrorType;
  retry_after?: number;
}
