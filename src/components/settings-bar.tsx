"use client";

import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLocale } from "@/components/locale-provider";

export function SettingsBar() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();

  return (
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
  );
}
