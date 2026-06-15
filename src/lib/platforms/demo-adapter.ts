import type { PlatformAdapter, PlatformStats, PlatformComment } from "./types";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const demoUsernames = [
  "creative_artist", "tech_guru", "food_lover", "travel_world", "fitness_fan",
  "music_daily", "nature_shot", "code_master", "art_gallery", "sports_hub",
];

const demoComments = [
  "Amazing content! Keep it up! 🔥",
  "Love this so much ❤️",
  "This is exactly what I needed to see today!",
  "Great work! How did you make this?",
  "So inspiring! Thanks for sharing 🙏",
  "You're killing it! 💪",
  "This deserves more attention",
  "Can't believe this doesn't have more likes!",
  "Absolutely stunning 😍",
  "Bookmarked this for later!",
  "This helped me so much, thank you!",
  "Best content on this platform hands down",
];

export const demoAdapter: PlatformAdapter = {
  name: "instagram",
  displayName: "Instagram Demo",

  async fetchStats(): Promise<PlatformStats> {
    return {
      followers: randomBetween(1200, 85000),
      likes: randomBetween(300, 15000),
      comments: randomBetween(50, 3000),
      shares: randomBetween(20, 2000),
    };
  },

  async fetchComments(): Promise<PlatformComment[]> {
    const count = randomBetween(3, 10);
    const comments: PlatformComment[] = [];
    for (let i = 0; i < count; i++) {
      const daysAgo = randomBetween(0, 14);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      comments.push({
        id: `demo-${i}-${Date.now()}`,
        platform: "instagram",
        username: demoUsernames[randomBetween(0, demoUsernames.length - 1)],
        text: demoComments[randomBetween(0, demoComments.length - 1)],
        timestamp: date.toISOString(),
        likes: randomBetween(1, 200),
      });
    }
    return comments;
  },

  async verifyToken(): Promise<boolean> {
    return true;
  },
};

export const demoFacebookAdapter: PlatformAdapter = {
  name: "facebook",
  displayName: "Facebook Demo",

  async fetchStats(): Promise<PlatformStats> {
    return {
      followers: randomBetween(500, 45000),
      likes: randomBetween(100, 8000),
      comments: randomBetween(20, 1500),
      shares: randomBetween(10, 1000),
    };
  },

  async fetchComments(): Promise<PlatformComment[]> {
    const count = randomBetween(2, 8);
    const comments: PlatformComment[] = [];
    for (let i = 0; i < count; i++) {
      const daysAgo = randomBetween(0, 10);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      comments.push({
        id: `demo-fb-${i}-${Date.now()}`,
        platform: "facebook",
        username: demoUsernames[randomBetween(0, demoUsernames.length - 1)],
        text: demoComments[randomBetween(0, demoComments.length - 1)],
        timestamp: date.toISOString(),
        likes: randomBetween(1, 100),
      });
    }
    return comments;
  },

  async verifyToken(): Promise<boolean> {
    return true;
  },
};

export const demoTikTokAdapter: PlatformAdapter = {
  name: "tiktok",
  displayName: "TikTok Demo",

  async fetchStats(): Promise<PlatformStats> {
    return {
      followers: randomBetween(2000, 120000),
      likes: randomBetween(500, 50000),
      comments: randomBetween(100, 5000),
      views: randomBetween(10000, 500000),
    };
  },

  async fetchComments(): Promise<PlatformComment[]> {
    const count = randomBetween(3, 12);
    const comments: PlatformComment[] = [];
    for (let i = 0; i < count; i++) {
      const daysAgo = randomBetween(0, 7);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      comments.push({
        id: `demo-tt-${i}-${Date.now()}`,
        platform: "tiktok",
        username: demoUsernames[randomBetween(0, demoUsernames.length - 1)],
        text: demoComments[randomBetween(0, demoComments.length - 1)],
        timestamp: date.toISOString(),
        likes: randomBetween(5, 500),
      });
    }
    return comments;
  },

  async verifyToken(): Promise<boolean> {
    return true;
  },
};
