import type { PlatformAdapter, PlatformStats, PlatformComment } from "./types";

export const telegramAdapter: PlatformAdapter = {
  name: "telegram",
  displayName: "Telegram",

  async fetchStats(accessToken: string, accountId: string): Promise<PlatformStats> {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${accessToken}/getChatMembersCount?chat_id=@${accountId}`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          followers: data.result ?? 0,
          likes: 0,
          comments: 0,
        };
      }
    } catch {
      // fall through
    }
    return { followers: 0, likes: 0, comments: 0 };
  },

  async fetchComments(): Promise<PlatformComment[]> {
    return [];
  },

  async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${accessToken}/getMe`
      );
      return res.ok;
    } catch {
      return false;
    }
  },
};
