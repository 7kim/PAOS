"use client";

import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="text-center max-w-md">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-red-400 mb-4">
          Application Error
        </p>
        <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-on-dark mb-4">
          Something went wrong
        </h1>
        <p className="font-sans text-[16px] leading-[20.8px] text-on-dark/60 mb-8">
          {error.message || "An unexpected error occurred in the application."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="gradient" onClick={reset}>
            Try again
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/app")}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
