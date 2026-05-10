import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, m } from 'framer-motion';

import { MainLayout } from '@/components/layout/MainLayout';
import { TopicInput } from '@/components/search/TopicInput';
import { PaperList } from '@/components/search/PaperList';
import { GenerateButton } from '@/components/search/GenerateButton';
import { ProgressSteps } from '@/components/output/ProgressSteps';
import { OutputPanel } from '@/components/output/OutputPanel';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

import { usePaperMindStore } from '@/lib/store';
import { searchPapers } from '@/lib/api/search';
import { generateSynthesis } from '@/lib/api/generate';
import type { PaperSource } from '@/lib/types';

export default function Research() {
  const router = useRouter();
  const {
    topic,
    papers,
    selectedIds,
    output,
    status,
    errorType,
    retryAfter,
    sources,
    setTopic,
    setPapers,
    setOutput,
    setStatus,
    setError,
    saveToHistory,
  } = usePaperMindStore();

  const searchMutation = useMutation({
    mutationFn: searchPapers,
    gcTime: 0,
    onMutate: () => setStatus('searching'),
    onSuccess: (data) => {
      setPapers(data.papers);
      setStatus('idle');
    },
    onError: () => setError('search_failure'),
  });

  const generateMutation = useMutation({
    mutationFn: generateSynthesis,
    gcTime: 0,
    onMutate: () => setStatus('generating'),
    onSuccess: (data) => {
      if (data.error) {
        setError(data.error, data.retry_after);
      } else if (data.output) {
        setOutput(data.output);
        setStatus('done');
        saveToHistory(topic, selectedIds.length, data.output);
      }
    },
    onError: () => setError('network'),
  });

  // Pre-fill topic and auto-search when navigated from homepage chip
  useEffect(() => {
    const prefill = router.query.topic as string | undefined;
    if (prefill && prefill.trim().length >= 3) {
      setTopic(prefill);
      searchMutation.mutate({ topic: prefill, sources });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleSearch = (searchTopic: string, searchSources: PaperSource) => {
    searchMutation.mutate({ topic: searchTopic, sources: searchSources });
  };

  const handleGenerate = () => {
    const selectedPapers = papers.filter((p) => selectedIds.includes(p.id));
    generateMutation.mutate({ topic, papers: selectedPapers });
  };

  const handleRetry = () => {
    if (errorType === 'search_failure') {
      searchMutation.mutate({ topic, sources });
    } else {
      const selectedPapers = papers.filter((p) => selectedIds.includes(p.id));
      generateMutation.mutate({ topic, papers: selectedPapers });
    }
  };

  const isSearching = status === 'searching';
  const isGenerating = status === 'generating';
  const isDone = status === 'done';
  const isError = status === 'error';
  const hasPapers = papers.length > 0;

  const isIdle = !hasPapers && !isSearching && !isGenerating && !isDone;
  const showFloating = hasPapers && !isGenerating && !isDone;

  return (
    <>
      <Head>
        <title>PaperMind: AI Research Synthesis</title>
      </Head>
      <MainLayout>
        {/* ── IDLE STATE: centered hero + sticky bottom input ── */}
        {isIdle && !isError && (
          <div className="relative flex flex-col min-h-full">
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-40">
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-2xl text-center mb-8"
              >
                <h1 className="font-serif text-4xl font-semibold text-app-text leading-tight mb-3">
                  Research Synthesis
                </h1>
                <p className="font-sans text-base text-app-text/40 leading-relaxed">
                  Search peer-reviewed papers, select the relevant ones,
                  <br className="hidden sm:block" /> and get an AI-synthesized report.
                </p>
              </m.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
              <div className="h-24 bg-gradient-to-t from-bg to-transparent" />
            </div>
            <div className="sticky bottom-0 left-0 right-0 pb-6 pt-2 px-5 pointer-events-auto">
              <div className="max-w-2xl mx-auto w-full">
                <AnimatedSection delay={0.1}>
                  <TopicInput onSearch={handleSearch} isLoading={isSearching} />
                </AnimatedSection>
                <p className="text-center text-[11px] text-app-text/25 font-sans mt-3">
                  Sources from PubMed &amp; Semantic Scholar · Synthesized by Llama 3.3 on Groq
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE STATES: normal scroll layout ── */}
        {(!isIdle || isError) && (
          <div
            className="max-w-2xl mx-auto px-5 py-8 w-full space-y-6"
            style={{ paddingBottom: showFloating ? '5rem' : undefined }}
          >
            {!isDone && !isGenerating && (
              <AnimatedSection delay={0}>
                <TopicInput onSearch={handleSearch} isLoading={isSearching} />
              </AnimatedSection>
            )}

            <AnimatePresence>
              {isError && errorType && (
                <AnimatedSection>
                  <ErrorMessage
                    errorType={errorType}
                    retryAfter={retryAfter}
                    onRetry={errorType !== 'rate_limit' ? handleRetry : undefined}
                  />
                </AnimatedSection>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isGenerating && (
                <AnimatedSection key="progress" delay={0.1}>
                  <ProgressSteps topic={topic} paperCount={selectedIds.length} />
                </AnimatedSection>
              )}

              {isDone && output && (
                <AnimatedSection key="output" delay={0}>
                  <OutputPanel output={output} />
                </AnimatedSection>
              )}

              {!isGenerating && !isDone && (hasPapers || isSearching) && (
                <AnimatedSection key="papers" delay={0.1}>
                  <PaperList warnings={searchMutation.data?.warnings} />
                </AnimatedSection>
              )}
            </AnimatePresence>
          </div>
        )}

        <GenerateButton onClick={handleGenerate} />
      </MainLayout>
    </>
  );
}
