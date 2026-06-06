import { NextResponse } from "next/server";
import { resolveCredentials } from "@/lib/oauth/credentials";
import { getAllAdapters } from "@/lib/platforms";

export async function GET() {
  try {
    const creds = await resolveCredentials();
    const adapters = getAllAdapters(creds).filter((a) => a.isConfigured());
    const platforms = await Promise.all(
      adapters.map((a) => a.fetchMetrics())
    );

    const totals = platforms.reduce(
      (acc, p) => ({
        likes: acc.likes + p.likes,
        comments: acc.comments + p.comments,
        shares: acc.shares + p.shares,
        followers: acc.followers + p.followers,
      }),
      { likes: 0, comments: 0, shares: 0, followers: 0 }
    );

    return NextResponse.json({ platforms, totals });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
