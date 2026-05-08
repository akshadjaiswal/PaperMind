import type { NextApiRequest, NextApiResponse } from 'next';
import { XMLParser } from 'fast-xml-parser';
import type { Paper, SearchRequest, SearchResponse } from '@/lib/types';
import { normalizeTitle, titleSimilarity } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ papers: [], error: 'Method not allowed' });
  }

  const { topic, sources } = req.body as SearchRequest;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
    return res.status(400).json({ papers: [], error: 'Topic must be at least 3 characters' });
  }

  const cleanTopic = topic.trim();
  const warnings: string[] = [];

  const [pubmedResult, semanticResult] = await Promise.allSettled([
    sources !== 'semantic' ? fetchPubMed(cleanTopic) : Promise.resolve([]),
    sources !== 'pubmed' ? fetchSemantic(cleanTopic) : Promise.resolve([]),
  ]);

  const pubmedPapers: Paper[] =
    pubmedResult.status === 'fulfilled' ? pubmedResult.value : [];
  const semanticPapers: Paper[] =
    semanticResult.status === 'fulfilled' ? semanticResult.value : [];

  if (pubmedResult.status === 'rejected' && sources !== 'semantic') {
    warnings.push('PubMed is temporarily unavailable. Showing Semantic Scholar results only.');
  }
  if (semanticResult.status === 'rejected' && sources !== 'pubmed') {
    warnings.push('Semantic Scholar is temporarily unavailable. Showing PubMed results only.');
  }

  const allPapers = [...pubmedPapers, ...semanticPapers];

  if (allPapers.length === 0) {
    return res.status(200).json({ papers: [], warnings, error: 'search_failure' });
  }

  const deduped = deduplicatePapers(allPapers);
  const enriched = await enrichWithUnpaywall(deduped);

  return res.status(200).json({ papers: enriched, warnings: warnings.length ? warnings : undefined });
}

async function fetchPubMed(topic: string): Promise<Paper[]> {
  const encoded = encodeURIComponent(topic);

  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encoded}&retmax=12&sort=relevance&retmode=json`;
  const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(10_000) });
  if (!searchRes.ok) throw new Error(`PubMed esearch failed: ${searchRes.status}`);

  const searchData = await searchRes.json();
  const pmids: string[] = searchData?.esearchresult?.idlist ?? [];
  if (pmids.length === 0) return [];

  const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&rettype=abstract&retmode=xml`;
  const fetchRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(15_000) });
  if (!fetchRes.ok) throw new Error(`PubMed efetch failed: ${fetchRes.status}`);

  const xml = await fetchRes.text();
  return parsePubMedXml(xml);
}

function parsePubMedXml(xml: string): Paper[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (tagName) =>
      ['PubmedArticle', 'Author', 'AbstractText', 'ArticleId'].includes(tagName),
  });

  let parsed: Record<string, unknown>;
  try {
    parsed = parser.parse(xml);
  } catch {
    return [];
  }

  const articles =
    (parsed?.PubmedArticleSet as Record<string, unknown>)?.PubmedArticle as unknown[] ?? [];

  return articles.flatMap((article) => {
    try {
      const a = article as Record<string, unknown>;
      const citation = a?.MedlineCitation as Record<string, unknown>;
      const articleData = citation?.Article as Record<string, unknown>;
      const pmid = citation?.PMID as string | Record<string, unknown>;
      const pmidStr = typeof pmid === 'object' ? String((pmid as Record<string, unknown>)?.['#text'] ?? '') : String(pmid ?? '');

      const rawTitle = articleData?.ArticleTitle;
      const title =
        typeof rawTitle === 'object'
          ? String((rawTitle as Record<string, unknown>)?.['#text'] ?? '')
          : String(rawTitle ?? '');

      if (!title) return [];

      // Authors
      const authorList = articleData?.AuthorList as Record<string, unknown> | undefined;
      const rawAuthors = authorList?.Author as unknown[] | undefined;
      const authors = [].concat(rawAuthors as never[] ?? []).map((auth) => {
        const a2 = auth as Record<string, unknown>;
        const last = String(a2?.LastName ?? '');
        const initials = String(a2?.Initials ?? '');
        return last ? `${last} ${initials}`.trim() : String(a2?.CollectiveName ?? '');
      }).filter(Boolean);

      // Abstract
      const rawAbstract = (articleData?.Abstract as Record<string, unknown>)?.AbstractText;
      let abstract = '';
      if (Array.isArray(rawAbstract)) {
        abstract = rawAbstract
          .map((seg) => {
            if (typeof seg === 'string') return seg;
            const s = seg as Record<string, unknown>;
            const label = s?.['@_Label'] ? `${s['@_Label']}: ` : '';
            return `${label}${s?.['#text'] ?? s ?? ''}`;
          })
          .join('\n\n');
      } else if (typeof rawAbstract === 'string') {
        abstract = rawAbstract;
      } else if (rawAbstract && typeof rawAbstract === 'object') {
        abstract = String((rawAbstract as Record<string, unknown>)?.['#text'] ?? '');
      }

      // Year
      const pubDate = (articleData?.Journal as Record<string, unknown>)?.JournalIssue as Record<string, unknown>;
      const year = Number((pubDate?.PubDate as Record<string, unknown>)?.Year ?? 0) || null;

      // Journal
      const journal = String(
        ((articleData?.Journal as Record<string, unknown>)?.Title as string) ?? ''
      ) || null;

      // DOI
      const articleIds = (
        (a?.PubmedData as Record<string, unknown>)?.ArticleIdList as Record<string, unknown>
      )?.ArticleId as unknown[] | undefined;
      let doi: string | null = null;
      for (const idObj of [].concat(articleIds as never[] ?? [])) {
        const id = idObj as Record<string, unknown>;
        if (id?.['@_IdType'] === 'doi') {
          doi = String(id?.['#text'] ?? '').trim() || null;
          break;
        }
      }

      return [
        {
          id: `pubmed_${pmidStr}`,
          source: 'pubmed' as const,
          title,
          authors: authors.length > 0 ? authors.join(', ') : 'Unknown authors',
          year,
          journal,
          abstract: abstract || 'No abstract available.',
          doi,
          pdf_url: null,
        },
      ];
    } catch {
      return [];
    }
  });
}

