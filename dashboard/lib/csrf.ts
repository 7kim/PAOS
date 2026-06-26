import { createHash } from "crypto";

const API_TOKEN = process.env.API_TOKEN || "";
const CSRF_TTL = 300_000; // 5 minutes

/** Verify an X-CSRF-Token value. */
export function verifyCsrfToken(token: string): boolean {
  if (!API_TOKEN) return true; // no token configured → skip
  const now = Date.now();
  const window = Math.floor(now / CSRF_TTL);
  // Check current and previous window (tolerate clock drift)
  for (const w of [window, window - 1]) {
    const expected = createHash("sha256")
      .update(`${API_TOKEN}:${w}`)
      .digest("hex");
    if (token === expected) return true;
  }
  return false;
}
