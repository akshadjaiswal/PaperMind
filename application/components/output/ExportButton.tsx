import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OutputObject } from '@/lib/types';

interface ExportButtonProps {
  output: OutputObject;
  className?: string;
}

const SECTION_LABELS: { key: keyof OutputObject; label: string }[] = [
  { key: 'abstract', label: 'Abstract' },
  { key: 'introduction', label: 'Introduction' },
  { key: 'key_concepts', label: 'Key Concepts' },
  { key: 'main_findings', label: 'Main Findings' },
  { key: 'discussion', label: 'Discussion' },
  { key: 'conclusion', label: 'Conclusion' },
];

function buildPrintClone(output: OutputObject): HTMLDivElement {
  const wrap = document.createElement('div');
  // Must be in viewport for html2canvas to capture — use opacity:0 + pointer-events:none
  // position:absolute left:-9999px causes blank pages in html2canvas
  wrap.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:740px',
    'padding:48px 56px',
    'background:#F9F8F4',
    'color:#2D3A31',
    'font-family:"Source Sans 3",system-ui,sans-serif',
    'font-size:14px',
    'line-height:1.7',
    'opacity:0',
    'pointer-events:none',
    'z-index:-1',
    'overflow:visible',
  ].join(';');

  // Title
  const title = document.createElement('h1');
  title.textContent = output.title;
  title.style.cssText = [
    'font-family:"Playfair Display",Georgia,serif',
    'font-size:26px',
    'font-weight:600',
    'color:#2D3A31',
    'margin:0 0 32px 0',
    'line-height:1.3',
  ].join(';');
  wrap.appendChild(title);

  // Report sections
  for (const { key, label } of SECTION_LABELS) {
    const content = output[key];
    if (typeof content !== 'string') continue;

    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom:28px;page-break-inside:avoid;';

    if (key === 'abstract') {
      section.style.cssText += [
        'background:#f0ede6',
        'border-left:4px solid #DCCFC2',
        'border-radius:0 12px 12px 0',
        'padding:18px 20px',
        'margin-bottom:32px',
      ].join(';');
      const lbl = document.createElement('p');
      lbl.textContent = label.toUpperCase();
      lbl.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:0.1em;color:#8C9A84;margin:0 0 8px 0;';
      section.appendChild(lbl);
      const body = document.createElement('p');
      body.textContent = content;
      body.style.cssText = 'font-style:italic;color:#4a5a4e;margin:0;';
      section.appendChild(body);
    } else {
      const h2 = document.createElement('h2');
      h2.textContent = label;
      h2.style.cssText = [
        'font-family:"Playfair Display",Georgia,serif',
        'font-size:17px',
        'font-weight:600',
        'color:#2D3A31',
        'margin:0 0 10px 0',
        'padding-bottom:8px',
        'border-bottom:1px solid #E6E2DA',
      ].join(';');
      section.appendChild(h2);
      const body = document.createElement('p');
      body.textContent = content;
      body.style.cssText = 'color:#3a4a3e;white-space:pre-wrap;margin:0;';
      section.appendChild(body);
    }

    wrap.appendChild(section);
  }

  // Comparison table — render markdown table as HTML table
  const tableSection = document.createElement('div');
  tableSection.style.cssText = 'margin-bottom:32px;page-break-inside:avoid;';
  const tableH2 = document.createElement('h2');
  tableH2.textContent = 'Comparison Table';
  tableH2.style.cssText = [
    'font-family:"Playfair Display",Georgia,serif',
    'font-size:17px',
    'font-weight:600',
    'color:#2D3A31',
    'margin:0 0 12px 0',
    'padding-bottom:8px',
    'border-bottom:1px solid #E6E2DA',
  ].join(';');
  tableSection.appendChild(tableH2);
  tableSection.appendChild(markdownTableToHtml(output.comparison_table));
  wrap.appendChild(tableSection);

  // Mermaid SVG — grab from live DOM if rendered
  const liveSvg = document.querySelector('.mermaid-container svg');
  if (liveSvg) {
    const chartSection = document.createElement('div');
    chartSection.style.cssText = 'margin-bottom:32px;page-break-inside:avoid;';
    const chartH2 = document.createElement('h2');
    chartH2.textContent = 'Research Flowchart';
    chartH2.style.cssText = [
      'font-family:"Playfair Display",Georgia,serif',
      'font-size:17px',
      'font-weight:600',
      'color:#2D3A31',
      'margin:0 0 12px 0',
      'padding-bottom:8px',
      'border-bottom:1px solid #E6E2DA',
    ].join(';');
    chartSection.appendChild(chartH2);
    const svgClone = liveSvg.cloneNode(true) as SVGElement;
    svgClone.style.cssText = 'width:100%;height:auto;max-width:640px;display:block;margin:0 auto;';
    chartSection.appendChild(svgClone);
    wrap.appendChild(chartSection);
  }

  // References
  const refSection = document.createElement('div');
  refSection.style.cssText = 'margin-bottom:16px;';
  const refH2 = document.createElement('h2');
  refH2.textContent = 'References';
  refH2.style.cssText = [
    'font-family:"Playfair Display",Georgia,serif',
    'font-size:17px',
    'font-weight:600',
    'color:#2D3A31',
    'margin:0 0 12px 0',
    'padding-bottom:8px',
    'border-bottom:1px solid #E6E2DA',
  ].join(';');
  refSection.appendChild(refH2);
  const ol = document.createElement('ol');
  ol.style.cssText = 'padding-left:20px;margin:0;';
  for (const ref of output.references) {
    const li = document.createElement('li');
    li.style.cssText = 'margin-bottom:8px;font-size:12px;color:#4a5a4e;';
    const parts = [`${ref.authors} (${ref.year ?? 'n.d.'}).`, ref.title + '.'];
    if (ref.journal) parts.push(`<em>${ref.journal}</em>.`);
    if (ref.doi) parts.push(`https://doi.org/${ref.doi}`);
    li.innerHTML = parts.join(' ');
    ol.appendChild(li);
  }
  refSection.appendChild(ol);
  wrap.appendChild(refSection);

  return wrap;
}

