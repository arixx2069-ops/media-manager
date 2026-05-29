"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, X } from "lucide-react";
import {
  detectBrowser,
  isStandaloneApp,
  browserLabel,
  type BrowserName,
} from "@/lib/browser";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function FirefoxSteps() {
  return (
    <ol className="text-xs text-zinc-500 mt-2 space-y-1 list-decimal list-inside">
      <li>
        Menu <strong className="text-zinc-400">☰</strong> (top right)
      </li>
      <li>
        <strong className="text-zinc-400">Install…</strong> or{" "}
        <strong className="text-zinc-400">Install this site as an app</strong>
      </li>
      <li>
        On phone: <strong className="text-zinc-400">☰ → Add to Home screen</strong>
      </li>
    </ol>
  );
}

function ChromeSteps() {
  return (
    <ol className="text-xs text-zinc-500 mt-2 space-y-1 list-decimal list-inside">
      <li>Install icon in the address bar, or sidebar Install button</li>
      <li>
        Or menu <strong className="text-zinc-400">⋮ → Install app…</strong>
      </li>
    </ol>
  );
}

function GenericSteps({ browser }: { browser: BrowserName }) {
  return (
    <p className="text-xs text-zinc-500 mt-2">
      Open in <strong className="text-zinc-400">Chrome</strong> or{" "}
      <strong className="text-zinc-400">Firefox</strong> for install options.{" "}
      <Link href="/install" className="text-indigo-400 hover:underline">
        Full guide
      </Link>
    </p>
  );
}

export function InstallApp() {
  const [browser, setBrowser] = useState<BrowserName>("other");
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

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
    };

    window.addEventListener("beforeinstallprompt", onInstallable);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }

  if (installed || dismissed) return null;

  const isChromium = browser === "chrome" || browser === "edge";
  const showChromeButton = isChromium && prompt !== null;
  const isFirefox = browser === "firefox";

  return (
    <div className="mx-3 mb-3 rounded-lg border border-indigo-500/40 bg-indigo-600/10 p-3">
      <div className="flex items-start gap-2">
        <Download className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-zinc-200">Install / download app</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Works in {browserLabel(browser)} and other browsers — opens like its own app.
          </p>

          {showChromeButton && (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md"
            >
              Install now
            </button>
          )}

          {isFirefox && <FirefoxSteps />}
          {isChromium && !prompt && <ChromeSteps />}
          {!isFirefox && !isChromium && <GenericSteps browser={browser} />}

          <Link
            href="/install"
            className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300"
          >
            All browsers →
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-zinc-600 hover:text-zinc-400"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
