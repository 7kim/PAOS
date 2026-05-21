"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-canvas-dark text-on-dark antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-red-400 mb-4">
              Error
            </p>
            <h1 className="font-sans text-[40px] font-medium leading-[48px] tracking-[-0.8px] mb-4">
              Something went wrong
            </h1>
            <p className="font-sans text-[16px] leading-[20.8px] text-on-dark/60 mb-8">
              {error.message || "An unexpected error occurred."}
            </p>
            <Button variant="gradient" size="lg" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
