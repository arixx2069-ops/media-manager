import { NextResponse } from "next/server";
import { syncAll } from "@/lib/api-sync";
import { isDemoMode } from "@/lib/oauth/credentials";
import { getDemoAccounts } from "@/lib/demo-data";

export async function GET() {
  try {
    if (isDemoMode()) {
      return NextResponse.json({
        demo: true,
        accounts: getDemoAccounts(),
      });
    }

    const results = await syncAll();
    return NextResponse.json({
      demo: false,
      results,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
