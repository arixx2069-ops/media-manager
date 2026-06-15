import { getOAuthCredentials } from "./credentials";

const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize";

export function buildTikTokAuthUrl(
  request: Request,
  state: string
): string {
  const { tiktok } = getOAuthCredentials();
  const { origin } = new URL(request.url);

  const params = new URLSearchParams({
    client_key: tiktok.clientKey,
    redirect_uri: `${origin}/api/oauth/tiktok/callback`,
    state,
    scope: [
      "user.info.basic",
      "user.info.stats",
      "video.list",
    ].join(","),
    response_type: "code",
  });

  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export async function exchangeTikTokCode(
  request: Request,
  code: string
): Promise<{ accessToken: string; openId: string }> {
  const { tiktok } = getOAuthCredentials();
  const { origin } = new URL(request.url);

  const tokenRes = await fetch(
    "https://open.tiktokapis.com/v2/oauth/token/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: tiktok.clientKey,
        client_secret: tiktok.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${origin}/api/oauth/tiktok/callback`,
      }),
    }
  );

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => ({}));
    throw new Error(err?.error_description ?? "Failed to exchange TikTok code");
  }

  const data = await tokenRes.json();
  return {
    accessToken: data.access_token,
    openId: data.open_id,
  };
}
