import { getOAuthCredentials } from "./credentials";

const META_AUTH_URL = "https://www.facebook.com/v22.0/dialog/oauth";

export function buildMetaAuthUrl(
  request: Request,
  state: string
): string {
  const { meta } = getOAuthCredentials();
  const { origin } = new URL(request.url);

  const params = new URLSearchParams({
    client_id: meta.appId,
    redirect_uri: `${origin}/api/oauth/meta/callback`,
    state,
    scope: [
      "instagram_basic",
      "instagram_manage_insights",
      "instagram_content_publish",
      "pages_read_engagement",
      "pages_show_list",
      "business_management",
    ].join(","),
    response_type: "code",
  });

  return `${META_AUTH_URL}?${params.toString()}`;
}

export async function exchangeMetaCode(
  request: Request,
  code: string
): Promise<{ accessToken: string; instagramAccountId?: string; facebookPageId?: string }> {
  const { meta } = getOAuthCredentials();
  const { origin } = new URL(request.url);

  const tokenRes = await fetch(
    `https://graph.facebook.com/v22.0/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: meta.appId,
        client_secret: meta.appSecret,
        redirect_uri: `${origin}/api/oauth/meta/callback`,
        code,
      }),
    }
  );

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Failed to exchange Meta code");
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const accountsRes = await fetch(
    `https://graph.facebook.com/v22.0/me/accounts?fields=id,name,instagram_business_account{id,username}&access_token=${accessToken}`
  );

  let instagramAccountId: string | undefined;
  let facebookPageId: string | undefined;

  if (accountsRes.ok) {
    const accountsData = await accountsRes.json();
    const pages = accountsData?.data ?? [];

    if (pages.length > 0) {
      facebookPageId = pages[0].id;
      const igAccount = pages[0].instagram_business_account;
      if (igAccount?.id) {
        instagramAccountId = igAccount.id;
      }
    }
  }

  return { accessToken, instagramAccountId, facebookPageId };
}

export async function longLivedMetaToken(shortLivedToken: string): Promise<string> {
  const { meta } = getOAuthCredentials();

  const res = await fetch(
    `https://graph.facebook.com/v22.0/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: meta.appId,
        client_secret: meta.appSecret,
        fb_exchange_token: shortLivedToken,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to exchange for long-lived token");
  }

  const data = await res.json();
  return data.access_token;
}
