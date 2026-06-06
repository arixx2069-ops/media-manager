"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Menu,
  Share2,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";

const items = [
  { href: "/", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/advisor", key: "advisor" as const, icon: Sparkles },
  { href: "/accounts", key: "accounts" as const, icon: Share2 },
  { href: "/comments", key: "comments" as const, icon: MessageCircle },
] as const;

type Props = {
  onOpenMenu: () => void;
};

export function BottomNav({ onOpenMenu }: Props) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-[var(--card-border)] bg-[var(--sidebar)] lg:hidden safe-bottom"
      aria-label="Quick navigation"
    >
      {items.map(({ href, key, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-[0.62rem] uppercase tracking-wide transition-colors touch-manipulation ${
              active
                ? "text-[var(--accent)] font-bold"
                : "text-[var(--muted)]"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "text-[var(--accent)]" : ""}`} />
            <span className="truncate max-w-full px-0.5">{t.nav[key]}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-[0.62rem] uppercase tracking-wide text-[var(--muted)] touch-manipulation"
        aria-label={t.mobile.openMenu}
      >
        <Menu className="h-5 w-5" />
        <span>{t.quickNav.more}</span>
      </button>
    </nav>
  );
}
