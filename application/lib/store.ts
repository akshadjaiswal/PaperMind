import { create } from 'zustand';
import type { Paper, OutputObject, AppStatus, ErrorType, PaperSource } from '@/lib/types';

interface PaperMindStore {
  topic: string;
  sources: PaperSource;
  papers: Paper[];
  selectedIds: string[];
  output: OutputObject | null;
  status: AppStatus;
  errorType: ErrorType;
  retryAfter: number | null;

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
}

const initialState = {
  topic: '',
  sources: 'both' as PaperSource,
  papers: [] as Paper[],
  selectedIds: [] as string[],
  output: null,
  status: 'idle' as AppStatus,
  errorType: null as ErrorType,
  retryAfter: null,
};

export const usePaperMindStore = create<PaperMindStore>()((set, get) => ({
  ...initialState,

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
      ...initialState,
      topic: state.topic,
    })),
}));
