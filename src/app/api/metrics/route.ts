import { NextResponse } from "next/server";
import { getAllAdapters } from "@/lib/platforms";

export async function GET() {
  try {
    const adapters = getAllAdapters().filter(
      (a) => a.platform !== "TWITTER" && a.platform !== "FACEBOOK" && a.platform !== "LINKEDIN"
    );
    const active = adapters.slice(0, 4);
    const metrics = await Promise.all(active.map((a) => a.fetchMetrics()));
    const totals = metrics.reduce(
      (acc, m) => ({
        likes: acc.likes + m.likes,
        comments: acc.comments + m.comments,
        shares: acc.shares + m.shares,
        followers: acc.followers + m.followers,
      }),
      { likes: 0, comments: 0, shares: 0, followers: 0 }
    );
    return NextResponse.json({ platforms: metrics, totals });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
