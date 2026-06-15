"use client";

import type { Platform } from "@/lib/platforms/types";

const platformColors: Record<Platform, string> = {
  instagram: "text-pink-500",
  facebook: "text-blue-500",
  tiktok: "text-sky-400",
  telegram: "text-blue-400",
};

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  telegram: "Telegram",
};

export function PlatformBadge({
  platform,
  className = "",
}: {
  platform: Platform;
  className?: string;
}) {
  return (
    <span
      className={`text-[0.62rem] uppercase tracking-wider font-medium ${
        platformColors[platform] ?? ""
      } ${className}`}
    >
      {platformLabels[platform] ?? platform}
    </span>
  );
}
