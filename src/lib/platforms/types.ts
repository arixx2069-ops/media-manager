import type { Platform } from "@prisma/client";

export type PlatformMetrics = {
  platform: Platform;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
};

export type PlatformComment = {
  externalId: string;
  author: string;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  isPositive: boolean;
  postedAt: Date;
};

export type PlatformUser = {
  externalId?: string;
  username: string;
  displayName?: string;
  role?: string;
};

export interface SocialPlatformAdapter {
  platform: Platform;
  isConfigured(): boolean;
  fetchMetrics(): Promise<PlatformMetrics>;
  fetchComments(limit?: number): Promise<PlatformComment[]>;
  addUser(user: PlatformUser): Promise<PlatformUser>;
  removeUser(username: string): Promise<void>;
}
