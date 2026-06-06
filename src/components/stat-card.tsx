import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
};

export function StatCard({ label, value, icon: Icon, sub }: Props) {
  return (
    <div className="editorial-card p-5 border-t-2 border-t-[var(--foreground)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow text-[0.62rem]">{label}</p>
          <p className="font-display text-3xl font-medium mt-2 tabular-nums tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && (
            <p className="text-xs text-[var(--muted)] mt-1 opacity-80">{sub}</p>
          )}
        </div>
        <div className="p-2 text-[var(--accent)]" style={{ background: "var(--accent-soft)" }}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
