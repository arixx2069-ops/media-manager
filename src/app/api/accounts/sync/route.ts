import { NextResponse } from "next/server";
import type { Platform } from "@prisma/client";
import { resolveCredentials } from "@/lib/oauth/credentials";
import { getAdapter } from "@/lib/platforms";

const SYNC_PLATFORMS: Platform[] = ["INSTAGRAM", "FACEBOOK", "TIKTOK"];

export async function POST() {
  try {
    const creds = await resolveCredentials();
    const updates: {
      platform: Platform;
      followers: number;
      likes: number;
      comments: number;
      shares: number;
      configured: boolean;
    }[] = [];

    for (const platform of SYNC_PLATFORMS) {
      const adapter = getAdapter(platform, creds);
      const configured = adapter.isConfigured();
      if (!configured) {
        updates.push({
          platform,
          followers: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          configured: false,
        });
        continue;
      }

      const metrics = await adapter.fetchMetrics();
      updates.push({
        platform: metrics.platform,
        followers: metrics.followers,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        configured: true,
      });
    }

    const anyConfigured = updates.some((u) => u.configured);
    return NextResponse.json({ updates, anyConfigured });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
