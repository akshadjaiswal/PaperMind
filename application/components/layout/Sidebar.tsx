import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

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

export function Sidebar() {
  return (
    <aside className="flex flex-col h-full bg-surface border-r border-border w-64 shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <LeafIcon />
          </div>
          <span className="font-serif text-lg font-semibold text-app-text tracking-tight">
            PaperMind
          </span>
        </div>
        <p className="text-xs text-app-text/40 mt-1.5 font-sans pl-0.5">
          AI Research Synthesis
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink href="/" label="Research" />
        <NavLink href="/about" label="About" />
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-app-text/30 font-sans leading-relaxed">
          Powered by Groq &amp; Llama 3.3
        </p>
        <p className="text-[11px] text-app-text/25 font-sans mt-0.5">
          PubMed · Semantic Scholar
        </p>
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