function markdownTableToHtml(md: string): HTMLElement {
  const container = document.createElement('div');
  const lines = md.trim().split('\n').filter((l) => !/^\|?[-|:\s]+\|?$/.test(l.trim()));
  if (lines.length < 2) {
    container.textContent = md;
    return container;
  }

  const table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';

  lines.forEach((line, i) => {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    const row = document.createElement('tr');
    row.style.cssText = i % 2 === 0 ? 'background:#f4f2ee;' : 'background:#F9F8F4;';
    cells.forEach((cell) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      td.textContent = cell;
      td.style.cssText = [
        'padding:7px 10px',
        'border:1px solid #E6E2DA',
        i === 0 ? 'font-weight:600;background:#e8e4dc;' : '',
      ].join(';');
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  container.appendChild(table);
  return container;
}

export function ExportButton({ output, className }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (typeof window === 'undefined') return;
    setExporting(true);

    const clone = buildPrintClone(output);
    document.body.appendChild(clone);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default as (
        element?: HTMLElement,
        options?: Record<string, unknown>
      ) => {
        set: (opts: Record<string, unknown>) => {
          from: (el: HTMLElement) => { save: () => Promise<void> };
        };
      };

      await html2pdf()
        .set({
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: 'PaperMind_Synthesis.pdf',
          image: { type: 'jpeg', quality: 0.97 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#F9F8F4',
            logging: false,
          },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css'] },
        })
        .from(clone)
        .save();
    } catch (err) {
      console.error('[ExportButton] PDF export failed:', err);
    } finally {
      document.body.removeChild(clone);
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={cn(
        'flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-xs font-medium font-sans',
        'border border-border text-app-text/60 hover:text-app-text hover:border-primary/40',
        'bg-surface hover:bg-surface-raised transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {exporting ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Download size={13} />
      )}
      {exporting ? 'Exporting…' : 'Export PDF'}
    </button>
  );
}
