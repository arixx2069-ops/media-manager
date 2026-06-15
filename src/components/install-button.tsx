"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Check, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

function getBrowser(): string {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "edge";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "safari";
  return "other";
}

function InstallGuide({
  browser,
  onClose,
}: {
  browser: string;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const isFirefox = browser === "firefox";
  const isSafari = browser === "safari";
  const isChrome = browser === "chrome" || browser === "edge";

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
            <h2
              id="install-guide-title"
              className="text-lg font-semibold"
            >
              {t.install.guideTitle}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              {t.install.guideSubtitle.replace(
                "{browser}",
                {
                  chrome: "Google Chrome",
                  firefox: "Mozilla Firefox",
                  edge: "Microsoft Edge",
                  safari: "Safari",
                  other: "your browser",
                }[browser] || "your browser"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] p-1"
            aria-label="Close"
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
        {isChrome && (
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
        {!isFirefox && !isChrome && !isSafari && (
          <p className="text-sm text-[var(--muted)]">
            {t.install.genericHint}
          </p>
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

export function InstallButton({
  className = "",
  variant = "sidebar",
}: {
  className?: string;
  variant?: "sidebar" | "page";
}) {
  const { t } = useLocale();
  const [browser, setBrowser] = useState("other");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setBrowser(getBrowser());

    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setShowGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installed && deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }
    setShowGuide(true);
  }, [installed, deferredPrompt]);

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

  return (
    <>
      <button
        type="button"
        onClick={install}
        className={`${variant === "sidebar" ? "btn-primary w-full" : "btn-primary"} ${className}`}
      >
        <Download className="w-4 h-4" />
        {deferredPrompt ? t.install.buttonNow : t.install.button}
      </button>

      {showGuide && (
        <InstallGuide
          browser={browser}
          onClose={() => setShowGuide(false)}
        />
      )}
    </>
  );
}
