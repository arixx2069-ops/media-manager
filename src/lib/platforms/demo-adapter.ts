import type { Platform } from "@prisma/client";
import {
  DEMO_PLATFORMS,
  DEMO_POSITIVE_COMMENTS,
  DEMO_USERS,
} from "@/lib/demo-data";
import type {
  SocialPlatformAdapter,
  PlatformMetrics,
  PlatformComment,
  PlatformUser,
} from "./types";

export function createDemoAdapter(platform: Platform): SocialPlatformAdapter {
  const demo = DEMO_PLATFORMS.find((p) => p.platform === platform);
  const users = DEMO_USERS.filter((u) => u.platform === platform);
  let localUsers = [...users];

  return {
    platform,
    isConfigured: () => true,
    async fetchMetrics(): Promise<PlatformMetrics> {
      if (!demo) {
        return { platform, likes: 0, comments: 0, shares: 0, followers: 0 };
      }
      return {
        platform,
        likes: demo.likes,
        comments: demo.comments,
        shares: demo.shares,
        followers: demo.followers,
      };
    },
    async fetchComments(limit = 20): Promise<PlatformComment[]> {
      return DEMO_POSITIVE_COMMENTS.filter((c) => c.platform === platform)
        .slice(0, limit)
        .map((c) => ({
          externalId: c.externalId,
          author: c.author,
          text: c.text,
          sentiment: c.sentiment as "positive",
          isPositive: c.isPositive,
          postedAt: c.postedAt,
        }));
    },
    async addUser(user: PlatformUser): Promise<PlatformUser> {
      localUsers.push({
        platform,
        username: user.username,
        displayName: user.displayName ?? user.username,
        role: user.role ?? "member",
        isActive: true,
      });
      return user;
    },
    async removeUser(username: string): Promise<void> {
      localUsers = localUsers.filter((u) => u.username !== username);
    },
  };
}
