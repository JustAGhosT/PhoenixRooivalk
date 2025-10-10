"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "../components/ui/button";
import styles from "./error-pages.module.css";

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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1 className={styles.errorCode}>500</h1>
          <h2 className={styles.errorTitle}>Something went wrong!</h2>
          <p className={styles.errorDescription}>
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className={styles.button}
          >
            Try Again
          </Button>
          <Link href="/" className={styles.buttonLink}>
            <Button variant="secondary" size="lg" className={styles.button}>
              Go Home
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className={styles.errorDetails}>
            <summary className={styles.errorSummary}>
              Error Details (Development)
            </summary>
            <pre className={styles.errorStack}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
