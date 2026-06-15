import type { PlatformAccount } from "./platforms/types";

export interface AccountInput {
  platform: string;
  username: string;
  displayName?: string;
  followers?: number;
  likes?: number;
  comments?: number;
}

export function createAccount(input: AccountInput): PlatformAccount {
  return {
    id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    platform: input.platform as any,
    username: input.username,
    displayName: input.displayName || input.username,
    stats: {
      followers: input.followers ?? 0,
      likes: input.likes ?? 0,
      comments: input.comments ?? 0,
    },
    connected: false,
  };
}
