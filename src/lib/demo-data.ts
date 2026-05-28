import type { Platform } from "@prisma/client";

export const DEMO_PLATFORMS: {
  platform: Platform;
  accountName: string;
  status: "CONNECTED";
  likes: number;
  comments: number;
  shares: number;
  followers: number;
}[] = [
  {
    platform: "INSTAGRAM",
    accountName: "@brandstudio",
    status: "CONNECTED",
    likes: 12480,
    comments: 892,
    shares: 340,
    followers: 45200,
  },
  {
    platform: "TIKTOK",
    accountName: "@brandstudio",
    status: "CONNECTED",
    likes: 89200,
    comments: 2100,
    shares: 5600,
    followers: 128000,
  },
  {
    platform: "TELEGRAM",
    accountName: "Brand Studio Channel",
    status: "CONNECTED",
    likes: 0,
    comments: 456,
    shares: 1200,
    followers: 8900,
  },
  {
    platform: "YOUTUBE",
    accountName: "Brand Studio",
    status: "CONNECTED",
    likes: 34000,
    comments: 1200,
    shares: 0,
    followers: 22100,
  },
];

export const DEMO_POSITIVE_COMMENTS = [
  {
    platform: "INSTAGRAM" as Platform,
    externalId: "ig-1",
    author: "sarah_k",
    text: "Love this product! Exactly what I needed 🔥",
    sentiment: "positive",
    isPositive: true,
    postedAt: new Date(Date.now() - 3600000),
  },
  {
    platform: "TIKTOK" as Platform,
    externalId: "tt-1",
    author: "mikecreates",
    text: "This tutorial saved my project, thank you!",
    sentiment: "positive",
    isPositive: true,
    postedAt: new Date(Date.now() - 7200000),
  },
  {
    platform: "TELEGRAM" as Platform,
    externalId: "tg-1",
    author: "Alex",
    text: "Great update on the channel, keep it up!",
    sentiment: "positive",
    isPositive: true,
    postedAt: new Date(Date.now() - 10800000),
  },
  {
    platform: "INSTAGRAM" as Platform,
    externalId: "ig-2",
    author: "design_daily",
    text: "Your aesthetic is always on point ✨",
    sentiment: "positive",
    isPositive: true,
    postedAt: new Date(Date.now() - 14400000),
  },
];

export const DEMO_USERS = [
  {
    platform: "INSTAGRAM" as Platform,
    username: "content_lead",
    displayName: "Jordan Lee",
    role: "admin",
    isActive: true,
  },
  {
    platform: "TIKTOK" as Platform,
    username: "video_editor",
    displayName: "Sam Rivera",
    role: "editor",
    isActive: true,
  },
  {
    platform: "TELEGRAM" as Platform,
    username: "community_mod",
    displayName: "Casey Kim",
    role: "moderator",
    isActive: true,
  },
];
