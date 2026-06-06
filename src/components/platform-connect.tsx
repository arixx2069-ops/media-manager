"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Unlink } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import {
  connectAndSync,
  disconnectOAuth,
  fetchOAuthStatus,
  type OAuthStatus,
} from "@/lib/oauth/client";

type Props = {
  onSynced?: () => void;
};

export function PlatformConnect({ onSynced }: Props) {
  const { t } = useLocale();
  const [status, setStatus] = useState<OAuthStatus | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus(await fetchOAuthStatus());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleDisconnect(platform: "meta" | "tiktok") {
    setBusy(platform);
    try {
      await disconnectOAuth(platform);
      await refresh();
      onSynced?.();
    } finally {
      setBusy(null);
    }
  }

  const metaConnected = status?.meta.connected ?? false;
  const tiktokConnected = status?.tiktok.connected ?? false;

  return (
    <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-8 space-y-4">
      <div>
        <h3 className="text-sm font-medium">{t.accounts.connectTitle}</h3>
        <p className="text-xs text-[var(--muted)] mt-1">{t.accounts.connectHint}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--card-border)] p-4 space-y-3">
          <p className="text-sm font-medium">Instagram + Facebook</p>
          {metaConnected ? (
            <>
              <p className="text-xs text-[var(--positive)]">
                {t.accounts.connected}
                {status?.meta.instagram?.username
                  ? ` · @${status.meta.instagram.username}`
                  : ""}
                {status?.meta.facebook?.name
                  ? ` · ${status.meta.facebook.name}`
                  : ""}
              </p>
              <button
                type="button"
                disabled={busy === "meta"}
                onClick={() => handleDisconnect("meta")}
                className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-red-500"
              >
                <Unlink className="w-3.5 h-3.5" />
                {t.accounts.disconnect}
              </button>
            </>
          ) : (
            <a
              href="/api/oauth/meta"
              className="inline-flex items-center gap-2 bg-[#1877F2] hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              <Link2 className="w-4 h-4" />
              {t.accounts.connectMeta}
            </a>
          )}
        </div>

        <div className="rounded-lg border border-[var(--card-border)] p-4 space-y-3">
          <p className="text-sm font-medium">TikTok</p>
          {tiktokConnected ? (
            <>
              <p className="text-xs text-[var(--positive)]">
                {t.accounts.connected}
                {status?.tiktok.username ? ` · @${status.tiktok.username}` : ""}
              </p>
              <button
                type="button"
                disabled={busy === "tiktok"}
                onClick={() => handleDisconnect("tiktok")}
                className="inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-red-500"
              >
                <Unlink className="w-3.5 h-3.5" />
                {t.accounts.disconnect}
              </button>
            </>
          ) : (
            <a
              href="/api/oauth/tiktok"
              className="btn-primary"
            >
              <Link2 className="w-4 h-4" />
              {t.accounts.connectTikTok}
            </a>
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">{t.accounts.autoTrackNote}</p>
    </section>
  );
}

/** Run after OAuth redirect (?connected=meta|tiktok). */
export function useOAuthReturnSync(onDone: () => void) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");
    if (!connected && !error) return;

    if (error) {
      window.history.replaceState({}, "", "/accounts");
      return;
    }

    let cancelled = false;
    (async () => {
      await connectAndSync();
      if (!cancelled) {
        onDone();
        window.history.replaceState({}, "", "/accounts");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onDone]);
}
