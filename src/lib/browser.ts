export type BrowserName = "chrome" | "firefox" | "edge" | "safari" | "other";

export function detectBrowser(): BrowserName {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "edge";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "safari";
  return "other";
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function browserLabel(name: BrowserName): string {
  const labels: Record<BrowserName, string> = {
    chrome: "Google Chrome",
    firefox: "Mozilla Firefox",
    edge: "Microsoft Edge",
    safari: "Safari",
    other: "your browser",
  };
  return labels[name];
}
