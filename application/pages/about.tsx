import Head from 'next/head';
import { MainLayout } from '@/components/layout/MainLayout';

const apis = [
  {
    name: 'PubMed E-utilities',
    description: 'NIH database with 35M+ biomedical abstracts. No API key required.',
  },
  {
    name: 'Semantic Scholar',
    description: '200M+ academic papers across all disciplines. No API key required.',
  },
  {
    name: 'Unpaywall',
    description: 'Finds legal open-access PDFs for papers with a DOI.',
  },
  {
    name: 'Groq + Llama 3.3 70B',
    description: 'State-of-the-art LLM inference for synthesizing academic content.',
  },
];

const features = [
  'Real peer-reviewed papers — not hallucinated citations',
  'Structured 3,000–4,500 word synthesis',
  'Visual flowchart of the research process',
  'Side-by-side comparison table across papers',
  'Numbered references with DOI links',
  'Export to PDF or copy as Markdown',
];

export default function About() {
  return (
    <>
      <Head>
        <title>About — PaperMind</title>
      </Head>
      <MainLayout>
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="mb-12">
            <h1 className="font-serif text-4xl font-semibold text-app-text mb-4">
              What is PaperMind?
            </h1>
            <p className="font-sans text-app-text/70 text-base leading-relaxed">
              PaperMind turns any research topic into a structured academic synthesis. Type a topic,
              select real peer-reviewed papers, and get a comprehensive report — synthesized by AI
              from actual abstracts, not invented from scratch.
            </p>
          </div>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-app-text mb-5">How it works</h2>
            <div className="space-y-3">
              {[
                'Type a research topic in the search bar',
                'PaperMind fetches real papers from PubMed and Semantic Scholar',
                'You select 3–10 papers to include in the synthesis',
                'The AI generates a structured report from the actual abstracts',
                'Export your synthesis as a PDF or copy as Markdown',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="font-serif text-primary font-semibold text-base w-6 shrink-0 pt-0.5">
                    {i + 1}
                  </span>
                  <p className="font-sans text-app-text/70 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-app-text mb-5">
              What you get
            </h2>
            <div className="bg-surface rounded-card border border-border p-5 space-y-2.5">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8C9A84"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 mt-0.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="font-sans text-app-text/70 text-sm">{f}</p>
                </div>
              ))}
            </div>
          </section>

          {/* APIs */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-app-text mb-5">
              Powered by
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {apis.map((api) => (
                <div
                  key={api.name}
                  className="bg-surface rounded-card border border-border p-4"
                >
                  <p className="font-serif text-sm font-semibold text-app-text mb-1">{api.name}</p>
                  <p className="font-sans text-xs text-app-text/55 leading-relaxed">{api.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-secondary/25 border border-secondary rounded-card p-5">
            <h2 className="font-serif text-base font-semibold text-app-text mb-2">
              Important disclaimer
            </h2>
            <p className="font-sans text-sm text-app-text/65 leading-relaxed">
              PaperMind synthesizes information from real paper abstracts, but AI summaries can
              contain errors or misinterpretations. Always verify claims against the original papers
              before using this synthesis in academic or professional work.
            </p>
          </section>
        </div>
      </MainLayout>
    </>
  );
}
