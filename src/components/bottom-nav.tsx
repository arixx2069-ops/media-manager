"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Share2,
  Menu,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";

const navItems = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/advisor", key: "advisor", icon: Sparkles },
  { href: "/accounts", key: "accounts", icon: Share2 },
  { href: "/comments", key: "comments", icon: MessageCircle },
];

export function BottomNav({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-[var(--card-border)] bg-[var(--sidebar)] lg:hidden safe-bottom"
      aria-label="Quick navigation"
    >
      {navItems.map((item) => {
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
