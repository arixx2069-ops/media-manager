import { getAppOrigin } from "./credentials";
import type { MetaConnection } from "./credentials";

const GRAPH = "https://graph.facebook.com/v21.0";

const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_manage_comments",
].join(",");

export function metaRedirectUri(request: Request): string {
  return `${getAppOrigin(request)}/api/oauth/meta/callback`;
}

export function buildMetaAuthUrl(request: Request, state: string): string {
  const appId = process.env.META_APP_ID?.trim();
  if (!appId) throw new Error("META_APP_ID is not set");

  const url = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", metaRedirectUri(request));
  url.searchParams.set("state", state);
  url.searchParams.set("scope", META_SCOPES);
  url.searchParams.set("response_type", "code");
  // Add additional OAuth parameters for better compatibility
  url.searchParams.set("auth_type", "rerequest"); // Force re-authentication if needed
  url.searchParams.set("display", "page"); // Display type for desktop
  return url.toString();
}

export async function exchangeMetaCode(
  request: Request,
  code: string
): Promise<MetaConnection> {
  const appId = process.env.META_APP_ID?.trim();
  const appSecret = process.env.META_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    throw new Error("META_APP_ID and META_APP_SECRET are required");
  }

  const tokenUrl = new URL(`${GRAPH}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", metaRedirectUri(request));
  tokenUrl.searchParams.set("code", code);

  const shortRes = await fetch(tokenUrl.toString());
  const shortData = (await shortRes.json()) as {
    access_token?: string;
    error?: { message?: string };
  };
  if (!shortRes.ok || !shortData.access_token) {
    throw new Error(shortData.error?.message ?? "Meta token exchange failed");
  }

  const longUrl = new URL(`${GRAPH}/oauth/access_token`);
  longUrl.searchParams.set("grant_type", "fb_exchange_token");
  longUrl.searchParams.set("client_id", appId);
  longUrl.searchParams.set("client_secret", appSecret);
  longUrl.searchParams.set("fb_exchange_token", shortData.access_token);

  const longRes = await fetch(longUrl.toString());
  const longData = (await longRes.json()) as {
    access_token?: string;
    error?: { message?: string };
  };
  const userToken = longData.access_token ?? shortData.access_token;

  type PageRow = {
    id: string;
    name?: string;
    access_token?: string;
    instagram_business_account?: { id: string; username?: string };
  };

  const pagesUrl = new URL(`${GRAPH}/me/accounts`);
  pagesUrl.searchParams.set(
    "fields",
    "id,name,access_token,instagram_business_account{id,username}"
  );
  pagesUrl.searchParams.set("access_token", userToken);

  const pagesRes = await fetch(pagesUrl.toString());
  const pagesData = (await pagesRes.json()) as {
    data?: PageRow[];
    error?: { message?: string };
  };

  if (!pagesRes.ok || pagesData.error) {
    throw new Error(pagesData.error?.message ?? "Could not load Facebook Pages");
  }

  const page = pagesData.data?.find(
    (p) => p.instagram_business_account || p.access_token
  );

  if (!page?.access_token) {
    throw new Error(
      "No Facebook Page found. Link a Page and Instagram Business account in Meta Business Suite."
    );
  }

  return {
    accessToken: page.access_token,
    pageId: page.id,
    pageName: page.name,
    igAccountId: page.instagram_business_account?.id,
    igUsername: page.instagram_business_account?.username,
  };
}
