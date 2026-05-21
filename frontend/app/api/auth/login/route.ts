import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { query } from "@/lib/db";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars!!";

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
 * Backed by PostgreSQL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Signup ─────────────────────────────────────────────────────────────
    if (body.action === "signup") {
      const parsed = signupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message || "Invalid input" },
          { status: 400 },
        );
      }

      const { email, password, inviteCode } = parsed.data;

      // Validate invite code against DB
      const inviteResult = await query(
        "SELECT code, max_uses, use_count FROM invite_codes WHERE code = $1",
        [inviteCode],
      );

      if (inviteResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Invalid invite code" },
          { status: 403 },
        );
      }

      const invite = inviteResult.rows[0];
      if (invite.max_uses > 0 && invite.use_count >= invite.max_uses) {
        return NextResponse.json(
          { error: "Invite code has reached maximum uses" },
          { status: 403 },
        );
      }

      // Check if user exists
      const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: "Account already exists" },
          { status: 409 },
        );
      }

      // Create user
      const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
      await query(
        "INSERT INTO users (email, password_hash, invite_code) VALUES ($1, $2, $3)",
        [email, passwordHash, inviteCode],
      );

      // Increment invite code usage
      await query(
        "UPDATE invite_codes SET use_count = use_count + 1 WHERE code = $1",
        [inviteCode],
      );

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
    }

    // ── Login ──────────────────────────────────────────────────────────────
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const result = await query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1 AND password_hash = $2",
      [email, passwordHash],
    );

    if (result.rows.length === 0) {
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
