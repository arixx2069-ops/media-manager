export type Platform = "instagram" | "facebook" | "tiktok" | "telegram";

export interface PlatformStats {
  likes: number;
  followers: number;
  comments: number;
  shares?: number;
  views?: number;
}

export interface PlatformAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName?: string;
  profilePicture?: string;
  stats: PlatformStats;
  connected: boolean;
  lastSynced?: string;
}

export interface PlatformComment {
  id: string;
  platform: Platform;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
  profilePicture?: string;
}

export interface PlatformAdapter {
  name: Platform;
  displayName: string;
  fetchStats(accessToken: string, accountId: string): Promise<PlatformStats>;
  fetchComments(accessToken: string, accountId: string): Promise<PlatformComment[]>;
  verifyToken(accessToken: string): Promise<boolean>;
}
