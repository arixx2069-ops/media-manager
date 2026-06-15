import type { PlatformAdapter, PlatformStats, PlatformComment } from "./types";
import {
  fetchInstagramBusinessAccount,
  fetchInstagramStats,
  fetchInstagramMediaInsights,
  fetchInstagramComments,
} from "./meta-client";

export const instagramAdapter: PlatformAdapter = {
  name: "instagram",
  displayName: "Instagram",

  async fetchStats(accessToken: string, accountId: string): Promise<PlatformStats> {
    const stats = await fetchInstagramStats(accessToken, accountId);
    const insights = await fetchInstagramMediaInsights(accessToken, accountId, 10);

    const totalLikes = insights.reduce((sum, i) => sum + i.likes, 0);
    const totalComments = insights.reduce((sum, i) => sum + i.comments, 0);
    const totalShares = insights.reduce((sum, i) => sum + i.shares, 0);

    return {
      followers: stats.follower_count ?? 0,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
    };
  },

  async fetchComments(
    accessToken: string,
    accountId: string
  ): Promise<PlatformComment[]> {
    const raw = await fetchInstagramComments(accessToken, accountId, 25);
    return raw.map((c: any) => ({
      id: c.id,
      platform: "instagram" as const,
      username: c.username ?? "unknown",
      text: c.text ?? "",
      timestamp: c.timestamp ?? new Date().toISOString(),
      likes: c.like_count ?? 0,
    }));
  },

  async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v22.0/me?access_token=${accessToken}`
      );
      return res.ok;
    } catch {
      return false;
    }
  },
};
