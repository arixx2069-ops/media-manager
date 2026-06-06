import { addAccount, loadAccounts, type ConnectedAccount } from "@/lib/accounts";
import { syncAccountsFromApis } from "@/lib/api-sync";

export type OAuthStatus = {
  meta: {
    connected: boolean;
    instagram: { username: string; accountId: string } | null;
    facebook: { name: string; pageId: string } | null;
  };
  tiktok: {
    connected: boolean;
    username: string | null;
    displayName: string | null;
  };
};

export async function fetchOAuthStatus(): Promise<OAuthStatus> {
  const res = await fetch("/api/oauth/status");
  if (!res.ok) {
    return {
      meta: { connected: false, instagram: null, facebook: null },
      tiktok: { connected: false, username: null, displayName: null },
    };
  }
  return res.json() as Promise<OAuthStatus>;
}

export function ensureAccountsFromOAuth(status: OAuthStatus): ConnectedAccount[] {
  let accounts = loadAccounts();

  if (status.meta.instagram?.username) {
    const username = status.meta.instagram.username.replace(/^@/, "");
    if (
      !accounts.some(
        (a) => a.platform === "INSTAGRAM" && a.username === username
      )
    ) {
      accounts = addAccount({
        platform: "INSTAGRAM",
        username,
        displayName: username,
        followers: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    }
  }

  if (status.meta.facebook?.pageId) {
    const username =
      status.meta.facebook.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 30) || status.meta.facebook.pageId;
    if (
      !accounts.some(
        (a) => a.platform === "FACEBOOK" && a.username === username
      )
    ) {
      accounts = addAccount({
        platform: "FACEBOOK",
        username,
        displayName: status.meta.facebook.name ?? username,
        followers: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    }
  }

  if (status.tiktok.username) {
    const username = status.tiktok.username.replace(/^@/, "");
    if (
      !accounts.some((a) => a.platform === "TIKTOK" && a.username === username)
    ) {
      accounts = addAccount({
        platform: "TIKTOK",
        username,
        displayName: status.tiktok.displayName ?? username,
        followers: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    }
  }

  return accounts;
}

/** After OAuth connect or on dashboard load: ensure accounts exist, then pull live stats. */
export async function connectAndSync(): Promise<{
  accounts: ConnectedAccount[];
  anyConfigured: boolean;
  status: OAuthStatus;
}> {
  const status = await fetchOAuthStatus();
  ensureAccountsFromOAuth(status);
  const result = await syncAccountsFromApis();
  return { ...result, status };
}

export async function disconnectOAuth(platform: "meta" | "tiktok"): Promise<void> {
  await fetch("/api/oauth/disconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform }),
  });
}
