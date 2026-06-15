let deferredPrompt: Event | null = null;

export function registerInstallPrompt() {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
  });
}

export function getDeferredPrompt(): Event | null {
  return deferredPrompt;
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    (deferredPrompt as any).prompt();
    const result = await (deferredPrompt as any).userChoice;
    deferredPrompt = null;
    return result.outcome === "accepted";
  } catch {
    return false;
  }
}
