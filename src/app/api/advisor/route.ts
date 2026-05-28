import { NextRequest, NextResponse } from "next/server";
import { getAiAdvice } from "@/lib/ai-advisor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const advice = await getAiAdvice({
      platforms: body.platforms,
      goals: body.goals,
      recentEngagement: body.recentEngagement,
    });
    return NextResponse.json(advice);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Advisor failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
