import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const OAUTH_PROVIDERS: Record<string, { authUrl: string; clientId: string; scopes: string }> = {
  github: {
    authUrl: "https://github.com/login/oauth/authorize",
    clientId: process.env.GITHUB_CLIENT_ID || "",
    scopes: "user:email",
  },
  google: {
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    scopes: "openid email profile",
  },
};

/**
 * GET /api/auth/oauth/[provider]
 * Initiate OAuth flow — redirect to provider's authorization page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const config = OAUTH_PROVIDERS[provider];

  if (!config) {
    return NextResponse.json(
      {
        error: `Unsupported OAuth provider: "${provider}". Supported: ${Object.keys(OAUTH_PROVIDERS).join(", ")}`,
      },
      { status: 400 },
    );
  }

  if (!config.clientId) {
    const envKey = `${provider.toUpperCase()}_CLIENT_ID`;
    return NextResponse.json(
      {
        error: `${provider} OAuth is not configured. Set ${envKey} and ${provider.toUpperCase()}_CLIENT_SECRET environment variables.`,
      },
      { status: 501 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3334";
  const redirectUri = `${baseUrl}/api/auth/oauth/${provider}/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  const urlParams = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    scope: config.scopes,
    state,
    response_type: "code",
  });

  const authUrl = `${config.authUrl}?${urlParams}`;
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
