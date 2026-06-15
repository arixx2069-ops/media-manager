"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

interface SetupStatus {
  checks: Record<string, boolean>;
  allReady: boolean;
  demoMode: boolean;
}

export default function SetupPage() {
  const { t } = useLocale();
  const [status, setStatus] = useState<SetupStatus | null>(null);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  const checkLabels: Record<string, string> = {
    sitePassword: t.setup.checkPassword,
    authSecret: t.setup.checkAuth,
    appUrl: t.setup.checkAppUrl,
    demoMode: t.setup.checkDemoOff,
    metaAppId: t.setup.checkMetaId,
    metaAppSecret: t.setup.checkMetaSecret,
    tiktokClientKey: t.setup.checkTikTokKey,
    tiktokClientSecret: t.setup.checkTikTokSecret,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.setup.title}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t.setup.subtitle}
        </p>
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-4">
        <h2 className="font-display text-base font-semibold">
          {t.setup.statusTitle}
        </h2>

        {status ? (
          <div className="space-y-2">
            {Object.entries(checkLabels).map(([key, label]) => {
              const ok = key === "demoMode" ? !status.demoMode : status.checks[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm"
                >
                  {ok ? (
                    <Check className="w-4 h-4 text-[var(--positive)] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span className={ok ? "" : "text-[var(--muted)]"}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">Loading status...</p>
        )}

        {status?.allReady && (
          <p className="text-sm text-[var(--positive)] font-medium">
            {t.setup.allReady}
          </p>
        )}
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-3">
        <h2 className="font-display text-base font-semibold">
          {t.setup.netlifyTitle}
        </h2>
        <p className="text-xs text-[var(--muted)]">{t.setup.netlifyHint}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="text-left py-2 pr-4 font-medium">
                  {t.setup.colKey}
                </th>
                <th className="text-left py-2 font-medium">
                  {t.setup.colValue}
                </th>
              </tr>
            </thead>
            <tbody className="text-[var(--muted)]">
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">SITE_PASSWORD</td>
                <td className="py-2 text-xs">aeen-iq</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">AUTH_SECRET</td>
                <td className="py-2 text-xs">any random string</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">DEMO_MODE</td>
                <td className="py-2 text-xs">false</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">META_APP_ID</td>
                <td className="py-2 text-xs">from Meta Developer</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">META_APP_SECRET</td>
                <td className="py-2 text-xs">from Meta Developer</td>
              </tr>
              <tr className="border-b border-[var(--card-border)]">
                <td className="py-2 pr-4 font-mono text-xs">TIKTOK_CLIENT_KEY</td>
                <td className="py-2 text-xs">from TikTok Developer</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">
                  TIKTOK_CLIENT_SECRET
                </td>
                <td className="py-2 text-xs">from TikTok Developer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="editorial-card p-4 sm:p-6 space-y-3">
        <h2 className="font-display text-base font-semibold">
          {t.setup.redirectTitle}
        </h2>
        <p className="text-xs text-[var(--muted)]">{t.setup.redirectHint}</p>

        <div className="space-y-2">
          <div className="bg-[var(--background)] p-3 rounded-lg">
            <p className="text-[0.62rem] uppercase text-[var(--muted)] mb-1">
              Meta OAuth redirect
            </p>
            <code className="text-xs break-all font-mono">
              {typeof window !== "undefined"
                ? `${window.location.origin}/api/oauth/meta/callback`
                : "https://your-site.netlify.app/api/oauth/meta/callback"}
            </code>
          </div>
          <div className="bg-[var(--background)] p-3 rounded-lg">
            <p className="text-[0.62rem] uppercase text-[var(--muted)] mb-1">
              TikTok OAuth redirect
            </p>
            <code className="text-xs break-all font-mono">
              {typeof window !== "undefined"
                ? `${window.location.origin}/api/oauth/tiktok/callback`
                : "https://your-site.netlify.app/api/oauth/tiktok/callback"}
            </code>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href="https://developers.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs flex-1"
        >
          Meta Developers
        </a>
        <a
          href="https://developers.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs flex-1"
        >
          TikTok Developers
        </a>
      </div>
    </div>
  );
}
