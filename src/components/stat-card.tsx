import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
};

export function StatCard({ label, value, icon: Icon, sub }: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#12121a] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="text-2xl font-semibold mt-1 tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
        </div>
        <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
