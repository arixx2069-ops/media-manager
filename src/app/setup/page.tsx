"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { APP_NAME } from "@/lib/constants";

type SetupStatus = {
  demoMode: boolean;
  hasSitePassword: boolean;
  hasAuthSecret: boolean;
  hasAppUrl: boolean;
  appUrl: string | null;
  hasMetaAppId: boolean;
  hasMetaSecret: boolean;
  hasTikTokKey: boolean;
  hasTikTokSecret: boolean;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 space-y-2">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <div className="flex items-start justify-between gap-2">
        <code className="text-xs break-all text-[var(--foreground)]">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 inline-flex items-center gap-1 text-xs text-link"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function StatusRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {ok ? (
        <Check className="w-4 h-4 text-[var(--positive)] shrink-0" />
      ) : (
        <X className="w-4 h-4 text-red-500 shrink-0" />
      )}
      <span className={ok ? "text-[var(--foreground)]" : "text-[var(--muted)]"}>
        {label}
      </span>
    </li>
  );
}

export default function SetupPage() {
  const { t } = useLocale();
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const siteUrl = status?.appUrl || origin;
  const metaRedirect = `${siteUrl}/api/oauth/meta/callback`;
  const tiktokRedirect = `${siteUrl}/api/oauth/tiktok/callback`;
  const apisReady =
    status &&
    !status.demoMode &&
    status.hasMetaAppId &&
    status.hasMetaSecret &&
    status.hasTikTokKey &&
    status.hasTikTokSecret &&
    status.hasAppUrl;

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">{t.setup.title}</h2>
        <p className="text-[var(--muted)] mt-1">{t.setup.subtitle}</p>
      </header>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6">
        <h3 className="text-sm font-medium mb-3">{t.setup.ownerNoteTitle}</h3>
        <p className="text-sm text-[var(--muted)]">{t.setup.ownerNote}</p>
      </section>

      {status && (
        <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6">
          <h3 className="text-sm font-medium mb-3">{t.setup.statusTitle}</h3>
          <ul className="space-y-2">
            <StatusRow ok={status.hasSitePassword} label={t.setup.checkPassword} />
            <StatusRow ok={status.hasAuthSecret} label={t.setup.checkAuth} />
            <StatusRow ok={status.hasAppUrl} label={t.setup.checkAppUrl} />
            <StatusRow ok={!status.demoMode} label={t.setup.checkDemoOff} />
            <StatusRow ok={status.hasMetaAppId} label={t.setup.checkMetaId} />
            <StatusRow ok={status.hasMetaSecret} label={t.setup.checkMetaSecret} />
            <StatusRow ok={status.hasTikTokKey} label={t.setup.checkTikTokKey} />
            <StatusRow ok={status.hasTikTokSecret} label={t.setup.checkTikTokSecret} />
          </ul>
          {apisReady && (
            <p className="mt-4 text-sm text-[var(--positive)]">{t.setup.allReady}</p>
          )}
        </section>
      )}

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6 space-y-4">
        <h3 className="text-sm font-medium">{t.setup.netlifyTitle}</h3>
        <p className="text-sm text-[var(--muted)]">{t.setup.netlifyHint}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--card-border)]">
                <th className="py-2 pr-4 font-medium">{t.setup.colKey}</th>
                <th className="py-2 font-medium">{t.setup.colValue}</th>
              </tr>
            </thead>
            <tbody className="text-[var(--foreground)]">
              {[
                ["SITE_PASSWORD", "aeen-iq (or your own password)"],
                ["AUTH_SECRET", "any long random string you make up"],
                ["DEMO_MODE", "false"],
                ["NEXT_PUBLIC_APP_URL", siteUrl || "https://YOUR-SITE.netlify.app"],
                ["META_APP_ID", "from developers.facebook.com → App ID"],
                ["META_APP_SECRET", "from developers.facebook.com → App secret"],
                ["TIKTOK_CLIENT_KEY", "from developers.tiktok.com → Client key"],
                ["TIKTOK_CLIENT_SECRET", "from developers.tiktok.com → Client secret"],
              ].map(([key, value]) => (
                <tr key={key} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="py-2.5 pr-4 align-top">
                    <code className="text-xs">{key}</code>
                  </td>
                  <td className="py-2.5 text-[var(--muted)] text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6 space-y-3">
        <h3 className="text-sm font-medium">{t.setup.redirectTitle}</h3>
        <p className="text-sm text-[var(--muted)]">{t.setup.redirectHint}</p>
        <CopyRow label="Meta redirect URI" value={metaRedirect} />
        <CopyRow label="TikTok redirect URI" value={tiktokRedirect} />
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 mb-6 space-y-3">
        <h3 className="text-sm font-medium">{t.setup.linksTitle}</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://developers.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-link"
            >
              Meta for Developers
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li>
            <a
              href="https://developers.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-link"
            >
              TikTok for Developers
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li>
            <a
              href="https://app.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-link"
            >
              Netlify dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
        </ul>
      </section>

      <section className="editorial-card p-5 mb-6 border-t-2 border-t-[var(--accent)]">
        <h3 className="text-sm font-medium mb-2">{t.setup.afterTitle}</h3>
        <ol className="text-sm text-[var(--muted)] space-y-2 list-decimal list-inside">
          <li>{t.setup.afterStep1}</li>
          <li>{t.setup.afterStep2}</li>
          <li>
            {t.setup.afterStep3.replace("{app}", APP_NAME)}
          </li>
        </ol>
      </section>

      <p className="text-sm text-[var(--muted)]">
        <Link href="/accounts" className="text-link">
          {t.setup.goAccounts}
        </Link>
      </p>
    </div>
  );
}
