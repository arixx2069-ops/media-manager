"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Heart, MessageCircle, RefreshCw, Share2, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { PlatformBadge } from "@/components/platform-badge";
import { PlatformConnect } from "@/components/platform-connect";
import { QuickActions } from "@/components/quick-actions";
import { useLocale } from "@/components/locale-provider";
import { syncAccountsFromApis } from "@/lib/api-sync";
import { connectAndSync, fetchOAuthStatus } from "@/lib/oauth/client";
import {
  aggregateMetrics,
  loadAccounts,
  profileUrl,
  type ConnectedAccount,
} from "@/lib/accounts";

export default function DashboardPage() {
  const { t } = useLocale();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const autoSynced = useRef(false);

  useEffect(() => {
    setAccounts(loadAccounts());
  }, []);

  useEffect(() => {
    if (autoSynced.current) return;
    autoSynced.current = true;

    (async () => {
      const status = await fetchOAuthStatus();
      if (!status.meta.connected && !status.tiktok.connected) return;

      setSyncing(true);
      setSyncMessage(t.dashboard.autoSyncing);
      try {
        const result = await connectAndSync();
        setAccounts(result.accounts);
        if (result.anyConfigured) {
          setSyncMessage(t.dashboard.syncOk);
        }
      } catch {
        setSyncMessage(t.dashboard.syncFail);
      } finally {
        setSyncing(false);
      }
    })();
  }, [t]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncAccountsFromApis();
      setAccounts(result.accounts);
      if (result.anyConfigured) {
        setSyncMessage(t.dashboard.syncOk);
      } else {
        setSyncMessage(t.dashboard.apiHint);
      }
    } catch {
      setSyncMessage(t.dashboard.syncFail);
    } finally {
      setSyncing(false);
    }
  }, [t]);

  const totals = aggregateMetrics(accounts);

  return (
    <div className="page-shell max-w-6xl mx-auto w-full">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--card-border)] pb-6">
        <div>
          <p className="eyebrow mb-2">01 / Overview</p>
          <h2 className="font-display text-3xl font-medium tracking-tight">{t.dashboard.title}</h2>
          <p className="text-[var(--muted)] mt-2 text-sm max-w-prose">{t.dashboard.subtitle}</p>
        </div>
        {accounts.length > 0 && (
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="btn-primary"
          >
            <RefreshCw
              className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? t.dashboard.syncing : t.dashboard.sync}
          </button>
        )}
      </header>

      <QuickActions />

      {syncMessage && (
        <p className="mb-4 text-sm text-[var(--muted)] rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3">
          {syncMessage}
        </p>
      )}

      {accounts.length === 0 ? (
        <div className="space-y-6">
          <PlatformConnect onSynced={() => setAccounts(loadAccounts())} />
          <div className="editorial-card p-8 text-center">
            <p className="text-[var(--muted)] mb-4">{t.dashboard.noAccounts}</p>
            <Link href="/accounts" className="btn-primary">
              {t.dashboard.addFirst}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label={t.dashboard.totalLikes}
              value={totals.likes}
              icon={Heart}
            />
            <StatCard
              label={t.dashboard.comments}
              value={totals.comments}
              icon={MessageCircle}
            />
            <StatCard
              label={t.dashboard.shares}
              value={totals.shares}
              icon={Share2}
            />
            <StatCard
              label={t.dashboard.followers}
              value={totals.followers}
              icon={Users}
            />
          </div>

          <section>
            <h3 className="font-display text-xl font-medium mb-4">{t.dashboard.yourAccounts}</h3>
            <div className="grid gap-3">
              {accounts.map((a) => (
                <div
                  key={a.id}
                  className="editorial-card flex flex-wrap items-center gap-4 p-4"
                >
                  <PlatformBadge platform={a.platform} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">@{a.username}</p>
                    <p className="text-sm text-[var(--muted)]">{a.displayName}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-[var(--muted)]">
                    <span>
                      <strong className="text-[var(--foreground)]">
                        {a.likes.toLocaleString()}
                      </strong>{" "}
                      {t.dashboard.likes}
                    </span>
                    <span>
                      <strong className="text-[var(--foreground)]">
                        {a.comments.toLocaleString()}
                      </strong>{" "}
                      {t.dashboard.commentsLabel}
                    </span>
                    <span>
                      <strong className="text-[var(--foreground)]">
                        {a.followers.toLocaleString()}
                      </strong>{" "}
                      {t.dashboard.followersLabel}
                    </span>
                  </div>
                  <a
                    href={profileUrl(a.platform, a.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t.dashboard.visit}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
