import type { Platform } from "@prisma/client";

const labels: Record<Platform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  TELEGRAM: "Telegram",
  YOUTUBE: "YouTube",
  TWITTER: "X",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
};

const colors: Record<Platform, string> = {
  INSTAGRAM: "bg-pink-500/15 text-pink-300",
  TIKTOK: "bg-[var(--card-border)] text-[var(--foreground)]",
  TELEGRAM: "bg-sky-500/15 text-sky-300",
  YOUTUBE: "bg-red-500/15 text-red-300",
  TWITTER: "bg-[var(--card-border)] text-[var(--foreground)]",
  FACEBOOK: "bg-blue-500/15 text-blue-300",
  LINKEDIN: "bg-blue-600/15 text-blue-200",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  return (
    <span
      className={`inline-flex text-xs font-medium px-2 py-0.5 rounded ${colors[platform]}`}
    >
      {labels[platform]}
    </span>
  );
}
