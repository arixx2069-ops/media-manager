"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageCircle,
  Share2,
  Users,
  RefreshCw,
  ExternalLink,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { useLocale } from "@/components/locale-provider";

interface Account {
  id: string;
  platform: string;
  username: string;
  displayName?: string;
  stats: {
    followers: number;
    likes: number;
    comments: number;
    shares?: number;
    views?: number;
  };
  connected: boolean;
  lastSynced?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok) {
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/accounts/sync", { method: "POST" });
      if (res.ok) {
        setSyncMessage(t.dashboard.syncOk);
        await fetchMetrics();
      } else {
        setSyncMessage(t.dashboard.syncFail);
      }
    } catch {
      setSyncMessage(t.dashboard.syncFail);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(""), 5000);
    }
  }, [fetchMetrics, t]);

  const totalFollowers = accounts.reduce((s, a) => s + a.stats.followers, 0);
  const totalLikes = accounts.reduce((s, a) => s + a.stats.likes, 0);
  const totalComments = accounts.reduce((s, a) => s + a.stats.comments, 0);
  const totalShares = accounts.reduce(
    (s, a) => s + (a.stats.shares ?? 0),
    0
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <p className="text-sm text-[var(--muted)]">{t.dashboard.autoSyncing}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.dashboard.title}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t.dashboard.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label={t.dashboard.followers}
          value={totalFollowers}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label={t.dashboard.totalLikes}
          value={totalLikes}
          icon={<Heart className="w-5 h-5" />}
        />
        <StatCard
          label={t.dashboard.comments}
          value={totalComments}
          icon={<MessageCircle className="w-5 h-5" />}
        />
        <StatCard
          label={t.dashboard.shares}
          value={totalShares}
          icon={<Share2 className="w-5 h-5" />}
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          {t.dashboard.yourAccounts}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="btn-secondary text-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? t.dashboard.syncing : t.dashboard.sync}
          </button>
        </div>
      </div>

      {syncMessage && (
        <p className="text-sm text-[var(--positive)]">{syncMessage}</p>
      )}

      {accounts.length === 0 ? (
        <div className="editorial-card p-8 text-center">
          <LayoutDashboard className="w-8 h-8 mx-auto text-[var(--muted)] mb-3" />
          <p className="text-sm text-[var(--muted)] mb-4">
            {t.dashboard.noAccounts}
          </p>
          <button
            type="button"
            onClick={() => router.push("/accounts")}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.addFirst}
          </button>
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
                  {account.connected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--positive)]" />
                  )}
                </div>
                <p className="font-medium truncate">
                  @{account.username}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted)]">
                  <span>
                    {account.stats.followers.toLocaleString()}{" "}
                    {t.dashboard.followersLabel}
                  </span>
                  <span>
                    {account.stats.likes.toLocaleString()} {t.dashboard.likes}
                  </span>
                  <span>
                    {account.stats.comments.toLocaleString()}{" "}
                    {t.dashboard.commentsLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://${account.platform}.com/${account.username}`,
                    "_blank"
                  )
                }
                className="btn-secondary text-xs shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                {t.dashboard.visit}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-[0.62rem] uppercase tracking-wider text-[var(--muted)] text-center">
        {t.dashboard.apiHint}
      </p>
    </div>
  );
}
