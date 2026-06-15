import { getMetaCredentials, getTikTokCredentials, isDemoMode } from "./credentials";
import { getPlatformAdapter } from "../platforms";

export interface SyncResult {
  platform: string;
  success: boolean;
  stats?: {
    followers: number;
    likes: number;
    comments: number;
    shares?: number;
    views?: number;
  };
  error?: string;
}

export async function syncPlatformStats(
  platform: string,
  accountIdOverride?: string
): Promise<SyncResult> {
  const demo = isDemoMode();

  try {
    const adapter = getPlatformAdapter(platform, demo);
    if (!adapter) {
      return { platform, success: false, error: `Unknown platform: ${platform}` };
    }

    if (demo) {
      const stats = await adapter.fetchStats("", "");
      return { platform, success: true, stats };
    }

    let accessToken = "";
    let accountId = accountIdOverride ?? "";

    if (platform === "instagram" || platform === "facebook") {
      const meta = getMetaCredentials();
      if (!meta) {
        return { platform, success: false, error: "Meta credentials not configured. Set META_APP_ID and META_APP_SECRET in .env" };
      }
      accessToken = meta.accessToken;
      if (!accountId) {
        accountId = platform === "instagram"
          ? (meta.instagramAccountId ?? "")
          : (meta.facebookPageId ?? "");
      }
    } else if (platform === "tiktok") {
      const tiktok = getTikTokCredentials();
      if (!tiktok) {
        return { platform, success: false, error: "TikTok credentials not configured. Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in .env" };
      }
      accessToken = tiktok.accessToken;
    }

    if (!accessToken) {
      return { platform, success: false, error: `No access token for ${platform}` };
    }

    const stats = await adapter.fetchStats(accessToken, accountId);
    return { platform, success: true, stats };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { platform, success: false, error: message };
  }
}

export async function syncAllPlatforms(): Promise<SyncResult[]> {
  const platforms = ["instagram", "facebook", "tiktok"];
  const results = await Promise.all(
    platforms.map((p) => syncPlatformStats(p))
  );
  return results;
}

export async function fetchPlatformComments(
  platform: string
): Promise<any[]> {
  const demo = isDemoMode();

  try {
    const adapter = getPlatformAdapter(platform, demo);
    if (!adapter) return [];

    if (demo) {
      return adapter.fetchComments("", "");
    }

    let accessToken = "";

    if (platform === "instagram" || platform === "facebook") {
      const meta = getMetaCredentials();
      if (!meta) return [];
      accessToken = meta.accessToken;
    } else if (platform === "tiktok") {
      const tiktok = getTikTokCredentials();
      if (!tiktok) return [];
      accessToken = tiktok.accessToken;
    }

    if (!accessToken) return [];
    return adapter.fetchComments(accessToken, "");
  } catch {
    return [];
  }
}
