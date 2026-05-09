import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(mode: ThemeMode, systemDark: boolean) {
  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pm-theme') as ThemeMode | null;
    const initial = stored ?? 'system';
    const sysDark = getSystemDark();
    setSystemDark(sysDark);
    setThemeState(initial);
    applyTheme(initial, sysDark);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
      setThemeState((t) => {
        applyTheme(t, e.matches);
        return t;
      });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('pm-theme', t);
    applyTheme(t, systemDark);
  };

  const resolvedTheme: 'light' | 'dark' =
    theme === 'dark' || (theme === 'system' && systemDark) ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
