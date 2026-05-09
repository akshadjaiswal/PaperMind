import Head from 'next/head';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

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

export default function Home() {
  const {
    topic,
    papers,
    selectedIds,
    output,
    status,
    errorType,
    retryAfter,
    sources,
    setPapers,
    setOutput,
    setStatus,
    setError,
    saveToHistory,
  } = usePaperMindStore();

  // Results stored in Zustand, not query cache — no invalidateQueries needed
  const searchMutation = useMutation({
    mutationFn: searchPapers,
    gcTime: 0,
    onMutate: () => {
      setStatus('searching');
    },
    onSuccess: (data) => {
      setPapers(data.papers);
      setStatus('idle');
    },
    onError: () => {
      setError('search_failure');
    },
  });

  // Results stored in Zustand, not query cache — no invalidateQueries needed
  const generateMutation = useMutation({
    mutationFn: generateSynthesis,
    gcTime: 0,
    onMutate: () => {
      setStatus('generating');
    },
    onSuccess: (data) => {
      if (data.error) {
        setError(data.error, data.retry_after);
      } else if (data.output) {
        setOutput(data.output);
        setStatus('done');
        saveToHistory(topic, selectedIds.length, data.output);
      }
    },
    onError: () => {
      setError('network');
    },
  });

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

  return (
    <>
      <Head>
        <title>PaperMind: AI Research Synthesis</title>
      </Head>
      <MainLayout>
        <div className="max-w-2xl mx-auto px-5 py-8 w-full space-y-6">
          {/* Header — only show when idle/searching/error */}
          {!isDone && (
            <AnimatedSection delay={0}>
              <div className="mb-2">
                <h1 className="font-serif text-3xl font-semibold text-app-text leading-tight">
                  Research Synthesis
                </h1>
                <p className="font-sans text-sm text-app-text/45 mt-1">
                  Search peer-reviewed papers, select the relevant ones, and get an AI-synthesized report.
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* Search input — always visible unless done */}
          {!isDone && !isGenerating && (
            <AnimatedSection delay={0.05}>
              <TopicInput onSearch={handleSearch} isLoading={isSearching} />
            </AnimatedSection>
          )}

          {/* Error message */}
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

          {/* Main content area — mutually exclusive states */}
          <AnimatePresence mode="wait">
            {/* Generating: progress steps */}
            {isGenerating && (
              <AnimatedSection key="progress" delay={0.1}>
                <ProgressSteps topic={topic} paperCount={selectedIds.length} />
              </AnimatedSection>
            )}

            {/* Done: output panel */}
            {isDone && output && (
              <AnimatedSection key="output" delay={0}>
                <OutputPanel output={output} />
              </AnimatedSection>
            )}

            {/* Papers list (idle/error state with papers) */}
            {!isGenerating && !isDone && (hasPapers || isSearching) && (
              <AnimatedSection key="papers" delay={0.1}>
                <PaperList warnings={searchMutation.data?.warnings} />
              </AnimatedSection>
            )}
          </AnimatePresence>

          {/* Generate button — shown when papers loaded and not generating/done */}
          {hasPapers && !isGenerating && !isDone && (
            <AnimatedSection delay={0.15}>
              <GenerateButton onClick={handleGenerate} />
            </AnimatedSection>
          )}
        </div>
      </MainLayout>
    </>
  );
}
