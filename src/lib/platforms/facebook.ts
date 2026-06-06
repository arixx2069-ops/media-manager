import type { Platform } from "@prisma/client";
import type { PlatformCredentials } from "@/lib/oauth/credentials";
import { metaGraphGet } from "./meta-client";
import type {
  PlatformComment,
  PlatformMetrics,
  PlatformUser,
  SocialPlatformAdapter,
} from "./types";

type FbPage = {
  followers_count?: number;
  fan_count?: number;
};

type FbFeedItem = {
  id: string;
  comments?: { summary?: { total_count?: number } };
  likes?: { summary?: { total_count?: number } };
  shares?: { count?: number };
};

type FbFeedResponse = {
  data?: FbFeedItem[];
};

type FbCommentItem = {
  id: string;
  message?: string;
  from?: { name?: string };
  created_time?: string;
};

type FbCommentsResponse = {
  data?: FbCommentItem[];
};

export function createFacebookAdapter(
  creds?: PlatformCredentials
): SocialPlatformAdapter {
  const platform: Platform = "FACEBOOK";
  const token = () => creds?.meta?.accessToken?.trim();
  const id = () => creds?.meta?.pageId?.trim();

  return {
    platform,
    isConfigured: () => Boolean(token() && id()),

    async fetchMetrics(): Promise<PlatformMetrics> {
      const pageId = id();
      const t = token();
      if (!pageId || !t) {
        return { platform, likes: 0, comments: 0, shares: 0, followers: 0 };
      }

      const page = await metaGraphGet<FbPage>(pageId, t, {
        fields: "followers_count,fan_count",
      });

      const feed = await metaGraphGet<FbFeedResponse>(`${pageId}/feed`, t, {
        fields: "comments.summary(true),likes.summary(true),shares",
        limit: "25",
      });

      const posts = feed.data ?? [];
      const likes = posts.reduce(
        (sum, p) => sum + (p.likes?.summary?.total_count ?? 0),
        0
      );
      const comments = posts.reduce(
        (sum, p) => sum + (p.comments?.summary?.total_count ?? 0),
        0
      );
      const shares = posts.reduce((sum, p) => sum + (p.shares?.count ?? 0), 0);

      return {
        platform,
        followers: page.followers_count ?? page.fan_count ?? 0,
        likes,
        comments,
        shares,
      };
    },

    async fetchComments(limit = 20): Promise<PlatformComment[]> {
      const pageId = id();
      const t = token();
      if (!pageId || !t) return [];

      const feed = await metaGraphGet<FbFeedResponse>(`${pageId}/feed`, t, {
        fields: "id",
        limit: "10",
      });

      const comments: PlatformComment[] = [];
      for (const post of feed.data ?? []) {
        if (comments.length >= limit) break;
        try {
          const res = await metaGraphGet<FbCommentsResponse>(
            `${post.id}/comments`,
            t,
            { fields: "id,message,from,created_time", limit: String(limit) }
          );
          for (const c of res.data ?? []) {
            if (comments.length >= limit) break;
            const text = c.message ?? "";
            const positive = /love|great|thank|amazing|❤/i.test(text);
            comments.push({
              externalId: c.id,
              author: c.from?.name ?? "unknown",
              text,
              sentiment: positive ? "positive" : "neutral",
              isPositive: positive,
              postedAt: c.created_time
                ? new Date(c.created_time)
                : new Date(),
            });
          }
        } catch {
          /* skip posts without permission */
        }
      }

      return comments.slice(0, limit);
    },

    async addUser(user: PlatformUser): Promise<PlatformUser> {
      return user;
    },

    async removeUser(): Promise<void> {
      /* managed via Meta Business Suite */
    },
  };
}
