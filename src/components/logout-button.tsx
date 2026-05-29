"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1.5 rounded"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
