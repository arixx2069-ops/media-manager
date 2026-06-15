"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Share2,
  ExternalLink,
  RefreshCw,
  Plus,
  Instagram,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { PlatformConnect } from "@/components/platform-connect";

interface Account {
  id: string;
  platform: string;
  username: string;
  displayName?: string;
  stats: {
    followers: number;
    likes: number;
    comments: number;
  };
  connected: boolean;
}

export default function AccountsPage() {
  const { t } = useLocale();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [metaConnected, setMetaConnected] = useState(false);
  const [tikTokConnected, setTikTokConnected] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const [newPlatform, setNewPlatform] = useState("instagram");
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "meta") {
      setMetaConnected(true);
      window.history.replaceState({}, "", "/accounts");
    }
    if (params.get("connected") === "tiktok") {
      setTikTokConnected(true);
      window.history.replaceState({}, "", "/accounts");
    }
  }, []);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((data) => {
        if (data.accounts) setAccounts(data.accounts);
      })
      .catch(() => {});
  }, []);

  const handleAddAccount = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUsername.trim()) return;

      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        platform: newPlatform,
        username: newUsername.trim(),
        displayName: newDisplayName.trim() || newUsername.trim(),
        stats: { followers: 0, likes: 0, comments: 0 },
        connected: false,
      };

      setAccounts((prev) => [...prev, newAccount]);
      setNewUsername("");
      setNewDisplayName("");
    },
    [newPlatform, newUsername, newDisplayName]
  );

  const handleSync = useCallback(
    async (platform: string) => {
      setSyncing(platform);
      try {
        await fetch("/api/accounts/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform }),
        });
        const res = await fetch("/api/metrics");
        const data = await res.json();
        if (data.accounts) setAccounts(data.accounts);
      } catch {
        // ignore
      } finally {
        setSyncing(null);
      }
    },
    []
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.accounts.title}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t.accounts.subtitle}
        </p>
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="font-display text-base font-semibold">
            {t.accounts.connectTitle}
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            {t.accounts.connectHint}
          </p>
        </div>

        <div className="space-y-3">
          <PlatformConnect
            platform="meta"
            label={t.accounts.connectMeta}
            isConnected={metaConnected}
            onDisconnect={() => setMetaConnected(false)}
          />
          <PlatformConnect
            platform="tiktok"
            label={t.accounts.connectTikTok}
            isConnected={tikTokConnected}
            onDisconnect={() => setTikTokConnected(false)}
          />
        </div>

        <p className="text-[0.62rem] text-[var(--muted)]">
          {t.accounts.autoTrackNote}
        </p>
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-4">
        <h2 className="font-display text-base font-semibold">
          {t.accounts.addAccount}
        </h2>

        <form onSubmit={handleAddAccount} className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              {t.accounts.platform}
            </label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)]"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              {t.accounts.username}
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="w-full px-3 py-2.5 text-sm"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              {t.accounts.displayName}
            </label>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm"
              placeholder="Optional"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            <Plus className="w-4 h-4" />
            {t.accounts.addBtn}
          </button>
        </form>
      </div>

      {accounts.length === 0 ? (
        <div className="editorial-card p-8 text-center">
          <Share2 className="w-8 h-8 mx-auto text-[var(--muted)] mb-3" />
          <p className="text-sm text-[var(--muted)]">
            {t.accounts.noAccounts}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="editorial-card p-4 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[0.62rem] uppercase tracking-wider text-[var(--accent)] font-medium">
                    {account.platform}
                  </span>
                </div>
                <p className="font-medium truncate">@{account.username}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted)]">
                  <span>{account.stats.followers.toLocaleString()} followers</span>
                  <span>{account.stats.likes.toLocaleString()} likes</span>
                  <span>{account.stats.comments.toLocaleString()} comments</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSync(account.platform)}
                  disabled={syncing === account.platform}
                  className="btn-secondary text-xs"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${
                      syncing === account.platform ? "animate-spin" : ""
                    }`}
                  />
                  {t.accounts.syncLive}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://${account.platform}.com/${account.username}`,
                      "_blank"
                    )
                  }
                  className="btn-secondary text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.accounts.visit}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