async function fetchSemantic(topic: string): Promise<Paper[]> {
  const encoded = encodeURIComponent(topic);
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encoded}&limit=10&fields=title,authors,year,abstract,externalIds,openAccessPdf`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Semantic Scholar failed: ${res.status}`);

  const data = await res.json();
  const items = (data?.data as unknown[]) ?? [];

  return items.flatMap((item) => {
    try {
      const p = item as Record<string, unknown>;
      const title = String(p?.title ?? '').trim();
      if (!title) return [];

      const rawAuthors = (p?.authors as Array<Record<string, unknown>>) ?? [];
      const authors = rawAuthors.map((a) => String(a?.name ?? '')).filter(Boolean).join(', ');

      const externalIds = p?.externalIds as Record<string, unknown> | undefined;
      const doi = String(externalIds?.DOI ?? '').trim() || null;

      const openAccess = p?.openAccessPdf as Record<string, unknown> | undefined;
      const pdf_url = String(openAccess?.url ?? '').trim() || null;

      return [
        {
          id: `semantic_${String(p?.paperId ?? Math.random())}`,
          source: 'semantic' as const,
          title,
          authors: authors || 'Unknown authors',
          year: Number(p?.year) || null,
          journal: null,
          abstract: String(p?.abstract ?? '') || 'No abstract available.',
          doi,
          pdf_url,
        },
      ];
    } catch {
      return [];
    }
  });
}

function countNonNull(paper: Paper): number {
  return [paper.authors, paper.year, paper.journal, paper.abstract, paper.doi, paper.pdf_url].filter(
    (v) => v !== null && v !== '' && v !== 'No abstract available.'
  ).length;
}

function deduplicatePapers(papers: Paper[]): Paper[] {
  const seen = new Map<string, Paper>();

  for (const paper of papers) {
    if (paper.doi) {
      const normDoi = paper.doi.toLowerCase().trim();
      const existing = seen.get(normDoi);
      if (!existing || countNonNull(paper) > countNonNull(existing)) {
        seen.set(normDoi, paper);
      }
    } else {
      const normTitle = normalizeTitle(paper.title);
      const isDuplicate = [...seen.values()].some(
        (p) => titleSimilarity(normTitle, normalizeTitle(p.title)) > 0.85
      );
      if (!isDuplicate) {
        seen.set(`title_${normTitle}`, paper);
      }
    }
  }

  return [...seen.values()]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 15);
}

async function enrichWithUnpaywall(papers: Paper[]): Promise<Paper[]> {
  const email = process.env.UNPAYWALL_EMAIL ?? 'papermind@erlin.ai';

  const enriched = await Promise.allSettled(
    papers.map(async (paper, i) => {
      if (!paper.doi || paper.pdf_url) return paper;
      await new Promise((r) => setTimeout(r, i * 80));
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(
          `https://api.unpaywall.org/v2/${encodeURIComponent(paper.doi)}?email=${email}`,
          { signal: controller.signal }
        );
        clearTimeout(timer);
        if (!res.ok) return paper;
        const data = await res.json();
        const url = (data?.best_oa_location?.url as string) ?? null;
        return { ...paper, pdf_url: url };
      } catch {
        return paper;
      }
    })
  );

  return enriched.map((result, i) =>
    result.status === 'fulfilled' ? result.value : papers[i]
  );
}
