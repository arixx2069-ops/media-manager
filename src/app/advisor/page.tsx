"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { loadAccounts } from "@/lib/accounts";
import {
  clearAdvisorChat,
  loadAdvisorChat,
  saveAdvisorChat,
  type AdvisorChatMessage,
} from "@/lib/advisor-chat";

export default function AdvisorPage() {
  const { t } = useLocale();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AdvisorChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadAdvisorChat();
    if (saved) {
      setMessages(saved.messages);
      setSource(saved.source);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (messages.length === 0 && !source) {
      clearAdvisorChat();
      return;
    }
    saveAdvisorChat(messages, source);
  }, [messages, source, hydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleClearChat() {
    setMessages([]);
    setSource(null);
    setApiKeyError(false);
    clearAdvisorChat();
  }

  async function handleAsk(e: FormEvent) {
    e.preventDefault();
    const text = question.trim();
    if (!text || loading) return;

    const userMessage: AdvisorChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setQuestion("");
    setLoading(true);

    try {
      const accounts = loadAccounts().map((a) => ({
        platform: a.platform,
        username: a.username,
        followers: a.followers,
        likes: a.likes,
        comments: a.comments,
      }));

      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          history: messages,
          accounts,
        }),
      });

      const data = (await res.json()) as {
        answer?: string;
        error?: string;
        source?: string;
        apiKeyError?: boolean;
      };

      if (!res.ok || data.error) {
        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content: data.error ?? t.advisor.error,
          },
        ]);
        setSource(null);
        setApiKeyError(false);
        return;
      }

      setApiKeyError(Boolean(data.apiKeyError));
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.answer ?? t.advisor.error },
      ]);
      setSource(data.source ?? null);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: t.advisor.error },
      ]);
      setSource(null);
      setApiKeyError(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell max-w-2xl mx-auto w-full flex flex-col min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-2rem)]">
      <header className="mb-6 shrink-0 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--accent)]" />
            {t.advisor.title}
          </h2>
          <p className="text-[var(--muted)] mt-1">{t.advisor.subtitle}</p>
          {messages.length > 0 && (
            <p className="text-xs text-[var(--muted)] mt-1 opacity-80">
              {t.advisor.autoSaved}
            </p>
          )}
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-red-500 border border-[var(--card-border)] hover:border-red-500/40 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t.advisor.clearChat}
          </button>
        )}
      </header>

      {apiKeyError && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium">{t.advisor.invalidKeyTitle}</p>
          <p className="mt-1 opacity-90">{t.advisor.invalidKeyBody}</p>
        </div>
      )}

      <div className="flex-1 space-y-4 mb-6 overflow-y-auto min-h-[200px]">
        {messages.length === 0 && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)] mb-2">
              {t.advisor.examplesTitle}
            </p>
            <ul className="space-y-1.5 list-disc list-inside">
              {t.advisor.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.advisor.thinking}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleAsk}
        className="shrink-0 flex flex-col gap-2 sm:flex-row sm:items-end border-t border-[var(--card-border)] pt-4 safe-bottom"
      >
        <label className="flex-1 text-sm">
          <span className="sr-only">{t.advisor.placeholder}</span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.advisor.placeholder}
            rows={2}
            disabled={loading}
            className="w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm resize-none disabled:opacity-60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk(e);
              }
            }}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-primary shrink-0 w-full sm:w-auto"
          aria-label={t.advisor.send}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {source && (
        <p className="text-xs text-[var(--muted)] mt-2 shrink-0">
          {source === "groq"
            ? t.advisor.poweredGroq
            : source === "grok"
              ? t.advisor.poweredGrok
              : source === "openai"
                ? t.advisor.poweredOpenAI
                : t.advisor.poweredDemo}
        </p>
      )}
    </div>
  );
}
