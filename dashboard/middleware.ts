/**
 * PAOS Middleware — Rate Limiting + API Authentication
 *
 * Applies to all /api/* routes.
 *
 * Configuration (via process.env or .env.local):
 *   API_TOKEN=<token>         — enables Bearer auth. Omit to skip auth (dev mode).
 *   RATE_LIMIT=100            — requests per window per IP (default: 100)
 *   RATE_LIMIT_WINDOW_MS=60000 — window in ms (default: 1 minute)
 *
 * Rate limiting uses an in-memory Map. Fine for single-instance;
 * swap to Redis if you scale horizontally.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── CSRF verification ───────────────────────────────────────────────────

import { verifyCsrfToken } from "@/lib/csrf";

const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);
const CSRF_ENABLED = process.env.CSRF_PROTECTION === "true";

// ── Rate Limiting ──────────────────────────────────────────────────────

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || "100", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

interface RateEntry {
  count: number;
  resetAt: number;
}

const rateMap = new Map<string, RateEntry>();

// Periodic cleanup every 5 minutes — prevents unbounded memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) rateMap.delete(key);
    }
  }, 300_000);
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { ok: false, retryAfter };
  }

  entry.count++;
  return { ok: true };
}

// ── Authentication ─────────────────────────────────────────────────────

const API_TOKEN = process.env.API_TOKEN || "";

function checkAuth(req: NextRequest): boolean {
  if (!API_TOKEN) return true; // no token configured → skip auth (dev mode)

  // Allow localhost requests without token (browser dev access)
  const host = req.headers.get("host") || "";
  if (host === "localhost:3333" || host.startsWith("127.0.0.1") || host.startsWith("::1")) return true;

  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  return auth.slice(7) === API_TOKEN;
}

// ── Middleware ──────────────────────────────────────────────────────────

/**
 * Extract client IP from common proxy headers, falling back to a
 * local-dev placeholder so rate limiting still works on localhost.
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /api/* routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Authentication
  if (!checkAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide Authorization: Bearer *** header." },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": "Bearer realm=\"PAOS API\"",
        },
      }
    );
  }

  // CSRF check for mutating requests (defense-in-depth — opt-in via CSR...ION env var)
  if (CSRF_ENABLED && MUTATING_METHODS.has(req.method)) {
    const csrfToken = req.headers.get("x-csrf-token") || "";
    if (!verifyCsrfToken(csrfToken)) {
      return NextResponse.json(
        { error: "CSRF validation failed. Fetch a token from GET /api/csrf-token and pass as X-CSRF-Token header." },
        { status: 403 }
      );
    }
  }

  // Rate limiting
  const ip = getClientIp(req);
  const rateResult = checkRateLimit(ip);

  if (!rateResult.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfter) },
      }
    );
  }

  // Pass through
  const response = NextResponse.next();

  // Security headers (HSTS, CORS, XSS)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // CORS — allow known origins
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [
    "http://localhost:3333",
    ...(process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
  ];
  if (allowedOrigins.includes(origin) || !origin) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
  }

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
