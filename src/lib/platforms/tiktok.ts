import type { Platform } from "@prisma/client";
import type { PlatformCredentials } from "@/lib/oauth/credentials";
import type {
  PlatformComment,
  PlatformMetrics,
  PlatformUser,
  SocialPlatformAdapter,
} from "./types";

const TIKTOK_USER_INFO = "https://open.tiktokapis.com/v2/user/info/";
const TIKTOK_VIDEO_LIST = "https://open.tiktokapis.com/v2/video/list/";

type TikTokUserData = {
  follower_count?: number;
  likes_count?: number;
  video_count?: number;
};

type TikTokUserResponse = {
  data?: { user?: TikTokUserData };
  error?: { message?: string };
};

type TikTokVideo = {
  id: string;
  comment_count?: number;
  like_count?: number;
  share_count?: number;
};

type TikTokVideoResponse = {
  data?: { videos?: TikTokVideo[] };
  error?: { message?: string };
};

export function createTikTokAdapter(
  creds?: PlatformCredentials
): SocialPlatformAdapter {
  const platform: Platform = "TIKTOK";
  const token = () => creds?.tiktok?.accessToken?.trim();

  async function tiktokPost<T>(url: string, body: object): Promise<T> {
    const t = token();
    if (!t) throw new Error("TikTok access token is not set");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      next: { revalidate: 300 },
    });

    const data = (await res.json()) as T & { error?: { message?: string } };
    if (!res.ok || data.error?.message) {
      throw new Error(data.error?.message ?? `TikTok API error (${res.status})`);
    }
    return data;
  }

  return {
    platform,
    isConfigured: () => Boolean(token()),

    async fetchMetrics(): Promise<PlatformMetrics> {
      if (!token()) {
        return { platform, likes: 0, comments: 0, shares: 0, followers: 0 };
      }

      const userRes = await tiktokPost<TikTokUserResponse>(TIKTOK_USER_INFO, {
        fields: ["follower_count", "likes_count", "video_count"],
      });

      const user = userRes.data?.user;
      let comments = 0;
      let shares = 0;

      try {
        const videoRes = await tiktokPost<TikTokVideoResponse>(
          TIKTOK_VIDEO_LIST,
          {
            max_count: 20,
            fields: ["id", "comment_count", "like_count", "share_count"],
          }
        );
        const videos = videoRes.data?.videos ?? [];
        comments = videos.reduce((s, v) => s + (v.comment_count ?? 0), 0);
        shares = videos.reduce((s, v) => s + (v.share_count ?? 0), 0);
      } catch {
        /* video.list may require extra scopes */
      }

      return {
        platform,
        followers: user?.follower_count ?? 0,
        likes: user?.likes_count ?? 0,
        comments,
        shares,
      };
    },

    async fetchComments(limit = 20): Promise<PlatformComment[]> {
      void limit;
      return [];
    },

    async addUser(user: PlatformUser): Promise<PlatformUser> {
      return user;
    },

    async removeUser(): Promise<void> {
      /* managed via TikTok Developer Portal */
    },
  };
}
