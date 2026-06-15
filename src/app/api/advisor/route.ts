import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json({
        reply: "AI Advisor is not configured. Add a GROQ_API_KEY to your .env file to enable AI responses. You can get a free key at https://console.groq.com/keys",
        provider: "none",
      });
    }

    const systemPrompt = `You are a social media advisor and growth expert. You help users grow their presence on Instagram, Facebook, and TikTok. Give concise, actionable advice. Be encouraging and specific. Keep responses under 200 words.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: "user", content: message },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          reply: "The AI advisor is having trouble. Please check that your GROQ_API_KEY is valid at https://console.groq.com/keys",
          error: err?.error?.message ?? "API error",
          provider: "groq",
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "No response from AI.";

    return NextResponse.json({
      reply,
      provider: "groq",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Advisor error";
    return NextResponse.json(
      { reply: `Error: ${message}`, error: message, provider: "error" },
      { status: 200 }
    );
  }
}
