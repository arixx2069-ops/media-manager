import type { PlatformAdapter, PlatformStats, PlatformComment } from "./types";
import { fetchFacebookPageStats, fetchFacebookPageFeed } from "./meta-client";

export const facebookAdapter: PlatformAdapter = {
  name: "facebook",
  displayName: "Facebook",

  async fetchStats(accessToken: string, accountId: string): Promise<PlatformStats> {
    const stats = await fetchFacebookPageStats(accessToken, accountId);

    const feed = await fetchFacebookPageFeed(accessToken, accountId, 10);
    const posts = feed?.data ?? [];

    const totalLikes = posts.reduce((sum: number, p: any) => {
      return sum + (p.likes?.summary?.total_count ?? 0);
    }, 0);
    const totalComments = posts.reduce((sum: number, p: any) => {
      return sum + (p.comments?.summary?.total_count ?? 0);
    }, 0);
    const totalShares = posts.reduce((sum: number, p: any) => {
      return sum + (p.shares?.count ?? 0);
    }, 0);

    return {
      followers: stats.fan_count ?? stats.followers_count ?? 0,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
    };
  },

  async fetchComments(
    accessToken: string,
    accountId: string
  ): Promise<PlatformComment[]> {
    const feed = await fetchFacebookPageFeed(accessToken, accountId, 5);
    const posts = feed?.data ?? [];

    const allComments: PlatformComment[] = [];
    for (const post of posts) {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v22.0/${post.id}/comments?fields=id,message,created_time,from{name,id},like_count&limit=25&access_token=${accessToken}`
        );
        if (res.ok) {
          const data = await res.json();
          for (const c of data?.data ?? []) {
            allComments.push({
              id: c.id,
              platform: "facebook",
              username: c.from?.name ?? "unknown",
              text: c.message ?? "",
              timestamp: c.created_time ?? new Date().toISOString(),
              likes: c.like_count ?? 0,
            });
          }
        }
      } catch {
        // skip failed comment fetches
      }
    }
    return allComments;
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
