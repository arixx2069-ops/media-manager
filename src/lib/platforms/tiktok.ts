import type { PlatformAdapter, PlatformStats, PlatformComment } from "./types";

const TIKTOK_API_URL = "https://open.tiktokapis.com/v2";

export const tiktokAdapter: PlatformAdapter = {
  name: "tiktok",
  displayName: "TikTok",

  async fetchStats(accessToken: string, accountId: string): Promise<PlatformStats> {
    const fields = "follower_count,likes_count,comment_count,video_count";
    const res = await fetch(
      `${TIKTOK_API_URL}/user/info/?fields=${fields}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch TikTok stats");
    }

    const data = await res.json();
    const user = data?.data?.user;

    return {
      followers: Number(user?.follower_count ?? 0),
      likes: Number(user?.likes_count ?? 0),
      comments: Number(user?.comment_count ?? 0),
      views: Number(user?.video_count ?? 0),
    };
  },

  async fetchComments(
    accessToken: string,
    accountId: string
  ): Promise<PlatformComment[]> {
    try {
      const videosRes = await fetch(
        `${TIKTOK_API_URL}/video/list/?fields=id,title,create_time&max_count=10`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!videosRes.ok) return [];

      const videosData = await videosRes.json();
      const videos = videosData?.data?.videos ?? [];

      const allComments: PlatformComment[] = [];
      for (const video of videos.slice(0, 5)) {
        try {
          const comRes = await fetch(
            `${TIKTOK_API_URL}/video/comment/list/?fields=id,text,create_time,user_display_name,like_count&max_count=20`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ video_id: video.id }),
            }
          );

          if (comRes.ok) {
            const comData = await comRes.json();
            for (const c of comData?.data?.comments ?? []) {
              allComments.push({
                id: c.id,
                platform: "tiktok",
                username: c.user_display_name ?? "unknown",
                text: c.text ?? "",
                timestamp: c.create_time ?? new Date().toISOString(),
                likes: c.like_count ?? 0,
              });
            }
          }
        } catch {
          // skip failed comment fetches
        }
      }

      return allComments;
    } catch {
      return [];
    }
  },

  async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const res = await fetch(
        `${TIKTOK_API_URL}/user/info/?fields=display_name`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.ok;
    } catch {
      return false;
    }
  },
};
