import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  outputId?: string;
  className?: string;
}

export function ExportButton({ outputId = 'output-panel', className }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (typeof window === 'undefined') return;
    setExporting(true);
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

      const element = document.getElementById(outputId);
      if (!element) return;

      await html2pdf()
        .set({
          margin: [0.75, 0.75, 0.75, 0.75],
          filename: 'PaperMind_Synthesis.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#F9F8F4' },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all', before: 'section' },
        })
        .from(element)
        .save();
    } catch (err) {
      console.error('[ExportButton] PDF export failed:', err);
    } finally {
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
