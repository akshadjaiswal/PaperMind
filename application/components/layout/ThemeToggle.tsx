import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', Icon: Sun, label: 'Light' },
  { value: 'dark', Icon: Moon, label: 'Dark' },
  { value: 'system', Icon: Monitor, label: 'System' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-surface-raised rounded-pill border border-border p-0.5">
      {OPTIONS.map(({ value, Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          title={label}
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
            theme === value
              ? 'bg-primary/20 text-primary shadow-soft-sm'
              : 'text-app-text/35 hover:text-app-text/60 hover:bg-surface'
          )}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
