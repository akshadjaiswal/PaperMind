import type { GenerateRequest, GenerateResponse } from '@/lib/types';

export async function generateSynthesis(payload: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  // Don't throw on 429 — return the body so client can show countdown
  const data: GenerateResponse = await res.json();
  return data;
}
