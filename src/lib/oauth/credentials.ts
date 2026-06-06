import type { NextRequest } from "next/server";
import {
  META_CONN_COOKIE,
  readSignedCookie,
  TIKTOK_CONN_COOKIE,
} from "./cookies";

export type MetaConnection = {
  accessToken: string;
  pageId?: string;
  pageName?: string;
  igAccountId?: string;
  igUsername?: string;
};

export type TikTokConnection = {
  accessToken: string;
  openId?: string;
  username?: string;
  displayName?: string;
};

export type PlatformCredentials = {
  meta?: MetaConnection;
  tiktok?: TikTokConnection;
};

export function getAppOrigin(request?: NextRequest | Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (request) return new URL(request.url).origin;
  return "http://localhost:3000";
}

export async function resolveCredentials(
  request?: NextRequest | Request
): Promise<PlatformCredentials> {
  const metaCookie = await readSignedCookie<MetaConnection>(META_CONN_COOKIE);
  const tiktokCookie = await readSignedCookie<TikTokConnection>(TIKTOK_CONN_COOKIE);

  const meta: MetaConnection | undefined =
    process.env.META_ACCESS_TOKEN?.trim()
      ? {
          accessToken: process.env.META_ACCESS_TOKEN.trim(),
          igAccountId: process.env.META_INSTAGRAM_ACCOUNT_ID?.trim(),
          pageId: process.env.META_FACEBOOK_PAGE_ID?.trim(),
        }
      : metaCookie ?? undefined;

  const tiktok: TikTokConnection | undefined =
    process.env.TIKTOK_ACCESS_TOKEN?.trim()
      ? {
          accessToken: process.env.TIKTOK_ACCESS_TOKEN.trim(),
        }
      : tiktokCookie ?? undefined;

  void request;
  return { meta, tiktok };
}

export function isMetaConfigured(creds: PlatformCredentials): boolean {
  return Boolean(
    creds.meta?.accessToken &&
      (creds.meta.igAccountId || creds.meta.pageId)
  );
}

export function isTikTokConfigured(creds: PlatformCredentials): boolean {
  return Boolean(creds.tiktok?.accessToken);
}
