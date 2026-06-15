import { NextResponse } from "next/server";
import { syncAll, syncPlatform } from "@/lib/api-sync";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform } = body as { platform?: string };

    if (platform) {
      const result = await syncPlatform(platform);
      return NextResponse.json({ results: [result] });
    }

    const results = await syncAll();
    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
