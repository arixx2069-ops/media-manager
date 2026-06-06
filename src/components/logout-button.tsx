"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export function LogoutButton() {
  const router = useRouter();
  const { t } = useLocale();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-sm text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-3 sm:py-2 rounded-lg touch-manipulation"
    >
      <LogOut className="w-3.5 h-3.5" />
      {t.logout}
    </button>
  );
}
