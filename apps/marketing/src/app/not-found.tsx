import Link from "next/link";
import * as React from "react";
import { Button } from "../components/ui/button";

export default function NotFound(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[var(--darker)] text-white flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-[rgb(var(--primary))] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-[rgb(var(--gray))] mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/" className="block">
            <Button variant="primary" size="lg" className="w-full">
              Go Home
            </Button>
          </Link>
          <Link href="/contact" className="block">
            <Button variant="secondary" size="lg" className="w-full">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
