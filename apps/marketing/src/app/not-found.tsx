"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "../components/ui/button";
import styles from "./error-pages.module.css";

export default function NotFound(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Page Not Found</h2>
          <p className={styles.errorDescription}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.buttonLink}>
            <Button variant="primary" size="lg" className={styles.button}>
              Go Home
            </Button>
          </Link>
          <Link href="/contact" className={styles.buttonLink}>
            <Button variant="secondary" size="lg" className={styles.button}>
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
