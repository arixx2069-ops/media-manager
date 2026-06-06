import type { Platform } from "@prisma/client";

export type ConnectedAccount = {
  id: string;
  platform: Platform;
  username: string;
  displayName?: string;
  followers: number;
  likes: number;
  comments: number;
  shares: number;
};

export const STORAGE_KEY = "aeen-iq-connected-accounts";

const PLATFORMS: Platform[] = [
  "INSTAGRAM",
  "TIKTOK",
  "FACEBOOK",
  "TELEGRAM",
  "YOUTUBE",
];

export function profileUrl(platform: Platform, username: string): string {
  const u = username.replace(/^@/, "").trim();
  switch (platform) {
    case "INSTAGRAM":
      return `https://www.instagram.com/${u}/`;
    case "TIKTOK":
      return `https://www.tiktok.com/@${u}`;
    case "TELEGRAM":
      return `https://t.me/${u}`;
    case "YOUTUBE":
      return `https://www.youtube.com/@${u}`;
    case "TWITTER":
      return `https://x.com/${u}`;
    case "FACEBOOK":
      return `https://www.facebook.com/${u}`;
    case "LINKEDIN":
      return `https://www.linkedin.com/in/${u}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(u)}`;
  }
}

export function loadAccounts(): ConnectedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConnectedAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: ConnectedAccount[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export function addAccount(
  data: Omit<ConnectedAccount, "id">
): ConnectedAccount[] {
  const accounts = loadAccounts();
  const username = data.username.replace(/^@/, "").trim();
  if (accounts.some((a) => a.platform === data.platform && a.username === username)) {
    return accounts;
  }
  const next: ConnectedAccount = {
    ...data,
    username,
    id: `${data.platform}-${username}-${Date.now()}`,
  };
  const updated = [...accounts, next];
  saveAccounts(updated);
  return updated;
}

export function removeAccount(id: string): ConnectedAccount[] {
  const updated = loadAccounts().filter((a) => a.id !== id);
  saveAccounts(updated);
  return updated;
}

export function aggregateMetrics(accounts: ConnectedAccount[]) {
  return accounts.reduce(
    (acc, a) => ({
      likes: acc.likes + a.likes,
      comments: acc.comments + a.comments,
      shares: acc.shares + a.shares,
      followers: acc.followers + a.followers,
    }),
    { likes: 0, comments: 0, shares: 0, followers: 0 }
  );
}

export { PLATFORMS as ACCOUNT_PLATFORMS };
