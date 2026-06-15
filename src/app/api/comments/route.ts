import { NextResponse } from "next/server";
import { getComments } from "@/lib/api-sync";
import { isDemoMode } from "@/lib/oauth/credentials";
import { getDemoComments } from "@/lib/demo-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") ?? undefined;

    if (isDemoMode()) {
      const comments = getDemoComments();
      const filtered = platform
        ? comments.filter((c) => c.platform === platform)
        : comments;
      return NextResponse.json({ comments: filtered });
    }

    const comments = await getComments(platform);
    return NextResponse.json({ comments });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch comments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
