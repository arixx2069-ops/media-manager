export interface MetaCredentials {
  accessToken: string;
  instagramAccountId?: string;
  facebookPageId?: string;
  expiresAt?: number;
}

export interface TikTokCredentials {
  accessToken: string;
  openId: string;
  expiresAt?: number;
}

export function getMetaCredentials(): MetaCredentials | null {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const igId = process.env.META_INSTAGRAM_ACCOUNT_ID;
  const fbId = process.env.META_FACEBOOK_PAGE_ID;

  if (!accessToken) return null;

  return {
    accessToken,
    instagramAccountId: igId,
    facebookPageId: fbId,
  };
}

export function getTikTokCredentials(): TikTokCredentials | null {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const openId = process.env.TIKTOK_OPEN_ID;

  if (!accessToken) return null;

  return {
    accessToken,
    openId: openId ?? "",
  };
}

export function getOAuthCredentials() {
  return {
    meta: {
      appId: process.env.META_APP_ID ?? "",
      appSecret: process.env.META_APP_SECRET ?? "",
    },
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY ?? "",
      clientSecret: process.env.TIKTOK_CLIENT_SECRET ?? "",
    },
  };
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

export function hasMetaCredentials(): boolean {
  return !!(process.env.META_APP_ID && process.env.META_APP_SECRET);
}

export function hasTikTokCredentials(): boolean {
  return !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET);
}
