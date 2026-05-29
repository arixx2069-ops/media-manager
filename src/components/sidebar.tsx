"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Sparkles,
  Share2,
  Download,
} from "lucide-react";
import { InstallApp } from "@/components/install-app";
import { LogoutButton } from "@/components/logout-button";
import { APP_NAME } from "@/lib/constants";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/comments", label: "Positive Comments", icon: MessageCircle },
  { href: "/users", label: "Team & Access", icon: Users },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles },
  { href: "/platforms", label: "Platforms", icon: Share2 },
  { href: "/install", label: "Install app", icon: Download },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-[#0d0d14] flex flex-col shrink-0">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-lg font-semibold tracking-tight leading-tight">
          {APP_NAME}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Password protected</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <InstallApp />
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <LogoutButton />
        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-400/10 px-2 py-1 rounded">
          Demo mode
        </span>
      </div>
    </aside>
  );
}
