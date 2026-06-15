export async function getAIAdvice(
  message: string,
  history?: { role: string; content: string }[]
): Promise<{ reply: string; provider: string }> {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return {
      reply:
        "AI Advisor is not configured. Add a GROQ_API_KEY to your .env file.",
      provider: "none",
    };
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a social media advisor and growth expert. Give concise, actionable advice. Keep responses under 200 words.",
          },
          ...(history ?? []).slice(-10),
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      return {
        reply: "AI advisor is having trouble. Check your GROQ_API_KEY.",
        provider: "error",
      };
    }

    const data = await res.json();
    return {
      reply: data?.choices?.[0]?.message?.content ?? "No response.",
      provider: "groq",
    };
  } catch {
    return {
      reply: "Failed to connect to AI advisor. Try again.",
      provider: "error",
    };
  }
}
