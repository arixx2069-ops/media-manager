import type { Platform } from "@prisma/client";
import {
  loadAccounts,
  saveAccounts,
  type ConnectedAccount,
} from "@/lib/accounts";

type SyncUpdate = {
  platform: Platform;
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  configured: boolean;
};

export async function syncAccountsFromApis(): Promise<{
  ok: boolean;
  anyConfigured: boolean;
  accounts: ConnectedAccount[];
}> {
  const res = await fetch("/api/accounts/sync", { method: "POST" });
  const data = (await res.json()) as {
    updates?: SyncUpdate[];
    anyConfigured?: boolean;
    error?: string;
  };

  if (!res.ok) {
    return { ok: false, anyConfigured: false, accounts: loadAccounts() };
  }

  const updates = data.updates ?? [];
  const anyConfigured = data.anyConfigured ?? false;
  if (!anyConfigured) {
    return { ok: true, anyConfigured: false, accounts: loadAccounts() };
  }

  let accounts = loadAccounts();
  for (const u of updates) {
    if (!u.configured) continue;
    accounts = accounts.map((a) =>
      a.platform === u.platform
        ? {
            ...a,
            followers: u.followers,
            likes: u.likes,
            comments: u.comments,
            shares: u.shares,
          }
        : a
    );
  }
  saveAccounts(accounts);
  return { ok: true, anyConfigured: true, accounts };
}
