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
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
          <MeshBackground />

          {/* Glass card */}
          <m.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-lg w-full rounded-[2rem] bg-white/40 dark:bg-black/25 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-soft-xl px-8 sm:px-10 py-10 text-center space-y-7"
          >
            {/* Logo */}
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <LeafIconLg />
              </div>
              <span className="font-serif text-3xl font-semibold text-app-text tracking-tight">
                PaperMind
              </span>
            </m.div>

            {/* Headline */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-app-text leading-[1.15] mb-3">
                Research Synthesis,
                <br />
                <span className="text-primary">Grounded in Real Papers.</span>
              </h1>
              <p className="font-sans text-[15px] text-app-text/55 leading-relaxed max-w-sm mx-auto">
                Fetch real peer-reviewed papers, select what matters, and get a
                structured AI report in seconds.
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface/80 backdrop-blur-sm border border-border/60 text-[11px] font-sans shadow-soft-sm"
                >
                  <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="font-semibold text-app-text/75">{b.label}</span>
                  <span className="text-app-text/35">{b.desc}</span>
                </div>
              ))}
            </m.div>

            {/* Topic chips */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2.5"
            >
              <p className="text-[11px] font-sans font-medium text-app-text/40 tracking-widest uppercase">
                Try a topic →
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {TOPIC_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => goToResearch(chip)}
                    className="px-3.5 py-1.5 rounded-pill bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-xs font-sans font-medium text-app-text/70 hover:text-app-text transition-all duration-200 hover:shadow-soft-sm"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </m.div>

            {/* CTA */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-1"
            >
              <button
                onClick={() => goToResearch()}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-pill bg-interactive hover:bg-interactive-hover text-white font-sans font-semibold text-[15px] shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
              >
                Start Researching
                <ArrowRight />
              </button>
            </m.div>
          </m.div>

          {/* Tagline below card */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-[11px] text-app-text/30 font-sans mt-5 text-center"
          >
            No sign-up · No database · Free to use
          </m.p>
        </div>
      </LazyMotion>
    </>
  );
}

function LeafIconLg() {
  return (
    <svg
      width="22"
      height="22"
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
