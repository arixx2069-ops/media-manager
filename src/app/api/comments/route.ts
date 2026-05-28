import { NextResponse } from "next/server";
import { getAllAdapters } from "@/lib/platforms";

export async function GET() {
  try {
    const adapters = getAllAdapters().slice(0, 4);
    const withPlatform = await Promise.all(
      adapters.map(async (a) => {
        const list = await a.fetchComments(10);
        return list
          .filter((c) => c.isPositive)
          .map((c) => ({ ...c, platform: a.platform }));
      })
    );

    const comments = withPlatform
      .flat()
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

    return NextResponse.json({ comments });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch comments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
