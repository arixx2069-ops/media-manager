import type { Platform } from "@prisma/client";
import type { PlatformCredentials } from "@/lib/oauth/credentials";
import { createDemoAdapter } from "./demo-adapter";
import { createFacebookAdapter } from "./facebook";
import { createInstagramAdapter } from "./instagram";
import { createTelegramAdapter } from "./telegram";
import { createTikTokAdapter } from "./tiktok";
import type { SocialPlatformAdapter } from "./types";

const PLATFORMS: Platform[] = [
  "INSTAGRAM",
  "TIKTOK",
  "TELEGRAM",
  "YOUTUBE",
  "TWITTER",
  "FACEBOOK",
  "LINKEDIN",
];

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false";
}

function hasLiveCredentials(
  platform: Platform,
  creds?: PlatformCredentials
): boolean {
  if (!creds) return false;
  switch (platform) {
    case "INSTAGRAM":
      return Boolean(creds.meta?.accessToken && creds.meta.igAccountId);
    case "FACEBOOK":
      return Boolean(creds.meta?.accessToken && creds.meta.pageId);
    case "TIKTOK":
      return Boolean(creds.tiktok?.accessToken);
    default:
      return false;
  }
}

export function getAdapter(
  platform: Platform,
  creds?: PlatformCredentials
): SocialPlatformAdapter {
  if (isDemoMode() && !hasLiveCredentials(platform, creds)) {
    return createDemoAdapter(platform);
  }

  switch (platform) {
    case "INSTAGRAM":
      return createInstagramAdapter(creds);
    case "FACEBOOK":
      return createFacebookAdapter(creds);
    case "TIKTOK":
      return createTikTokAdapter(creds);
    case "TELEGRAM":
      return createTelegramAdapter();
    default:
      return createDemoAdapter(platform);
  }
}

export function getAllAdapters(
  creds?: PlatformCredentials
): SocialPlatformAdapter[] {
  return PLATFORMS.map((p) => getAdapter(p, creds));
}

export { PLATFORMS };
