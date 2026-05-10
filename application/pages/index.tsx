import Head from 'next/head';
import { useRouter } from 'next/router';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { MeshBackground } from '@/components/layout/MeshBackground';

const TOPIC_CHIPS = [
  'transformer attention mechanism',
  'CRISPR gene editing',
  'gut microbiome depression',
  'quantum computing error correction',
];

const SOURCE_BADGES = [
  { label: 'PubMed', desc: '35M+ papers' },
  { label: 'Semantic Scholar', desc: '200M+ papers' },
  { label: 'Groq · Llama 3.3', desc: 'AI synthesis' },
  { label: 'Unpaywall', desc: 'Free PDFs' },
];

export default function Home() {
  const router = useRouter();

  const goToResearch = (topic?: string) => {
    if (topic) {
      router.push(`/research?topic=${encodeURIComponent(topic)}`);
    } else {
      router.push('/research');
    }
  };

  return (
    <>
      <Head>
        <title>PaperMind — AI Research Synthesis</title>
        <meta
          name="description"
          content="Turn any research topic into a structured academic synthesis. Real papers, real citations, AI-powered."
        />
      </Head>
      <LazyMotion features={domAnimation}>
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg">
        <MeshBackground />

        {/* Single screen, vertically centered */}
        <div className="flex h-full w-full items-center justify-center px-6 py-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-lg w-full text-center space-y-8"
          >
            {/* Logo mark */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center gap-2.5"
            >
              <div className="size-10 rounded-2xl bg-primary/15 flex items-center justify-center backdrop-blur-sm">
                <LeafIconLg />
              </div>
              <span className="font-serif text-2xl font-semibold text-app-text tracking-tight">
                PaperMind
              </span>
            </m.div>

            {/* Headline */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-app-text leading-tight mb-4">
                Research Synthesis,
                <br />
                <span className="text-primary">Grounded in Real Papers.</span>
              </h1>
              <p className="font-sans text-base text-app-text/55 leading-relaxed max-w-md mx-auto">
                Search peer-reviewed papers from PubMed and Semantic Scholar,
                select the ones that matter, and get a structured AI-synthesized
                report in seconds.
              </p>
            </m.div>

            {/* Source badges */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center gap-2 flex-wrap"
            >
              {SOURCE_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface/70 backdrop-blur-sm border border-border text-xs font-sans shadow-soft-sm"
                >
                  <span className="font-medium text-app-text/80">{b.label}</span>
                  <span className="text-app-text/35">{b.desc}</span>
                </div>
              ))}
            </m.div>

            {/* Example topic chips */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <p className="text-[11px] font-sans font-medium text-app-text/35 uppercase tracking-wider">
                Try a topic
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {TOPIC_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => goToResearch(chip)}
                    className="px-3 py-1.5 rounded-pill bg-surface/60 backdrop-blur-sm border border-border text-xs font-sans text-app-text/65 hover:text-app-text hover:bg-surface hover:border-primary/40 hover:shadow-soft-sm transition-all duration-200"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </m.div>

            {/* Primary CTA */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={() => goToResearch()}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-interactive text-white font-sans font-semibold text-sm hover:bg-interactive-hover shadow-soft-md hover:shadow-soft-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Researching
                <ArrowRight />
              </button>
              <p className="text-[11px] text-app-text/30 font-sans mt-4">
                No sign-up · No database · Free to use
              </p>
            </m.div>
          </m.div>
        </div>
        </div>
      </LazyMotion>
    </>
  );
}

function LeafIconLg() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8C9A84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
