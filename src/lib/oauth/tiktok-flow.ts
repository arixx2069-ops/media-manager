import { getAppOrigin } from "./credentials";
import type { TikTokConnection } from "./credentials";

const TIKTOK_AUTH = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USER = "https://open.tiktokapis.com/v2/user/info/";

const TIKTOK_SCOPES = [
  "user.info.basic",
  "user.info.stats",
  "video.list",
].join(",");

export function tiktokRedirectUri(request: Request): string {
  return `${getAppOrigin(request)}/api/oauth/tiktok/callback`;
}

export function buildTikTokAuthUrl(request: Request, state: string): string {
  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim();
  if (!clientKey) throw new Error("TIKTOK_CLIENT_KEY is not set");

  const url = new URL(TIKTOK_AUTH);
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", TIKTOK_SCOPES);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", tiktokRedirectUri(request));
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeTikTokCode(
  request: Request,
  code: string
): Promise<TikTokConnection> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim();
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET?.trim();
  if (!clientKey || !clientSecret) {
    throw new Error("TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET are required");
  }

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: tiktokRedirectUri(request),
  });

  const tokenRes = await fetch(TIKTOK_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    open_id?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(
      tokenData.error_description ?? tokenData.error ?? "TikTok token exchange failed"
    );
  }

  const userRes = await fetch(TIKTOK_USER, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: ["open_id", "username", "display_name"],
    }),
  });

  const userData = (await userRes.json()) as {
    data?: {
      user?: { username?: string; display_name?: string; open_id?: string };
    };
  };

  const user = userData.data?.user;

  return {
    accessToken: tokenData.access_token,
    openId: tokenData.open_id ?? user?.open_id,
    username: user?.username,
    displayName: user?.display_name,
  };
}
