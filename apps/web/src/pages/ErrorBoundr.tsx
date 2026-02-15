import { useEffect } from 'react';

interface ErrorProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-2">500</h1>
          <div className="w-12 h-1 bg-primary mx-auto"></div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Oops, something went wrong
        </h2>

        <p className="text-muted-foreground mb-2 text-base leading-relaxed">
          We encountered an unexpected error. Our team has been notified, and we're working to fix it.
        </p>

        <p className="text-sm text-muted-foreground mb-8">
          {error?.message || 'An unknown error occurred'}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>

          <a
            href="/"
            className="flex-1 px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
