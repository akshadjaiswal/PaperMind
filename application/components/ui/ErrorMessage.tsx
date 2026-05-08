import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { ErrorType } from '@/lib/types';
import { cn } from '@/lib/utils';

const MESSAGES: Record<NonNullable<ErrorType>, string> = {
  rate_limit: 'Taking a breather — Groq rate limit reached.',
  timeout: 'Generation timed out. The AI took too long to respond.',
  parse_failure: 'The AI returned an unexpected format. Please try again.',
  search_failure: "Couldn't reach the paper databases. Check your connection.",
  network: 'A network error occurred. Please try again.',
};

interface ErrorMessageProps {
  errorType: ErrorType;
  retryAfter?: number | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ errorType, retryAfter, onRetry, className }: ErrorMessageProps) {
  const [countdown, setCountdown] = useState(retryAfter ?? 0);

  useEffect(() => {
    if (!retryAfter || errorType !== 'rate_limit') return;
    setCountdown(retryAfter);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRetry?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [retryAfter, errorType, onRetry]);

  if (!errorType) return null;

  return (
    <div
      className={cn(
        'bg-secondary/30 border border-secondary rounded-card p-4 flex items-start gap-3',
        className
      )}
    >
      <AlertCircle size={18} className="text-interactive shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-app-text">{MESSAGES[errorType]}</p>
        {errorType === 'rate_limit' && countdown > 0 && (
          <p className="text-xs text-app-text/60 mt-1">
            Retrying automatically in {countdown}s…
          </p>
        )}
      </div>
      {onRetry && errorType !== 'rate_limit' && (
        <button
          onClick={onRetry}
          className="shrink-0 flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-medium transition-colors"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}
