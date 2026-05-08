import type { NextApiRequest, NextApiResponse } from 'next';
import type { GenerateRequest, GenerateResponse, OutputObject } from '@/lib/types';
import { SYSTEM_PROMPT, buildUserMessage } from '@/lib/prompts';

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' },
    responseLimit: '8mb',
  },
};

const REQUIRED_KEYS: (keyof OutputObject)[] = [
  'title',
  'abstract',
  'introduction',
  'key_concepts',
  'main_findings',
  'discussion',
  'conclusion',
  'flowchart_mermaid',
  'comparison_table',
  'references',
];

async function callGroq(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 6000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('retry-after') ?? '60', 10);
    const err = new Error('rate_limit') as Error & { retryAfter: number };
    err.retryAfter = retryAfter;
    throw err;
  }

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

function parseOutput(raw: string): OutputObject | null {
  try {
    const parsed = JSON.parse(raw);
    const missing = REQUIRED_KEYS.filter((k) => !(k in parsed));
    if (missing.length > 0) return null;
    return parsed as OutputObject;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GenerateResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'network' });
  }

  const { topic, papers } = req.body as GenerateRequest;

  if (!topic || !papers || !Array.isArray(papers) || papers.length === 0) {
    return res.status(400).json({ error: 'network' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserMessage(topic, papers) },
  ];

  try {
    let rawContent = await callGroq(messages);
    let output = parseOutput(rawContent);

    // Retry once on parse failure with a nudge
    if (!output) {
      const retryMessages = [
        ...messages,
        { role: 'assistant', content: rawContent },
        {
          role: 'user',
          content:
            'Your response was not valid JSON with all required keys. Please respond with only the valid JSON object as specified, with no markdown code blocks or extra text.',
        },
      ];
      rawContent = await callGroq(retryMessages);
      output = parseOutput(rawContent);
    }

    if (!output) {
      return res.status(200).json({ error: 'parse_failure' });
    }

    return res.status(200).json({ output });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        return res.status(504).json({ error: 'timeout' });
      }
      if (err.message === 'rate_limit') {
        const retryAfter = (err as Error & { retryAfter?: number }).retryAfter ?? 60;
        return res.status(429).json({ error: 'rate_limit', retry_after: retryAfter });
      }
    }
    return res.status(500).json({ error: 'network' });
  }
}
