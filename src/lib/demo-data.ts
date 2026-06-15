import type { PlatformAccount, PlatformComment } from "./platforms/types";

export function getDemoAccounts(): PlatformAccount[] {
  return [
    {
      id: "demo-ig-1",
      platform: "instagram",
      username: "your_instagram",
      displayName: "Instagram",
      stats: {
        followers: 14230,
        likes: 891,
        comments: 234,
        shares: 56,
      },
      connected: true,
      lastSynced: new Date().toISOString(),
    },
    {
      id: "demo-fb-1",
      platform: "facebook",
      username: "your_facebook",
      displayName: "Facebook",
      stats: {
        followers: 8560,
        likes: 445,
        comments: 123,
        shares: 34,
      },
      connected: true,
      lastSynced: new Date().toISOString(),
    },
    {
      id: "demo-tt-1",
      platform: "tiktok",
      username: "your_tiktok",
      displayName: "TikTok",
      stats: {
        followers: 28450,
        likes: 1567,
        comments: 456,
        views: 89200,
      },
      connected: true,
      lastSynced: new Date().toISOString(),
    },
  ];
}

export function getDemoComments(): PlatformComment[] {
  const comments: PlatformComment[] = [
    { id: "d1", platform: "instagram", username: "creative_artist", text: "Amazing content! Keep it up! 🔥", timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 45 },
    { id: "d2", platform: "instagram", username: "tech_guru", text: "Love this so much ❤️", timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 23 },
    { id: "d3", platform: "facebook", username: "food_lover", text: "This is exactly what I needed to see today!", timestamp: new Date(Date.now() - 10800000).toISOString(), likes: 12 },
    { id: "d4", platform: "tiktok", username: "travel_world", text: "So inspiring! Thanks for sharing 🙏", timestamp: new Date(Date.now() - 14400000).toISOString(), likes: 67 },
    { id: "d5", platform: "instagram", username: "fitness_fan", text: "Great work! How did you make this?", timestamp: new Date(Date.now() - 18000000).toISOString(), likes: 8 },
    { id: "d6", platform: "facebook", username: "music_daily", text: "You're killing it! 💪", timestamp: new Date(Date.now() - 21600000).toISOString(), likes: 34 },
    { id: "d7", platform: "tiktok", username: "nature_shot", text: "This deserves more attention", timestamp: new Date(Date.now() - 25200000).toISOString(), likes: 89 },
    { id: "d8", platform: "instagram", username: "code_master", text: "Bookmarked this for later!", timestamp: new Date(Date.now() - 28800000).toISOString(), likes: 15 },
  ];
  return comments;
}
