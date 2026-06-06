"use client";

import { Languages, Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";
import type { Locale } from "@/lib/i18n";

const activeBtn =
  "bg-[var(--accent-soft)] border-[var(--accent-soft-border)] text-[var(--accent)]";
const idleBtn =
  "border-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--card-hover)]";

export function SettingsBar() {
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <div className="px-4 py-3 border-t border-[var(--card-border)] space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-[0.65rem] uppercase tracking-wider py-2 border transition-colors ${
            theme === "light" ? activeBtn : idleBtn
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
            theme === "dark" ? activeBtn : idleBtn
          }`}
          aria-pressed={theme === "dark"}
        >
          <Moon className="w-3.5 h-3.5" />
          {t.theme.dark}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Languages className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
        {(["en", "ar"] as Locale[]).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`flex-1 text-[0.65rem] uppercase tracking-wider py-2 border transition-colors ${
              locale === code ? activeBtn : idleBtn
            }`}
            aria-pressed={locale === code}
          >
            {t.language[code]}
          </button>
        ))}
      </div>
    </div>
  );
}
