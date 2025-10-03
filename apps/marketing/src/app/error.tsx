"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "../components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--darker)] text-white flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[rgb(var(--primary))] mb-4">
            500
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Something went wrong!
          </h2>
          <p className="text-[rgb(var(--gray))] mb-8">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Try Again
          </Button>
          <Link href="/" className="block">
            <Button variant="secondary" size="lg" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-[rgb(var(--primary))] hover:text-[rgb(var(--accent))]">
              Error Details (Development)
            </summary>
            <pre className="mt-4 p-4 bg-[rgba(var(--bg-surface),0.8)] rounded-lg text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
