"use client";

import { Sparkles, Share2, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

interface QuickActionProps {
  href: string;
  icon: typeof Sparkles;
  label: string;
  hint: string;
}

function QuickAction({ href, icon: Icon, label, hint }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="editorial-card p-3 flex items-center gap-3 hover:bg-[var(--card-hover)] transition-colors"
    >
      <div
        className="p-2 rounded-lg text-[var(--accent)] shrink-0"
        style={{ background: "var(--accent-soft)" }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[var(--muted)] truncate">{hint}</p>
      </div>
    </Link>
  );
}

export function QuickActions() {
  const { t } = useLocale();

  return (
    <div className="space-y-2">
      <p className="eyebrow">{t.quickNav.title}</p>
      <div className="grid grid-cols-2 gap-2">
        <QuickAction
          href="/advisor"
          icon={Sparkles}
          label={t.quickNav.advisor}
          hint={t.quickNav.advisorHint}
        />
        <QuickAction
          href="/accounts"
          icon={Share2}
          label={t.quickNav.accounts}
          hint={t.quickNav.accountsHint}
        />
        <QuickAction
          href="/comments"
          icon={MessageCircle}
          label={t.quickNav.comments}
          hint={t.quickNav.commentsHint}
        />
        <QuickAction
          href="/setup"
          icon={Settings}
          label={t.quickNav.setup}
          hint={t.quickNav.setupHint}
        />
      </div>
    </div>
  );
}
