import type { PlatformAdapter } from "./types";
import { instagramAdapter } from "./instagram";
import { facebookAdapter } from "./facebook";
import { tiktokAdapter } from "./tiktok";
import {
  demoAdapter,
  demoFacebookAdapter,
  demoTikTokAdapter,
} from "./demo-adapter";

export type { PlatformAdapter, PlatformStats, PlatformComment, Platform } from "./types";

export function getPlatformAdapters(
  demoMode: boolean
): Record<string, PlatformAdapter> {
  if (demoMode) {
    return {
      instagram: demoAdapter,
      facebook: demoFacebookAdapter,
      tiktok: demoTikTokAdapter,
    };
  }

  return {
    instagram: instagramAdapter,
    facebook: facebookAdapter,
    tiktok: tiktokAdapter,
  };
}

export function getPlatformAdapter(
  platform: string,
  demoMode: boolean
): PlatformAdapter | undefined {
  return getPlatformAdapters(demoMode)[platform];
}
