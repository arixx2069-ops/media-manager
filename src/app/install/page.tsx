"use client";

import { Download } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { InstallButton } from "@/components/install-button";

export default function InstallPage() {
  const { t } = useLocale();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t.install.button}
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t.install.guideTitle}
        </p>
      </div>

      <div className="editorial-card p-6 text-center space-y-4">
        <Download className="w-12 h-12 mx-auto text-[var(--accent)]" />
        <p className="text-sm text-[var(--muted)]">
          {t.install.guideSubtitle.replace("{browser}", "")}
        </p>
        <InstallButton variant="page" className="mx-auto" />
      </div>
    </div>
  );
}
