"use client";

import { useState, FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";

type Recommendation = {
  title: string;
  content: string;
  priority: string;
};

type Advice = {
  summary: string;
  recommendations: Recommendation[];
  source: string;
};

const priorityColor: Record<string, string> = {
  high: "text-red-300 bg-red-500/10",
  medium: "text-amber-300 bg-amber-500/10",
  low: "text-zinc-400 bg-zinc-500/10",
};

export default function AdvisorPage() {
  const [goals, setGoals] = useState("");
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAdvice(null);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: goals || undefined }),
      });
      const data = await res.json();
      setAdvice(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          AI Advisor
        </h2>
        <p className="text-zinc-500 mt-1">
          Get recommendations on what to upload and what actions to take this week
        </p>
      </header>

      <form onSubmit={handleAsk} className="space-y-4 mb-8">
        <label className="block text-sm text-zinc-400">
          Your goals (optional)
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. Grow TikTok followers by 20%, promote new product launch"
            rows={3}
            className="mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Get advice
        </button>
      </form>

      {advice && (
        <div className="space-y-6">
          <p className="text-zinc-300 leading-relaxed">{advice.summary}</p>
          <ul className="space-y-4">
            {advice.recommendations.map((r, i) => (
              <li
                key={i}
                className="rounded-xl border border-zinc-800 bg-[#12121a] p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{r.title}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded capitalize ${priorityColor[r.priority] ?? priorityColor.low}`}
                  >
                    {r.priority}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{r.content}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-600">
            Powered by {advice.source === "openai" ? "OpenAI" : "demo advisor"}
          </p>
        </div>
      )}
    </div>
  );
}
