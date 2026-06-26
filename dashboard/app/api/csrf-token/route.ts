import { NextResponse } from "next/server";
import { createHash } from "crypto";

/**
 * CSRF token endpoint.
 *
 * Returns a time-bound token derived from the API_TOKEN.
 * Clients fetch this token and pass it as X-CSRF-Token header
 * on POST/PUT/DELETE/PATCH requests for double verification.
 *
 * CSRF is fundamentally mitigated by Bearer auth (no cookies),
 * but this endpoint provides defense-in-depth for clients that
 * want explicit token validation.
 */

const API_TOKEN = process.env.API_TOKEN || "";
const CSRF_TTL = 300_000; // 5 minutes

export async function GET() {
  const now = Date.now();
  const window = Math.floor(now / CSRF_TTL);
  const token = createHash("sha256")
    .update(`${API_TOKEN}:${window}`)
    .digest("hex");

  return NextResponse.json({ token, expiresIn: CSRF_TTL });
}
