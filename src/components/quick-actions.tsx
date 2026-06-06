"use client";

import Link from "next/link";
import {
  MessageCircle,
  Settings,
  Share2,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";

type ActionKey = "advisor" | "accounts" | "comments" | "setup";

const actions: {
  href: string;
  key: ActionKey;
  icon: typeof Sparkles;
  featured?: boolean;
}[] = [
  { href: "/advisor", key: "advisor", icon: Sparkles, featured: true },
  { href: "/accounts", key: "accounts", icon: Share2 },
  { href: "/comments", key: "comments", icon: MessageCircle },
  { href: "/setup", key: "setup", icon: Settings },
];

const hintKeys: Record<ActionKey, "advisorHint" | "accountsHint" | "commentsHint" | "setupHint"> = {
  advisor: "advisorHint",
  accounts: "accountsHint",
  comments: "commentsHint",
  setup: "setupHint",
};

export function QuickActions() {
  const { t } = useLocale();

  return (
    <section className="mb-8">
      <p className="eyebrow mb-3">{t.quickNav.title}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map(({ href, key, icon: Icon, featured }) => (
          <Link
            key={href}
            href={href}
            className={`editorial-card flex flex-col gap-3 p-4 min-h-[7.5rem] touch-manipulation ${
              featured ? "border-t-2 border-t-[var(--accent)]" : ""
            }`}
          >
            <Icon
              className={`h-6 w-6 ${featured ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}
            />
            <div>
              <p className="font-display text-base font-medium leading-tight">
                {t.quickNav[key]}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1 leading-snug">
                {t.quickNav[hintKeys[key]]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
