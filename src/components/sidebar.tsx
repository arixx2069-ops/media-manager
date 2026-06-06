"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Share2,
  Download,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { InstallButton } from "@/components/install-button";
import { LogoutButton } from "@/components/logout-button";
import { SettingsBar } from "@/components/settings-bar";
import { useLocale } from "@/components/locale-provider";
import { APP_NAME } from "@/lib/constants";

const navKeys = [
  { href: "/", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/advisor", key: "advisor" as const, icon: Sparkles, highlight: true },
  { href: "/accounts", key: "accounts" as const, icon: Share2 },
  { href: "/comments", key: "comments" as const, icon: MessageCircle },
  { href: "/setup", key: "setup" as const, icon: Settings },
  { href: "/install", key: "install" as const, icon: Download },
  { href: "/admin/access", key: "access" as const, icon: Shield },
];

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside
      className={`fixed inset-y-0 start-0 z-50 flex w-[min(18rem,85vw)] flex-col border-e border-[var(--card-border)] bg-[var(--sidebar)] transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
        open
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0"
      }`}
      style={{ fontFamily: "inherit" }}
    >
      <div className="flex items-start justify-between gap-2 border-b border-[var(--card-border)] p-4 sm:p-6 safe-top">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold tracking-tight leading-tight">
            {APP_NAME}
          </h1>
          <p className="eyebrow mt-2 text-[0.62rem]">{t.appTagline}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-[var(--muted)] hover:bg-[var(--card-hover)] lg:hidden"
          aria-label={t.mobile.closeMenu}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navKeys.map(({ href, key, icon: Icon, highlight }) => {
          const active = pathname === href;
          const label = key === "access" ? "Access Control" : t.nav[key];
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.12em] transition-colors touch-manipulation ${
                active
                  ? "nav-active font-bold"
                  : highlight
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
  );
}
