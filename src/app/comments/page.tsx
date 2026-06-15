"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Heart, ExternalLink } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

interface Comment {
  id: string;
  platform: string;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
}

export default function CommentsPage() {
  const { t } = useLocale();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => {
        setComments(data.comments ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-sm text-[var(--muted)]">{t.comments.loading}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.comments.title}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t.comments.subtitle}
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="editorial-card p-8 text-center">
          <MessageCircle className="w-8 h-8 mx-auto text-[var(--muted)] mb-3" />
          <p className="text-sm text-[var(--muted)]">{t.comments.none}</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {t.comments.addFirst} {t.comments.addFirstHint}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="editorial-card p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[0.62rem] uppercase tracking-wider text-[var(--accent)] font-medium">
                    {comment.platform}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {t.comments.from} @{comment.username}
                  </span>
                </div>
                {comment.likes !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                    <Heart className="w-3 h-3" />
                    {comment.likes}
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed">{comment.text}</p>
              <p className="text-[0.62rem] text-[var(--muted)]">
                {new Date(comment.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
