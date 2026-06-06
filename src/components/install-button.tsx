"use client";

import { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { browserLabel } from "@/lib/browser";
import { usePwaInstall } from "@/lib/pwa-install";

type Props = {
  className?: string;
  variant?: "sidebar" | "page";
};

function InstallGuideModal({
  browser,
  onClose,
}: {
  browser: ReturnType<typeof usePwaInstall>["browser"];
  onClose: () => void;
}) {
  const { t } = useLocale();
  const isFirefox = browser === "firefox";
  const isSafari = browser === "safari";
  const isChromium = browser === "chrome" || browser === "edge";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
    >
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-xl max-h-[90dvh] overflow-y-auto safe-bottom">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 id="install-guide-title" className="text-lg font-semibold">
              {t.install.guideTitle}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              {t.install.guideSubtitle.replace("{browser}", browserLabel(browser))}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] p-1"
            aria-label={t.install.guideClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isFirefox && (
          <ol className="space-y-3 text-sm text-[var(--muted)] list-decimal list-inside">
            <li>{t.install.firefoxStep1}</li>
            <li>{t.install.firefoxStep2}</li>
            <li>{t.install.firefoxStep3}</li>
          </ol>
        )}

        {isChromium && (
          <ol className="space-y-3 text-sm text-[var(--muted)] list-decimal list-inside">
            <li>{t.install.chromeStep1}</li>
            <li>{t.install.chromeStep2}</li>
          </ol>
        )}

        {isSafari && (
          <ol className="space-y-3 text-sm text-[var(--muted)] list-decimal list-inside">
            <li>{t.install.safariStep1}</li>
            <li>{t.install.safariStep2}</li>
          </ol>
        )}

        {!isFirefox && !isChromium && !isSafari && (
          <p className="text-sm text-[var(--muted)]">{t.install.genericHint}</p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full mt-6"
        >
          {t.install.guideClose}
        </button>
      </div>
    </div>
  );
}

export function InstallButton({ className = "", variant = "sidebar" }: Props) {
  const { t } = useLocale();
  const {
    browser,
    installed,
    canOneClickInstall,
    install,
    showGuide,
    setShowGuide,
  } = usePwaInstall();

  if (installed) {
    if (variant === "page") {
      return (
        <p className="inline-flex items-center gap-2 text-sm text-[var(--positive)]">
          <Check className="w-4 h-4" />
          {t.install.installed}
        </p>
      );
    }
    return null;
  }

  const base =
    variant === "sidebar"
      ? "btn-primary w-full"
      : "btn-primary";

  return (
    <>
      <button
        type="button"
        onClick={() => void install()}
        className={`${base} ${className}`}
      >
        <Download className="w-4 h-4" />
        {canOneClickInstall ? t.install.buttonNow : t.install.button}
      </button>

      {showGuide && (
        <InstallGuideModal browser={browser} onClose={() => setShowGuide(false)} />
      )}
    </>
  );
}
