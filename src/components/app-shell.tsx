"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";
import { useLocale } from "@/components/locale-provider";
import { APP_SHORT_NAME } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col lg:flex-row">
      {menuOpen && (
        <button
          type="button"
          aria-label={t.mobile.closeMenu}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--card-border)] bg-[var(--sidebar)] px-4 py-3 lg:hidden safe-top">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--card-hover)]"
            aria-label={t.mobile.openMenu}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold">{APP_SHORT_NAME}</p>
            <p className="truncate text-[0.62rem] uppercase tracking-wider text-[var(--muted)]">{t.appTagline}</p>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0 safe-bottom">
          {children}
        </main>

        <BottomNav onOpenMenu={() => setMenuOpen(true)} />
      </div>
    </div>
  );
}
