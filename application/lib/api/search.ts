import type { SearchRequest, SearchResponse } from '@/lib/types';

export async function searchPapers(payload: SearchRequest): Promise<SearchResponse> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? `Search failed: ${res.status}`);
  }
  return res.json();
}
