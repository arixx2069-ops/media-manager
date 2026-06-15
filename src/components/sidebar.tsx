"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Share2,
  Settings,
  Download,
  Shield,
  X,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";
import { InstallButton } from "@/components/install-button";
import { SettingsBar } from "@/components/settings-bar";
import { LogoutButton } from "@/components/logout-button";
import { APP_NAME } from "@/lib/constants";

const navItems = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/advisor", key: "advisor", icon: Sparkles, highlight: true },
  { href: "/accounts", key: "accounts", icon: Share2 },
  { href: "/comments", key: "comments", icon: MessageCircle },
  { href: "/setup", key: "setup", icon: Settings },
  { href: "/install", key: "install", icon: Download },
  { href: "/admin/access", key: "access", icon: Shield },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

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
          open
            ? "translate-x-0"
            : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0"
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
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const label =
              item.key === "access"
                ? "Access Control"
                : (t.nav as any)[item.key];
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

        <SettingsBar />

        <div className="border-t border-[var(--card-border)] p-4 safe-bottom">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
