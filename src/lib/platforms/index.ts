import type { Platform } from "@prisma/client";
import { createDemoAdapter } from "./demo-adapter";
import { createTelegramAdapter } from "./telegram";
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

export function getAdapter(platform: Platform): SocialPlatformAdapter {
  if (isDemoMode()) {
    return createDemoAdapter(platform);
  }

  switch (platform) {
    case "TELEGRAM":
      return createTelegramAdapter();
    default:
      return createDemoAdapter(platform);
  }
}

export function getAllAdapters(): SocialPlatformAdapter[] {
  return PLATFORMS.map(getAdapter);
}

export { PLATFORMS };
