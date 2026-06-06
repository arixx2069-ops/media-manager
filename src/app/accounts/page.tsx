"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ExternalLink, Plus, RefreshCw, Trash2 } from "lucide-react";
import type { Platform } from "@prisma/client";
import { PlatformBadge } from "@/components/platform-badge";
import {
  PlatformConnect,
  useOAuthReturnSync,
} from "@/components/platform-connect";
import { useLocale } from "@/components/locale-provider";
import { syncAccountsFromApis } from "@/lib/api-sync";
import {
  ACCOUNT_PLATFORMS,
  addAccount,
  loadAccounts,
  profileUrl,
  removeAccount,
  type ConnectedAccount,
} from "@/lib/accounts";

export default function AccountsPage() {
  const { t } = useLocale();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [platform, setPlatform] = useState<Platform>("INSTAGRAM");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [followers, setFollowers] = useState("0");
  const [likes, setLikes] = useState("0");
  const [comments, setComments] = useState("0");
  const [syncing, setSyncing] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const reload = useCallback(() => {
    setAccounts(loadAccounts());
  }, []);

  useEffect(() => {
    reload();
    const err = new URLSearchParams(window.location.search).get("error");
    if (err) {
      setBanner(decodeURIComponent(err.replace(/\+/g, " ")));
      window.history.replaceState({}, "", "/accounts");
    }
  }, [reload]);

  useOAuthReturnSync(() => {
    reload();
    setBanner(t.dashboard.syncOk);
  });

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    const updated = addAccount({
      platform,
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
      followers: Number(followers) || 0,
      likes: Number(likes) || 0,
      comments: Number(comments) || 0,
      shares: 0,
    });
    setAccounts(updated);
    setUsername("");
    setDisplayName("");
    setFollowers("0");
    setLikes("0");
    setComments("0");
  }

  function handleRemove(id: string) {
    setAccounts(removeAccount(id));
  }

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await syncAccountsFromApis();
      setAccounts(result.accounts);
    } finally {
      setSyncing(false);
    }
  }, []);

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t.accounts.title}</h2>
          <p className="text-[var(--muted)] mt-1">{t.accounts.subtitle}</p>
        </div>
        {accounts.length > 0 && (
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 border border-[var(--card-border)] hover:bg-[var(--card-hover)] text-sm px-4 py-2 rounded-lg"
          >
            <RefreshCw
              className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
            />
            {t.accounts.syncLive}
          </button>
        )}
      </header>

      {banner && (
        <p className="mb-4 text-sm rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-[var(--muted)]">
          {banner}
        </p>
      )}

      <PlatformConnect onSynced={reload} />

      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-8 space-y-4"
      >
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.accounts.addAccount}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.platform}
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            >
              {ACCOUNT_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.username}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="yourname"
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.displayName}
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.followers}
            <input
              type="number"
              min={0}
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.likes}
            <input
              type="number"
              min={0}
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-[var(--muted)]">
            {t.accounts.comments}
            <input
              type="number"
              min={0}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 w-full bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn-primary"
        >
          {t.accounts.addBtn}
        </button>
      </form>

      {accounts.length === 0 ? (
        <p className="text-[var(--muted)] text-sm">{t.accounts.noAccounts}</p>
      ) : (
        <ul className="space-y-3">
          {accounts.map((a) => (
            <li
              key={a.id}
              className="editorial-card p-4 flex flex-wrap items-center gap-3"
            >
              <PlatformBadge platform={a.platform} />
              <div className="flex-1 min-w-[140px]">
                <p className="font-medium">@{a.username}</p>
                <p className="text-sm text-[var(--muted)]">{a.displayName}</p>
                <p className="text-xs text-[var(--muted)] mt-1 opacity-80">
                  {a.followers.toLocaleString()} {t.dashboard.followersLabel} ·{" "}
                  {a.likes.toLocaleString()} {t.dashboard.likes}
                </p>
              </div>
              <a
                href={profileUrl(a.platform, a.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-link px-3 py-2"
                style={{ background: "var(--accent-soft)" }}
              >
                <ExternalLink className="w-4 h-4" />
                {t.accounts.visit}
              </a>
              <button
                type="button"
                onClick={() => handleRemove(a.id)}
                className="p-2 text-[var(--muted)] hover:text-red-500 rounded-lg hover:bg-red-500/10"
                aria-label="Remove account"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
