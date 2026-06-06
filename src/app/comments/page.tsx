"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlatformBadge } from "@/components/platform-badge";
import { useLocale } from "@/components/locale-provider";
import { loadAccounts } from "@/lib/accounts";
import type { Platform } from "@prisma/client";

type ApiComment = {
  externalId: string;
  author: string;
  text: string;
  platform: Platform;
  postedAt: string;
};

export default function CommentsPage() {
  const { t } = useLocale();
  const [accountCount, setAccountCount] = useState(0);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAccountCount(loadAccounts().length);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/comments");
        const data = (await res.json()) as { comments?: ApiComment[] };
        if (!cancelled && data.comments) {
          setComments(
            data.comments.map((c) => ({
              ...c,
              postedAt:
                typeof c.postedAt === "string"
                  ? c.postedAt
                  : new Date(c.postedAt).toISOString(),
            }))
          );
        }
      } catch {
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">{t.comments.title}</h2>
        <p className="text-[var(--muted)] mt-1">{t.comments.subtitle}</p>
      </header>

      {accountCount === 0 ? (
        <p className="text-[var(--muted)]">
          <Link href="/accounts" className="text-link">
            {t.comments.addFirst}
          </Link>{" "}
          {t.comments.addFirstHint}
        </p>
      ) : loading ? (
        <p className="text-[var(--muted)]">{t.comments.loading}</p>
      ) : comments.length === 0 ? (
        <p className="text-[var(--muted)] text-sm">{t.comments.none}</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={`${c.platform}-${c.externalId}`}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlatformBadge platform={c.platform} />
                <span className="text-xs text-[var(--muted)]">
                  {t.comments.from} {c.author}
                </span>
              </div>
              <p className="text-sm">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
