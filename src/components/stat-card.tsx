"use client";

import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="editorial-card p-4 flex items-center gap-3">
      <div
        className="p-2.5 rounded-lg text-[var(--accent)] shrink-0"
        style={{ background: "var(--accent-soft)" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] uppercase tracking-wider text-[var(--muted)]">
          {label}
        </p>
        <p className="text-lg font-semibold font-display truncate">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}
