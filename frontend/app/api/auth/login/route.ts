import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars!!";

// In-memory user store for MVP
const USERS: Map<string, { email: string; passwordHash: string }> = new Map();

function simpleHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function createToken(email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  action: z.literal("signup"),
  inviteCode: z.string().min(1, "Invite code is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT in httpOnly cookie.
 * Also handles signup when action=signup.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a signup request
    if (body.action === "signup") {
      const parsed = signupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid input" },
          { status: 400 },
        );
      }

      const { email, password, inviteCode } = parsed.data;

      // Validate invite code (simple check for MVP)
      if (inviteCode !== "CODE-SRS-2026" && inviteCode !== "PREVIEW") {
        return NextResponse.json(
          { error: "Invalid invite code" },
          { status: 403 },
        );
      }

      if (USERS.has(email)) {
        return NextResponse.json(
          { error: "Account already exists" },
          { status: 409 },
        );
      }

      USERS.set(email, { email, passwordHash: simpleHash(password) });

      const token = createToken(email);
      const response = NextResponse.json({ success: true });

      response.cookies.set("session", token, {
        httpOnly: true,
        secure: false, // set to true in production
        sameSite: "lax",
        path: "/",
        maxAge: 86400,
      });

      return response;
    }

    // Login
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const user = USERS.get(email);

    if (!user || user.passwordHash !== simpleHash(password)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = createToken(email);
    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/auth/login
 * Sign out — clear the session cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
