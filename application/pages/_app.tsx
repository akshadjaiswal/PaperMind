import type { AppProps } from 'next/app';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import '../styles/globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-source-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <div className={`${playfair.variable} ${sourceSans.variable}`}>
          <Component {...pageProps} />
        </div>
      </QueryProvider>
    </ErrorBoundary>
  );
}
