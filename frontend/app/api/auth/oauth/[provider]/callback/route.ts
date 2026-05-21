import { NextRequest, NextResponse } from "next/server";
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
      exp: Math.floor(Date.now() / 1000) + 86400,
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

const OAUTH_PROVIDERS: Record<string, { tokenUrl: string; clientId: string; clientSecret: string }> = {
  github: {
    tokenUrl: "https://github.com/login/oauth/access_token",
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  },
  google: {
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
};

/**
 * GET /api/auth/oauth/[provider]/callback
 * OAuth provider redirects here after user authorizes.
 * Exchanges code for token, fetches user info, creates session.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const config = OAUTH_PROVIDERS[provider];

  if (!config) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=unsupported_provider`, request.url),
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error(`OAuth ${provider} error:`, error);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${error}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=no_code", request.url),
    );
  }

  // Validate state to prevent CSRF
  const storedState = request.cookies.get("oauth_state")?.value;
  if (storedState && state !== storedState) {
    return NextResponse.redirect(
      new URL("/auth/login?error=csrf", request.url),
    );
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3334";
    const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error(`OAuth token exchange failed for ${provider}:`, errText);
      return NextResponse.redirect(
        new URL("/auth/login?error=token_exchange_failed", request.url),
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info from provider
    let userEmail = "";
    let displayName = "";
    let avatarUrl = "";
    let providerId = "";

    if (provider === "github") {
      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        providerId = String(userData.id);
        displayName = userData.name || userData.login;
        avatarUrl = userData.avatar_url;
        const emailRes = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (emailRes.ok) {
          const emails = await emailRes.json();
          const primary = emails.find((e: { primary: boolean; email: string }) => e.primary);
          userEmail = primary?.email || userData.email || `${userData.login}@github.oauth`;
        }
      }
    } else if (provider === "google") {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        providerId = userData.id;
        userEmail = userData.email;
        displayName = userData.name;
        avatarUrl = userData.picture;
      }
    }

    if (!userEmail) {
      return NextResponse.redirect(
        new URL("/auth/login?error=email_not_found", request.url),
      );
    }

    // Find or create user in database
    let userResult = await query(
      "SELECT id, email, role FROM users WHERE provider = $1 AND provider_id = $2",
      [provider, providerId],
    );

    if (userResult.rows.length === 0) {
      userResult = await query("SELECT id FROM users WHERE email = $1", [userEmail]);

      if (userResult.rows.length > 0) {
        // Link OAuth to existing account
        await query(
          `UPDATE users SET provider = $1, provider_id = $2, avatar_url = COALESCE($3, avatar_url), display_name = COALESCE($4, display_name), updated_at = NOW() WHERE email = $5`,
          [provider, providerId, avatarUrl, displayName, userEmail],
        );
      } else {
        // Create new user via OAuth
        await query(
          "INSERT INTO users (email, display_name, avatar_url, provider, provider_id, invite_code) VALUES ($1, $2, $3, $4, $5, 'oauth')",
          [userEmail, displayName, avatarUrl, provider, providerId],
        );
      }
    }

    // Issue JWT and redirect to app
    const token = createToken(userEmail);
    const response = NextResponse.redirect(new URL("/app", request.url));
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (err) {
    console.error(`OAuth ${provider} callback error:`, err);
    return NextResponse.redirect(
      new URL("/auth/login?error=internal", request.url),
    );
  }
}
