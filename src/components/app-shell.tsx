"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Share2,
  Settings,
  Download,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  Languages,
  LogOut,
  Send,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";
import { InstallButton } from "@/components/install-button";
import { APP_NAME, APP_SHORT_NAME } from "@/lib/constants";

interface NavItem {
  href: string;
  key: string;
  icon: typeof LayoutDashboard;
  highlight?: boolean;
}

const sidebarNav: NavItem[] = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/post", key: "post", icon: Send, highlight: true },
  { href: "/advisor", key: "advisor", icon: Sparkles, highlight: true },
  { href: "/accounts", key: "accounts", icon: Share2 },
  { href: "/comments", key: "comments", icon: MessageCircle },
  { href: "/setup", key: "setup", icon: Settings },
  { href: "/install", key: "install", icon: Download },
  { href: "/admin/access", key: "access", icon: Shield },
];

const bottomNav: NavItem[] = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/post", key: "post", icon: Send },
  { href: "/advisor", key: "advisor", icon: Sparkles },
  { href: "/accounts", key: "accounts", icon: Share2 },
  { href: "/comments", key: "comments", icon: MessageCircle },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-[min(18rem,85vw)] flex-col border-e border-[var(--card-border)] bg-[var(--sidebar)] transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0"
        }`}
      >
        <div className="flex items-start justify-between gap-2 border-b border-[var(--card-border)] p-4 sm:p-6 safe-top">
          <div className="min-w-0">
            <h1 className="font-display text-lg font-semibold tracking-tight leading-tight">
              {APP_NAME}
            </h1>
            <p className="eyebrow mt-2">{t.appTagline}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-[var(--muted)] hover:bg-[var(--card-hover)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {sidebarNav.map((item) => {
            const isActive = pathname === item.href;
            const label =
              item.key === "access" ? "Access Control" : (t.nav as any)[item.key];
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.12em] transition-colors touch-manipulation ${
                  isActive
                    ? "nav-active font-bold"
                    : item.highlight
                      ? "text-[var(--accent)] hover:bg-[var(--card-hover)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3">
          <InstallButton />
        </div>

        <div className="px-4 py-3 border-t border-[var(--card-border)] space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-[0.65rem] uppercase tracking-wider py-2 border transition-colors ${
                theme === "light"
                  ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]"
                  : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--card-hover)]"
              }`}
              aria-pressed={theme === "light"}
            >
              <Sun className="w-3.5 h-3.5" />
              {t.theme.light}
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-1.5 text-[0.65rem] uppercase tracking-wider py-2 border transition-colors ${
                theme === "dark"
                  ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]"
                  : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--card-hover)]"
              }`}
              aria-pressed={theme === "dark"}
            >
              <Moon className="w-3.5 h-3.5" />
              {t.theme.dark}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
            {(["en", "ar"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={`flex-1 text-[0.65rem] uppercase tracking-wider py-2 border transition-colors ${
                  locale === l
                    ? "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--card-hover)]"
                }`}
                aria-pressed={locale === l}
              >
                {t.language[l]}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--card-border)] p-4 safe-bottom">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function LogoutButton() {
  const { t } = useLocale();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
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

function BottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-[var(--card-border)] bg-[var(--sidebar)] lg:hidden safe-bottom"
      aria-label="Quick navigation"
    >
      {bottomNav.map((item) => {
        const isActive = pathname === item.href;
        const label = (t.nav as any)[item.key];
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-[0.62rem] uppercase tracking-wide transition-colors touch-manipulation ${
              isActive
                ? "text-[var(--accent)] font-bold"
                : "text-[var(--muted)]"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? "text-[var(--accent)]" : ""}`}
            />
            <span className="truncate max-w-full px-0.5">{label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-[0.62rem] uppercase tracking-wide text-[var(--muted)] touch-manipulation"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
        <span>{t.quickNav.more}</span>
      </button>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t: shellT } = useLocale();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col lg:flex-row">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--card-border)] bg-[var(--sidebar)] px-4 py-3 lg:hidden safe-top">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--card-hover)]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold">
              {APP_SHORT_NAME}
            </p>
            <p className="truncate text-[0.62rem] uppercase tracking-wider text-[var(--muted)]">
              {shellT.appTagline}
            </p>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0 safe-bottom">
          {children}
        </main>

        <BottomNav onOpenMenu={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}
