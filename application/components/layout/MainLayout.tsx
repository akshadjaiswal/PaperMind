import { useState } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex h-dvh overflow-hidden bg-bg">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-app-text/20 backdrop-blur-sm md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <m.div
                initial={{ x: -264 }}
                animate={{ x: 0 }}
                exit={{ x: -264 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-y-0 left-0 z-50 md:hidden"
              >
                <Sidebar />
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden flex items-center px-4 py-3 border-b border-border bg-surface">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-app-text/60 hover:text-app-text hover:bg-surface-raised transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <span className="ml-3 font-serif text-base font-semibold text-app-text">PaperMind</span>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </LazyMotion>
  );
}
