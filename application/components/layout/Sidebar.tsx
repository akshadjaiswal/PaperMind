import Link from 'next/link';
import { useRouter } from 'next/router';
import { Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePaperMindStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        'block px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
        isActive
          ? 'bg-primary/10 text-primary font-semibold'
          : 'text-app-text/60 hover:text-app-text hover:bg-surface-raised'
      )}
    >
      {label}
    </Link>
  );
};

function formatAge(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function Sidebar() {
  const router = useRouter();
  const { history, loadFromHistory, deleteFromHistory } = usePaperMindStore();

  return (
    <aside className="flex flex-col h-full bg-surface border-r border-border w-64 shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <LeafIcon />
          </div>
          <span className="font-serif text-lg font-semibold text-app-text tracking-tight">
            PaperMind
          </span>
        </Link>
        <p className="text-xs text-app-text/40 mt-1.5 font-sans pl-0.5">
          AI Research Synthesis
        </p>
      </div>

      {/* Nav */}
      <nav className="px-3 pt-4 pb-2 space-y-1 border-b border-border">
        <NavLink href="/research" label="Research" />
        <NavLink href="/about" label="About" />
      </nav>

      {/* History */}
      <div className="flex-1 overflow-y-auto">
        {history.length > 0 ? (
          <div className="p-3">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Clock size={11} className="text-app-text/30" />
              <span className="text-[11px] font-sans font-medium text-app-text/35 uppercase tracking-wider">
                Recent
              </span>
            </div>
            <ul className="space-y-0.5">
              {history.map((entry) => (
                <li key={entry.id} className="group flex items-start gap-1">
                  <button
                    onClick={() => { loadFromHistory(entry); router.push('/research'); }}
                    className="flex-1 text-left px-2.5 py-2 rounded-xl hover:bg-surface-raised transition-colors duration-150 min-w-0"
                  >
                    <p className="text-xs font-medium text-app-text/75 truncate leading-tight">
                      {entry.topic}
                    </p>
                    <p className="text-[10px] text-app-text/35 font-sans mt-0.5">
                      {entry.paperCount} papers · {formatAge(entry.createdAt)}
                    </p>
                  </button>
                  <button
                    onClick={() => deleteFromHistory(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 mt-1 rounded-lg text-app-text/25 hover:text-interactive hover:bg-secondary/30 transition-all duration-150 shrink-0"
                    aria-label="Delete from history"
                  >
                    <Trash2 size={11} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="text-[11px] text-app-text/25 font-sans leading-relaxed">
              Completed research will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {/* Appearance row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-app-text/35 font-sans font-medium uppercase tracking-wider">
            Appearance
          </span>
          <ThemeToggle />
        </div>
        {/* Divider */}
        <div className="border-t border-border/50 pt-3">
          <p className="text-[11px] text-app-text/30 font-sans leading-relaxed">
            Powered by Groq &amp; Llama 3.3
          </p>
          <p className="text-[11px] text-app-text/25 font-sans mt-0.5">
            PubMed · Semantic Scholar
          </p>
        </div>
      </div>
    </aside>
  );
}

function LeafIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8C9A84"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
