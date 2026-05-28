import type { Platform } from "@prisma/client";
import type {
  SocialPlatformAdapter,
  PlatformMetrics,
  PlatformComment,
  PlatformUser,
} from "./types";

const TELEGRAM_API = "https://api.telegram.org/bot";

export function createTelegramAdapter(): SocialPlatformAdapter {
  const platform: Platform = "TELEGRAM";
  const token = process.env.TELEGRAM_BOT_TOKEN;

  return {
    platform,
    isConfigured: () => Boolean(token),
    async fetchMetrics(): Promise<PlatformMetrics> {
      if (!token) {
        throw new Error("TELEGRAM_BOT_TOKEN not configured");
      }
      const res = await fetch(`${TELEGRAM_API}${token}/getMe`);
      const data = (await res.json()) as { ok: boolean };
      if (!data.ok) {
        throw new Error("Telegram API error");
      }
      return {
        platform,
        likes: 0,
        comments: 0,
        shares: 0,
        followers: 0,
      };
    },
    async fetchComments(): Promise<PlatformComment[]> {
      return [];
    },
    async addUser(user: PlatformUser): Promise<PlatformUser> {
      return user;
    },
    async removeUser(): Promise<void> {},
  };
}
