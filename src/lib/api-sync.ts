import { syncAllPlatforms, syncPlatformStats, fetchPlatformComments } from "./oauth/client";
import type { SyncResult } from "./oauth/client";

export type { SyncResult } from "./oauth/client";

export async function syncAll(): Promise<SyncResult[]> {
  return syncAllPlatforms();
}

export async function syncPlatform(platform: string): Promise<SyncResult> {
  return syncPlatformStats(platform);
}

export async function getComments(platform?: string): Promise<any[]> {
  if (platform) {
    return fetchPlatformComments(platform);
  }

  const platforms = ["instagram", "facebook", "tiktok"];
  const allComments = await Promise.all(
    platforms.map((p) => fetchPlatformComments(p))
  );
  return allComments.flat().sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
