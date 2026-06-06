import { NextRequest, NextResponse } from "next/server";
import { getAiAdvice } from "@/lib/ai-advisor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = typeof body.question === "string" ? body.question : "";

    if (!question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const advice = await getAiAdvice({
      question,
      history: body.history,
      accounts: body.accounts,
    });

    return NextResponse.json(advice);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Advisor failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
