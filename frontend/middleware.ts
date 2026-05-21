import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars!!";

// Rate limiting store (in-memory for MVP)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

const encoder = new TextEncoder();

async function createSignature(input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input: string): string {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = input.length % 4 ? 4 - (input.length % 4) : 0;
  input += "=".repeat(padding);
  return atob(input);
}

async function verifyToken(token: string): Promise<string | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64UrlDecode(parts[1]));

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    const expectedSig = await createSignature(`${parts[0]}.${parts[1]}`);
    if (expectedSig !== parts[2]) return null;

    return payload.sub;
  } catch {
    return null;
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

const publicPaths = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/api/auth/login",
  "/api/models",
  "/_next/static",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (
    publicPaths.some(
      (p) =>
        pathname === p ||
        pathname.startsWith(p + "/") ||
        pathname.startsWith("/_next"),
    )
  ) {
    // Rate limit /api/pipeline
    if (pathname === "/api/pipeline") {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      if (!checkRateLimit(ip)) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Maximum 5 requests per hour." },
          { status: 429 },
        );
      }
    }
    return NextResponse.next();
  }

  // Auth check for protected routes
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie || !(await verifyToken(sessionCookie))) {
    // Redirect to login for page requests
    if (!pathname.startsWith("/api/")) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Return 401 for API requests
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit /api/pipeline for authenticated users too
  if (pathname === "/api/pipeline") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 5 requests per hour." },
        { status: 429 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
