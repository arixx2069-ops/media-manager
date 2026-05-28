import OpenAI from "openai";
import { DEMO_PLATFORMS } from "@/lib/demo-data";

export type AdvisorInput = {
  platforms?: string[];
  recentEngagement?: string;
  goals?: string;
};

export type AdvisorResult = {
  summary: string;
  recommendations: {
    title: string;
    content: string;
    priority: "high" | "medium" | "low";
  }[];
  source: "openai" | "demo";
};

const DEMO_ADVICE: AdvisorResult = {
  summary:
    "Your TikTok and Instagram audiences are most active mid-week. Double down on short-form video and respond to positive comments within 2 hours to boost reach.",
  recommendations: [
    {
      title: "Post a TikTok behind-the-scenes reel",
      content:
        "Wednesday 6–8 PM performs best. Use a trending sound and end with a clear CTA to your Telegram channel.",
      priority: "high",
    },
    {
      title: "Instagram carousel: customer wins",
      content:
        "Repurpose top positive comments into a 5-slide carousel. Tag commenters to encourage reshares.",
      priority: "medium",
    },
    {
      title: "Telegram poll this weekend",
      content:
        "Ask followers what content they want next week. Use results to plan Monday's upload.",
      priority: "medium",
    },
    {
      title: "YouTube Shorts cross-post",
      content:
        "Trim your last long-form video into 3 Shorts and link back to the full video in each description.",
      priority: "low",
    },
  ],
  source: "demo",
};

export async function getAiAdvice(input: AdvisorInput = {}): Promise<AdvisorResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const demoMode = process.env.DEMO_MODE !== "false";

  if (demoMode || !apiKey) {
    await new Promise((r) => setTimeout(r, 400));
    return DEMO_ADVICE;
  }

  const client = new OpenAI({ apiKey });
  const metricsSummary = DEMO_PLATFORMS.map(
    (p) =>
      `${p.platform}: ${p.followers} followers, ${p.likes} likes, ${p.comments} comments`
  ).join("\n");

  const prompt = `You are a social media strategist advisor. Based on these metrics:
${metricsSummary}

User goals: ${input.goals ?? "Grow engagement and followers"}
Platforms focus: ${input.platforms?.join(", ") ?? "all"}

Respond in JSON only with this shape:
{
  "summary": "one paragraph",
  "recommendations": [
    { "title": "...", "content": "...", "priority": "high|medium|low" }
  ]
}
Give 3-5 actionable recommendations for what to upload and what to do this week.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return DEMO_ADVICE;

  try {
    const parsed = JSON.parse(raw) as Omit<AdvisorResult, "source">;
    return { ...parsed, source: "openai" };
  } catch {
    return DEMO_ADVICE;
  }
}
