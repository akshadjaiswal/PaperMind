import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Paper, OutputObject, AppStatus, ErrorType, PaperSource, HistoryEntry } from '@/lib/types';

const MAX_HISTORY = 10;

interface PaperMindStore {
  // Session state (not persisted — resets on page load)
  topic: string;
  sources: PaperSource;
  papers: Paper[];
  selectedIds: string[];
  output: OutputObject | null;
  status: AppStatus;
  errorType: ErrorType;
  retryAfter: number | null;

  // History (persisted to localStorage)
  history: HistoryEntry[];

  // Session actions
  setTopic: (topic: string) => void;
  setSources: (sources: PaperSource) => void;
  setPapers: (papers: Paper[]) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelected: () => void;
  setOutput: (output: OutputObject) => void;
  setStatus: (status: AppStatus) => void;
  setError: (errorType: ErrorType, retryAfter?: number) => void;
  reset: () => void;

  // History actions
  saveToHistory: (topic: string, paperCount: number, output: OutputObject) => void;
  loadFromHistory: (entry: HistoryEntry) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const sessionDefaults = {
  topic: '',
  sources: 'both' as PaperSource,
  papers: [] as Paper[],
  selectedIds: [] as string[],
  output: null,
  status: 'idle' as AppStatus,
  errorType: null as ErrorType,
  retryAfter: null,
};

export const usePaperMindStore = create<PaperMindStore>()(
  persist(
    (set, get) => ({
      ...sessionDefaults,
      history: [],

      setTopic: (topic) => set({ topic }),
      setSources: (sources) => set({ sources }),
      setPapers: (papers) => set({ papers, selectedIds: [] }),
      toggleSelect: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((sid) => sid !== id)
            : [...state.selectedIds, id],
        })),
      selectAll: () => set((state) => ({ selectedIds: state.papers.map((p) => p.id) })),
      clearSelected: () => set({ selectedIds: [] }),
      setOutput: (output) => set({ output }),
      setStatus: (status) => set({ status }),
      setError: (errorType, retryAfter) =>
        set({ status: 'error', errorType, retryAfter: retryAfter ?? null }),
      reset: () =>
        set((state) => ({
          ...sessionDefaults,
          topic: state.topic,
          history: state.history,
        })),

      saveToHistory: (topic, paperCount, output) =>
        set((state) => {
          const entry: HistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            topic,
            createdAt: Date.now(),
            paperCount,
            output,
          };
          // Deduplicate by topic (keep latest, remove older same-topic)
          const filtered = state.history.filter(
            (h) => h.topic.toLowerCase() !== topic.toLowerCase()
          );
          return {
            history: [entry, ...filtered].slice(0, MAX_HISTORY),
          };
        }),

      loadFromHistory: (entry) =>
        set({
          topic: entry.topic,
          output: entry.output,
          status: 'done',
          papers: [],
          selectedIds: [],
          errorType: null,
          retryAfter: null,
        }),

      deleteFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'papermind-history',
      storage: createJSONStorage(() => localStorage),
      // Only persist history — session state always starts fresh
      partialize: (state) => ({ history: state.history }),
    }
  )
);
