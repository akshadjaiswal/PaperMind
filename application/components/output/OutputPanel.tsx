import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReportTab } from './ReportTab';
import { FlowchartTab } from './FlowchartTab';
import { TableTab } from './TableTab';
import { ReferencesTab } from './ReferencesTab';
import { CopyButton } from './CopyButton';
import { ExportButton } from './ExportButton';
import { usePaperMindStore } from '@/lib/store';
import type { OutputObject } from '@/lib/types';

interface OutputPanelProps {
  output: OutputObject;
}

export function OutputPanel({ output }: OutputPanelProps) {
  const { reset, topic } = usePaperMindStore();

  return (
    <div className="w-full" id="print-output">
      {/* Action bar */}
      <div className="no-print flex items-center justify-between mb-4 pb-4 border-b border-border">
        <button
          onClick={reset}
          className="rounded-pill px-4 py-1.5 text-xs font-medium font-sans border border-border text-app-text/55 hover:text-app-text hover:bg-surface-raised bg-surface transition-all duration-200"
        >
          ← New search
        </button>
        <div className="flex items-center gap-2">
          <CopyButton output={output} />
          <ExportButton output={output} />
        </div>
      </div>

      {/* Tabs */}
      <div id="output-panel">
        <Tabs defaultValue="report">
          <TabsList className="rounded-pill bg-surface-raised border border-border h-auto p-1 gap-0.5 mb-6">
            <TabsTrigger
              value="report"
              className="rounded-pill text-xs font-sans px-4 py-1.5 data-[state=active]:bg-interactive data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-soft-sm text-app-text/55 transition-all duration-200"
            >
              Report
            </TabsTrigger>
            <TabsTrigger
              value="flowchart"
              className="rounded-pill text-xs font-sans px-4 py-1.5 data-[state=active]:bg-interactive data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-soft-sm text-app-text/55 transition-all duration-200"
            >
              Flowchart
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="rounded-pill text-xs font-sans px-4 py-1.5 data-[state=active]:bg-interactive data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-soft-sm text-app-text/55 transition-all duration-200"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="references"
              className="rounded-pill text-xs font-sans px-4 py-1.5 data-[state=active]:bg-interactive data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-soft-sm text-app-text/55 transition-all duration-200"
            >
              References
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-0">
            <ReportTab output={output} />
          </TabsContent>

          <TabsContent value="flowchart" className="mt-0">
            <FlowchartTab mermaid={output.flowchart_mermaid} />
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <TableTab markdown={output.comparison_table} />
          </TabsContent>

          <TabsContent value="references" className="mt-0">
            <ReferencesTab refs={output.references} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
