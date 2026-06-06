"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Wrong password. Try again.");
        return;
      }
      const from = searchParams.get("from") || "/";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 min-h-[100dvh] flex items-center justify-center p-4 safe-top safe-bottom bg-[var(--background)]">
      <div className="w-full max-w-sm editorial-card p-6 sm:p-8 shadow-none">
        <div className="flex items-center gap-3 mb-8 border-b border-[var(--card-border)] pb-6">
          <div className="p-2 text-[var(--accent)]" style={{ background: "var(--accent-soft)" }}>
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{APP_NAME}</h1>
            <p className="text-xs text-[var(--muted)] mt-1">Enter the site password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-xs uppercase tracking-wider text-[var(--muted)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="mt-2 w-full px-3 py-3 sm:py-2.5 text-sm"
              placeholder="Enter password"
            />
          </label>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
