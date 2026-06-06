"use client";

import { useCallback, useEffect, useState } from "react";
import { detectBrowser, isStandaloneApp, type BrowserName } from "@/lib/browser";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function usePwaInstall() {
  const [browser, setBrowser] = useState<BrowserName>("other");
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setBrowser(detectBrowser());
    if (isStandaloneApp()) {
      setInstalled(true);
      return;
    }

    const onInstallable = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
      setShowGuide(false);
    };

    window.addEventListener("beforeinstallprompt", onInstallable);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (installed) return;
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
      return;
    }
    setShowGuide(true);
  }, [installed, prompt]);

  return {
    browser,
    installed,
    canOneClickInstall: prompt !== null,
    install,
    showGuide,
    setShowGuide,
  };
}
