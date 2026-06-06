import type { Platform } from "@prisma/client";
import type { PlatformCredentials } from "@/lib/oauth/credentials";
import { metaGraphGet } from "./meta-client";
import type {
  PlatformComment,
  PlatformMetrics,
  PlatformUser,
  SocialPlatformAdapter,
} from "./types";

type IgUser = {
  followers_count?: number;
  media_count?: number;
};

type IgMediaItem = {
  like_count?: number;
  comments_count?: number;
};

type IgMediaResponse = {
  data?: IgMediaItem[];
};

type IgCommentItem = {
  id: string;
  text?: string;
  username?: string;
  timestamp?: string;
};

type IgCommentsResponse = {
  data?: IgCommentItem[];
};

export function createInstagramAdapter(
  creds?: PlatformCredentials
): SocialPlatformAdapter {
  const platform: Platform = "INSTAGRAM";
  const token = () => creds?.meta?.accessToken?.trim();
  const accountId = () => creds?.meta?.igAccountId?.trim();

  return {
    platform,
    isConfigured: () => Boolean(token() && accountId()),

    async fetchMetrics(): Promise<PlatformMetrics> {
      const id = accountId();
      const t = token();
      if (!id || !t) {
        return { platform, likes: 0, comments: 0, shares: 0, followers: 0 };
      }

      const user = await metaGraphGet<IgUser>(id, t, {
        fields: "followers_count,media_count",
      });

      const media = await metaGraphGet<IgMediaResponse>(`${id}/media`, t, {
        fields: "like_count,comments_count",
        limit: "50",
      });

      const items = media.data ?? [];
      const likes = items.reduce((sum, m) => sum + (m.like_count ?? 0), 0);
      const comments = items.reduce(
        (sum, m) => sum + (m.comments_count ?? 0),
        0
      );

      return {
        platform,
        followers: user.followers_count ?? 0,
        likes,
        comments,
        shares: 0,
      };
    },

    async fetchComments(limit = 20): Promise<PlatformComment[]> {
      const id = accountId();
      const t = token();
      if (!id || !t) return [];

      const media = await metaGraphGet<{ data?: { id: string }[] }>(
        `${id}/media`,
        t,
        { fields: "id", limit: "10" }
      );

      const comments: PlatformComment[] = [];
      for (const post of media.data ?? []) {
        if (comments.length >= limit) break;
        try {
          const res = await metaGraphGet<IgCommentsResponse>(
            `${post.id}/comments`,
            t,
            { fields: "id,text,username,timestamp", limit: String(limit) }
          );
          for (const c of res.data ?? []) {
            if (comments.length >= limit) break;
            const text = c.text ?? "";
            const positive =
              /love|great|amazing|thank|❤|🔥|👏/i.test(text) || text.length > 0;
            comments.push({
              externalId: c.id,
              author: c.username ?? "unknown",
              text,
              sentiment: positive ? "positive" : "neutral",
              isPositive: positive,
              postedAt: c.timestamp ? new Date(c.timestamp) : new Date(),
            });
          }
        } catch {
          /* skip posts without comment permission */
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
