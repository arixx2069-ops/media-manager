import OpenAI from "openai";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AdvisorAccountContext = {
  platform: string;
  username: string;
  followers: number;
  likes: number;
  comments: number;
};

export type AdvisorInput = {
  question: string;
  history?: ChatMessage[];
  accounts?: AdvisorAccountContext[];
};

export type AdvisorResult = {
  answer: string;
  source: "groq" | "grok" | "openai" | "demo";
  apiKeyError?: boolean;
};

type AiProvider = {
  client: OpenAI;
  model: string;
  source: "groq" | "grok" | "openai";
};

function buildMetricsContext(accounts?: AdvisorAccountContext[]): string {
  if (!accounts?.length) {
    return "The user has not connected any accounts yet.";
  }
  return accounts
    .map(
      (a) =>
        `@${a.username} on ${a.platform}: ${a.followers.toLocaleString()} followers, ${a.likes.toLocaleString()} likes, ${a.comments.toLocaleString()} comments`
    )
    .join("\n");
}

function demoAnswer(question: string, accounts?: AdvisorAccountContext[]): string {
  const q = question.toLowerCase();
  const hasAccounts = Boolean(accounts?.length);
  const stats = hasAccounts
    ? `Based on your connected accounts (${accounts!.map((a) => a.platform).join(", ")}), `
    : "Without connected account data, ";

  if (/hello|hi|hey|marhaba|salam|مرحب|السلام/.test(q)) {
    return hasAccounts
      ? `Hello! I can see your ${accounts!.length} connected account(s). Ask me anything — growth tips, content ideas, when to post, or how to read your stats.`
      : "Hello! I'm your social media advisor. Connect accounts on the My accounts page for personalized answers, or ask me general questions about Instagram, TikTok, and Facebook.";
  }

  if (/tiktok|تيك\s*توك/.test(q)) {
    return `${stats}for TikTok: post 1–3 short videos daily when possible, use trending sounds in your niche, hook viewers in the first 2 seconds, and reply to comments quickly. Reuse your best-performing format rather than chasing every trend.`;
  }

  if (/instagram|insta|انست|إنست/.test(q)) {
    return `${stats}for Instagram: mix Reels, carousels, and Stories. Reels drive discovery; carousels build trust. Post when your audience is online (check Insights), use 3–5 relevant hashtags, and turn positive comments into Story replies.`;
  }

  if (/facebook|فيسبوك/.test(q)) {
    return `${stats}for Facebook Pages: native video and live posts often outperform link-only posts. Ask questions in captions to get comments, respond within a few hours, and cross-post your best Instagram/TikTok clips as Reels on the Page.`;
  }

  if (/follower|grow|growth|متابع|نمو/.test(q)) {
    return `${stats}to grow followers: post consistently (3–5× per week minimum), lead with value or entertainment in the first line, collaborate with similar-sized creators, and engage on others' posts in your niche. Track what gets saves and shares — not just likes.`;
  }

  if (/like|engagement|تفاعل|إعجاب/.test(q)) {
    return `${stats}to boost engagement: end posts with a clear question or CTA, use captions people want to comment on, post at peak times, and reply to every comment in the first hour when you can.`;
  }

  if (/when|time|post|schedule|متى|وقت/.test(q)) {
    return `${stats}a good starting schedule: TikTok/Instagram Reels Tue–Thu 6–9 PM local time; test weekends too. Check each platform's analytics after 2 weeks and move slots toward when *your* audience is active.`;
  }

  if (/comment|تعليق/.test(q)) {
    return `${stats}for comments: reply fast with something specific (not just "thanks!"), pin great comments on posts, and turn recurring questions into new content. Negative comments — stay calm, take heated threads to DM if needed.`;
  }

  return `${stats}regarding "${question.trim()}": focus on one platform this week, double down on a format that already worked for you, and measure saves/shares plus follower change — not vanity likes alone. Ask a follow-up if you want ideas for a specific platform or goal.`;
}

function resolveAiProvider(): AiProvider | null {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    return {
      client: new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      }),
      model: process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile",
      source: "groq",
    };
  }

  const xaiKey =
    process.env.XAI_API_KEY?.trim() || process.env.GROK_API_KEY?.trim();
  if (xaiKey) {
    return {
      client: new OpenAI({
        apiKey: xaiKey,
        baseURL: "https://api.x.ai/v1",
      }),
      model: process.env.GROK_MODEL?.trim() || "grok-3-mini",
      source: "grok",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      source: "openai",
    };
  }

  return null;
}

export async function getAiAdvice(input: AdvisorInput): Promise<AdvisorResult> {
  const question = input.question?.trim();
  if (!question) {
    return {
      answer: "Please type a question and I'll help you with it.",
      source: "demo",
    };
  }

  const demoMode = process.env.DEMO_MODE !== "false";
  const provider = resolveAiProvider();

  if (demoMode || !provider) {
    await new Promise((r) => setTimeout(r, 350));
    return { answer: demoAnswer(question, input.accounts), source: "demo" };
  }

  const metricsBlock = buildMetricsContext(input.accounts);

  const systemPrompt = `You are the AI advisor inside SMM Social Media Manager — a friendly expert on Instagram, TikTok, Facebook, and social media growth.

Rules:
- Answer the user's question directly. Do not ignore their question or give unrelated generic weekly plans unless they ask for a plan.
- Be practical, specific, and concise (2–4 short paragraphs max unless they ask for detail).
- If they write in Arabic, reply in Arabic. Otherwise reply in the same language they used.
- Use their connected account stats when relevant; if none, say so briefly and still answer the question.
- You advise only — you cannot post, connect accounts, or access platforms yourself.

Connected account stats:
${metricsBlock}`;

  const history = (input.history ?? []).slice(-10).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    const completion = await provider.client.chat.completions.create({
      model: provider.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: question },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      return { answer: demoAnswer(question, input.accounts), source: "demo" };
    }

    return { answer, source: provider.source };
  } catch (e) {
    const errMsg =
      e instanceof Error ? e.message : "AI request failed";
    const isAuthError =
      /invalid api key|incorrect api key|401|authentication/i.test(errMsg);

    if (isAuthError) {
      return {
        answer: demoAnswer(question, input.accounts),
        source: "demo",
        apiKeyError: true,
      };
    }

    return {
      answer: `I couldn't reach the AI service (${errMsg}). Here's a quick tip: ${demoAnswer(question, input.accounts)}`,
      source: "demo",
    };
  }
}
