"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, Trash2 } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "aeen-iq-advisor-chat";

function loadChat(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function AdvisorPage() {
  const { t } = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [provider, setProvider] = useState("demo");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(loadChat());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || thinking) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setProvider(data.provider || "demo");
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.advisor.error,
        },
      ]);
    } finally {
      setThinking(false);
    }
  }, [input, thinking, messages, t]);

  const handleClear = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const examples = t.advisor.examples as unknown as string[];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {t.advisor.title}
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {t.advisor.subtitle}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary text-xs"
          >
            <Trash2 className="w-3 h-3" />
            {t.advisor.clearChat}
          </button>
        )}
      </div>

      {messages.length === 0 && (
        <div className="editorial-card p-6 space-y-4">
          <p className="font-display text-sm font-semibold">
            {t.advisor.examplesTitle}
          </p>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(example)}
                className="block w-full text-left text-sm text-[var(--muted)] hover:text-[var(--foreground)] p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] editorial-card p-3 ${
                msg.role === "user"
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : ""
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="editorial-card p-3">
              <p className="text-sm text-[var(--muted)]">
                {t.advisor.thinking}
              </p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 pt-2 bg-[var(--background)]">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.advisor.placeholder}
            rows={2}
            className="flex-1 px-3 py-2.5 text-sm resize-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || thinking}
            className="btn-primary shrink-0"
          >
            {thinking ? (
              <Sparkles className="w-4 h-4 animate-pulse" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[0.55rem] uppercase tracking-wider text-[var(--muted)] mt-2 text-center">
          {provider === "groq"
            ? t.advisor.poweredGroq
            : provider === "none"
              ? t.advisor.poweredDemo
              : t.advisor.autoSaved}
        </p>
      </div>
    </div>
  );
}
