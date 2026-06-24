"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Send, Image, Check } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

const platforms = ["instagram", "tiktok", "facebook"] as const;

export default function PostPage() {
  const { t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(platforms));
  const [posting, setPosting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const toggle = useCallback((p: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }, []);

  const handlePost = useCallback(async () => {
    if (!video || selected.size === 0) return;
    setPosting(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append("video", video);
      form.append("caption", caption);
      form.append("platforms", JSON.stringify([...selected]));

      const res = await fetch("/api/post", { method: "POST", body: form });
      const data = await res.json();
      setResult({ ok: res.ok, message: data.message });
    } catch {
      setResult({ ok: false, message: "Network error. Try again." });
    } finally {
      setPosting(false);
    }
  }, [video, caption, selected]);

  const handleReset = useCallback(() => {
    setVideo(null);
    setCaption("");
    setSelected(new Set(platforms));
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const canPost = video !== null && selected.size > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t.post.title}</h1>
        <p className="text-sm text-[var(--muted)] mt-1">{t.post.subtitle}</p>
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
            {t.post.videoLabel}
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
            role="button"
            tabIndex={0}
            className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
          >
            {video ? (
              <div className="space-y-2">
                <Check className="w-8 h-8 mx-auto text-[var(--positive)]" />
                <p className="text-sm font-medium">{video.name}</p>
                <p className="text-xs text-[var(--muted)]">
                  {(video.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-[var(--muted)]" />
                <p className="text-sm text-[var(--muted)]">{t.post.videoHint}</p>
                <p className="text-xs text-[var(--muted)]">MP4, MOV, AVI — max 500MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
            {t.post.caption}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t.post.captionPlaceholder}
            rows={3}
            className="w-full px-3 py-2.5 text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
            {t.post.postTo}
          </label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => {
              const active = selected.has(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggle(p)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl border transition-colors ${
                    active
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePost}
          disabled={!canPost || posting}
          className="btn-primary w-full"
        >
          {posting ? (
            <span className="animate-pulse">{t.post.posting}</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t.post.postBtn}
            </>
          )}
        </button>

        {result && (
          <div
            className={`p-3 rounded-xl text-sm ${
              result.ok
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
            }`}
          >
            <p>{result.message}</p>
            {result.ok && (
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-xs underline"
              >
                {t.post.postAnother}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
