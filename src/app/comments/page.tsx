"use client";

import { useEffect, useState } from "react";
import { PlatformBadge } from "@/components/platform-badge";
import type { Platform } from "@prisma/client";

type Comment = {
  platform: Platform;
  author: string;
  text: string;
  postedAt: string;
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-3xl">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Positive comments</h2>
        <p className="text-zinc-500 mt-1">
          Highlighted feedback from Instagram, TikTok, Telegram, and YouTube
        </p>
      </header>

      {loading ? (
        <p className="text-zinc-500">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="text-zinc-500">No positive comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c, i) => (
            <li
              key={`${c.platform}-${c.author}-${i}`}
              className="rounded-xl border border-zinc-800 bg-[#12121a] p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlatformBadge platform={c.platform} />
                <span className="text-sm font-medium text-zinc-300">
                  @{c.author}
                </span>
                <span className="text-xs text-zinc-600 ml-auto">
                  {new Date(c.postedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-zinc-300">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
