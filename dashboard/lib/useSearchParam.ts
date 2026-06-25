"use client";
import { useState, useEffect } from "react";

/**
 * Safe replacement for useSearchParams() that works during prerendering
 * on Next.js without requiring Suspense boundaries or dynamic exports.
 */
export function useSearchParam(key: string): string {
  const [val, setVal] = useState("");
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      setVal(url.searchParams.get(key) || "");
    } catch { /* ignore */ }
  }, [key]);
  return val;
}
