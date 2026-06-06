import { NextResponse } from "next/server";
import { resolveCredentials } from "@/lib/oauth/credentials";
import { getAllAdapters } from "@/lib/platforms";

const COMMENT_PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TIKTOK", "TELEGRAM"] as const;

export async function GET() {
  try {
    const creds = await resolveCredentials();
    const adapters = getAllAdapters(creds).filter(
      (a) =>
        COMMENT_PLATFORMS.includes(
          a.platform as (typeof COMMENT_PLATFORMS)[number]
        ) && a.isConfigured()
    );

    const withPlatform = await Promise.all(
      adapters.map(async (a) => {
        const list = await a.fetchComments(15);
        return list
          .filter((c) => c.isPositive)
          .map((c) => ({
            externalId: c.externalId,
            author: c.author,
            text: c.text,
            platform: a.platform,
            postedAt: c.postedAt.toISOString(),
          }));
      })
    );

    const comments = withPlatform
      .flat()
      .sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );

    return NextResponse.json({ comments });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch comments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
