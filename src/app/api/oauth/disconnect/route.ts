import { NextResponse } from "next/server";
import {
  clearCookie,
  META_CONN_COOKIE,
  TIKTOK_CONN_COOKIE,
} from "@/lib/oauth/cookies";

export async function POST(request: Request) {
  const { platform } = (await request.json()) as { platform?: string };

  if (platform === "meta") {
    await clearCookie(META_CONN_COOKIE);
  } else if (platform === "tiktok") {
    await clearCookie(TIKTOK_CONN_COOKIE);
  } else {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
