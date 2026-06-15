const META_GRAPH_URL = "https://graph.facebook.com/v22.0";

export interface InstagramBusinessAccount {
  id: string;
  username: string;
  name: string;
  profile_picture_url?: string;
}

export interface InstagramStats {
  follower_count: number;
  media_count: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface FacebookPageStats {
  fan_count: number;
  followers_count: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface MediaInsight {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}

export async function fetchInstagramBusinessAccount(
  accessToken: string,
  igAccountId: string
): Promise<InstagramBusinessAccount> {
  const res = await fetch(
    `${META_GRAPH_URL}/${igAccountId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Failed to fetch Instagram account");
  }
  return res.json();
}

export async function fetchInstagramStats(
  accessToken: string,
  igAccountId: string
): Promise<InstagramStats> {
  const res = await fetch(
    `${META_GRAPH_URL}/${igAccountId}?fields=followed_by_count,follower_count,media_count&access_token=${accessToken}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Failed to fetch Instagram stats");
  }
  return res.json();
}

export async function fetchInstagramMediaInsights(
  accessToken: string,
  igAccountId: string,
  limit = 10
): Promise<MediaInsight[]> {
  const mediaRes = await fetch(
    `${META_GRAPH_URL}/${igAccountId}/media?fields=id,media_type,caption&limit=${limit}&access_token=${accessToken}`
  );
  if (!mediaRes.ok) return [];

  const mediaData = await mediaRes.json();
  const mediaItems = mediaData?.data ?? [];

  const insights: MediaInsight[] = [];
  for (const item of mediaItems.slice(0, 10)) {
    if (item.media_type === "VIDEO") continue;
    const insRes = await fetch(
      `${META_GRAPH_URL}/${item.id}/insights?metric=likes,comments,shares,reach,impressions&access_token=${accessToken}`
    );
    if (insRes.ok) {
      const insData = await insRes.json();
      const metricMap: Record<string, number> = {};
      for (const m of insData?.data ?? []) {
        metricMap[m.name] = m.values?.[0]?.value ?? 0;
      }
      insights.push({
        likes: metricMap.likes ?? 0,
        comments: metricMap.comments ?? 0,
        shares: metricMap.shares ?? 0,
        reach: metricMap.reach ?? 0,
        impressions: metricMap.impressions ?? 0,
      });
    }
  }
  return insights;
}

export async function fetchFacebookPageStats(
  accessToken: string,
  pageId: string
): Promise<FacebookPageStats> {
  const res = await fetch(
    `${META_GRAPH_URL}/${pageId}?fields=fan_count,followers_count,likes&access_token=${accessToken}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Failed to fetch Facebook page stats");
  }
  return res.json();
}

export async function fetchFacebookPageFeed(
  accessToken: string,
  pageId: string,
  limit = 10
) {
  const res = await fetch(
    `${META_GRAPH_URL}/${pageId}/feed?fields=id,message,created_time,likes.limit(1).summary(true),comments.limit(1).summary(true),shares&limit=${limit}&access_token=${accessToken}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Failed to fetch Facebook feed");
  }
  return res.json();
}

export async function fetchInstagramComments(
  accessToken: string,
  igAccountId: string,
  limit = 25
) {
  const mediaRes = await fetch(
    `${META_GRAPH_URL}/${igAccountId}/media?fields=id&limit=5&access_token=${accessToken}`
  );
  if (!mediaRes.ok) return [];

  const mediaData = await mediaRes.json();
  const mediaItems = mediaData?.data ?? [];

  const allComments: any[] = [];
  for (const item of mediaItems) {
    const comRes = await fetch(
      `${META_GRAPH_URL}/${item.id}/comments?fields=id,text,timestamp,username,like_count&limit=${limit}&access_token=${accessToken}`
    );
    if (comRes.ok) {
      const comData = await comRes.json();
      allComments.push(...(comData?.data ?? []));
    }
  }
  return allComments;
}
